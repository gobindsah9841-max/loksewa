/* Smoke test of the reader app in a simulated browser (jsdom).
   Usage:  node test_ui.js <path-to-www-dir> [path-to-node_modules-with-jsdom]   (needs: npm install jsdom)
   It opens every screen, answers questions, runs a timed test and a search,
   and fails if any script error is reported. It does not test layout. */
'use strict';
var path = require('path');
var www = path.resolve(process.argv[2] || '.');
var jsdomPath = process.argv[3] ? path.join(path.resolve(process.argv[3]), 'jsdom') : 'jsdom';
var jsdom = require(jsdomPath);

var errors = [];
var checks = 0;
function ok(cond, what) {
  checks++;
  if (!cond) { errors.push('FAILED: ' + what); console.log('  ✗ ' + what); } else { console.log('  ✓ ' + what); }
}
function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

var vc = new jsdom.VirtualConsole();
vc.on('jsdomError', function (e) {
  var msg = String(e && (e.detail || e.message || e));
  if (/Not implemented: (window\.scrollTo|navigation)/.test(String(e && e.message))) { return; }
  errors.push('script error: ' + (e && e.stack ? e.stack.split('\n').slice(0, 3).join(' | ') : msg));
});
vc.on('error', function (e) { errors.push('console.error: ' + e); });

/* The pages are served over http://127.0.0.1 so that localStorage works in the simulated browser. */
var http = require('http');
var fs = require('fs');
var TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };
var server = http.createServer(function (req, res) {
  var file = path.join(www, decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html');
  if (file.indexOf(www) !== 0 || !fs.existsSync(file)) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  res.end(fs.readFileSync(file));
});
server.listen(0, '127.0.0.1', function () {
  var base = 'http://127.0.0.1:' + server.address().port + '/index.html';
  jsdom.JSDOM.fromURL(base, {
    runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: vc
  }).then(runTests).catch(function (e) { console.log('test crashed:', e && e.stack || e); process.exit(2); });
});

async function runTests(dom) {
  try {
  var w = dom.window, d = w.document;
  w.scrollTo = function () {};
  w.onerror = function (m) { errors.push('window.onerror: ' + m); };
  await new Promise(function (r) { if (d.readyState === 'complete') { r(); } else { w.addEventListener('load', r); } });
  await sleep(100);
  function $(sel) { return d.querySelectorAll(sel); }
  async function nav(hash, wait) { w.location.hash = hash; await sleep(wait || 150); }
  var IDX = w.LSDATA.index;

  console.log('home');
  ok(IDX && IDX.parts.length >= 13, 'index loaded with ' + (IDX ? IDX.parts.length : 0) + ' parts');
  ok($('#main a.card').length === IDX.parts.length, 'home lists every part (' + $('#main a.card').length + ' cards)');
  ok($('.tile').length === 4, 'four tiles on home');
  ok(d.getElementById('btnBack').style.visibility === 'hidden', 'no back button on home');

  console.log('reader');
  var last = IDX.parts.length - 1;
  await nav('#/read/' + last, 400);
  ok(!!d.getElementById('book'), 'a chapter opens');
  /* A chapter has one heading for each topic ("10.1 ...") and one for its end matter. The number of topics
     differs: 8 to 10 in the national chapters, 7 in the province chapters. */
  var chNo = IDX.parts[last].ch;
  var topicHeads = Array.prototype.filter.call($('#book h2'), function (h) { return h.textContent.indexOf(chNo + '.') === 0; }).length;
  ok(topicHeads >= 5 && $('#book h2').length === topicHeads + 1,
    'chapter ' + chNo + ' has ' + topicHeads + ' topic headings and one end-matter heading (' + $('#book h2').length + ')');
  ok($('#book .tw table').length > 20, 'tables are wrapped for sideways scrolling (' + $('#book .tw table').length + ')');
  ok($('#book p.ans').length >= IDX.parts[last].mcq, 'answers are marked for hiding (' + $('#book p.ans').length + ')');
  ok($('#book p.qid .chip').length === IDX.parts[last].mcq, 'every question keeps its label chip (' + $('#book p.qid .chip').length + ')');
  var ans = $('#book p.ans')[0];
  ans.click();
  ok(/shown/.test(ans.className), 'tapping an answer reveals it');
  ans.click();
  ok(!/shown/.test(ans.className), 'tapping again hides it');
  d.getElementById('btnToc').click();
  ok(d.getElementById('drawer').className === '' && $('#drawer a').length > 10, 'contents drawer opens (' + $('#drawer a').length + ' entries)');
  $('#drawer a')[3].click();
  ok(d.getElementById('drawer').className === 'hidden', 'choosing an entry closes the drawer');
  ok(JSON.parse(w.localStorage.getItem('lsbook.v1')).last.i === last, 'last-read part is remembered');
  await nav('#/read/0', 300);
  ok($('#book a[href^="#/read/"]').length >= 12, 'links between parts became in-app links (' + $('#book a[href^="#/read/"]').length + ')');
  ok($('#book a[href$=".md"]').length === 0, 'no link points at a .md file');
  for (var i = 0; i < IDX.parts.length; i++) {
    await nav('#/read/' + i, 250);
    if (!d.getElementById('book') || d.getElementById('book').textContent.length < 2000) { ok(false, 'part ' + i + ' renders'); }
  }
  ok(true, 'all ' + IDX.parts.length + ' parts render');

  console.log('practice');
  await nav('#/quiz');
  ok($('#main a.card').length === IDX.chapters.length, 'practice lists ' + IDX.chapters.length + ' chapters');
  var ch = IDX.chapters[IDX.chapters.length - 1];
  await nav('#/quiz/' + ch, 400);
  var topicButtons = $('#main button.card');
  var sets = w.LSDATA.quiz[ch].topics.length;   /* the topics, and the Top 25 of the chapter end */
  ok(ch === chNo && sets === topicHeads + 1 && topicButtons.length === sets,
    'chapter ' + ch + ' lists its ' + topicHeads + ' topics and the Top 25 (' + topicButtons.length + ' sets)');
  topicButtons[0].click();
  await sleep(200);
  ok(w.location.hash === '#/run' && $('.q .opt').length === 4, 'a topic starts with a four-option question');
  var n = 0, rightAnswers = 0;
  while ($('.score').length === 0 && n < 40) {
    var opts = $('.q .opt');
    opts[n % 4].click();
    ok($('.q .exp').length === 1 && $('.q .opt.ok').length === 1, 'question ' + (n + 1) + ' shows the answer and one correct option');
    if (/ok/.test($('.q .opt')[n % 4].className)) { rightAnswers++; }
    d.querySelector('[data-act="next"]').click();
    n++;
  }
  ok(n === 5 && $('.score').length === 1, 'five questions, then a result');
  ok($('.score .big')[0].textContent.indexOf(rightAnswers + ' of 5') === 0, 'score is counted correctly (' + $('.score .big')[0].textContent + ')');
  ok($('.rv').length === 5, 'review lists all five questions');
  var st = JSON.parse(w.localStorage.getItem('lsbook.v1')).st;
  ok(Object.keys(st).length === 5, 'five answers were recorded');
  d.querySelector('[data-act="again"]').click();
  await sleep(100);
  ok($('.q .opt').length === 4 && $('.score').length === 0, '"try again" restarts the set');
  await nav('#/quiz/' + ch, 300);
  d.querySelector('[data-act="startAll"]').click();
  await sleep(200);
  ok(/Question 1 of /.test($('.top2')[0].textContent), 'mixed practice of the whole chapter starts');

  console.log('timed test');
  await nav('#/test');
  d.querySelector('[data-act="setN"][data-n="10"]').click();
  ok(/on/.test(d.querySelector('[data-act="setN"][data-n="10"]').className), 'test length can be chosen');
  d.querySelector('[data-act="startTest"]').click();
  await sleep(1500);
  ok(w.location.hash === '#/run' && !!d.getElementById('timer'), 'test starts with a clock');
  ok($('.pal button').length === 10, 'ten questions in the palette');
  var data = w.LSDATA.quiz, picked = [];
  for (var k = 0; k < 6; k++) {
    $('.q .opt')[k % 4].click();
    picked.push(k % 4);
    ok($('.q .exp').length === 0, 'no answer is shown during the test (question ' + (k + 1) + ')');
    if (k < 5) { d.querySelector('[data-act="next"]').click(); }
  }
  d.querySelector('[data-act="submit"]').click();
  ok($('.score').length === 0 && /blank/.test(d.getElementById('main').textContent), 'first tap on Finish warns about blanks');
  d.querySelector('[data-act="submit"]').click();
  ok($('.score').length === 1, 'second tap shows the result');
  var saved = JSON.parse(w.localStorage.getItem('lsbook.v1')).tests;
  var t = saved[saved.length - 1];
  ok(t.n === 10 && t.c + t.w === 6 && t.b === 4, 'result saved: ' + t.c + ' right, ' + t.w + ' wrong, ' + t.b + ' blank');
  var expected = Math.round((2 * t.c - 0.4 * t.w) * 10) / 10;
  ok($('.score .big')[0].textContent === (expected < 0 ? '−' + (-expected) : expected) + ' / 20', 'marks follow 2 and −0.4: ' + $('.score .big')[0].textContent);
  ok(Object.keys(data).length === IDX.chapters.length, 'all chapters were loaded for the test');

  console.log('search');
  await nav('#/search', 1200);
  var input = d.getElementById('sq');
  input.value = 'Lipulekh';
  input.oninput();
  await sleep(500);
  var hits = $('.hit');
  ok(hits.length > 3, 'search for "Lipulekh" finds sections (' + hits.length + ')');
  ok($('.hit mark').length > 0, 'the word is highlighted');
  input.value = 'संविधान';
  input.oninput();
  await sleep(500);
  ok($('.hit').length > 3, 'search in Nepali works (' + $('.hit').length + ' hits)');
  var href = $('.hit')[0].getAttribute('href');
  await nav(href, 400);
  ok(!!d.getElementById('book') && !!d.getElementById(href.split('/')[3]), 'a search result opens the right section (' + href + ')');

  console.log('settings');
  await nav('#/settings');
  d.querySelector('[data-act="theme"][data-v="dark"]').click();
  ok(/th-dark/.test(d.body.className), 'dark theme applies');
  d.querySelector('[data-act="font"][data-v="4"]').click();
  ok(/fs4/.test(d.body.className), 'largest text applies');
  d.querySelector('[data-act="hide"][data-v="0"]').click();
  ok(!/hide-ans/.test(d.body.className), 'answers can be always shown');
  d.querySelector('[data-act="reset"]').click();
  ok(Object.keys(JSON.parse(w.localStorage.getItem('lsbook.v1')).st).length > 0, 'first tap on erase only warns');
  d.querySelector('[data-act="reset"]').click();
  ok(Object.keys(JSON.parse(w.localStorage.getItem('lsbook.v1')).st).length === 0, 'second tap erases the scores');
  await nav('#/');
  ok($('.hero').length === 1, 'back on the home screen');

  await sleep(200);
  console.log('\n' + checks + ' checks, ' + errors.length + ' problem(s)');
  errors.forEach(function (e) { console.log('  ' + e); });
  w.close();
  process.exit(errors.length ? 1 : 0);
  } catch (e) { console.log('test crashed:', e && e.stack || e); process.exit(2); }
}
