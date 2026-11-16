# Build information

| | |
|---|---|
| File | `loksewa-study-book.apk` |
| Built (UTC) | 13 November 2026, 15:11 |
| App name | Loksewa Study Book |
| Package | `io.github.gobindsah9841max.loksewa.studybook` |
| Version | 1.16 (code 26111315) |
| Android versions | declared minimum Android 5.0 (API 21); built against and targeting Android 14 (API 34) |
| Permissions | none (checked in the finished APK) |
| Size | 1.49 MB (1490268 bytes); 5.3 MB unpacked; 47 files |
| SHA-256 of the APK | `58811b31e96774d3a24b890c80033515e0fe84ebe93df12fd118714dffd41973` |
| Signing certificate SHA-256 | `711b8cdacb7934d32cc3189788ecaa91730c64eb45ccd054f2d05f73aa768dde` |
| Signature schemes | v1 (JAR), v2 and v3 — checked with `apksigner verify` |
| Book content | Parts 1–16 (Chapters 1–12): 830 MCQs, 166 short-answer questions |

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
