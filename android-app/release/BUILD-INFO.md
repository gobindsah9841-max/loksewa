# Build information

| | |
|---|---|
| File | `loksewa-study-book.apk` |
| Built (UTC) | 19 November 2026, 13:43 |
| App name | Loksewa Study Book |
| Package | `io.github.gobindsah9841max.loksewa.studybook` |
| Version | 1.17 (code 26111913) |
| Android versions | declared minimum Android 5.0 (API 21); built against and targeting Android 14 (API 34) |
| Permissions | none (checked in the finished APK) |
| Size | 1.63 MB (1625584 bytes); 5.7 MB unpacked; 49 files |
| SHA-256 of the APK | `52fc5ba6a125d3049f66db18fd62d5141dca6dd9452398505b59ecca4279e38a` |
| Signing certificate SHA-256 | `4244f1f7341130c7c48649fc8931647d941e2a9fd4c9c206a6e20ba657daf88f` |
| Signature schemes | v1 (JAR), v2 and v3 — checked with `apksigner verify` |
| Book content | Parts 1–17 (Chapters 1–13): 890 MCQs, 178 short-answer questions |

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
