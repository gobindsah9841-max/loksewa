#!/usr/bin/env python3
"""Check that one chapter of the study book follows the book's fixed layout.

    python3 android-app/tools/check_chapter.py study-book/part-13-chapter-09-current-affairs.md [earlier chapters ...]

It checks the form, not the facts:
  * every topic has the ten numbered elements, in order, and seven province rows in element 8;
  * every MCQ has an id, an honesty label, four different options and one answer line;
  * ids are complete and not repeated; answers are spread over (a)-(d);
  * the end matter has sections A-G, 20 top facts, 25 MCQs, 5 short-answer questions and 16 common mistakes;
  * the question totals in the chapter's header table are right;
  * (if earlier chapters are named) no question stem is nearly the same as an earlier one;
  * (if the package nepali-datetime is installed) every "BS date (AD date)" pair agrees.
Exit code 1 if a check fails.

Chapters 3 to 10 pass. Chapters 1 and 2 were written before the layout was fixed and are reported for three
small differences of form (a table title inside the heading of element 4, two topic headings without a Nepali
name, and 12 and 14 common mistakes instead of 16). Their questions, labels and dates pass.
"""
import collections
import difflib
import re
import sys

ELEMENTS = ["1 · Why it matters", "2 · Simple explanation", "3 · Key facts", "4 · Tables",
            "5 · Numbers and dates to remember", "6 · Memory aid", "7 · Exam traps", "8 · Province link",
            "9 · Practice MCQs", "10 · Short-answer question"]
PROVINCES = ["Koshi", "Madhesh", "Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim"]
LABELS = ("Pattern-Based – Reconstructed", "Expected – Practice")
ID_LINE = re.compile(r"^\*\*(Q \d+\.\d+\.\d+|T\d+)\*\* `\[(.+?)\]`$")
OPTION = re.compile(r"^- \(([a-d])\) (.+)$")
ANSWER = re.compile(r"^\*\*Answer: \(([a-d])\)\*\* — \S")
BS_MONTHS = ["Baisakh", "Jestha", "Ashad", "Shrawan", "Bhadra", "Ashoj", "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"]
AD_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

problems = []


def bad(text):
    problems.append(text)


def questions(lines):
    """Return a list of dicts: id, label, stem, options, answer, line number."""
    out, i = [], 0
    while i < len(lines):
        m = ID_LINE.match(lines[i])
        if not m:
            i += 1
            continue
        j = i + 1
        while j < len(lines) and not ID_LINE.match(lines[j]) and not lines[j].startswith("#"):
            j += 1
        block = lines[i + 1:j]
        options = [(o.group(1), o.group(2).strip()) for o in map(OPTION.match, block) if o]
        answers = [a.group(1) for a in map(ANSWER.match, block) if a]
        first_option = next((k for k, l in enumerate(block) if OPTION.match(l)), len(block))
        stem = " ".join(l.strip() for l in block[:first_option] if l.strip())
        out.append({"id": m.group(1), "label": m.group(2), "stem": stem, "options": options, "answers": answers, "line": i + 1})
        i = j
    return out


def norm(stem):
    return re.sub(r"[^a-z0-9 ]+", " ", stem.lower())


def main():
    path = sys.argv[1]
    lines = open(path, encoding="utf-8").read().split("\n")
    head = re.match(r"# PART (\d+) — CHAPTER (\d+): ", lines[0])
    if not head:
        raise SystemExit("First line is not '# PART n — CHAPTER n: ...'")
    part, ch = int(head.group(1)), int(head.group(2))

    # ---- topics
    topic_at = [k for k, l in enumerate(lines) if re.match(r"## %d\.\d+ " % ch, l)]
    end_at = next((k for k, l in enumerate(lines) if l == "## Chapter %d — End matter" % ch), None)
    if end_at is None:
        raise SystemExit("No '## Chapter %d — End matter' heading" % ch)
    numbers = [int(re.match(r"## %d\.(\d+) " % ch, lines[k]).group(1)) for k in topic_at]
    if numbers != list(range(1, len(numbers) + 1)):
        bad("topic numbers are not 1..n in order: %s" % numbers)
    for n, start in enumerate(topic_at):
        stop = topic_at[n + 1] if n + 1 < len(topic_at) else end_at
        body = lines[start:stop]
        name = "%d.%d" % (ch, n + 1)
        if not re.search(r"\([^)]*[\u0900-\u097F][^)]*\)\s*$", lines[start]):
            bad("%s: heading has no Nepali name in brackets" % name)
        elements = [l[5:] for l in body if l.startswith("#### ")]
        if elements != ELEMENTS:
            bad("%s: elements are %s" % (name, elements))
        at8 = next((k for k, l in enumerate(body) if l == "#### 8 · Province link"), None)
        at9 = next((k for k, l in enumerate(body) if l == "#### 9 · Practice MCQs"), None)
        if at8 is not None and at9 is not None:
            rows = [l.split("|")[1].strip() for l in body[at8:at9] if l.startswith("| ") and l.split("|")[1].strip() in PROVINCES]
            if rows != PROVINCES:
                bad("%s: province rows are %s" % (name, rows))
        if sum(l.startswith("**Question.**") for l in body) != 1 or sum(l.startswith("**Model answer.**") for l in body) != 1:
            bad("%s: needs exactly one **Question.** and one **Model answer.**" % name)
        if [l for l in body if l.strip()][-1] != "---":
            bad("%s: does not end with a --- line" % name)

    # ---- questions
    qs = questions(lines)
    ids = [q["id"] for q in qs]
    want = ["Q %d.%d.%d" % (ch, t, n) for t in range(1, len(topic_at) + 1) for n in range(1, 6)] + ["T%d" % n for n in range(1, 26)]
    if ids != want:
        missing = [i for i in want if i not in ids]
        extra = [i for i in ids if i not in want]
        repeated = [i for i, c in collections.Counter(ids).items() if c > 1]
        bad("question ids: missing %s, unexpected %s, repeated %s, or out of order" % (missing, extra, repeated))
    for q in qs:
        letters = [o[0] for o in q["options"]]
        texts = [o[1] for o in q["options"]]
        if q["label"] not in LABELS:
            bad("%s: unknown label [%s]" % (q["id"], q["label"]))
        if letters != ["a", "b", "c", "d"]:
            bad("%s: options are %s" % (q["id"], letters))
        if len(set(texts)) != len(texts):
            bad("%s: two options are the same" % q["id"])
        if len(q["answers"]) != 1:
            bad("%s: %d answer lines" % (q["id"], len(q["answers"])))
        if len(q["stem"]) < 15:
            bad("%s: stem is missing or very short" % q["id"])
        pattern_words = re.search(r"^(Fill in the blank|Match |Arrange |Consider these|Which of these pairs|Three of these)|Which of them are correct|Which one (did|was|is) \*\*not\*\*|\*\*wrongly\*\*|______", q["stem"])
        if q["label"] == LABELS[1] and pattern_words:
            bad("%s: labelled Expected but written to a pattern (%s)" % (q["id"], pattern_words.group(0)))
    key = collections.Counter(q["answers"][0] for q in qs if len(q["answers"]) == 1)
    labels = collections.Counter(q["label"] for q in qs)
    if key and max(key.values()) - min(key.values()) > max(3, len(qs) // 10):
        bad("answers are unevenly spread: %s" % dict(key))

    # ---- end matter
    tail = lines[end_at:]
    sections = [l for l in tail if l.startswith("### ")]
    want_sections = ["### A. Quick Revision", "### B. Top 20 facts", "### C. Top 25 MCQs", "### D. Five short-answer questions",
                     "### E. Common mistakes", "### F. Status of the facts in this chapter", "### G. References"]
    if sections != want_sections:
        bad("end-matter sections are %s" % sections)
    else:
        at = {s[4]: tail.index(s) for s in want_sections}
        count = lambda a, b, rx: sum(bool(re.match(rx, l)) for l in tail[at[a]:at[b]])
        if count("B", "C", r"\d+\. ") != 20:
            bad("section B has %d numbered facts, not 20" % count("B", "C", r"\d+\. "))
        if count("D", "E", r"\*\*\d\. ") != 5 or count("D", "E", r"\*Points for the answer:\*") != 5:
            bad("section D needs 5 questions, each with '*Points for the answer:*'")
        if count("E", "F", r"\d+\. ") != 16:
            bad("section E has %d mistakes, not 16" % count("E", "F", r"\d+\. "))
    closing = [l for l in lines if l.strip()][-2:]
    if closing[0] != "*End of Chapter %d (Part %d).*" % (ch, part) or not closing[1].startswith("**Next:** "):
        bad("closing lines are %s" % closing)

    # ---- totals in the header table
    saq = len(topic_at) + 5
    row = next((l for l in lines[:20] if l.startswith("| **Questions in this chapter**")), "")
    m = re.search(r"(\d+) MCQs \((\d+) in topics \+ (\d+) at the end\) and (\d+) short-answer questions", row)
    if not m or [int(x) for x in m.groups()] != [len(qs), len(qs) - 25, 25, saq]:
        bad("header says '%s' but the chapter has %d MCQs and %d short-answer questions" % (row.strip(), len(qs), saq))

    # ---- nearly repeated stems
    earlier = []
    for other in sys.argv[2:]:
        for q in questions(open(other, encoding="utf-8").read().split("\n")):
            earlier.append((other.split("/")[-1][:7], q["id"], norm(q["stem"])))
    mine = [(q["id"], norm(q["stem"])) for q in qs]
    near = []
    for k, (qid, stem) in enumerate(mine):
        for qid2, stem2 in mine[:k]:
            if difflib.SequenceMatcher(None, stem, stem2).ratio() >= 0.72 and not stem.startswith(("consider these statements which", "match the")):
                near.append("%s ~ %s (this chapter)" % (qid, qid2))
        for src, qid2, stem2 in earlier:
            if abs(len(stem) - len(stem2)) < 0.4 * max(len(stem), len(stem2)) and difflib.SequenceMatcher(None, stem, stem2).quick_ratio() >= 0.72 \
                    and difflib.SequenceMatcher(None, stem, stem2).ratio() >= 0.72:
                near.append("%s ~ %s in %s" % (qid, qid2, src))

    # ---- BS-AD pairs
    pairs_checked, pairs_wrong = 0, []
    try:
        import nepali_datetime as nd
        rx = re.compile(r"(\d{1,2})(?:–(\d{1,2}))? (%s) (20\d\d) ?\((?:[a-z ]+)?(\d{1,2})(?:–(\d{1,2}))? (%s) (20\d\d)\)" % ("|".join(BS_MONTHS), "|".join(AD_MONTHS)))
        rx2 = re.compile(r"(\d{1,2}) (%s) (20\d\d); (\d{1,2}) (%s) (20\d\d)\)" % ("|".join(BS_MONTHS), "|".join(AD_MONTHS)))
        text = "\n".join(lines)
        lead_rx = re.compile(r"(\d{1,2}) (%s)(?: (20\d\d))? (?:–|to) $" % "|".join(BS_MONTHS))
        found = []
        for m in rx.finditer(text):
            lead = lead_rx.search(text[max(0, m.start() - 25):m.start()])
            if lead and not m.group(2) and m.group(6):
                # a range that crosses a BS month or year: "25 Kartik – 9 Mangsir 2078 (11–25 November 2021)",
                # "24 Chaitra 2062 – 11 Baisakh 2063 (6–24 April 2006)"
                found.append((lead.group(1), lead.group(2), lead.group(3) or m.group(4), m.group(5), m.group(7), m.group(8), lead.group(0) + m.group(0) + " [start of range]"))
                found.append((m.group(1), m.group(3), m.group(4), m.group(6), m.group(7), m.group(8), lead.group(0) + m.group(0) + " [end of range]"))
                continue
            found.append((m.group(1), m.group(3), m.group(4), m.group(5), m.group(7), m.group(8), m.group(0)))
            if m.group(2) and m.group(6):
                found.append((m.group(2), m.group(3), m.group(4), m.group(6), m.group(7), m.group(8), m.group(0) + " [end of range]"))
        found += [(m.group(1), m.group(2), m.group(3), m.group(4), m.group(5), m.group(6), m.group(0)) for m in rx2.finditer(text)]
        for bd, bm, by, ad, am, ay, shown in found:
            got = nd.date(int(by), BS_MONTHS.index(bm) + 1, int(bd)).to_datetime_date()
            pairs_checked += 1
            if (got.day, got.month, got.year) != (int(ad), AD_MONTHS.index(am) + 1, int(ay)):
                pairs_wrong.append("%s -> should be %d %s %d" % (shown, got.day, AD_MONTHS[got.month - 1], got.year))
        for w in sorted(set(pairs_wrong)):
            bad("date pair: " + w)
    except ImportError:
        pairs_checked = -1

    # ---- report
    print("Chapter %d (Part %d): %d topics, %d MCQs (%d in topics + 25 at the end), %d short-answer questions" % (ch, part, len(topic_at), len(qs), len(qs) - 25, saq))
    print("labels:", dict(labels), "| answers:", dict(sorted(key.items())))
    by_topic = collections.OrderedDict()
    for q in qs:
        group = q["id"].rsplit(".", 1)[0] if q["id"].startswith("Q") else "T"
        by_topic.setdefault(group, []).append(q["answers"][0] if q["answers"] else "?")
    print("keys:", " | ".join("%s %s" % (g.replace("Q ", ""), " ".join(v)) for g, v in by_topic.items()))
    print("marks: 🔄 ×%d, ⚖️ ×%d | lines: %d" % (sum(l.count("🔄") for l in lines), sum(l.count("⚖️") for l in lines), len(lines)))
    print("BS–AD pairs checked:", "not checked (pip install nepali-datetime)" if pairs_checked < 0 else pairs_checked)
    print("nearly repeated stems (look at each):", near if near else "none")
    print("%d problem(s)" % len(problems))
    for p in problems:
        print("  ✗ " + p)
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
