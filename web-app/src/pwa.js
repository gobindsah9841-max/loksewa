/* Loksewa Study Book — web version only (the Android app does not load this file).
   It starts the service worker (sw.js), which keeps a copy of every file of the book on the phone,
   and it tells the reader when that copy is ready or when a newer version has arrived.
   Plain ES5, like the rest of the app. */
(function () {
  'use strict';
  if (!('serviceWorker' in navigator)) { return; }   // very old browser: the pages still work, but only online

  var box = null, timer = null;

  function hide() {
    if (timer) { clearTimeout(timer); timer = null; }
    if (box && box.parentNode) { box.parentNode.removeChild(box); }
    box = null;
  }

  /* A small message at the bottom of the screen, with an optional button. */
  function show(text, buttonText, onButton, stayMs) {
    var span, b, x;
    hide();
    box = document.createElement('div');
    box.id = 'pwaNote';
    box.setAttribute('role', 'status');
    box.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:60;background:#1f3a5f;color:#fff;' +
      'border-radius:10px;padding:12px 14px;font-size:15px;line-height:1.4;box-shadow:0 2px 10px rgba(0,0,0,.35);' +
      'display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;';
    span = document.createElement('span');
    span.style.cssText = '-webkit-flex:1;flex:1;min-width:0;';
    span.appendChild(document.createTextNode(text));
    box.appendChild(span);
    if (buttonText) {
      b = document.createElement('button');
      b.type = 'button';
      b.id = 'pwaBtn';
      b.style.cssText = 'margin-left:10px;border:0;border-radius:8px;padding:8px 14px;background:#f2b705;color:#1c2430;font-weight:700;font-size:15px;';
      b.appendChild(document.createTextNode(buttonText));
      b.addEventListener('click', onButton, false);
      box.appendChild(b);
    }
    x = document.createElement('button');
    x.type = 'button';
    x.id = 'pwaClose';
    x.setAttribute('aria-label', 'Close this message');
    x.style.cssText = 'margin-left:6px;border:0;background:transparent;color:#fff;font-size:20px;line-height:1;padding:6px 8px;';
    x.appendChild(document.createTextNode('\u00d7'));
    x.addEventListener('click', hide, false);
    box.appendChild(x);
    document.body.appendChild(box);
    if (stayMs) { timer = setTimeout(hide, stayMs); }
  }

  /* true: an earlier copy of the book is already serving this page, so a new service worker means an update */
  var controlled = !!navigator.serviceWorker.controller;
  var reloading = false;

  function offerUpdate(reg) {
    show('A newer version of the book is ready.', 'Update', function () {
      var waiting = reg.waiting;
      if (!waiting) { hide(); return; }
      show('Updating\u2026');
      waiting.postMessage({ type: 'SKIP_WAITING' });   // sw.js then takes over, and the page reloads (below)
    });
  }

  function watch(reg, worker) {
    if (!worker) { return; }
    worker.addEventListener('statechange', function () {
      if (worker.state === 'installed' && controlled) { offerUpdate(reg); }
      if (worker.state === 'activated' && !controlled) {
        show('Saved on this phone. The book now opens without the internet.', null, null, 9000);
      }
    }, false);
  }

  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (!controlled || reloading) { return; }   // the first copy taking over needs no reload
    reloading = true;
    window.location.reload();
  }, false);

  function start() {
    navigator.serviceWorker.register('sw.js').then(function (reg) {
      if (reg.waiting && controlled) { offerUpdate(reg); }
      watch(reg, reg.installing);
      reg.addEventListener('updatefound', function () { watch(reg, reg.installing); }, false);
    })['catch'](function () { /* no offline copy in this browser; the pages still work online */ });
  }

  if (document.readyState === 'complete') { start(); } else { window.addEventListener('load', start, false); }
})();
