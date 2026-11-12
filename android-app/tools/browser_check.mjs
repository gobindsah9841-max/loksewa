// Look at the reader in a real headless Chromium, at the size of a phone screen.
// The pages are opened straight from disk (file://), the way the APK opens them from
// file:///android_asset/www/ — no web server, no network.
//
// Run it through browser_check.sh, which installs what it needs.
//   node browser_check.mjs <www-dir> <screenshot-dir>
// It walks through every screen, saves numbered screenshots, and exits with code 1 if it sees
// a script error, a file that failed to load, a screen wider than the phone, or lost progress.
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const www = path.resolve(process.argv[2]);
const outDir = path.resolve(process.argv[3]);
fs.mkdirSync(outDir, { recursive: true });
const url = 'file://' + www + '/index.html';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const problems = [];
let shotNo = 0;

const browser = await puppeteer.launch({
  executablePath: await chromium.executablePath(),
  args: [...chromium.args, '--no-sandbox', '--font-render-hinting=none'],
  headless: 'shell',
  defaultViewport: { width: 393, height: 800, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
});
console.log('browser:', await browser.version(), '| page:', url);
const page = await browser.newPage();
page.on('pageerror', e => problems.push('script error: ' + e.message));
page.on('console', m => { if (m.type() === 'error') { problems.push('console error: ' + m.text()); } });
page.on('requestfailed', r => problems.push('failed to load: ' + r.url()));

async function shot(name) {
  shotNo++;
  const file = String(shotNo).padStart(2, '0') + '-' + name + '.png';
  await page.screenshot({ path: path.join(outDir, file) });
  const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  if (m.sw > m.cw) { problems.push(name + ': the page is ' + m.sw + ' px wide on a ' + m.cw + ' px screen'); }
  console.log('  ' + file);
}
async function go(hash, wait = 500) { await page.evaluate(h => { location.hash = h; }, hash); await sleep(wait); }
async function scrollTo(selector, index, gap) {
  await page.evaluate((s, i, g) => { const el = document.querySelectorAll(s)[i]; window.scrollTo(0, el.getBoundingClientRect().top + window.pageYOffset - g); }, selector, index, gap);
  await sleep(300);
}
function check(cond, what) { if (!cond) { problems.push('FAILED: ' + what); } console.log('  ' + (cond ? '✓ ' : '✗ ') + what); }

await page.goto(url, { waitUntil: 'load' });
await sleep(500);
check(await page.evaluate(() => location.protocol) === 'file:', 'opened from disk, not from a server');
await shot('home');

await go('#/read/5', 900);
await shot('chapter-top');
await scrollTo('#book h2', 1, 60);
await shot('topic');
await scrollTo('#book .tw', 6, 120);
await shot('table');
await scrollTo('#book p.qid', 0, 80);
await page.evaluate(() => document.querySelectorAll('#book p.ans')[0].click());
await sleep(200);
await shot('questions-in-the-text');
await page.evaluate(() => window.scrollTo(0, 5000));
await sleep(700);                                   // lets the reading position be saved
await page.evaluate(() => document.getElementById('btnToc').click());
await sleep(300);
await shot('contents-drawer');
await page.evaluate(() => document.getElementById('shade').click());

await go('#/quiz');
await shot('practice-chapters');
await go('#/quiz/1', 700);
await shot('practice-topics');
await page.evaluate(() => document.querySelector('#main button.card').click());
await sleep(500);
await shot('question');
await page.evaluate(() => document.querySelectorAll('.q .opt')[1].click());
await sleep(300);
await shot('question-answered');
for (let k = 0; k < 5; k++) {
  await page.evaluate(() => {
    const o = document.querySelectorAll('.q .opt');
    if (o.length && !document.querySelector('.q .exp')) { o[0].click(); }
    const n = document.querySelector('[data-act="next"]');
    if (n) { n.click(); }
  });
  await sleep(150);
}
await shot('practice-result');
await page.evaluate(() => document.querySelector('[data-act="done"]').click());
await sleep(400);
check(await page.evaluate(() => location.hash) === '#/quiz/1', '"Done" returns to the list of topics');
await page.goBack(); await sleep(300);
check(await page.evaluate(() => location.hash) === '#/quiz', 'one Back from there reaches the list of chapters');

await go('#/test');
await shot('test-setup');
await page.evaluate(() => { document.querySelector('[data-act="setN"][data-n="10"]').click(); document.querySelector('[data-act="startTest"]').click(); });
await sleep(1800);
await page.evaluate(() => document.querySelectorAll('.q .opt')[2].click());
await sleep(200);
await shot('test-running');
// leaving a test by accident must not lose it
await page.goBack(); await sleep(400);
check(await page.evaluate(() => !!document.querySelector('[data-act="resume"]')), 'a test left with Back can be resumed');
await shot('test-left-unfinished');
await page.evaluate(() => document.querySelector('[data-act="resume"]').click());
await sleep(400);
check(await page.evaluate(() => location.hash === '#/run' && !!document.getElementById('timer') && document.querySelectorAll('.q .opt.sel').length === 1), 'resuming shows the test again, with its clock and the answer already given');
await page.evaluate(() => document.querySelector('[data-act="submit"]').click());
await sleep(200);
await page.evaluate(() => document.querySelector('[data-act="submit"]').click());
await sleep(400);
await shot('test-result');

await go('#/search', 1500);
await page.type('#sq', 'Lipulekh');
await sleep(800);
check(await page.evaluate(() => document.querySelectorAll('.hit').length) > 3, 'search finds sections');
await shot('search');

// the Back key of the phone calls history.back(): it must walk back through the screens
await page.goBack(); await sleep(400);
check(await page.evaluate(() => location.hash) !== '#/search', 'Back leaves the search screen');

// progress must survive closing and reopening the app
const before = JSON.parse(await page.evaluate(() => localStorage.getItem('lsbook.v1')));
await page.goto(url, { waitUntil: 'load' });
await sleep(500);
const after = JSON.parse(await page.evaluate(() => localStorage.getItem('lsbook.v1')));
check(Object.keys(after.st).length > 0 && Object.keys(after.st).length === Object.keys(before.st).length, 'answers are still there after reopening (' + Object.keys(after.st).length + ' questions)');
check(after.tests.length === 1, 'the timed test result is still there');
check(await page.evaluate(() => !!document.querySelector('a.card.go')), 'home offers "Continue reading"');
await page.evaluate(() => document.querySelector('a.card.go').click());
await sleep(1200);
check(await page.evaluate(() => window.pageYOffset) > 4000, 'the reading position is restored');

// reopening the app on the question screen (Android may do this after closing the app in the background)
await page.goto(url + '#/test', { waitUntil: 'load' }); await sleep(400);
const lengthBefore = await page.evaluate(() => history.length);
await page.goto(url + '#/run', { waitUntil: 'load' }); await sleep(500);
check(await page.evaluate(() => location.hash) === '#/quiz', 'the question screen with nothing to show turns into the practice list');
check(await page.evaluate(() => history.length) === lengthBefore + 1, 'and adds no extra step to the Back history');
await page.goBack(); await sleep(400);
check(await page.evaluate(() => location.hash) === '#/test', 'so Back is not trapped');

await go('#/settings');
await shot('settings');
await page.evaluate(() => document.querySelector('[data-act="theme"][data-v="sepia"]').click());
await go('#/read/6', 900);
await scrollTo('#book h2', 2, 60);
await shot('sepia');
await go('#/settings', 300);
await page.evaluate(() => document.querySelector('[data-act="theme"][data-v="dark"]').click());
await go('#/read/7', 900);
await scrollTo('#book h2', 2, 60);
await shot('dark');

// links that leave the book must be ordinary web links; the app hands them to the phone's browser
const n = await page.evaluate(() => document.querySelectorAll('#data a').length);
const count = await page.evaluate(() => window.LSDATA.index.parts.length);
let odd = [];
for (let i = 0; i < count; i++) {
  await go('#/read/' + i, 350);
  const here = await page.evaluate(() => [].filter.call(document.querySelectorAll('#book a'), a => !/^(https?:\/\/|#)/.test(a.getAttribute('href') || '')).map(a => a.getAttribute('href')));
  odd = odd.concat(here);
  const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, len: (document.getElementById('book') || { textContent: '' }).textContent.length }));
  if (m.sw > m.cw) { problems.push('part ' + i + ' is wider than the screen'); }
  if (m.len < 2000) { problems.push('part ' + i + ' did not render'); }
}
check(odd.length === 0, 'every link is either inside the book or an ordinary web link' + (odd.length ? ': ' + odd.slice(0, 5).join(', ') : ''));
check(true, 'all ' + count + ' parts open, none wider than the screen');

await browser.close();
console.log(problems.length ? '\n' + problems.length + ' problem(s):\n  ' + problems.join('\n  ') : '\nno script errors, no failed loads, no problems');
process.exit(problems.length ? 1 : 0);
