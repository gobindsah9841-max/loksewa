#!/usr/bin/env python3
"""Turn the markdown study book into the data files of the offline reader app.

Usage:  make_assets.py <study-book-dir> <output-data-dir> [version-name]

Writes, as plain JavaScript files that a WebView can load with <script> tags
(no XHR, so they work from file:///android_asset/):

  index.js      list of parts, chapter titles, question counts, build date
  part-<i>.js   one part of the book as HTML, with its table of contents
  quiz-<ch>.js  the multiple-choice questions of one chapter, as structured data
  search.js     plain text of every section, for the search screen

Nothing in the book is changed. Every question keeps its honesty label.
"""
import datetime
import html as htmllib
import json
import os
import re
import sys

from markdown_it import MarkdownIt

MD = MarkdownIt("commonmark", {"html": False}).enable("table").enable("strikethrough")

# a markdown table written with a blank header line ("| | |") gets an empty header row; leave it out
EMPTY_THEAD = re.compile(r"<thead>\s*<tr>(?:\s*<th[^>]*>\s*</th>)+\s*</tr>\s*</thead>\s*")

LABEL = re.compile(r"^\*\*(Q \d+\.\d+\.\d+|T\d+)\*\* `\[(.+?)\]`$")
OPTION = re.compile(r"^- \(([a-d])\) (.+)$")
ANSWER = re.compile(r"^\*\*Answer: \(([a-d])\)\*\* — (.+)$")
TOPIC = re.compile(r"^## (\d+\.\d+) (.+)$")
H1_CHAPTER = re.compile(r"^PART (\d+) — CHAPTER (\d+): (.+?)(?: \((.+)\))?$")
H1_PART = re.compile(r"^PART (\d+) — (.+)$")
TAG = re.compile(r"<[^>]+>")
HEADING = re.compile(r"<h([1-4])>(.*?)</h\1>", re.S)


def js_dump(obj):
    s = json.dumps(obj, ensure_ascii=False, separators=(",", ":"))
    return s.replace("\u2028", "\\u2028").replace("\u2029", "\\u2029").replace("</", "<\\/")


def text_of(fragment):
    return re.sub(r"\s+", " ", htmllib.unescape(TAG.sub(" ", fragment))).strip()


def inline(src):
    return MD.renderInline(src.strip())


def part_meta(index, filename, source):
    h1 = ""
    for line in source.split("\n"):
        if line.startswith("# "):
            h1 = line[2:].strip()
            break
    meta = {"i": index, "slug": filename[:-3], "num": 0, "kind": "front", "ch": 0, "title": h1, "nep": ""}
    if filename == "README.md":
        meta.update(kind="about", title="About this book", nep="")
        return meta
    m = H1_CHAPTER.match(h1)
    if m:
        meta.update(num=int(m.group(1)), kind="chapter", ch=int(m.group(2)), title=m.group(3).strip(), nep=(m.group(4) or "").strip())
        return meta
    m = H1_PART.match(h1)
    if m:
        meta.update(num=int(m.group(1)), title=m.group(2).strip())
    return meta


def to_html(source, link_map):
    """Render one part. Returns (html, toc, sections)."""
    html = MD.render(source)

    # in-book links -> in-app routes; everything else is left for the system browser
    def fix_link(m):
        target = m.group(1)
        name, _, _anchor = target.partition("#")
        if name in link_map:
            return 'href="#/read/%d"' % link_map[name]
        return m.group(0)

    html = re.sub(r'href="([^"]+)"', fix_link, html)

    # headings get ids; h2 and h3 go into the table of contents
    toc, counter = [], [0]

    def add_id(m):
        counter[0] += 1
        level, inner = int(m.group(1)), m.group(2)
        hid = "h%d" % counter[0]
        if level in (2, 3):
            toc.append([level, hid, text_of(inner)])
        return '<h%d id="%s">%s</h%d>' % (level, hid, inner, level)

    html = HEADING.sub(add_id, html)

    # sections for search: text between one heading and the next
    # each section also remembers the topic (h2) it belongs to
    sections = []
    pieces = re.split(r'(<h[1-4] id="h\d+">.*?</h[1-4]>)', html, flags=re.S)
    current, parent = None, ""
    for piece in pieces:
        m = re.match(r'<h([1-4]) id="(h\d+)">(.*?)</h[1-4]>', piece, re.S)
        if m:
            title = text_of(m.group(3))
            if m.group(1) in ("1", "2"):
                parent = title if m.group(1) == "2" else ""
                current = [m.group(2), title, "", ""]
            else:
                current = [m.group(2), title, "", parent]
            sections.append(current)
        elif current is not None:
            current[2] += " " + text_of(piece)
    sections = [[hid, title, body.strip(), up] for hid, title, body, up in sections]

    # wide tables scroll sideways inside their own box
    html = EMPTY_THEAD.sub("", html)
    html = html.replace("<table>", '<div class="tw"><table>').replace("</table>", "</table></div>")
    # answers and model answers can be hidden until tapped
    html = html.replace("<p><strong>Answer: (", '<p class="ans"><strong>Answer: (')
    html = html.replace("<p><strong>Model answer.</strong>", '<p class="ans model"><strong>Model answer.</strong>')
    html = html.replace("<p><em>Points for the answer:</em>", '<p class="ans model"><em>Points for the answer:</em>')
    # question labels become small chips
    html = re.sub(r"<p><strong>((?:Q \d+\.\d+\.\d+|T\d+))</strong> <code>\[(.+?)\]</code></p>",
                  r'<p class="qid"><strong>\1</strong> <span class="chip">\2</span></p>', html)
    return html, toc, sections


def extract_mcqs(source):
    """Return a list of topics, each with its questions, read from the markdown."""
    topics, current, q, stage = [], None, None, None
    end_topic = None
    for raw in source.split("\n"):
        line = raw.rstrip()
        m = TOPIC.match(line)
        if m and q is None:
            current = {"id": m.group(1), "title": m.group(2).strip(), "q": []}
            topics.append(current)
            continue
        m = LABEL.match(line)
        if m:
            qid, label = m.group(1), m.group(2)
            if qid.startswith("T"):
                if end_topic is None:
                    end_topic = {"id": "T", "title": "End-of-chapter test — Top 25", "q": []}
                    topics.append(end_topic)
                target = end_topic
            else:
                target = current
            q = {"id": qid, "l": label, "body": [], "o": [], "a": None, "e": ""}
            q["_target"] = target
            stage = "body"
            continue
        if q is None:
            continue
        mo, ma = OPTION.match(line), ANSWER.match(line)
        if ma:
            q["a"] = "abcd".index(ma.group(1))
            q["e"] = inline(ma.group(2))
            q["s"] = MD.render("\n".join(q.pop("body")).strip())
            q["s"] = q["s"].replace("<table>", '<div class="tw"><table>').replace("</table>", "</table></div>")
            target = q.pop("_target")
            if len(q["o"]) != 4 or target is None:
                raise SystemExit("Badly formed question %s" % q["id"])
            target["q"].append(q)
            q, stage = None, None
        elif mo and stage in ("body", "opts"):
            stage = "opts"
            q["o"].append(inline(mo.group(2)))
        elif stage == "body":
            q["body"].append(raw)
    if q is not None:
        raise SystemExit("Question %s has no answer line" % q["id"])
    return [t for t in topics if t["q"]]


def main():
    book_dir, out_dir = sys.argv[1], sys.argv[2]
    version = sys.argv[3] if len(sys.argv) > 3 else ""
    os.makedirs(out_dir, exist_ok=True)
    files = ["README.md"] + sorted(f for f in os.listdir(book_dir) if re.match(r"part-\d+-.*\.md$", f))
    link_map = {name: i for i, name in enumerate(files)}

    parts, search, total_mcq, total_saq = [], [], 0, 0
    for i, name in enumerate(files):
        source = open(os.path.join(book_dir, name), encoding="utf-8").read()
        meta = part_meta(i, name, source)
        html, toc, sections = to_html(source, link_map)
        meta["kb"] = round(len(html.encode("utf-8")) / 1024)
        meta["mcq"] = 0
        if meta["kind"] == "chapter":
            topics = extract_mcqs(source)
            meta["mcq"] = sum(len(t["q"]) for t in topics)
            meta["saq"] = len(re.findall(r"^\*\*Question\.\*\*", source, re.M)) + len(
                re.findall(r"^\*Points for the answer:\*", source, re.M))
            total_mcq += meta["mcq"]
            total_saq += meta["saq"]
            quiz = {"ch": meta["ch"], "title": meta["title"], "topics": topics}
            with open(os.path.join(out_dir, "quiz-%d.js" % meta["ch"]), "w", encoding="utf-8") as f:
                f.write("LS_REG('quiz',%d,%s);\n" % (meta["ch"], js_dump(quiz)))
        with open(os.path.join(out_dir, "part-%d.js" % i), "w", encoding="utf-8") as f:
            f.write("LS_REG('part',%d,%s);\n" % (i, js_dump({"toc": toc, "html": html})))
        for hid, title, body, up in sections:
            search.append([i, hid, title, body, up])
        parts.append(meta)

    with open(os.path.join(out_dir, "search.js"), "w", encoding="utf-8") as f:
        f.write("LS_REG('search',0,%s);\n" % js_dump(search))
    numbers = [p["num"] for p in parts if p["num"]]
    index = {
        "built": datetime.datetime.utcnow().strftime("%d %B %Y"),
        "version": version,
        "parts": parts,
        "firstPart": min(numbers),
        "lastPart": max(numbers),
        "chapters": [p["ch"] for p in parts if p["kind"] == "chapter"],
        "mcq": total_mcq,
        "saq": total_saq,
    }
    with open(os.path.join(out_dir, "index.js"), "w", encoding="utf-8") as f:
        f.write("LS_REG('index',0,%s);\n" % js_dump(index))
    print("parts: %d (Parts %d-%d) | chapters: %s | MCQs: %d | short-answer questions: %d | search sections: %d"
          % (len(parts), index["firstPart"], index["lastPart"], index["chapters"], total_mcq, total_saq, len(search)))
    return index


if __name__ == "__main__":
    main()
