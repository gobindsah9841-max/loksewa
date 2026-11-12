#!/usr/bin/env python3
"""Build the Loksewa Study Book APK from the markdown in ../study-book.

    bash   android-app/tools/fetch_toolchain.sh     # once per machine (about half a minute)
    python3 android-app/build_apk.py                # every time the book changes

The result is android-app/release/loksewa-study-book.apk, signed and ready to install.

No Android SDK or Gradle is needed. The steps are the ones Gradle would run, done by hand:
  1. markdown -> HTML and question data      (tools/make_assets.py)
  2. launcher icons                          (tools/make_icons.py)
  3. resources + manifest -> base.apk, R.java (aapt2 compile, aapt2 link)
  4. Java -> .class                          (ecj, against android.jar)
  5. .class -> classes.dex                   (dx)
  6. zip everything, uncompressed entries aligned on 4 bytes
  7. sign with APK signature schemes v1, v2 and v3, then verify (apksigner)
"""
import argparse
import datetime
import hashlib
import os
import re
import shutil
import struct
import subprocess
import sys
import zipfile

sys.dont_write_bytecode = True  # keep __pycache__ folders out of the repository
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
TC = os.environ.get("TC", "/tmp/loksewa-apk-toolchain")
sys.path.insert(0, os.path.join(TC, "pylib"))
sys.path.insert(0, os.path.join(HERE, "tools"))

JAVA = os.environ.get("JAVA", os.path.join(TC, "pylib/jdk4py/java-runtime/bin/java"))
KEYTOOL = os.environ.get("KEYTOOL", os.path.join(TC, "pylib/jdk4py/java-runtime/bin/keytool"))
AAPT2 = os.environ.get("AAPT2", os.path.join(TC, "pylib/aapt2/bin/Linux/aapt2"))
ANDROID_JAR = os.environ.get("ANDROID_JAR", os.path.join(TC, "tools/android.jar"))
ECJ = os.environ.get("ECJ", os.path.join(TC, "tools/ecj.jar"))
DX = os.environ.get("DX", os.path.join(TC, "tools/dx.jar"))
APKSIGNER = os.environ.get("APKSIGNER", os.path.join(TC, "tools/apksigner.jar"))

PACKAGE = "io.github.gobindsah9841max.loksewa.studybook"
KEYSTORE = os.path.join(HERE, "signing", "loksewa-debug.p12")
KEY_ALIAS, KEY_PASS = "loksewa", "android"
STORED = (".png", ".jpg", ".jpeg", ".webp", ".gif", ".arsc", ".woff", ".woff2", ".ttf", ".otf")


def run(cmd, quiet=False):
    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    lines = [l for l in proc.stdout.splitlines() if not l.startswith("WARNING:")]
    if proc.returncode != 0:
        print("\n".join(lines))
        raise SystemExit("FAILED: " + " ".join(cmd[:4]) + " ...")
    if not quiet and lines:
        print("\n".join("    " + l for l in lines if l.strip()))
    return "\n".join(lines)


def step(text):
    print("\n== " + text)


def aligned_extra(offset, name_len, align=4):
    """The zip 'extra' field Android uses (id 0xD935) to push stored data onto a 4-byte boundary."""
    pad = (-(offset + 30 + name_len + 6)) % align
    return struct.pack("<HHH", 0xD935, 2 + pad, align) + b"\0" * pad


def pack(base_apk, dex, assets_dir, out):
    entries = []
    with zipfile.ZipFile(base_apk) as z:
        for name in z.namelist():
            entries.append((name, z.read(name)))
    entries.append(("classes.dex", open(dex, "rb").read()))
    for root, dirs, files in os.walk(assets_dir):
        dirs.sort()
        for f in sorted(files):
            path = os.path.join(root, f)
            entries.append(("assets/" + os.path.relpath(path, assets_dir).replace(os.sep, "/"), open(path, "rb").read()))
    first = {"AndroidManifest.xml": 0, "classes.dex": 1, "resources.arsc": 2}
    entries.sort(key=lambda e: (first.get(e[0], 3), e[0]))
    with zipfile.ZipFile(out, "w") as z:
        for name, data in entries:
            info = zipfile.ZipInfo(name, date_time=(2026, 1, 1, 0, 0, 0))
            info.external_attr = 0o644 << 16
            info.create_system = 0
            if name.lower().endswith(STORED):
                info.compress_type = zipfile.ZIP_STORED
                info.extra = aligned_extra(z.fp.tell(), len(name.encode("utf-8")))
            else:
                info.compress_type = zipfile.ZIP_DEFLATED
            z.writestr(info, data, compresslevel=9)


def misaligned(apk):
    bad = []
    with open(apk, "rb") as f, zipfile.ZipFile(apk) as z:
        for info in z.infolist():
            f.seek(info.header_offset)
            header = f.read(30)
            name_len, extra_len = struct.unpack("<HH", header[26:30])
            if info.compress_type == zipfile.ZIP_STORED and (info.header_offset + 30 + name_len + extra_len) % 4:
                bad.append(info.filename)
    return bad


def dex_types(data):
    """Read a classes.dex and return (classes defined in it, every other type its code refers to)."""
    if data[:4] != b"dex\n":
        raise SystemExit("classes.dex is not a dex file")
    string_ids_off = struct.unpack_from("<I", data, 0x3C)[0]
    type_ids_size, type_ids_off = struct.unpack_from("<II", data, 0x40)
    class_defs_size, class_defs_off = struct.unpack_from("<II", data, 0x60)

    def type_name(type_idx):
        string_idx = struct.unpack_from("<I", data, type_ids_off + 4 * type_idx)[0]
        off = struct.unpack_from("<I", data, string_ids_off + 4 * string_idx)[0]
        while data[off] & 0x80:      # skip the length prefix
            off += 1
        off += 1
        return data[off:data.index(b"\0", off)].decode("utf-8", "replace")

    defined = [type_name(struct.unpack_from("<I", data, class_defs_off + 32 * k)[0]) for k in range(class_defs_size)]
    referred = sorted(set(type_name(i) for i in range(type_ids_size)) - set(defined))
    readable = lambda d: d[1:-1].replace("/", ".") if d.startswith("L") else d
    return [readable(d) for d in defined], [readable(d) for d in referred if d.startswith("L")]


def main():
    ap = argparse.ArgumentParser(description="Build the Loksewa Study Book APK")
    ap.add_argument("--book", default=os.path.join(REPO, "study-book"), help="folder with README.md and part-*.md")
    ap.add_argument("--work", default="/tmp/loksewa-apk-work", help="scratch folder (emptied first)")
    ap.add_argument("--out", default=os.path.join(HERE, "release", "loksewa-study-book.apk"), help="where to write the signed APK")
    ap.add_argument("--version-name", default="", help="default: 1.<number of the last Part in the book>")
    ap.add_argument("--version-code", type=int, default=0, help="default: the build hour as yymmddHH (UTC)")
    ap.add_argument("--keep-work", action="store_true", help="also keep the intermediate files (class files, dex, unsigned APK) in the scratch folder")
    args = ap.parse_args()

    for tool in (JAVA, KEYTOOL, AAPT2, ANDROID_JAR, ECJ, DX, APKSIGNER):
        if not os.path.exists(tool):
            raise SystemExit("Missing tool: %s\nRun android-app/tools/fetch_toolchain.sh first (or set TC / the tool variables)." % tool)

    now = datetime.datetime.utcnow()
    # the version code must grow with every build, or Android refuses the update: yymmddHH in UTC
    version_code = args.version_code or int(now.strftime("%y%m%d%H"))
    work = args.work
    shutil.rmtree(work, ignore_errors=True)
    www = os.path.join(work, "assets", "www")
    os.makedirs(os.path.dirname(www))

    step("1. Book -> pages and question data")
    shutil.copytree(os.path.join(HERE, "app", "web"), www)
    import make_assets
    sys.argv = ["make_assets.py", args.book, os.path.join(www, "data"), "pending"]
    index = make_assets.main()
    version_name = args.version_name or "1.%d" % index["lastPart"]
    # write the real version into the index now that the last part is known
    index_js = os.path.join(www, "data", "index.js")
    text = open(index_js, encoding="utf-8").read().replace('"version":"pending"', '"version":"%s"' % version_name)
    open(index_js, "w", encoding="utf-8").write(text)
    print("    version %s (code %d)" % (version_name, version_code))

    step("2. Launcher icons")
    res = os.path.join(work, "res")
    shutil.copytree(os.path.join(HERE, "app", "res"), res)
    import make_icons
    sys.argv = ["make_icons.py", res, os.path.join(HERE, "release", "icon-preview.png")]
    make_icons.main()

    step("3. Resources and manifest (aapt2)")
    os.chmod(AAPT2, 0o755)
    flat = os.path.join(work, "res.zip")
    run([AAPT2, "compile", "--dir", res, "-o", flat])
    base = os.path.join(work, "base.apk")
    gen = os.path.join(work, "gen")
    run([AAPT2, "link", "-o", base, "-I", ANDROID_JAR, "--manifest", os.path.join(HERE, "app", "AndroidManifest.xml"),
         "--java", gen, "--min-sdk-version", "21", "--target-sdk-version", "34",
         "--version-code", str(version_code), "--version-name", version_name, flat])

    step("4. Java -> class files (ecj)")
    classes = os.path.join(work, "classes")
    sources = []
    for root in (os.path.join(HERE, "app", "java"), gen):
        for dirpath, _dirs, files in os.walk(root):
            sources += [os.path.join(dirpath, f) for f in files if f.endswith(".java")]
    run([JAVA, "-jar", ECJ, "-source", "1.7", "-target", "1.7", "-bootclasspath", ANDROID_JAR, "-proc:none",
         "-warn:none", "-d", classes] + sources)

    step("5. Class files -> classes.dex (dx)")
    dex = os.path.join(work, "classes.dex")
    run([JAVA, "-cp", DX, "com.android.dx.command.Main", "--dex", "--min-sdk-version=21", "--output=" + dex, classes])

    step("6. Zip and align")
    unsigned = os.path.join(work, "unsigned.apk")
    pack(base, dex, os.path.join(work, "assets"), unsigned)

    step("7. Sign and verify (apksigner)")
    if not os.path.exists(KEYSTORE):
        os.makedirs(os.path.dirname(KEYSTORE), exist_ok=True)
        run([KEYTOOL, "-genkeypair", "-keystore", KEYSTORE, "-storetype", "PKCS12", "-alias", KEY_ALIAS, "-keyalg", "RSA",
             "-keysize", "2048", "-validity", "10950", "-storepass", KEY_PASS, "-keypass", KEY_PASS,
             "-dname", "CN=Loksewa Study Book (debug key), O=loksewa study book"], quiet=True)
        print("    new debug signing key created: " + os.path.relpath(KEYSTORE, REPO))
    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    run([JAVA, "-jar", APKSIGNER, "sign", "--ks", KEYSTORE, "--ks-key-alias", KEY_ALIAS, "--ks-pass", "pass:" + KEY_PASS,
         "--key-pass", "pass:" + KEY_PASS, "--v1-signing-enabled", "true", "--v2-signing-enabled", "true",
         "--v3-signing-enabled", "true", "--min-sdk-version", "21", "--out", args.out, unsigned], quiet=True)
    if os.path.exists(args.out + ".idsig"):
        os.remove(args.out + ".idsig")
    verify = run([JAVA, "-jar", APKSIGNER, "verify", "--verbose", "--print-certs", "--min-sdk-version", "21", args.out], quiet=True)
    badging = run([AAPT2, "dump", "badging", args.out], quiet=True)
    bad = misaligned(args.out)
    if bad:
        raise SystemExit("Stored entries are not 4-byte aligned: %s" % bad)
    if "Verified using v2 scheme (APK Signature Scheme v2): true" not in verify:
        raise SystemExit("Signature verification failed:\n" + verify)

    # What is really inside: the app must hold only its own classes and ask for no permission.
    with zipfile.ZipFile(args.out) as z:
        defined, referred = dex_types(z.read("classes.dex"))
    strangers = [c for c in defined if not c.startswith(PACKAGE + ".")]
    if strangers:
        raise SystemExit("Unexpected classes in classes.dex: %s" % strangers)
    if "uses-permission" in badging:
        raise SystemExit("The APK asks for a permission; it should ask for none:\n" + badging)

    size = os.path.getsize(args.out)
    sha = hashlib.sha256(open(args.out, "rb").read()).hexdigest()
    cert = re.search(r"certificate SHA-256 digest: (\w+)", verify)
    with zipfile.ZipFile(args.out) as z:
        names = z.namelist()
        raw = sum(i.file_size for i in z.infolist())
    info_lines = [
        "# Build information",
        "",
        "| | |",
        "|---|---|",
        "| File | `%s` |" % os.path.basename(args.out),
        "| Built (UTC) | %s |" % now.strftime("%d %B %Y, %H:%M"),
        "| App name | Loksewa Study Book |",
        "| Package | `%s` |" % PACKAGE,
        "| Version | %s (code %d) |" % (version_name, version_code),
        "| Android versions | declared minimum Android 5.0 (API 21); built against and targeting Android 14 (API 34) |",
        "| Permissions | none (checked in the finished APK) |",
        "| Size | %.2f MB (%d bytes); %.1f MB unpacked; %d files |" % (size / 1e6, size, raw / 1e6, len(names)),
        "| SHA-256 of the APK | `%s` |" % sha,
        "| Signing certificate SHA-256 | `%s` |" % (cert.group(1) if cert else "?"),
        "| Signature schemes | v1 (JAR), v2 and v3 — checked with `apksigner verify` |",
        "| Book content | Parts %d–%d (Chapters %d–%d): %d MCQs, %d short-answer questions |" % (
            index["firstPart"], index["lastPart"], index["chapters"][0], index["chapters"][-1], index["mcq"], index["saq"]),
        "",
        "Checks run by the build: `apksigner verify` (v1, v2, v3), `aapt2 dump badging`, 4-byte alignment of every stored entry,",
        "no permission requested, and no class in `classes.dex` other than the app's own.",
        "The build does not start the app on a phone or an emulator. What was and was not tested is listed in README.md.",
        "",
        "## Program code inside the APK",
        "",
        "Classes in `classes.dex` (%d): %s." % (len(defined), ", ".join("`%s`" % c.replace(PACKAGE + ".", "") for c in defined)),
        "",
        "Every other class the code refers to (%d) — all of them belong to Android or Java:" % len(referred),
        "",
    ] + ["- `%s`" % c for c in referred] + [
        "",
    ]
    open(os.path.join(os.path.dirname(args.out), "BUILD-INFO.md"), "w", encoding="utf-8").write("\n".join(info_lines))

    print("\n".join("    " + l for l in verify.splitlines() if l.startswith(("Verifies", "Verified using v1", "Verified using v2", "Verified using v3 ", "Number of signers"))))
    print("\n".join("    " + l for l in badging.splitlines() if l.startswith(("package:", "sdkVersion", "targetSdkVersion", "application-label:", "launchable-activity", "uses-permission"))))
    print("\nAPK ready: %s  (%.2f MB, sha256 %s...)" % (os.path.relpath(args.out, REPO), size / 1e6, sha[:16]))
    print("The app's pages are also in %s (tools/browser_check.sh looks at them in a browser)." % www)
    if not args.keep_work:
        for junk in ("classes", "gen", "res.zip", "base.apk", "unsigned.apk", "classes.dex"):
            path = os.path.join(work, junk)
            shutil.rmtree(path, ignore_errors=True) if os.path.isdir(path) else (os.path.exists(path) and os.remove(path))


if __name__ == "__main__":
    main()
