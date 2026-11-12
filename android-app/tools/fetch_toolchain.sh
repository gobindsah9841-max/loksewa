#!/usr/bin/env bash
# Fetch a small Android build toolchain WITHOUT the Android SDK or Gradle.
#
# Why this exists: the APK in ../release was built in a sandbox that could reach only
# github.com, pypi.org and registry.npmjs.org — not dl.google.com or Maven Central.
# Everything below therefore comes from PyPI or from files committed in public GitHub repositories.
# If you have a normal Android SDK, you do not need this script: see README.md ("Using your own SDK").
#
# Result (in $TC, default /tmp/loksewa-apk-toolchain):
#   java, keytool   Temurin JRE, from the PyPI package jdk4py
#   aapt2           from the PyPI package aapt2 (2.19)
#   android.jar     API 34 platform jar, from github.com/Sable/android-platforms
#   ecj.jar         Eclipse Java compiler 4.2.2 (the JRE has no javac), from the Tomcat copy in github.com/jvf/scalaris
#   dx.jar          dx 30.0.2 (class files -> classes.dex), from github.com/oooooooko/kmpact (dex2jar 2.4 bundle)
#   apksigner.jar   apksigner 36.0.0, from github.com/oooooooko/kmpact
#   Python libs     markdown-it-py (markdown -> HTML), Pillow (launcher icons)
set -euo pipefail
TC="${TC:-/tmp/loksewa-apk-toolchain}"
mkdir -p "$TC/tools"
echo "Toolchain directory: $TC"

python3 -m pip install --quiet --upgrade --target "$TC/pylib" jdk4py aapt2 markdown-it-py Pillow
chmod +x "$TC/pylib/aapt2/bin/Linux/aapt2" || true

sparse_get() {  # repo  path-in-repo  destination
  local repo="$1" path="$2" dest="$3" tmp
  if [ -s "$dest" ]; then return; fi
  tmp="$(mktemp -d)"
  git clone --quiet --depth 1 --filter=blob:none --sparse "https://github.com/$repo.git" "$tmp/r"
  git -C "$tmp/r" sparse-checkout set "$(dirname "$path")" >/dev/null
  cp "$tmp/r/$path" "$dest"
  rm -rf "$tmp"
}
sparse_get Sable/android-platforms android-34/android.jar "$TC/tools/android.jar"
sparse_get jvf/scalaris contrib/wikipedia/contrib/apache-tomcat/lib/ecj-4.2.2.jar "$TC/tools/ecj.jar"
sparse_get oooooooko/kmpact androidcmdtools-resources/apksigner-36.0.0.jar "$TC/tools/apksigner.jar"
sparse_get oooooooko/kmpact androidcmdtools-resources/dex2jar-2.4/lib/dx-30.0.2.jar "$TC/tools/dx.jar"

JAVA="$TC/pylib/jdk4py/java-runtime/bin/java"
"$JAVA" -version 2>&1 | head -1
"$TC/pylib/aapt2/bin/Linux/aapt2" version 2>&1 | head -1
"$JAVA" -jar "$TC/tools/ecj.jar" -version 2>&1 | head -1
ls -la "$TC/tools"
echo "Toolchain ready."
