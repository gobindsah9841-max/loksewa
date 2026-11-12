#!/usr/bin/env bash
# Optional checks of the reader's pages (run after build_apk.py --keep-work):
#   1. tools/test_ui.js       55 behaviour checks in a simulated browser (jsdom)
#   2. tools/browser_check.mjs a walk through every screen in a real headless Chromium opened from
#                              disk at phone size, with screenshots
# Everything it needs comes from registry.npmjs.org and pypi.org and goes into $BC (default
# /tmp/loksewa-browser-check). Nothing is added to the repository or to the APK.
#
#   bash android-app/tools/browser_check.sh [www-dir] [screenshot-dir]
#   SETUP_ONLY=1 bash android-app/tools/browser_check.sh      # only install the browser and the fonts
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
WWW="${1:-/tmp/loksewa-apk-work/assets/www}"
OUT="${2:-/tmp/loksewa-apk-work/screenshots}"
BC="${BC:-/tmp/loksewa-browser-check}"
TC="${TC:-/tmp/loksewa-apk-toolchain}"
mkdir -p "$BC/fonts" "$BC/home" "$OUT"
cd "$BC"

if [ ! -d node_modules/puppeteer-core ]; then
  echo "Installing jsdom, puppeteer-core and a packaged Chromium (about 70 MB) ..."
  npm install --silent --no-audit --no-fund jsdom puppeteer-core @sparticuz/chromium @fontsource/noto-sans-devanagari
fi

# The packaged Chromium is made for AWS Lambda; unpack the shared libraries and fonts it brings.
if [ ! -d "$BC/libs/lib" ]; then
  mkdir -p "$BC/libs"
  node -e '
    const z = require("zlib"), fs = require("fs"), dir = "node_modules/@sparticuz/chromium/bin/";
    for (const n of ["al2023", "swiftshader", "fonts"]) {
      fs.writeFileSync(process.argv[1] + "/" + n + ".tar", z.brotliDecompressSync(fs.readFileSync(dir + n + ".tar.br")));
    }' "$BC/libs"
  for n in al2023 swiftshader fonts; do tar -xf "$BC/libs/$n.tar" -C "$BC/libs"; rm "$BC/libs/$n.tar"; done
  cp "$BC"/libs/fonts/Open_Sans/*.ttf "$BC/fonts/"
fi

# A Devanagari font so that the Nepali words show in the screenshots (phones have their own).
if [ ! -s "$BC/fonts/NotoSansDevanagari-Regular.ttf" ]; then
  python3 -m pip install --quiet --target "$BC/pylib" fonttools
  PYTHONPATH="$BC/pylib" python3 - "$BC" <<'PY'
import sys
from fontTools.ttLib import TTFont
bc = sys.argv[1]
src = bc + "/node_modules/@fontsource/noto-sans-devanagari/files/noto-sans-devanagari-devanagari-%s-normal.woff"
for weight, name in (("400", "Regular"), ("700", "Bold")):
    font = TTFont(src % weight)
    font.flavor = None
    font.save("%s/fonts/NotoSansDevanagari-%s.ttf" % (bc, name))
PY
fi
cat > "$BC/fonts.conf" <<XML
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig><dir>$BC/fonts</dir><cachedir>$BC/fonts-cache</cachedir><config></config></fontconfig>
XML

# web-app/check_web.sh uses the same browser: it asks for the setup only
if [ -n "${SETUP_ONLY:-}" ]; then exit 0; fi

echo "== 1. Behaviour checks (jsdom)"
node "$HERE/test_ui.js" "$WWW" "$BC/node_modules" | tail -1

echo "== 2. Real Chromium, opened from disk at phone size"
cp "$HERE/browser_check.mjs" "$BC/browser_check.mjs"
LD_LIBRARY_PATH="$BC/libs/lib:$BC/libs" FONTCONFIG_FILE="$BC/fonts.conf" HOME="$BC/home" \
  node "$BC/browser_check.mjs" "$WWW" "$OUT"

# One picture of four screens for the release folder.
if [ -d "$TC/pylib/PIL" ]; then
  PYTHONPATH="$TC/pylib" python3 - "$OUT" "$HERE/../release/preview.jpg" <<'PY'
import glob, sys
from PIL import Image
out, dest = sys.argv[1], sys.argv[2]
want = ["home", "topic", "question-answered", "test-running"]
files = [glob.glob("%s/*-%s.png" % (out, w))[0] for w in want]
width = 360
shots = [Image.open(f).convert("RGB") for f in files]
shots = [s.resize((width, int(s.height * width / s.width)), Image.LANCZOS) for s in shots]
gap = 16
sheet = Image.new("RGB", (width * len(shots) + gap * (len(shots) + 1), shots[0].height + 2 * gap), "#D5DBE3")
for k, s in enumerate(shots):
    sheet.paste(s, (gap + k * (width + gap), gap))
sheet.save(dest, quality=85, optimize=True)
print("preview written:", dest, sheet.size)
PY
fi
echo "Screenshots are in $OUT"
