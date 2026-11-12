/* Loksewa Study Book — offline reader and practice app.
   Written in plain ES5 so that it also runs in old Android WebViews.
   Data arrives through <script> files (data/*.js) that call LS_REG(); nothing is fetched from a network. */
(function () {
  'use strict';

  var D = window.LSDATA;
  var IDX = D.index;
  var KEY = 'lsbook.v1';
  var LETTERS = ['a', 'b', 'c', 'd'];
  var NOT_PAST = 'Practice question written for this book. It is not a past examination question.';

  var main = byId('main');
  var titleEl = byId('title');
  var btnBack = byId('btnBack');
  var btnToc = byId('btnToc');
  var btnSearch = byId('btnSearch');
  var btnSet = byId('btnSet');
  var drawer = byId('drawer');
  var shade = byId('shade');

  var S = loadState();
  var cur = { view: '', i: -1 };
  var run = null;
  var timer = null;
  var saveTimer = null;
  var searchTimer = null;
  var searchReady = false;
  var LC = [];
  var testSetup = { n: 25, timed: true };

  /* ---------- small helpers ---------- */

  function byId(id) { return document.getElementById(id); }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function hasClass(node, cls) {
    return node && typeof node.className === 'string' && (' ' + node.className + ' ').indexOf(' ' + cls + ' ') >= 0;
  }

  function up(node, cls) {
    while (node && node !== document) {
      if (hasClass(node, cls)) { return node; }
      node = node.parentNode;
    }
    return null;
  }

  function upAttr(node, attr) {
    while (node && node !== document) {
      if (node.getAttribute && node.getAttribute(attr) !== null) { return node; }
      node = node.parentNode;
    }
    return null;
  }

  function shuffle(a) {
    var i, j, t;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function two(n) { return (n < 10 ? '0' : '') + n; }

  function clock(secs) { return two(Math.floor(secs / 60)) + ':' + two(secs % 60); }

  function go(hash) { location.hash = hash; }
  /* like go(), but takes the place of the present screen in the Back history instead of adding to it */
  function swap(hash) { location.replace(String(location.href).split('#')[0] + hash); }

  function toTop() { window.scrollTo(0, 0); }

  function loadState() {
    var s = {};
    try { s = JSON.parse(window.localStorage.getItem(KEY) || '{}') || {}; } catch (e) { s = {}; }
    if (typeof s.fs !== 'number') { s.fs = 2; }
    if (!s.th) { s.th = 'light'; }
    if (typeof s.hide !== 'boolean') { s.hide = true; }
    if (!s.pos) { s.pos = {}; }
    if (!s.st) { s.st = {}; }
    if (!s.tests) { s.tests = []; }
    return s;
  }

  function save() {
    try { window.localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage may be unavailable */ }
  }

  function saveSoon() {
    if (saveTimer) { return; }
    saveTimer = setTimeout(function () { saveTimer = null; save(); }, 800);
  }

  function applyPrefs() {
    document.body.className = 'th-' + S.th + ' fs' + S.fs + (S.hide ? ' hide-ans' : '');
  }

  function need(kind, key, src, cb) {
    var have = kind === 'search' ? D.search : D[kind][key];
    if (have) { cb(); return; }
    var s = document.createElement('script');
    s.src = src;
    s.onload = function () { cb(); };
    s.onerror = function () { main.innerHTML = '<p class="pad">This part of the book could not be loaded.</p>'; };
    document.body.appendChild(s);
  }

  function needMany(chapters, cb) {
    var k = 0;
    function step() {
      if (k >= chapters.length) { cb(); return; }
      var ch = chapters[k++];
      need('quiz', ch, 'data/quiz-' + ch + '.js', step);
    }
    step();
  }

  function setBar(title, view) {
    titleEl.textContent = title;
    btnBack.style.visibility = view === 'home' ? 'hidden' : 'visible';
    btnToc.style.display = view === 'read' ? '' : 'none';
    btnSearch.style.display = view === 'search' ? 'none' : '';
  }

  function partLabel(p) {
    if (p.kind === 'chapter') { return 'Chapter ' + p.ch; }
    if (p.kind === 'about') { return 'About'; }
    return 'Part ' + p.num;
  }

  function fullTitle(p) {
    return p.kind === 'about' ? p.title : partLabel(p) + ' — ' + p.title;
  }

  /* a number with a real minus sign */
  function signed(x) {
    return x < 0 ? '−' + (-x) : String(x);
  }

  function chapterPart(ch) {
    var i;
    for (i = 0; i < IDX.parts.length; i++) {
      if (IDX.parts[i].kind === 'chapter' && IDX.parts[i].ch === ch) { return IDX.parts[i]; }
    }
    return null;
  }

  function qkey(ch, q) { return ch + '|' + q.id; }

  function statsFor(ch, list) {
    var tried = 0, right = 0, wrong = [], i, st;
    for (i = 0; i < list.length; i++) {
      st = S.st[qkey(ch, list[i])];
      if (st) { tried++; if (st[2]) { right++; } else { wrong.push(list[i]); } }
    }
    return { tried: tried, right: right, wrong: wrong, n: list.length };
  }

  function chapterStatsFromKeys(ch, total) {
    var pre = ch + '|', tried = 0, right = 0, k;
    for (k in S.st) {
      if (S.st.hasOwnProperty(k) && k.indexOf(pre) === 0) { tried++; if (S.st[k][2]) { right++; } }
    }
    return { tried: tried, right: right, n: total };
  }

  function record(ch, q, ok) {
    var k = qkey(ch, q), st = S.st[k] || [0, 0, 0];
    st[0] += 1; if (ok) { st[1] += 1; } st[2] = ok ? 1 : 0;
    S.st[k] = st;
  }

  /* ---------- home ---------- */

  function home() {
    cur = { view: 'home', i: -1 };
    setBar('Loksewa Study Book', 'home');
    var h = [], i, p, last = S.last ? IDX.parts[S.last.i] : null;
    h.push('<div class="hero"><h1>Provincial Public Service Commission — 5th Level, Paper I</h1>');
    h.push('<p class="nep">प्रदेश लोक सेवा आयोग · सहायकस्तर पाँचौं तह (अप्राविधिक) · प्रथम पत्र</p>');
    h.push('<p class="sub">General Knowledge study book for all seven provinces — works without the internet.</p></div>');
    h.push('<div class="wrap">');
    if (last) {
      h.push('<a class="card go" href="#/read/' + last.i + '"><div class="n">Continue reading</div><div class="t">' +
        esc(fullTitle(last)) + '</div></a>');
    }
    h.push('<div class="tiles">');
    h.push('<div class="tile"><a href="#/quiz">Practice MCQs<small>' + IDX.mcq + ' questions, by topic</small></a></div>');
    h.push('<div class="tile"><a href="#/test">Timed test<small>2 marks, −0.4 for a wrong answer</small></a></div>');
    h.push('<div class="tile"><a href="#/search">Search<small>the whole book</small></a></div>');
    h.push('<div class="tile"><a href="#/settings">Settings<small>text size, dark mode</small></a></div>');
    h.push('</div>');
    h.push('<div class="sec">Start here</div>');
    for (i = 0; i < IDX.parts.length; i++) {
      p = IDX.parts[i];
      if (p.kind === 'chapter') { continue; }
      h.push('<a class="card" href="#/read/' + i + '"><span class="k f">' + (p.kind === 'about' ? 'i' : p.num) + '</span><div class="t">' +
        esc(p.title) + '</div><div class="n">' + (p.kind === 'about' ? 'How the book is built, its sources and its limits' : esc(partLabel(p))) + '</div></a>');
    }
    h.push('<div class="sec">Chapters</div>');
    for (i = 0; i < IDX.parts.length; i++) {
      p = IDX.parts[i];
      if (p.kind !== 'chapter') { continue; }
      h.push('<a class="card" href="#/read/' + i + '"><span class="k">' + p.ch + '</span><div class="t">' + esc(p.title) +
        '</div><div class="n">' + esc(p.nep) + (p.nep ? ' · ' : '') + p.mcq + ' MCQs · ' + (p.saq || 0) + ' short answers</div></a>');
    }
    h.push('<div class="note"><b>This edition</b> holds Parts ' + IDX.firstPart + ' to ' + IDX.lastPart + ' of the book (Chapters ' +
      IDX.chapters[0] + ' to ' + IDX.chapters[IDX.chapters.length - 1] + '): ' + IDX.mcq + ' MCQs and ' + IDX.saq +
      ' short-answer questions. Later chapters are still being written. Built on ' + esc(IDX.built) + '.</div>');
    h.push('<div class="note">No question in this book is a verified past question. Facts marked 🔄 change with time — check them again before your examination. Your own commission\'s syllabus is the authority.</div>');
    h.push('</div>');
    main.innerHTML = h.join('');
    toTop();
  }

  /* ---------- reader ---------- */

  function jump(hid) {
    var node = byId(hid);
    if (!node) { return; }
    var y = node.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop || 0) - 62;
    window.scrollTo(0, y < 0 ? 0 : y);
  }

  function read(i, hid) {
    var p = IDX.parts[i];
    if (!p) { home(); return; }
    if (cur.view === 'read' && cur.i === i && byId('book')) {
      if (hid) { jump(hid); }
      return;
    }
    cur = { view: 'read', i: i, ready: false };
    setBar(fullTitle(p), 'read');
    main.innerHTML = '<p class="pad">Opening ' + esc(partLabel(p)) + '…</p>';
    need('part', i, 'data/part-' + i + '.js', function () {
      if (cur.view !== 'read' || cur.i !== i) { return; }
      var h = [], prev = IDX.parts[i - 1], next = IDX.parts[i + 1];
      h.push('<article class="book" id="book">' + D.part[i].html + '</article>');
      h.push('<div class="pn">');
      if (p.kind === 'chapter') {
        h.push('<a class="btn wide" href="#/quiz/' + p.ch + '">Practise the ' + p.mcq + ' MCQs of this chapter</a>');
      }
      if (prev) { h.push('<a class="btn alt" href="#/read/' + (i - 1) + '">‹ ' + esc(partLabel(prev)) + '</a>'); }
      if (next) { h.push('<a class="btn alt r" href="#/read/' + (i + 1) + '">' + esc(partLabel(next)) + ' ›</a>'); }
      h.push('</div>');
      main.innerHTML = h.join('');
      S.last = { i: i };
      save();
      if (hid) { jump(hid); }
      else if (S.pos[i]) { window.scrollTo(0, S.pos[i]); }
      else { toTop(); }
      cur.ready = true;
    });
  }

  function openDrawer() {
    if (cur.view !== 'read' || !D.part[cur.i]) { return; }
    var toc = D.part[cur.i].toc, h = ['<div class="dh">In this part</div><a href="#" data-h="">Top of the page</a>'], k;
    for (k = 0; k < toc.length; k++) {
      h.push('<a href="#" class="l' + toc[k][0] + '" data-h="' + toc[k][1] + '">' + esc(toc[k][2]) + '</a>');
    }
    drawer.innerHTML = h.join('');
    drawer.className = '';
    shade.className = '';
    drawer.scrollTop = 0;
  }

  function closeDrawer() {
    drawer.className = 'hidden';
    shade.className = 'hidden';
  }

  /* ---------- practice lists ---------- */

  function quizHome() {
    cur = { view: 'quiz', i: -1 };
    setBar('Practice MCQs', 'quiz');
    var h = ['<div class="wrap"><div class="note">Choose a chapter. Each question shows its answer and a short explanation as soon as you pick an option. Every question was written for this book as practice; none is a past examination question.</div>'], i, p, st;
    for (i = 0; i < IDX.parts.length; i++) {
      p = IDX.parts[i];
      if (p.kind !== 'chapter') { continue; }
      st = chapterStatsFromKeys(p.ch, p.mcq);
      h.push('<a class="card" href="#/quiz/' + p.ch + '"><span class="k">' + p.ch + '</span><div class="t">' + esc(p.title) + '</div><div class="n">' +
        p.mcq + ' questions · ' + st.tried + ' tried · ' + st.right + ' right last time</div><div class="bar2"><i style="width:' +
        Math.round(100 * st.tried / (p.mcq || 1)) + '%"></i></div></a>');
    }
    h.push('<a class="btn wide" href="#/test">Timed test from all chapters</a></div>');
    main.innerHTML = h.join('');
    toTop();
  }

  function allQuestions(ch) {
    var out = [], t = D.quiz[ch].topics, a, b;
    for (a = 0; a < t.length; a++) { for (b = 0; b < t[a].q.length; b++) { out.push(t[a].q[b]); } }
    return out;
  }

  function quizChapter(ch) {
    var p = chapterPart(ch);
    if (!p) { quizHome(); return; }
    cur = { view: 'quizch', i: ch };
    setBar('Chapter ' + ch + ' — practice', 'quizch');
    main.innerHTML = '<p class="pad">Loading questions…</p>';
    need('quiz', ch, 'data/quiz-' + ch + '.js', function () {
      if (cur.view !== 'quizch' || cur.i !== ch) { return; }
      var topics = D.quiz[ch].topics, all = allQuestions(ch), st = statsFor(ch, all), h = ['<div class="wrap">'], k, ts;
      h.push('<div class="sec">' + esc(p.title) + '</div>');
      h.push('<button class="btn" type="button" data-act="startAll" data-ch="' + ch + '">All ' + all.length + ' questions, mixed</button>');
      h.push('<button class="btn alt" type="button" data-act="startWrong" data-ch="' + ch + '"' + (st.wrong.length ? '' : ' disabled') + '>Questions I got wrong (' + st.wrong.length + ')</button>');
      h.push('<div class="sec">By topic</div>');
      for (k = 0; k < topics.length; k++) {
        ts = statsFor(ch, topics[k].q);
        h.push('<button class="card" type="button" data-act="startTopic" data-ch="' + ch + '" data-t="' + k + '"><div class="t">' +
          esc((topics[k].id === 'T' ? '' : topics[k].id + ' ') + topics[k].title) + '</div><div class="n">' + ts.n + ' questions' +
          (ts.tried ? ' · last time ' + ts.right + ' of ' + ts.tried + ' right' : '') + '</div></button>');
      }
      h.push('<a class="btn alt wide" href="#/read/' + p.i + '">Read this chapter</a></div>');
      main.innerHTML = h.join('');
      toTop();
    });
  }

  /* ---------- running a set of questions ---------- */

  function startRun(mode, title, back, items, secs) {
    var picks = [], k;
    for (k = 0; k < items.length; k++) { picks.push(-1); }
    run = { mode: mode, title: title, back: back, items: items, picks: picks, i: 0, done: false, left: secs || 0, timed: !!secs, warn: false };
    if (location.hash === '#/run') { showRun(); } else { go('#/run'); }
  }

  function stopTimer() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  function startTimer() {
    stopTimer();
    if (!run || !run.timed || run.done) { return; }
    timer = setInterval(function () {
      if (!run || run.done || cur.view !== 'run') { stopTimer(); return; }
      run.left -= 1;
      var t = byId('timer');
      if (t) { t.textContent = clock(run.left < 0 ? 0 : run.left); if (run.left <= 60) { t.className = 'timer low'; } }
      if (run.left <= 0) { finishRun(); }
    }, 1000);
  }

  function questionCard(item, pick, reveal, selectable) {
    var q = item.q, h = [], k, cls;
    h.push('<div class="q"><div class="meta">Chapter ' + item.ch + ' · ' + esc(q.id) + ' <span class="chip">' + esc(q.l) + '</span></div>');
    h.push('<div class="stem">' + q.s + '</div>');
    for (k = 0; k < 4; k++) {
      cls = 'opt';
      if (reveal) {
        if (k === q.a) { cls += ' ok'; } else if (k === pick) { cls += ' no'; }
      } else if (k === pick) { cls += ' sel'; }
      h.push('<button class="' + cls + '" type="button"' + (selectable ? ' data-act="opt" data-o="' + k + '"' : '') + '><b>(' + LETTERS[k] + ')</b> ' + q.o[k] + '</button>');
    }
    if (reveal) {
      h.push('<div class="exp' + (pick === q.a ? '' : ' bad') + '"><b>Answer: (' + LETTERS[q.a] + ')</b> — ' + q.e +
        (pick < 0 ? ' <i>(You left this blank.)</i>' : '') + '</div>');
    }
    h.push('</div>');
    return h.join('');
  }

  function showRun() {
    if (!run) { swap('#/quiz'); return; }   /* e.g. the app was closed in the middle of a set */
    cur = { view: 'run', i: -1 };
    setBar(run.title, 'run');
    if (run.done) { showResult(); return; }
    var n = run.items.length, i = run.i, item = run.items[i], pick = run.picks[i], h = ['<div class="wrap">'], k, right = 0, answered = 0;
    for (k = 0; k < n; k++) {
      if (run.picks[k] >= 0) { answered++; if (run.picks[k] === run.items[k].q.a) { right++; } }
    }
    if (run.mode === 'practice') {
      h.push('<div class="top2"><span class="g">Question ' + (i + 1) + ' of ' + n + '</span><span>' + right + ' right so far</span></div>');
      h.push(questionCard(item, pick, pick >= 0, pick < 0));
      h.push('<div class="pn">');
      if (pick >= 0) {
        h.push('<button class="btn r" type="button" data-act="next">' + (i + 1 < n ? 'Next question ›' : 'See the result ›') + '</button>');
      }
      h.push('</div><div class="note">' + NOT_PAST + '</div>');
    } else {
      h.push('<div class="top2"><span class="g">Question ' + (i + 1) + ' of ' + n + ' · ' + answered + ' answered</span>' +
        (run.timed ? '<span id="timer" class="timer' + (run.left <= 60 ? ' low' : '') + '">' + clock(run.left < 0 ? 0 : run.left) + '</span>' : '') + '</div>');
      h.push(questionCard(item, pick, false, true));
      h.push('<div class="pn"><button class="btn alt" type="button" data-act="prev"' + (i > 0 ? '' : ' disabled') + '>‹ Back</button>');
      h.push('<button class="btn alt" type="button" data-act="clear"' + (pick >= 0 ? '' : ' disabled') + '>Leave blank</button>');
      h.push('<button class="btn r" type="button" data-act="next"' + (i + 1 < n ? '' : ' disabled') + '>Next ›</button></div>');
      h.push('<div class="pal">');
      for (k = 0; k < n; k++) {
        h.push('<button type="button" data-act="pal" data-k="' + k + '" class="' + (run.picks[k] >= 0 ? 'd' : '') + (k === i ? ' c' : '') + '">' + (k + 1) + '</button>');
      }
      h.push('</div>');
      if (run.warn) {
        h.push('<div class="note"><b>' + (n - answered) + ' question(s) are blank.</b> A blank costs nothing; a wrong answer costs 0.4 mark. Tap the button once more to finish.</div>');
      }
      h.push('<button class="btn warn wide" type="button" data-act="submit">Finish the test and see the result</button>');
    }
    h.push('</div>');
    main.innerHTML = h.join('');
    toTop();
    if (!timer) { startTimer(); }
  }

  function finishRun() {
    if (!run || run.done) { return; }
    stopTimer();
    run.done = true;
    var k, c = 0, w = 0, b = 0;
    for (k = 0; k < run.items.length; k++) {
      if (run.picks[k] < 0) { b++; }
      else if (run.picks[k] === run.items[k].q.a) { c++; }
      else { w++; }
      if (run.mode === 'test' && run.picks[k] >= 0) { record(run.items[k].ch, run.items[k].q, run.picks[k] === run.items[k].q.a); }
    }
    run.c = c; run.w = w; run.b = b;
    if (run.mode === 'test') {
      S.tests.push({ d: new Date().toDateString(), n: run.items.length, c: c, w: w, b: b });
      if (S.tests.length > 20) { S.tests = S.tests.slice(S.tests.length - 20); }
    }
    save();
    if (cur.view === 'run') { showResult(); }
  }

  function marks(c, w) { return Math.round((2 * c - 0.4 * w) * 10) / 10; }

  function showResult() {
    var n = run.items.length, h = ['<div class="wrap">'], k, pick, item, cls, wrongCount = run.w + run.b, m;
    h.push('<div class="score">');
    if (run.mode === 'test') {
      m = marks(run.c, run.w);
      h.push('<div class="big">' + signed(m) + ' / ' + (2 * n) + '</div><div class="row">' + (m < 0 ? 'below zero' : Math.round(100 * m / (2 * n)) + ' percent') + '</div>');
      h.push('<div class="row">' + run.c + ' right × 2 = ' + (2 * run.c) + ' · ' + run.w + ' wrong × 0.4 = −' + (Math.round(4 * run.w) / 10) + ' · ' + run.b + ' blank</div>');
      h.push('<div class="row">Marked as in the examination: 2 marks for a right answer, 0.4 mark taken off for a wrong one, nothing for a blank.</div>');
    } else {
      h.push('<div class="big">' + run.c + ' of ' + n + '</div><div class="row">right at the first try</div>');
    }
    h.push('</div>');
    h.push('<button class="btn" type="button" data-act="again">Try these questions again</button>');
    h.push('<button class="btn alt" type="button" data-act="againWrong"' + (wrongCount ? '' : ' disabled') + '>Only the ones I missed (' + wrongCount + ')</button>');
    h.push('<button class="btn alt" type="button" data-act="done">Done</button>');
    h.push('<div class="sec">Review</div>');
    for (k = 0; k < n; k++) {
      item = run.items[k]; pick = run.picks[k];
      cls = pick < 0 ? 'b' : (pick === item.q.a ? '' : 'w');
      h.push('<div class="rv ' + cls + '">' + questionCard(item, pick, true, false) + '</div>');
    }
    h.push('<div class="note">' + NOT_PAST + '</div></div>');
    main.innerHTML = h.join('');
    toTop();
  }

  function itemsOf(ch, list) {
    var out = [], k;
    for (k = 0; k < list.length; k++) { out.push({ ch: ch, q: list[k] }); }
    return out;
  }

  /* ---------- timed test ---------- */

  function testHome() {
    cur = { view: 'test', i: -1 };
    setBar('Timed test', 'test');
    var h = ['<div class="wrap">'], i, p, k, t, sizes = [10, 25, 50];
    h.push('<div class="note">A mixed test from the chapters you tick. Marking follows the examination: <b>2 marks</b> for a right answer, <b>0.4 mark off</b> for a wrong one, nothing for a blank. The real paper has 50 questions in 45 minutes and also tests mental ability, which this edition does not yet cover.</div>');
    if (run && run.mode === 'test' && !run.done) {
      h.push('<button class="card go" type="button" data-act="resume"><div class="n">You left a test unfinished</div><div class="t">Go back to it — question ' +
        (run.i + 1) + ' of ' + run.items.length + (run.timed ? ', ' + clock(run.left < 0 ? 0 : run.left) + ' left' : '') + '</div></button>');
    }
    h.push('<div class="sec">Number of questions</div><div class="seg">');
    for (k = 0; k < sizes.length; k++) {
      h.push('<button type="button" data-act="setN" data-n="' + sizes[k] + '" class="' + (testSetup.n === sizes[k] ? 'on' : '') + '">' + sizes[k] + '</button>');
    }
    h.push('</div><div class="sec">Time limit</div><div class="seg">');
    h.push('<button type="button" data-act="setTimed" data-v="1" class="' + (testSetup.timed ? 'on' : '') + '">54 seconds a question</button>');
    h.push('<button type="button" data-act="setTimed" data-v="0" class="' + (testSetup.timed ? '' : 'on') + '">No limit</button>');
    h.push('</div><div class="sec">Chapters</div>');
    for (i = 0; i < IDX.parts.length; i++) {
      p = IDX.parts[i];
      if (p.kind !== 'chapter') { continue; }
      h.push('<label class="ck"><input type="checkbox" class="tch" value="' + p.ch + '" checked> Chapter ' + p.ch + ' — ' + esc(p.title) + '</label>');
    }
    h.push('<button class="btn wide" type="button" data-act="startTest">Start the test</button>');
    h.push('<p id="testMsg" class="note hidden"></p>');
    if (S.tests.length) {
      h.push('<div class="sec">Your last tests</div><div class="tw"><table><tr><th>Date</th><th>Questions</th><th>Right</th><th>Wrong</th><th>Blank</th><th>Marks</th></tr>');
      for (k = S.tests.length - 1; k >= 0 && k >= S.tests.length - 8; k--) {
        t = S.tests[k];
        h.push('<tr><td>' + esc(t.d) + '</td><td>' + t.n + '</td><td>' + t.c + '</td><td>' + t.w + '</td><td>' + t.b + '</td><td>' + signed(marks(t.c, t.w)) + ' / ' + (2 * t.n) + '</td></tr>');
      }
      h.push('</table></div>');
    }
    h.push('</div>');
    main.innerHTML = h.join('');
    toTop();
  }

  function startTest() {
    var boxes = main.getElementsByTagName('input'), chapters = [], k, msg = byId('testMsg');
    for (k = 0; k < boxes.length; k++) {
      if (hasClass(boxes[k], 'tch') && boxes[k].checked) { chapters.push(parseInt(boxes[k].value, 10)); }
    }
    if (!chapters.length) {
      msg.className = 'note'; msg.textContent = 'Tick at least one chapter.';
      return;
    }
    msg.className = 'note'; msg.textContent = 'Preparing the test…';
    needMany(chapters, function () {
      var pool = [], a, n = testSetup.n;
      for (a = 0; a < chapters.length; a++) { pool = pool.concat(itemsOf(chapters[a], allQuestions(chapters[a]))); }
      shuffle(pool);
      if (n > pool.length) { n = pool.length; }
      startRun('test', 'Timed test — ' + n + ' questions', '#/test', pool.slice(0, n), testSetup.timed ? n * 54 : 0);
    });
  }

  /* ---------- search ---------- */

  function searchHome() {
    cur = { view: 'search', i: -1 };
    setBar('Search the book', 'search');
    main.innerHTML = '<div class="sbox"><input id="sq" type="search" placeholder="Type a word, a name or a date" autocomplete="off" autocapitalize="off" spellcheck="false" value="' +
      esc(S.lastQuery || '') + '"></div><div class="sres" id="sres"><p class="note">Loading the search index…</p></div>';
    toTop();
    var input = byId('sq');
    input.oninput = function () {
      if (searchTimer) { clearTimeout(searchTimer); }
      searchTimer = setTimeout(doSearch, 250);
    };
    input.onkeyup = input.oninput;
    need('search', 0, 'data/search.js', function () {
      var k, s;
      if (!searchReady) {
        for (k = 0; k < D.search.length; k++) { s = D.search[k]; LC[k] = (s[2] + ' ' + s[3]).toLowerCase(); }
        searchReady = true;
      }
      if (cur.view === 'search') { doSearch(); }
    });
  }

  function snippet(text, lower, q) {
    var at = lower.indexOf(q), from, to, pre, mid, post, sp;
    if (at < 0) { return esc(text.substr(0, 140)) + (text.length > 140 ? '…' : ''); }
    from = at - 60; if (from < 0) { from = 0; }
    if (from > 0) { sp = text.indexOf(' ', from); if (sp > -1 && sp < at) { from = sp + 1; } }
    to = at + q.length + 90; if (to > text.length) { to = text.length; }
    pre = text.substring(from, at); mid = text.substr(at, q.length); post = text.substring(at + q.length, to);
    return (from > 0 ? '…' : '') + esc(pre) + '<mark>' + esc(mid) + '</mark>' + esc(post) + (to < text.length ? '…' : '');
  }

  function doSearch() {
    var box = byId('sres'), input = byId('sq');
    if (!box || !input || !searchReady) { return; }
    var q = input.value.replace(/^\s+|\s+$/g, '').toLowerCase(), hits = [], k, s, inTitle, body, p, h = [], total = 0;
    S.lastQuery = input.value; saveSoon();
    if (q.length < 2) {
      box.innerHTML = '<p class="note">Type at least two letters. You can search in English or in Nepali — try <b>Lipulekh</b>, <b>Article 76</b>, <b>2083</b> or <b>संविधान</b>.</p>';
      return;
    }
    for (k = 0; k < D.search.length; k++) {
      s = D.search[k];
      if (LC[k].indexOf(q) < 0) { continue; }
      total++;
      inTitle = s[2].toLowerCase().indexOf(q) >= 0;
      if (hits.length < 400) { hits.push([inTitle ? 0 : 1, k]); }
    }
    hits.sort(function (x, y) { return x[0] - y[0] || x[1] - y[1]; });
    h.push('<p class="note">' + total + ' section' + (total === 1 ? '' : 's') + ' found' + (total > 80 ? ' — showing the first 80' : '') + '.</p>');
    for (k = 0; k < hits.length && k < 80; k++) {
      s = D.search[hits[k][1]]; p = IDX.parts[s[0]]; body = s[3];
      h.push('<a class="hit" href="#/read/' + s[0] + '/' + s[1] + '"><div class="w">' + esc(fullTitle(p) + (s[4] ? ' › ' + s[4] : '')) + '</div><div class="h">' +
        esc(s[2]) + '</div><div class="s">' + snippet(body, body.toLowerCase(), q) + '</div></a>');
    }
    box.innerHTML = h.join('');
  }

  /* ---------- settings ---------- */

  function settings() {
    cur = { view: 'settings', i: -1 };
    setBar('Settings', 'settings');
    var h = ['<div class="wrap">'], k, names = ['Smallest', 'Small', 'Medium', 'Large', 'Largest'], themes = [['light', 'Light'], ['sepia', 'Sepia'], ['dark', 'Dark']], tried = 0, key;
    for (key in S.st) { if (S.st.hasOwnProperty(key)) { tried++; } }
    h.push('<div class="sec">Text size</div><div class="seg">');
    for (k = 0; k < 5; k++) { h.push('<button type="button" data-act="font" data-v="' + k + '" class="' + (S.fs === k ? 'on' : '') + '">' + names[k] + '</button>'); }
    h.push('</div><div class="sec">Colours</div><div class="seg">');
    for (k = 0; k < themes.length; k++) { h.push('<button type="button" data-act="theme" data-v="' + themes[k][0] + '" class="' + (S.th === themes[k][0] ? 'on' : '') + '">' + themes[k][1] + '</button>'); }
    h.push('</div><div class="sec">Answers while reading</div><div class="seg">');
    h.push('<button type="button" data-act="hide" data-v="1" class="' + (S.hide ? 'on' : '') + '">Hide until I tap</button>');
    h.push('<button type="button" data-act="hide" data-v="0" class="' + (S.hide ? '' : 'on') + '">Always show</button></div>');
    h.push('<div class="sec">My progress</div><div class="note">' + tried + ' of ' + IDX.mcq + ' questions tried · ' + S.tests.length + ' timed test(s) saved on this phone.</div>');
    h.push('<button class="btn warn" type="button" data-act="reset">Erase my scores and reading positions</button>');
    h.push('<p id="resetMsg" class="note hidden"></p>');
    h.push('<div class="sec">About</div><div class="note"><b>Loksewa Study Book</b>' + (IDX.version ? ' — version ' + esc(IDX.version) : '') + ', built on ' + esc(IDX.built) +
      '.<br>Parts ' + IDX.firstPart + '–' + IDX.lastPart + ' of the study book for the provincial Public Service Commission 5th Level (non-technical) Paper I: ' + IDX.mcq + ' MCQs, ' + IDX.saq + ' short-answer questions.' +
      '<br><br>The app works fully offline and asks for no permission. Links to sources open in your browser.' +
      '<br><br>No question is a verified past question; each carries a label that says how it was written. Recent facts are marked 🔄 and must be checked again before the examination. The syllabus published by your own commission is the authority.</div>');
    h.push('<a class="btn alt wide" href="#/read/0">Read “About this book”</a></div>');
    main.innerHTML = h.join('');
    toTop();
  }

  /* ---------- actions ---------- */

  var resetArmed = false;

  var actions = {
    startAll: function (b) {
      var ch = parseInt(b.getAttribute('data-ch'), 10);
      startRun('practice', 'Chapter ' + ch + ' — all questions', '#/quiz/' + ch, shuffle(itemsOf(ch, allQuestions(ch))));
    },
    startWrong: function (b) {
      var ch = parseInt(b.getAttribute('data-ch'), 10), st = statsFor(ch, allQuestions(ch));
      if (st.wrong.length) { startRun('practice', 'Chapter ' + ch + ' — questions I got wrong', '#/quiz/' + ch, itemsOf(ch, st.wrong)); }
    },
    startTopic: function (b) {
      var ch = parseInt(b.getAttribute('data-ch'), 10), t = D.quiz[ch].topics[parseInt(b.getAttribute('data-t'), 10)];
      startRun('practice', (t.id === 'T' ? 'Chapter ' + ch + ' — Top 25' : 'Topic ' + t.id), '#/quiz/' + ch, itemsOf(ch, t.q));
    },
    opt: function (b) {
      if (!run || run.done) { return; }
      var o = parseInt(b.getAttribute('data-o'), 10), item = run.items[run.i];
      if (run.mode === 'practice') {
        if (run.picks[run.i] >= 0) { return; }
        run.picks[run.i] = o;
        record(item.ch, item.q, o === item.q.a);
        saveSoon();
      } else {
        run.picks[run.i] = o;
        run.warn = false;
      }
      var y = window.pageYOffset || 0;
      showRun();
      window.scrollTo(0, y);
    },
    clear: function () { if (run && !run.done) { run.picks[run.i] = -1; showRun(); } },
    next: function () {
      if (!run) { return; }
      if (run.i + 1 < run.items.length) { run.i += 1; showRun(); }
      else if (run.mode === 'practice') { finishRun(); }
    },
    prev: function () { if (run && run.i > 0) { run.i -= 1; showRun(); } },
    pal: function (b) { if (run) { run.i = parseInt(b.getAttribute('data-k'), 10); showRun(); } },
    submit: function () {
      if (!run) { return; }
      var k, blank = 0;
      for (k = 0; k < run.picks.length; k++) { if (run.picks[k] < 0) { blank++; } }
      if (blank && !run.warn) { run.warn = true; showRun(); window.scrollTo(0, document.body.scrollHeight); return; }
      finishRun();
    },
    again: function () { if (run) { startRun(run.mode, run.title, run.back, run.items, run.timed ? run.items.length * 54 : 0); } },
    againWrong: function () {
      if (!run) { return; }
      var items = [], k;
      for (k = 0; k < run.items.length; k++) { if (run.picks[k] !== run.items[k].q.a) { items.push(run.items[k]); } }
      if (items.length) { startRun('practice', 'Questions I missed', run.back, items); }
    },
    setN: function (b) { testSetup.n = parseInt(b.getAttribute('data-n'), 10); testHome(); },
    done: function () {
      var back = run ? run.back : '#/quiz';
      if (window.history.length > 1) { window.history.back(); } else { swap(back); }
    },
    resume: function () { if (run && !run.done) { go('#/run'); } },
    setTimed: function (b) { testSetup.timed = b.getAttribute('data-v') === '1'; testHome(); },
    startTest: function () { startTest(); },
    font: function (b) { S.fs = parseInt(b.getAttribute('data-v'), 10); save(); applyPrefs(); settings(); },
    theme: function (b) { S.th = b.getAttribute('data-v'); save(); applyPrefs(); settings(); },
    hide: function (b) { S.hide = b.getAttribute('data-v') === '1'; save(); applyPrefs(); settings(); },
    reset: function () {
      var msg = byId('resetMsg');
      if (!resetArmed) {
        resetArmed = true;
        msg.className = 'note'; msg.textContent = 'This erases your scores, test results and reading positions on this phone. Tap the red button again to confirm.';
        return;
      }
      resetArmed = false;
      S.st = {}; S.tests = []; S.pos = {}; S.last = null; save();
      settings();
    }
  };

  main.addEventListener('click', function (ev) {
    var t = ev.target, a, b, name;
    if (cur.view === 'read') {
      a = up(t, 'ans');
      if (a && hasClass(document.body, 'hide-ans')) {
        if (t.tagName === 'A' && hasClass(a, 'shown')) { return; }
        a.className = hasClass(a, 'shown') ? a.className.replace(/\s*shown/, '') : a.className + ' shown';
        ev.preventDefault();
        return;
      }
    }
    b = upAttr(t, 'data-act');
    if (!b || b.disabled) { return; }
    name = b.getAttribute('data-act');
    if (name !== 'reset') { resetArmed = false; }
    if (actions[name]) { actions[name](b); }
  }, false);

  drawer.addEventListener('click', function (ev) {
    var a = upAttr(ev.target, 'data-h');
    if (!a) { return; }
    ev.preventDefault();
    var hid = a.getAttribute('data-h');
    closeDrawer();
    if (hid) { jump(hid); } else { toTop(); }
  }, false);

  shade.addEventListener('click', closeDrawer, false);
  btnToc.addEventListener('click', function () { if (drawer.className === 'hidden') { openDrawer(); } else { closeDrawer(); } }, false);
  btnSearch.addEventListener('click', function () { go('#/search'); }, false);
  btnSet.addEventListener('click', function () { go('#/settings'); }, false);
  btnBack.addEventListener('click', function () {
    if (drawer.className !== 'hidden') { closeDrawer(); return; }
    if (window.history.length > 1) { window.history.back(); } else { go('#/'); }
  }, false);

  window.addEventListener('scroll', function () {
    if (cur.view !== 'read' || !cur.ready) { return; }
    S.pos[cur.i] = window.pageYOffset || document.documentElement.scrollTop || 0;
    saveSoon();
  }, false);

  /* ---------- router ---------- */

  function route() {
    var parts = location.hash.replace(/^#\/?/, '').split('/');
    closeDrawer();
    if (parts[0] !== 'run') { stopTimer(); }
    switch (parts[0]) {
      case 'read': read(parseInt(parts[1], 10) || 0, parts[2] || ''); break;
      case 'quiz': if (parts[1]) { quizChapter(parseInt(parts[1], 10)); } else { quizHome(); } break;
      case 'run': showRun(); break;
      case 'test': testHome(); break;
      case 'search': searchHome(); break;
      case 'settings': settings(); break;
      default: home();
    }
  }

  window.addEventListener('hashchange', route, false);
  applyPrefs();
  if (!IDX) {
    main.innerHTML = '<p class="pad">The book data is missing from this build.</p>';
  } else {
    route();
  }
}());
