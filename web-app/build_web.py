#!/usr/bin/env python3
"""Build the web application of the Loksewa Study Book: a small web site that also works offline.

    bash    android-app/tools/fetch_toolchain.sh    # once per machine: brings markdown-it-py and Pillow
    python3 web-app/build_web.py                    # every time the book changes

The result is the folder docs/ at the top of the repository. GitHub Pages publishes that folder
(repository Settings -> Pages -> Deploy from a branch -> main, /docs), so the web application is at

    https://gobindsah9841-max.github.io/loksewa/

once the change has reached the main branch.

The pages are the very files the Android app carries: android-app/app/web (index.html, app.css, app.js)
and the data files that android-app/tools/make_assets.py writes from the markdown in study-book/.
Nothing in them is changed, except that index.html gets a few extra lines in its head and one script.
Five things are added for the web:

    manifest.webmanifest, icons/   let a phone put the book on its home screen and open it like an app
    pwa.js                         starts the service worker; says when the offline copy is ready
    sw.js                          the service worker: keeps a copy of every file on the phone
    version.json                   what this build holds (for checking what is published)
    .nojekyll                      tells GitHub Pages to publish the files as they are

The same input on the same day gives the same output, byte for byte.
"""
import argparse
import hashlib
import json
import os
import shutil
import sys

sys.dont_write_bytecode = True  # keep __pycache__ folders out of the repository
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
ANDROID = os.path.join(REPO, "android-app")
TC = os.environ.get("TC", "/tmp/loksewa-apk-toolchain")
sys.path.insert(0, os.path.join(TC, "pylib"))
sys.path.insert(0, os.path.join(ANDROID, "tools"))

SITE_URL = "https://gobindsah9841-max.github.io/loksewa/"
NAME = "Loksewa Study Book"
SHORT_NAME = "Loksewa"
DESCRIPTION = ("Study book for the provincial Public Service Commission 5th Level (non-technical) Paper I: "
               "reading, practice MCQs, timed tests and search. Works without the internet after the first visit.")
THEME, BACKGROUND = "#1f3a5f", "#f4f6f9"

HEAD_LINES = """<meta name="description" content="%(description)s">
<meta name="theme-color" content="%(theme)s">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="%(short)s">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" sizes="192x192" href="icons/icon-192.png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
"""


def full_bleed_icon(size, zoom_factor, scale=4):
    """The launcher drawing on a full navy square, kept inside the middle of the picture.

    Android cuts a 'maskable' icon to a circle or a rounded square and iOS rounds the corners itself,
    so these pictures have no transparent corners and the book stays inside the safe middle part."""
    from PIL import Image, ImageDraw
    import make_icons as mi
    n = size * scale
    img = Image.new("RGB", (n, n), mi.NAVY)
    d = ImageDraw.Draw(img)
    zoom = n / 108.0 * zoom_factor

    def tr(pt):
        return ((pt[0] - 54) * zoom + n / 2, (pt[1] - 55) * zoom + n / 2)

    d.polygon([tr(p) for p in mi.polygon(mi.LEFT_PAGE)], fill=mi.WHITE)
    d.polygon([tr(p) for p in mi.polygon(mi.RIGHT_PAGE)], fill=mi.PAGE)
    for a, b in mi.LINES:
        d.line([tr(a), tr(b)], fill="#8FA3BF", width=max(1, int(1.7 * zoom)))
    x, y, r = mi.BADGE
    cx, cy = tr((x, y))
    rr = r * zoom
    d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=mi.GOLD, outline=mi.NAVY, width=max(1, int(1.6 * zoom)))
    d.line([tr(p) for p in mi.TICK], fill=mi.WHITE, width=max(2, int(3 * zoom)), joint="curve")
    return img.resize((size, size), Image.LANCZOS)


def write_icons(folder):
    import make_icons as mi
    os.makedirs(folder)
    mi.legacy_png(192, scale=8).save(os.path.join(folder, "icon-192.png"), optimize=True)
    mi.legacy_png(512, scale=4).save(os.path.join(folder, "icon-512.png"), optimize=True)
    full_bleed_icon(512, 1.2).save(os.path.join(folder, "maskable-512.png"), optimize=True)
    full_bleed_icon(180, 1.35).save(os.path.join(folder, "apple-touch-icon.png"), optimize=True)


def manifest():
    return {
        "name": NAME,
        "short_name": SHORT_NAME,
        "description": DESCRIPTION,
        "lang": "en",
        "start_url": "./",
        "scope": "./",
        "display": "standalone",
        "background_color": BACKGROUND,
        "theme_color": THEME,
        "icons": [
            {"src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"},
            {"src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"},
            {"src": "icons/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
        ],
    }


def replace_once(text, old, new, what):
    if text.count(old) != 1:
        raise SystemExit("index.html: expected exactly one %s, found %d" % (what, text.count(old)))
    return text.replace(old, new)


def site_files(out):
    """Every published file, as a path relative to the site, in a fixed order."""
    found = []
    for folder, _, names in os.walk(out):
        for name in names:
            found.append(os.path.relpath(os.path.join(folder, name), out).replace(os.sep, "/"))
    return sorted(found)


def main():
    ap = argparse.ArgumentParser(description="Build the web application into docs/.")
    ap.add_argument("--book", default=os.path.join(REPO, "study-book"), help="folder with the markdown book")
    ap.add_argument("--out", default=os.path.join(REPO, "docs"), help="output folder (GitHub Pages publishes docs/)")
    ap.add_argument("--version-name", default="", help="default: 1.<number of the last Part in the book>, as in the Android app")
    args = ap.parse_args()
    out = os.path.abspath(args.out)
    if os.path.exists(out) and not os.path.exists(os.path.join(out, "sw.js")) and os.listdir(out):
        raise SystemExit("%s exists and is not an earlier build of this site; not touching it" % out)

    try:
        import make_assets
        import PIL  # noqa: F401
    except ImportError as e:
        raise SystemExit("Missing Python package (%s). Run android-app/tools/fetch_toolchain.sh first, "
                         "or: pip install markdown-it-py Pillow" % e.name)

    # 1. the app's pages and the book's data, exactly as in the Android app
    shutil.rmtree(out, ignore_errors=True)
    shutil.copytree(os.path.join(ANDROID, "app", "web"), out)
    sys.argv = ["make_assets.py", args.book, os.path.join(out, "data"), "pending"]
    index = make_assets.main()
    version_name = args.version_name or "1.%d" % index["lastPart"]
    index_js = os.path.join(out, "data", "index.js")
    text = open(index_js, encoding="utf-8").read()
    if text.count('"version":"pending"') != 1:
        raise SystemExit("data/index.js: version marker not found")
    open(index_js, "w", encoding="utf-8").write(text.replace('"version":"pending"', '"version":"%s"' % version_name))

    # 2. what a phone needs to treat the site as an app
    write_icons(os.path.join(out, "icons"))
    with open(os.path.join(out, "manifest.webmanifest"), "w", encoding="utf-8") as f:
        json.dump(manifest(), f, indent=2, ensure_ascii=False)
        f.write("\n")
    shutil.copy(os.path.join(HERE, "src", "pwa.js"), os.path.join(out, "pwa.js"))
    page = open(os.path.join(out, "index.html"), encoding="utf-8").read()
    page = replace_once(page, '<link rel="stylesheet" href="app.css">\n',
                        '<link rel="stylesheet" href="app.css">\n' + HEAD_LINES % {
                            "description": DESCRIPTION, "theme": THEME, "short": SHORT_NAME}, "stylesheet line")
    page = replace_once(page, '<script src="app.js"></script>\n',
                        '<script src="app.js"></script>\n<script src="pwa.js"></script>\n', "app.js script line")
    open(os.path.join(out, "index.html"), "w", encoding="utf-8").write(page)

    # 3. the service worker: a list of every file, and a version name that changes when any file changes
    files = site_files(out)
    digest = hashlib.sha256()
    total = 0
    for name in files:
        data = open(os.path.join(out, name), "rb").read()
        total += len(data)
        digest.update(name.encode("utf-8") + b"\0" + data + b"\0")
    version = "%s-%s" % (version_name, digest.hexdigest()[:12])
    worker = open(os.path.join(HERE, "src", "sw.template.js"), encoding="utf-8").read()
    for marker in ("'__VERSION__'", "__FILES__"):
        if worker.count(marker) != 1:
            raise SystemExit("sw.template.js: expected exactly one %s" % marker)
    worker = worker.replace("'__VERSION__'", json.dumps(version))
    worker = worker.replace("__FILES__", json.dumps(["./"] + files, indent=2))
    open(os.path.join(out, "sw.js"), "w", encoding="utf-8").write(worker)

    # 4. two small files that are not part of the offline copy
    info = {
        "name": NAME,
        "version": version_name,
        "offlineCopy": version,
        "built": index["built"],
        "parts": "%d-%d" % (index["firstPart"], index["lastPart"]),
        "chapters": "%d-%d" % (index["chapters"][0], index["chapters"][-1]),
        "mcq": index["mcq"],
        "shortAnswerQuestions": index["saq"],
        "files": len(files),
        "bytes": total,
    }
    with open(os.path.join(out, "version.json"), "w", encoding="utf-8") as f:
        json.dump(info, f, indent=2)
        f.write("\n")
    open(os.path.join(out, ".nojekyll"), "w").close()

    print("\nWeb application ready: %s  (%d files in the offline copy, %.2f MB; version %s, offline copy %s)"
          % (os.path.relpath(out, REPO), len(files), total / 1e6, version_name, version))
    print("Published address after the change reaches the main branch: " + SITE_URL)
    return info


if __name__ == "__main__":
    main()
