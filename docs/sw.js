/* Loksewa Study Book — service worker of the web version.
   Written by web-app/build_web.py from web-app/src/sw.template.js. Do not edit the copy in docs/.

   What it does:
     install   fetches every file of the book once and stores it on the phone (one cache per version);
     fetch     answers every request for the book from that stored copy, so the book opens offline;
     activate  removes the stored copies of older versions.
   A newer version is fetched in the background and waits. It takes over when the reader taps
   "Update" (pwa.js sends SKIP_WAITING) or when every tab of the book has been closed. */
'use strict';

var VERSION = "1.14-dcee4873d818";
var CACHE = 'loksewa-' + VERSION;
var FILES = [
  "./",
  "app.css",
  "app.js",
  "data/index.js",
  "data/part-0.js",
  "data/part-1.js",
  "data/part-10.js",
  "data/part-11.js",
  "data/part-12.js",
  "data/part-13.js",
  "data/part-14.js",
  "data/part-2.js",
  "data/part-3.js",
  "data/part-4.js",
  "data/part-5.js",
  "data/part-6.js",
  "data/part-7.js",
  "data/part-8.js",
  "data/part-9.js",
  "data/quiz-1.js",
  "data/quiz-10.js",
  "data/quiz-2.js",
  "data/quiz-3.js",
  "data/quiz-4.js",
  "data/quiz-5.js",
  "data/quiz-6.js",
  "data/quiz-7.js",
  "data/quiz-8.js",
  "data/quiz-9.js",
  "data/search.js",
  "icons/apple-touch-icon.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/maskable-512.png",
  "index.html",
  "manifest.webmanifest",
  "pwa.js"
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      /* cache: 'reload' goes past the browser's own HTTP cache, so that the stored copy is really the new one */
      return cache.addAll(FILES.map(function (file) { return new Request(file, { cache: 'reload' }); }));
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(names.map(function (name) {
        if (name.indexOf('loksewa-') === 0 && name !== CACHE) { return caches.delete(name); }
        return null;
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SKIP_WAITING') { self.skipWaiting(); }
});

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET') { return; }
  if (request.url.indexOf(self.location.origin + '/') !== 0) { return; }   // links to other sites go to the network as usual
  event.respondWith(
    caches.open(CACHE).then(function (cache) {
      return cache.match(request, { ignoreSearch: true }).then(function (stored) {
        if (stored) { return stored; }
        if (request.mode === 'navigate') {
          /* any other address inside the book's folder opens the book itself */
          return cache.match('index.html').then(function (page) { return page || fetch(request); });
        }
        return fetch(request);
      });
    })
  );
});
