# Build information

| | |
|---|---|
| File | `loksewa-study-book.apk` |
| Built (UTC) | 12 November 2026, 09:22 |
| App name | Loksewa Study Book |
| Package | `io.github.gobindsah9841max.loksewa.studybook` |
| Version | 1.15 (code 26111209) |
| Android versions | declared minimum Android 5.0 (API 21); built against and targeting Android 14 (API 34) |
| Permissions | none (checked in the finished APK) |
| Size | 1.38 MB (1383633 bytes); 4.9 MB unpacked; 45 files |
| SHA-256 of the APK | `8233098d8f0857eb7c210c598c3df807111882afa35bec7f293ab1d5f316013b` |
| Signing certificate SHA-256 | `b1ed5a59d8e4fa6fcf3cc8fe1e42b801e1b9b8f2d4dba04900b2591e91b961cc` |
| Signature schemes | v1 (JAR), v2 and v3 — checked with `apksigner verify` |
| Book content | Parts 1–15 (Chapters 1–11): 770 MCQs, 154 short-answer questions |

Checks run by the build: `apksigner verify` (v1, v2, v3), `aapt2 dump badging`, 4-byte alignment of every stored entry,
no permission requested, and no class in `classes.dex` other than the app's own.
The build does not start the app on a phone or an emulator. What was and was not tested is listed in README.md.

## Program code inside the APK

Classes in `classes.dex` (8): `MainActivity$1`, `MainActivity`, `R$color`, `R$drawable`, `R$mipmap`, `R$string`, `R$style`, `R`.

Every other class the code refers to (20) — all of them belong to Android or Java:

- `android.app.Activity`
- `android.content.Context`
- `android.content.Intent`
- `android.net.Uri`
- `android.os.Bundle`
- `android.view.View`
- `android.view.ViewGroup`
- `android.view.ViewParent`
- `android.webkit.WebBackForwardList`
- `android.webkit.WebChromeClient`
- `android.webkit.WebSettings`
- `android.webkit.WebView`
- `android.webkit.WebViewClient`
- `dalvik.annotation.EnclosingClass`
- `dalvik.annotation.EnclosingMethod`
- `dalvik.annotation.InnerClass`
- `dalvik.annotation.MemberClasses`
- `java.lang.Exception`
- `java.lang.Object`
- `java.lang.String`
