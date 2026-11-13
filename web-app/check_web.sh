#!/usr/bin/env bash
# Checks of the web application in docs/ (run after web-app/build_web.py):
#   1. android-app/tools/test_ui.js   the app's 55 behaviour checks in a simulated browser (jsdom),
#                                     with the pages coming from a web server
#   2. web-app/tools/check_web.mjs    a real headless Chromium: the site served the way GitHub Pages
#                                     serves it, the offline copy, and the update to a newer build
# The browser is the one android-app/tools/browser_check.sh installs (from registry.npmjs.org and
# pypi.org, into $BC, default /tmp/loksewa-browser-check). Nothing is added to the repository.
#
#   bash web-app/check_web.sh [screenshot-dir]
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(dirname "$HERE")"
DOCS="$REPO/docs"
OUT="${1:-/tmp/loksewa-web-check}"
BC="${BC:-/tmp/loksewa-browser-check}"
export BC

SETUP_ONLY=1 bash "$REPO/android-app/tools/browser_check.sh"

echo "== 1. Behaviour checks (jsdom), pages from a web server"
node "$REPO/android-app/tools/test_ui.js" "$DOCS" "$BC/node_modules" | tail -1

echo "== 2. Real Chromium: served like GitHub Pages, offline copy, update"
cp "$HERE/tools/check_web.mjs" "$BC/check_web.mjs"
LD_LIBRARY_PATH="$BC/libs/lib:$BC/libs" FONTCONFIG_FILE="$BC/fonts.conf" HOME="$BC/home" \
  node "$BC/check_web.mjs" "$DOCS" "$OUT"
