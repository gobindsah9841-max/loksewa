// Checks of the web application (docs/) in a real headless Chromium at the size of a phone screen.
//
// Run it through web-app/check_web.sh, which installs what it needs.
//   node check_web.mjs <docs-dir> [screenshot-dir]
//
// The site is served by a small local web server under /loksewa/ — the way GitHub Pages serves it at
// https://gobindsah9841-max.github.io/loksewa/ . The script checks that
//   1. the pages load there, and every address stays inside /loksewa/;
//   2. the manifest and the icons are what a phone needs to put the book on its home screen;
//   3. the service worker stores every file and the reader is told "Saved on this phone";
//   4. with the network cut AND the server stopped, the book still opens and works;
//   5. a newer build is offered with an "Update" button, takes over after one tap, and the old copy is removed.
// It exits with code 1 if any check fails. It cannot check a real phone, or GitHub Pages itself.
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import http from 'http';
import os from 'os';
import path from 'path';

const docs = path.resolve(process.argv[2] || 'docs');
const outDir = path.resolve(process.argv[3] || path.join(os.tmpdir(), 'loksewa-web-check'));
fs.mkdirSync(outDir, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const problems = [];
function check(cond, what) { if (!cond) { problems.push('FAILED: ' + what); } console.log('  ' + (cond ? '✓ ' : '✗ ') + what); }

/* ---------- a web server that behaves like GitHub Pages for one project site ---------- */
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json; charset=utf-8', '.png': 'image/png'
};
let root = docs;            // the folder being served; step 5 swaps in a newer build
const seen = [];            // every request, with its status
const sockets = new Set();
let server = null, port = 0;
function handler(req, res) {
  const u = decodeURIComponent(req.url.split('?')[0]);
  if (u === '/loksewa') { seen.push([301, u]); res.writeHead(301, { Location: '/loksewa/' }); res.end(); return; }
  if (u.indexOf('/loksewa/') !== 0) { seen.push([404, u]); res.writeHead(404); res.end('not found'); return; }
  let file = path.join(root, u.slice('/loksewa/'.length));
  if (u.endsWith('/')) { file = path.join(file, 'index.html'); }
  if (file.indexOf(root) !== 0 || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { seen.push([404, u]); res.writeHead(404); res.end('not found'); return; }
  seen.push([200, u]);
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'max-age=600' });
  res.end(fs.readFileSync(file));
}
function startServer() {
  return new Promise(resolve => {
    server = http.createServer(handler);
    server.on('connection', s => { sockets.add(s); s.on('close', () => sockets.delete(s)); });
    server.listen(port, '127.0.0.1', () => { port = server.address().port; resolve(); });
  });
}
function stopServer() {
  return new Promise(resolve => { for (const s of sockets) { s.destroy(); } server.close(() => resolve()); });
}

await startServer();
const base = 'http://127.0.0.1:' + port + '/loksewa/';
const built = JSON.parse(fs.readFileSync(path.join(docs, 'version.json'), 'utf8'));
const swText = fs.readFileSync(path.join(docs, 'sw.js'), 'utf8');
const listed = JSON.parse(swText.slice(swText.indexOf('var FILES = ') + 12, swText.indexOf('];', swText.indexOf('var FILES = ')) + 1));

const browser = await puppeteer.launch({
  executablePath: await chromium.executablePath(),
  args: [...chromium.args, '--no-sandbox', '--font-render-hinting=none'],
  headless: 'shell',
  defaultViewport: { width: 393, height: 800, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
});
console.log('browser:', await browser.version(), '| site:', base, '| build:', built.offlineCopy);

function watch(page) {
  page.on('pageerror', e => problems.push('script error: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') { problems.push('console error: ' + m.text()); } });
  page.on('requestfailed', r => problems.push('failed to load: ' + r.url()));
}
async function shot(page, name) {
  await page.screenshot({ path: path.join(outDir, name + '.png') });
  const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  if (m.sw > m.cw) { problems.push(name + ': the page is ' + m.sw + ' px wide on a ' + m.cw + ' px screen'); }
}
const noteText = page => page.evaluate(() => { const n = document.getElementById('pwaNote'); return n ? n.textContent : ''; });
async function waitFor(fn, ms, step = 100) { const end = Date.now() + ms; while (Date.now() < end) { if (await fn()) { return true; } await sleep(step); } return false; }
const cacheState = page => page.evaluate(async () => {
  const names = await caches.keys();
  const out = {};
  for (const n of names) { out[n] = (await (await caches.open(n)).keys()).length; }
  return out;
});
/* walk through the app: home, a chapter, practice questions, search — every screen needs its own data file */
async function useTheBook(page, label) {
  const home = await page.evaluate(() => ({ tiles: document.querySelectorAll('.tile').length, cards: document.querySelectorAll('#main a.card').length, parts: window.LSDATA.index.parts.length }));
  check(home.tiles === 4 && home.cards >= home.parts, label + ': home shows 4 tiles and all ' + home.parts + ' parts');
  const lastPart = home.parts - 1;
  await page.evaluate(i => { location.hash = '#/read/' + i; }, lastPart);
  check(await waitFor(() => page.evaluate(() => document.querySelectorAll('#book h2').length >= 7), 8000), label + ': the last chapter opens with its topics');
  const lastChapter = await page.evaluate(() => window.LSDATA.index.chapters[window.LSDATA.index.chapters.length - 1]);
  await page.evaluate(c => { location.hash = '#/quiz/' + c; }, lastChapter);
  check(await waitFor(() => page.evaluate(() => document.querySelectorAll('#main button.card').length >= 7), 8000), label + ': practice questions of the last chapter are listed');
  await page.evaluate(() => document.querySelector('#main button.card').click());
  check(await waitFor(() => page.evaluate(() => document.querySelectorAll('.q .opt').length === 4), 5000), label + ': a question with four options is shown');
  await page.evaluate(() => { location.hash = '#/search'; });
  await waitFor(() => page.evaluate(() => !!document.getElementById('sq')), 8000);
  await page.type('#sq', 'Lipulekh');
  check(await waitFor(() => page.evaluate(() => document.querySelectorAll('.hit').length > 3), 8000), label + ': search finds sections');
  await page.evaluate(() => { location.hash = '#/'; });
  await sleep(300);
}

/* ---------- 1. the pages, served like GitHub Pages ---------- */
console.log('1. Served under /loksewa/');
let page = await browser.newPage();
watch(page);
await page.goto('http://127.0.0.1:' + port + '/loksewa', { waitUntil: 'load' });   // without the last slash, as people type it
check(page.url() === base, 'the address without a final slash is sent on to ' + base);
check(await page.evaluate(() => !!window.LSDATA && !!window.LSDATA.index), 'the book index is loaded');
check(await page.evaluate(() => window.LSDATA.index.version) === built.version, 'the page shows version ' + built.version);

/* ---------- 2. what a phone needs to install it ---------- */
console.log('2. Manifest and icons');
const head = await page.evaluate(() => ({
  manifest: (document.querySelector('link[rel="manifest"]') || {}).href || '',
  theme: (document.querySelector('meta[name="theme-color"]') || {}).content || '',
  touch: (document.querySelector('link[rel="apple-touch-icon"]') || {}).href || ''
}));
check(head.manifest === base + 'manifest.webmanifest' && head.theme === '#1f3a5f' && head.touch === base + 'icons/apple-touch-icon.png', 'the page names its manifest, theme colour and touch icon');
const man = await page.evaluate(async url => {
  const r = await fetch(url);
  const m = await r.json();
  const icons = [];
  for (const i of m.icons) {
    const img = new Image();
    img.src = new URL(i.src, url).href;
    await new Promise(done => { img.onload = done; img.onerror = done; });
    icons.push({ src: i.src, sizes: i.sizes, purpose: i.purpose, w: img.naturalWidth, h: img.naturalHeight });
  }
  return { type: r.headers.get('content-type'), m, icons, start: new URL(m.start_url, url).href, scope: new URL(m.scope, url).href };
}, head.manifest);
check(man.m.name === 'Loksewa Study Book' && man.m.short_name === 'Loksewa' && man.m.display === 'standalone', 'manifest: name, short name, opens as a standalone app');
check(man.start === base && man.scope === base, 'manifest: start address and scope are the site folder (' + man.start + ')');
check(man.icons.length === 3 && man.icons.every(i => i.sizes === i.w + 'x' + i.h), 'manifest: three icons, each of the size it states (' + man.icons.map(i => i.sizes + ' ' + i.purpose).join(', ') + ')');
check(man.icons.some(i => i.w === 192) && man.icons.some(i => i.w === 512 && i.purpose === 'any') && man.icons.some(i => i.purpose === 'maskable'), 'manifest: has the 192 and 512 pixel icons and a maskable one');
const cdp = await page.createCDPSession();
const appManifest = await cdp.send('Page.getAppManifest');
check((appManifest.errors || []).length === 0, 'Chromium reads the manifest without errors');
try {
  const inst = await cdp.send('Page.getInstallabilityErrors');
  console.log('    installability, as this headless browser reports it: ' + (JSON.stringify((inst.installabilityErrors || []).map(e => e.errorId)) || '[]'));
} catch (e) { console.log('    (installability report not available in this browser)'); }

/* ---------- 3. the offline copy ---------- */
console.log('3. Service worker and offline copy');
check(await waitFor(async () => (await noteText(page)).indexOf('Saved on this phone') === 0, 60000), 'the reader is told: "Saved on this phone. The book now opens without the internet."');
await shot(page, '1-saved-message');
let state = await cacheState(page);
check(Object.keys(state).length === 1 && Object.keys(state)[0] === 'loksewa-' + built.offlineCopy, 'one stored copy, named ' + Object.keys(state)[0]);
check(state['loksewa-' + built.offlineCopy] === listed.length && listed.length === built.files + 1, 'it holds all ' + listed.length + ' addresses (' + built.files + ' files and the folder address)');
check(await page.evaluate(() => !!navigator.serviceWorker.controller), 'the open page is already served by the service worker');
check(seen.every(s => s[0] !== 404), 'no file was missing on the server (' + seen.length + ' requests)');
check(seen.every(s => s[1].indexOf('/loksewa') === 0), 'every request stayed inside /loksewa/');
await page.evaluate(() => document.getElementById('pwaClose').click());
check(await noteText(page) === '', 'the message can be closed');

/* ---------- 4. no network at all ---------- */
console.log('4. Network cut and server stopped');
await stopServer();
await page.setOfflineMode(true);
await page.reload({ waitUntil: 'load' });
await sleep(400);
await useTheBook(page, 'offline');
await shot(page, '2-offline-home');
const page2 = await browser.newPage();
watch(page2);
await page2.setOfflineMode(true);
await page2.goto(base + 'index.html?from=homescreen#/settings', { waitUntil: 'load' });
check(await waitFor(() => page2.evaluate(() => document.querySelectorAll('[data-act="theme"]').length === 3), 5000), 'offline: a new tab opens the book too (address with index.html and a query)');
check((await noteText(page2)) === '', 'offline: no message is shown when nothing changed');
await page2.close();

/* ---------- 5. a newer build ---------- */
console.log('5. Update to a newer build');
const newer = fs.mkdtempSync(path.join(os.tmpdir(), 'loksewa-newer-'));
fs.cpSync(docs, newer, { recursive: true });
const marker = '/* newer build made by check_web.mjs */';
fs.appendFileSync(path.join(newer, 'app.css'), '\n' + marker + '\n');
fs.writeFileSync(path.join(newer, 'sw.js'), swText.replace(JSON.stringify(built.offlineCopy), JSON.stringify(built.offlineCopy + '-newer')));
root = newer;
await startServer();
await page.setOfflineMode(false);
await page.reload({ waitUntil: 'load' });
check(await waitFor(async () => (await noteText(page)).indexOf('A newer version of the book is ready.') === 0, 60000), 'online again with a newer build on the server: "A newer version of the book is ready." with an Update button');
await shot(page, '3-update-offered');
check(await page.evaluate(async () => (await (await fetch('app.css')).text())).then(t => t.indexOf(marker) < 0), 'until the reader taps Update, the old copy is still the one shown');
state = await cacheState(page);
check(Object.keys(state).length === 2, 'both copies are stored while the new one waits');
const reloaded = new Promise(resolve => page.once('load', resolve));
await page.evaluate(() => document.getElementById('pwaBtn').click());
await Promise.race([reloaded, sleep(15000)]);
await sleep(600);
check(await page.evaluate(async () => (await (await fetch('app.css')).text())).then(t => t.indexOf(marker) >= 0), 'after one tap on Update the page reloads with the new files');
state = await cacheState(page);
check(Object.keys(state).length === 1 && Object.keys(state)[0] === 'loksewa-' + built.offlineCopy + '-newer', 'the old copy is removed; only ' + Object.keys(state)[0] + ' remains');
check((await noteText(page)) === '', 'no message is left on the screen');
await useTheBook(page, 'after the update');
check(await page.evaluate(() => { try { return typeof localStorage.getItem('lsbook.v1') === 'string'; } catch (e) { return false; } }), 'the reader\'s progress is kept in the browser\'s storage');

await browser.close();
await stopServer();
fs.rmSync(newer, { recursive: true, force: true });
console.log(problems.length ? '\n' + problems.join('\n') : '\nno script errors, no failed loads, no problems');
console.log('Screenshots are in ' + outDir);
process.exit(problems.length ? 1 : 0);
