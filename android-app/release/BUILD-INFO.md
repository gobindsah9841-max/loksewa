# Build information

| | |
|---|---|
| File | `loksewa-study-book.apk` |
| Built (UTC) | 12 November 2026, 04:36 |
| App name | Loksewa Study Book |
| Package | `io.github.gobindsah9841max.loksewa.studybook` |
| Version | 1.12 (code 26111204) |
| Android versions | declared minimum Android 5.0 (API 21); built against and targeting Android 14 (API 34) |
| Permissions | none (checked in the finished APK) |
| Size | 1.03 MB (1026848 bytes); 3.6 MB unpacked; 39 files |
| SHA-256 of the APK | `d730be08ab9f80d10307dffd730adbec7d295f0acec3de04b01bf282dc5d544d` |
| Signing certificate SHA-256 | `dad400e8a5445ba479c8bf6a546277c86216ffa4dd78cb2aadc6e6339eba771b` |
| Signature schemes | v1 (JAR), v2 and v3 — checked with `apksigner verify` |
| Book content | Parts 1–12 (Chapters 1–8): 585 MCQs, 117 short-answer questions |

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
