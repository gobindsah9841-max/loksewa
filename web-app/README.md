# Loksewa Study Book — web app

The study book in [`../study-book/`](../study-book/README.md) as a web application: it opens in the browser of a phone,
can be put on the home screen like an app, and **works without the internet after the first visit**.

**Address:** <https://gobindsah9841-max.github.io/loksewa/>

Or scan this picture with the phone's camera:

<img src="web-app-qr.png" alt="QR code of the web app address" width="200">

It holds the same pages as the [Android app](../android-app/README.md): reading, practice MCQs, timed tests, search,
text size and dark mode. Nothing has to be installed and no file has to be downloaded by hand.

---

## 1. How to use it on a phone

1. Open the address above in **Chrome** (or another browser) while the phone has internet.
2. Wait a few seconds. A blue message appears at the bottom: **"Saved on this phone. The book now opens without the internet."**
   From then on the same address opens without internet too. The first visit fetches about 5.3 MB of files
   (about 1.5 MB when the server compresses them, as GitHub Pages normally does). The figure grows as chapters are added.
3. To get an icon on the home screen: in Chrome open the **⋮** menu and choose **Add to Home screen** (or **Install app**).
   On an iPhone: the Share button, then **Add to Home Screen**. The book then opens in its own window, like an app.

**When the book changes,** the web app notices it the next time it is opened with internet. It fetches the new files
in the background and then shows **"A newer version of the book is ready."** with an **Update** button. One tap, and the
new version is shown. Until then the old version stays complete and usable.

**Your scores, test results and reading positions** are kept by the browser on your phone, for this address only.
They are not sent anywhere. They are lost if you clear the browser's data for the site, and they are separate from the
scores kept by the Android app.

## 2. Where the published pages come from

The address above is served by **GitHub Pages** from the folder [`docs/`](../docs) on the **`main`** branch of this repository.

- GitHub Pages must be switched on **once** by the owner of the repository; the build tools are not allowed to do it:
  **Settings → Pages → Build and deployment → Source: "Deploy from a branch" → Branch: `main`, folder `/docs` → Save.**
- After that, GitHub publishes `docs/` again by itself every time `main` changes. It takes a minute or two.
- A new chapter therefore appears in the web app when the branch that holds it has been merged into `main`.
- `https://gobindsah9841-max.github.io/loksewa/version.json` shows which build is published.

Everything published is public, like the repository itself.

## 3. What was checked, and what was not

Checked on every build by `web-app/check_web.sh`:

- the app's own 55 behaviour checks in a simulated browser, with the pages coming from a web server;
- in a real headless Chromium at phone size, with the site served under `/loksewa/` as GitHub Pages serves it:
  - the pages load and every address stays inside `/loksewa/`;
  - the manifest and the three icons are read without errors;
  - the service worker stores every file, and the "Saved on this phone" message appears;
  - with the network cut **and** the server stopped, the book still opens: home, a chapter, practice questions, search, a new tab;
  - a newer build is offered with the Update button, takes over after one tap, and the old copy is removed.

The pages themselves are the ones inside the Android app, which has its own checks (`android-app/tools/browser_check.sh`).

**Not checked:**

- a real phone, and browsers other than Chromium (Firefox, Safari on iPhone, Samsung Internet);
- GitHub Pages itself — the checks use a local server that behaves the same way for one site folder;
- whether a given phone shows the "Add to Home screen" offer by itself; the menu entry is the sure way.

## 4. Build it again

```bash
bash android-app/tools/fetch_toolchain.sh     # once per machine: brings markdown-it-py and Pillow (and the Android tools)
python3 web-app/build_web.py                  # writes docs/ again from study-book/
bash web-app/check_web.sh                     # optional checks (need node and npm; fetch about 70 MB once)
```

Then commit `docs/` together with the change to the book. The same book on the same day gives the same files, byte for byte.
The version shown in the app is `1.` followed by the number of the last Part, as in the Android app.

`build_web.py` needs only two Python packages. Without the Android toolchain: `pip install markdown-it-py Pillow`.

## 5. How it works

| File in `docs/` | Where it comes from | What it is for |
|---|---|---|
| `index.html`, `app.css`, `app.js` | copied from `android-app/app/web/`; `index.html` gets eight extra lines in its head and one script line | the app itself |
| `data/*.js` | written by `android-app/tools/make_assets.py` from the markdown book | the book, the questions and the search text |
| `manifest.webmanifest`, `icons/` | written by `build_web.py` (the icon is the Android launcher drawing) | lets a phone put the book on the home screen and open it in its own window |
| `pwa.js` | `web-app/src/pwa.js` | starts the service worker; shows the two messages |
| `sw.js` | `web-app/src/sw.template.js` + the list of files and a version name | the service worker: keeps a copy of every file on the phone |
| `version.json` | written by `build_web.py` | what the build holds; not part of the offline copy |
| `.nojekyll` | empty | tells GitHub Pages to publish the files as they are |

The service worker keeps one stored copy per version. The version name ends in a fingerprint of all the files, so any
change to the book gives a new name. A new copy is fetched whole before it is used, and the old one is removed only when
the new one has taken over, so the reader never sees a mixture of two versions.

## 6. Folder map

```
web-app/
├── README.md              this file
├── build_web.py           the build: study-book/ + android-app/app/web/  ->  docs/
├── check_web.sh           the checks of section 3
├── src/
│   ├── pwa.js             copied into docs/ as it is
│   └── sw.template.js     becomes docs/sw.js
└── tools/
    └── check_web.mjs      the Chromium part of the checks
docs/                      the built site — do not edit by hand; build_web.py writes it again
```

## 7. Limits you should know

- The web app is a reader. It does not fetch news or update the 🔄 facts; the book's dates apply.
- It shows what was published last. Open it with internet from time to time to receive new chapters.
- A browser may remove the stored copy of a site that has not been opened for a long time, or when the phone is very
  short of space. The book then needs internet once more. Putting it on the home screen makes this less likely.
- In a private (incognito) window nothing is kept after the window is closed.
