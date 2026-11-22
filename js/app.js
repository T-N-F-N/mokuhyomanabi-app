/* =========================================================
 * 目標実現アプリ — 学習エンジン
 * 教材は courses/*.js で LearnApp.registerCourse({...}) により登録する（README.md 参照）。
 * 学習記録はこのブラウザの localStorage に保存される（設定画面からバックアップ可）。
 * ========================================================= */
(function () {
  'use strict';
  const App = (window.LearnApp = window.LearnApp || {});
  App.courses = [];
  App.courseMap = {};

  /* ---------- ユーティリティ ---------- */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const stripTags = (s) => String(s == null ? '' : s).replace(/<[^>]*>/g, '');
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pct = (x) => Math.round((x || 0) * 100);
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const dayNo = (d = new Date()) => Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000);
  const dayStr = (n) => new Date(n * 86400000).toISOString().slice(0, 10);
  const strToDay = (s) => { const [y, m, d] = s.split('-').map(Number); return dayNo(new Date(y, m - 1, d)); };
  const isTyping = (e) => /INPUT|TEXTAREA|SELECT/.test(e.target.tagName);
  const view = () => $('#view');
  const norm = (s) => String(s).normalize('NFKC').toLowerCase().replace(/[’‘`]/g, "'").replace(/[.,!?;:"“”()]/g, ' ').replace(/\s+/g, ' ').trim();
  const words = (s) => norm(s).split(' ').filter(Boolean);
  function go(h) { if (location.hash === h) route(); else location.hash = h; }

  /* ---------- 図解ヘルパー（教材から LearnApp.D.xxx(...) で使う。色はテーマ変数に従う） ---------- */
  const D = (App.D = {});
  let figId = 0;
  const tw = (s, fs = 14) => [...String(s || '')].reduce((a, ch) => a + (/[\u0000-ɏ]/.test(ch) ? fs * 0.58 : fs), 0);
  const FILLS = ['fa', 'fw', 'fg', 'fr', 'f1'];
  const T = (x, y, s, cls = '', style = '') => `<text x="${x}" y="${y}" class="${cls}"${style ? ` style="${style}"` : ''}>${esc(s)}</text>`;
  const fig = (svg, w, h, cap) => `<div class="fig"><svg viewBox="0 0 ${Math.ceil(w)} ${Math.ceil(h)}" width="${Math.ceil(w)}"${w <= 430 ? ' class="fit"' : ''}>${svg}</svg>${cap ? `<p class="cap">${cap}</p>` : ''}</div>`;
  // ここから4つ（flow / compare / icons / stack）は HTML で描く。画面がせまいと、自動で縦にならぶ
  const cc = (c) => 'dgc-' + String(c || 'f1').slice(1).toLowerCase();
  const dfig = (inner, cap) => `<div class="fig dg">${inner}${cap ? `<p class="cap">${cap}</p>` : ''}</div>`;
  // 横の流れ：items = [[見出し, 補足, 絵文字], ...]
  D.flow = (items, o = {}) => {
    const cols = o.colors || FILLS;
    const boxes = items.map(([a, b, e], i) => `<div class="dg-box ${cc(cols[i % cols.length])}"${o.minW ? ` style="min-width:${o.minW}px"` : ''}>${e ? `<span class="dg-e">${esc(e)}</span>` : ''}<b>${esc(a)}</b>${b ? `<small>${esc(b)}</small>` : ''}</div>`).join('<span class="dg-ar"></span>');
    return dfig(`${o.title ? `<div class="dg-title">${esc(o.title)}</div>` : ''}<div class="dg-flow">${boxes}</div>${o.loop ? `<div class="dg-loop">↺ ${o.loop === true ? 'くり返す' : esc(o.loop)}</div>` : ''}`, o.cap);
  };
  // 左右の比較：{title, icon, lines:[...], color}
  D.compare = (L, R, o = {}) => {
    const panel = (p, def) => `<div class="dg-panel ${cc(p.color || def)}"><b class="dg-pt">${p.icon ? esc(p.icon) + ' ' : ''}${esc(p.title)}</b>${p.lines.map((ln) => `<span>・${esc(ln)}</span>`).join('')}</div>`;
    return dfig(`<div class="dg-cmp">${panel(L, 'fa')}${o.vs ? `<span class="dg-vs">${esc(o.vs)}</span>` : '<span class="dg-gap"></span>'}${panel(R, 'fg')}</div>`, o.cap);
  };
  // 絵文字のイラスト並び：items = [[絵文字, 見出し, 補足], ...]、o.sep = '→' など
  D.icons = (items, o = {}) => {
    const cols = o.colors || ['f1'], arrow = o.sep === '→';
    const cells = items.map(([e, a, b], i) => `<div class="dg-ic ${cc(cols[i % cols.length])}"><span class="dg-e">${esc(e)}</span><div><b>${esc(a)}</b>${b ? `<small>${esc(b)}</small>` : ''}</div></div>`);
    const sep = o.sep ? (arrow ? '<span class="dg-ar"></span>' : `<span class="dg-sep">${esc(o.sep)}</span>`) : '';
    return dfig(`<div class="dg-icons${o.sep ? ' has-sep' : ''}" style="--w:${o.w || 120}px">${cells.join(sep)}</div>`, o.cap);
  };
  // 英文などのカタマリ：parts = [[語句, 役割, 色クラス], ...]
  D.chunks = (parts, o = {}) => {
    let x = 10, s = '';
    parts.forEach(([t, r, c], i) => {
      const w = Math.max(tw(t, 15) + 22, tw(r, 11.5) + 12);
      s += `<rect x="${x}" y="14" width="${w}" height="40" rx="8" class="l ${c || 'f1'}"/>` + T(x + w / 2, 40, t, 'tm b en', 'font-size:15px') + (r ? T(x + w / 2, 74, r, 'tm s') : '');
      x += w + (o.slash ? 26 : 8);
      if (o.slash && i < parts.length - 1) s += T(x - 13, 42, '/', 'tm b tr', 'font-size:20px');
    });
    return fig(s, x + 2, 86, o.cap);
  };
  // 輪（サイクル）：items = [[見出し, 補足], ...]
  D.cycle = (items, o = {}) => {
    const n = items.length, R = o.r || 120, cx = 300, cy = R + 40, bw = Math.max(120, ...items.map(([a, b]) => Math.max(tw(a, 14), tw(b, 11.5)) + 20)), bh = 46;
    const P = items.map((_, i) => { const t = (-90 + (i * 360) / n) * Math.PI / 180; return [cx + R * 1.35 * Math.cos(t), cy + R * Math.sin(t)]; });
    let s = o.center ? T(cx, cy + 5, o.center, 'tm b ta', 'font-size:15px') : '';
    P.forEach(([x, y], i) => {
      const [x2, y2] = P[(i + 1) % n], ax = x + (x2 - x) * 0.32, ay = y + (y2 - y) * 0.32, bx = x + (x2 - x) * 0.68, by = y + (y2 - y) * 0.68;
      s += `<path d="M${ax.toFixed(1)} ${ay.toFixed(1)} L${bx.toFixed(1)} ${by.toFixed(1)}" class="la" marker-end="url(#ara)"/>`;
    });
    P.forEach(([x, y], i) => { const [a, b] = items[i]; s += `<rect x="${(x - bw / 2).toFixed(1)}" y="${(y - bh / 2).toFixed(1)}" width="${bw}" height="${bh}" rx="10" class="l ${FILLS[i % FILLS.length]}"/>` + T(x, y + (b ? -2 : 5), a, 'tm b') + (b ? T(x, y + 15, b, 'tm s') : ''); });
    return fig(s, 600, cy + R + 40, o.cap);
  };
  // 表のマス目：cols=[...], rows=[...], cells=[[[文字, 色], ...], ...]
  D.grid = (cols, rows, cells, o = {}) => {
    const hw = Math.max(90, ...rows.map((r) => tw(r, 13) + 20)), cw = Math.max(o.cw || 150, ...cells.flat().map(([t]) => Math.max(...String(t).split('\n').map((ln) => tw(ln, 13) + 24))), ...cols.map((c) => tw(c, 13) + 20)), ch = o.ch || 62;
    let s = '';
    cols.forEach((c, j) => (s += T(hw + 10 + j * cw + cw / 2, 26, c, 'tm b')));
    rows.forEach((r, i) => {
      s += T(hw, 40 + i * ch + ch / 2 + 5, r, 'b', 'text-anchor:end;font-size:13px');
      cells[i].forEach(([t, c], j) => {
        const x = hw + 10 + j * cw, y = 38 + i * ch, ls = String(t).split('\n');
        s += `<rect x="${x + 3}" y="${y + 3}" width="${cw - 6}" height="${ch - 6}" rx="8" class="l ${c || 'f1'}"/>` + ls.map((ln, k) => T(x + cw / 2, y + ch / 2 + 5 + (k - (ls.length - 1) / 2) * 17, ln, k ? 'tm s' : 'tm b')).join('');
      });
    });
    return fig(s, hw + 20 + cols.length * cw, 44 + rows.length * ch, o.cap);
  };
  // 棒グラフ：data=[[ラベル, 値, 強調?], ...]、o.cum で累積折れ線（パレート図）
  D.bars = (data, o = {}) => {
    const bw = 40, step = Math.max(70, ...data.map((d) => tw(d[0], 11.5) + 14)), W = Math.max(60 + data.length * step, o.title ? tw(o.title, 14) + 60 : 0), base = 190, max = o.max || Math.max(...data.map((d) => d[1]));
    let s = `<path d="M40 ${base} L${W} ${base}" class="l"/>`;
    data.forEach(([lab, v, hl], i) => {
      const x = 50 + i * step + (step - bw) / 2, h = (v / max) * 140;
      s += `<rect x="${x}" y="${base - h}" width="${bw}" height="${h}" rx="3" class="l ${hl ? 'fA' : 'fa'}"/>` + T(x + bw / 2, base + 18, lab, 'tm s') + T(x + bw / 2, base - h - 6, (o.unit ? v + o.unit : v), 'tm s');
    });
    if (o.cum) {
      const tot = data.reduce((a, d) => a + d[1], 0);
      let c = 0;
      const pts = data.map(([, v], i) => { c += v; return `${(50 + i * step + step / 2).toFixed(1)},${(base - (c / tot) * 160).toFixed(1)}`; });
      s += `<polyline points="${pts.join(' ')}" class="lr"/>` + pts.map((p) => `<circle cx="${p.split(',')[0]}" cy="${p.split(',')[1]}" r="4" class="fR"/>`).join('') + T(W - 4, 24, o.cum === true ? '累積 %' : o.cum, 'tr s', 'text-anchor:end');
    }
    if (o.title) s += T(44, 18, o.title, 'b');
    return fig(s, W + 10, base + 30, o.cap);
  };
  // 目盛り（強さ・段階）：items=[[ラベル, 補足], ...]
  D.scale = (items, o = {}) => {
    const n = items.length, W = Math.max(560, n * 120), step = (W - 100) / Math.max(1, n - 1), id = 'sg' + ++figId;
    let s = `<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" style="stop-color:var(--good);stop-opacity:.35"/><stop offset="1" style="stop-color:var(--bad);stop-opacity:.75"/></linearGradient></defs><rect x="40" y="46" width="${W - 80}" height="16" rx="8" fill="url(#${id})"/>`;
    items.forEach(([a, b], i) => { const x = 50 + i * step; s += `<circle cx="${x}" cy="54" r="7" class="fI"/>` + T(x, 34, a, 'tm b') + (b ? T(x, 86, b, 'tm s') : ''); });
    if (o.left) s += T(40, 112, o.left, 's'); if (o.right) s += T(W - 40, 112, o.right, 's', 'text-anchor:end');
    return fig(s, W, o.left || o.right ? 122 : 100, o.cap);
  };
  // 積み重ね（下が土台）：items=[[見出し, 補足], ...] 上から順
  D.stack = (items, o = {}) => {
    const n = items.length, cols = o.colors || FILLS;
    return dfig(`<div class="dg-stack${o.pyramid ? ' pyr' : ''}">${items.map(([a, b], i) => `<div class="dg-box ${cc(cols[i % cols.length])}"${o.pyramid ? ` style="--pw:${Math.round(45 + 55 * (i / Math.max(1, n - 1)))}%"` : ''}><b>${esc(a)}</b>${b ? `<small>${esc(b)}</small>` : ''}</div>`).join('')}</div>`, o.cap);
  };
  D.svg = (inner, w, h, cap) => fig(inner, w, h, cap);

  /* ---------- コース登録 ---------- */
  function normUnit(c, u, keyCards) {
    u.course = c.id;
    u.stage = u.stage || 0;
    u.summary = u.summary || u.sum || '';
    u.prereq = u.prereq || u.pre || [];
    u.outcomes = u.outcomes || u.goals || [];
    u.lessons = (u.lessons || []).map((l, i) => {
      const L = { ...l, id: l.id || u.id + '.l' + i, minutes: l.minutes || l.min || 10, idx: i };
      if (L.steps) L.steps = L.steps.map((st, k) => {
        if (st.t === 'q') return { ...st, q: normQ(st.q, c.id, u.id, 'l' + i + 's' + k) };
        if (st.t === 'key') keyCards.push({ f: st.front, b: st.back, ex: u.title });
        return st;
      });
      return L;
    });
    u.missions = (u.missions || []).map((m, i) => ({ ...m, id: m.id || u.id + '.m' + i, idx: i, unit: u.id }));
    u.questions = (u.questions || u.qs || []).map((q, i) => normQ(q, c.id, u.id, i));
    c.unitMap[u.id] = u;
    u.questions.forEach((q) => (c.qMap[q.id] = q));
  }
  App.registerCourse = function (c) {
    c.stages = c.stages || [{ title: '基礎' }];
    c.levels = c.levels || [{ id: 'beginner', label: '初心者', stage: 0 }];
    c.goals = c.goals || [];
    c.exams = c.exams || [];
    c.teacher = c.teacher || { name: '先生', icon: '🧑‍🏫' };
    c.unitMap = {};
    const keyCards = [];
    c.qMap = {};
    c.units.forEach((u) => normUnit(c, u, keyCards));
    c.cardMap = {};
    if (keyCards.length) c.decks = [{ id: 'keys', title: '決め台詞カード', desc: 'レッスンの「決め台詞」を思い出す練習。要点を一言で言えれば、理解は本物です。', cards: keyCards }].concat(c.decks || []);
    c.decks = (c.decks || []).map((d) => normDeck(c, d));
    App.courses.push(c);
    App.courseMap[c.id] = c;
  };
  function normDeck(c, d) {
    const deck = { ...d };
    deck.cards = d.cards.map((x) => {
      const cd = Array.isArray(x) ? { f: x[0], b: x[1], ex: x[2] || '' } : { ...x };
      cd.id = d.id + ':' + cd.f; cd.deck = d.id; cd.say = !!d.say;
      c.cardMap[cd.id] = cd;
      return cd;
    });
    return deck;
  }
  // 別ファイルから既存コースに単語帳を追加する：LearnApp.addDecks('english', [{ id, title, say, desc, cards }])
  App.addDecks = function (cid, decks) {
    const c = App.courseMap[cid];
    if (!c) { console.warn('addDecks: コースが見つかりません', cid); return; }
    decks.forEach((d) => c.decks.push(normDeck(c, d)));
  };
  // 別ファイルから既存コースにユニットを追加する：LearnApp.addUnits('speed', [{ id, stage, title, lessons, qs, ... }])
  App.addUnits = function (cid, units) {
    const c = App.courseMap[cid];
    if (!c) { console.warn('addUnits: コースが見つかりません', cid); return; }
    const keyCards = [];
    units.forEach((u) => { normUnit(c, u, keyCards); c.units.push(u); });
    if (keyCards.length) {
      const nd = normDeck(c, { id: 'keys', title: '決め台詞カード', desc: 'レッスンの「決め台詞」を思い出す練習。要点を一言で言えれば、理解は本物です。', cards: keyCards });
      const d = c.decks.find((x) => x.id === 'keys');
      if (d) d.cards.push(...nd.cards); else c.decks.unshift(nd);
    }
  };
  // 別ファイルから既存ユニットに練習問題を追加する：LearnApp.addQuestions('english', { 'en-tense': [{ id: 'x1', lv: 1, q, c, a, e }, ...] })
  App.addQuestions = function (cid, map) {
    const c = App.courseMap[cid];
    if (!c) { console.warn('addQuestions: コースが見つかりません', cid); return; }
    Object.keys(map).forEach((uid) => {
      const u = c.unitMap[uid];
      if (!u) { console.warn('addQuestions: ユニットが見つかりません', uid); return; }
      map[uid].forEach((q) => { const n = normQ(q, cid, uid, 'x' + u.questions.length); if (c.qMap[n.id]) { console.warn('addQuestions: 問題IDが重複しています', n.id); return; } u.questions.push(n); c.qMap[n.id] = n; });
    });
  };
  // コースに模試を追加する
  App.addExams = function (cid, exams) { const c = App.courseMap[cid]; if (c) c.exams.push(...exams); };
  function normQ(q, cid, uid, i) {
    const n = { ...q };
    n.type = q.type || q.t || 'mc';
    if (q.c && !n.choices) n.choices = q.c;
    if (q.a !== undefined && n.answer === undefined) n.answer = q.a;
    n.explain = q.explain || q.e || '';
    n.id = q.id ? uid + '.' + q.id : uid + '.' + i;
    n.unit = uid; n.course = cid;
    if (n.type === 'tf') { n.type = 'mc'; n.choices = ['正しい（○）', '誤り（×）']; n.answer = n.answer ? 0 : 1; n.shuffle = false; }
    return n;
  }

  /* ---------- 状態保存 ---------- */
  const KEY = 'learnapp.v1';
  function defaults() {
    return {
      v: 1, xp: 0, streak: 0, best: 0, last: null, hist: {}, badges: {}, maxCombo: 0,
      totals: { answered: 0, correct: 0, lessons: 0, exams: 0, cards: 0, sessions: 0, missions: 0, reads: 0, readWords: 0 },
      read: {},
      settings: { dailyGoal: 60, rate: 0.95, voice: '', theme: 'auto', newCards: 15 },
      courses: {},
    };
  }
  let S;
  try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) { S = null; }
  if (!S || typeof S !== 'object') S = defaults();
  else { const d = defaults(); S = { ...d, ...S, totals: { ...d.totals, ...S.totals }, settings: { ...d.settings, ...S.settings } }; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { console.warn('保存に失敗しました', e); } }
  function cs(id) {
    const x = (S.courses[id] = S.courses[id] || { setup: null, lessons: {}, q: {}, cards: {}, exams: [], crowns: {}, diag: null });
    if (!x.missions) x.missions = {};
    return x;
  }
  const LV = ['', '基礎', '標準', '応用'];

  /* ---------- 間隔反復（SM-2 を簡略化） g: 0=不正解 1=難しい 2=普通 3=簡単 ---------- */
  function srs(s, g) {
    const t = dayNo();
    s.ease = s.ease || 2.5;
    if (g === 0) { s.reps = 0; s.lapses = (s.lapses || 0) + 1; s.ivl = 0; s.ease = Math.max(1.3, s.ease - 0.2); s.due = t + 1; return s; }
    s.reps = (s.reps || 0) + 1;
    let ivl;
    if (s.reps === 1) ivl = [0, 1, 2, 4][g];
    else if (s.reps === 2) ivl = [0, 3, 6, 9][g];
    else ivl = Math.round((s.ivl || 1) * (g === 1 ? 1.2 : g === 2 ? s.ease : s.ease * 1.3));
    s.ease = Math.max(1.3, s.ease + (g === 1 ? -0.15 : g === 3 ? 0.15 : 0));
    s.ivl = Math.max(1, ivl); s.due = t + s.ivl;
    return s;
  }
  function gradeQ(q, g) {
    const st = cs(q.course).q;
    const s = (st[q.id] = st[q.id] || { seen: 0, ok: 0, ng: 0 });
    s.seen++; if (g) s.ok++; else s.ng++;
    srs(s, g); save();
  }

  /* ---------- 習得度・学習計画 ---------- */
  function strength(s) { if (!s) return 0; const r = s.reps || 0; return r >= 3 ? 1 : r === 2 ? 0.75 : r === 1 ? 0.5 : 0.15; }
  function unitMastery(u) {
    const c = cs(u.course);
    const lf = u.lessons.length ? u.lessons.filter((l) => c.lessons[l.id]).length / u.lessons.length : 1;
    const qf = u.questions.length ? u.questions.reduce((a, q) => a + strength(c.q[q.id]), 0) / u.questions.length : lf;
    return 0.25 * lf + 0.75 * qf;
  }
  function courseMastery(c) { return c.units.length ? c.units.reduce((a, u) => a + unitMastery(u), 0) / c.units.length : 0; }
  function planUnits(c) {
    const st = cs(c.id).setup, goals = (st && st.goals) || [];
    return c.units.filter((u) => u.core || !goals.length || !u.tags || u.tags.some((t) => goals.includes(t)));
  }
  function isKey(c, u) { const st = cs(c.id).setup, g = (st && st.goals) || []; return !!(g.length && u.tags && u.tags.some((t) => g.includes(t))); }
  function nextUnit(c) {
    const s0 = (cs(c.id).setup || {}).startStage || 0;
    return planUnits(c).find((u) => u.stage >= s0 && unitMastery(u) < 0.8) || c.units.find((u) => unitMastery(u) < 0.8) || null;
  }
  function nextStep(c) {
    const u = nextUnit(c), cst = cs(c.id);
    if (!u) return c.exams[0] ? { label: '全ユニット習得！模試で実力確認', sub: c.exams[0].title, href: `#/c/${c.id}/exam/${c.exams[0].id}` } : null;
    const l = u.lessons.find((x) => !cst.lessons[x.id]);
    if (l) return { u, label: u.title, sub: `レッスン「${l.title}」約${l.minutes}分`, href: `#/c/${c.id}/l/${u.id}/${l.idx}` };
    return { u, label: u.title, sub: `練習問題で定着させる（習得度 ${pct(unitMastery(u))}%）`, href: `#/c/${c.id}/practice/${u.id}` };
  }
  function pace(c) {
    const su = cs(c.id).setup; if (!su) return null;
    const cst = cs(c.id);
    let rem = 0;
    planUnits(c).filter((u) => u.stage >= (su.startStage || 0)).forEach((u) => {
      u.lessons.forEach((l) => { if (!cst.lessons[l.id]) rem += l.minutes; });
      u.questions.forEach((q) => { rem += (1 - strength(cst.q[q.id])) * 1.5; });
    });
    rem = Math.ceil(rem);
    const p = { rem };
    if (su.minutes) p.finish = dayNo() + Math.ceil(rem / su.minutes);
    if (su.target) { p.daysLeft = strToDay(su.target) - dayNo(); p.need = p.daysLeft > 0 ? Math.ceil(rem / p.daysLeft) : null; }
    return p;
  }
  function dueItems(courses) {
    const t = dayNo(), out = [];
    courses.forEach((c) => {
      const st = cs(c.id);
      Object.keys(st.q).forEach((id) => { const s = st.q[id], q = c.qMap[id]; if (q && s.due != null && s.due <= t) out.push({ kind: 'q', q, due: s.due }); });
      Object.keys(st.cards).forEach((id) => { const s = st.cards[id], cd = c.cardMap[id]; if (cd && s.due != null && s.due <= t) out.push({ kind: 'card', card: cd, course: c.id, due: s.due }); });
    });
    return out.sort((a, b) => a.due - b.due);
  }

  /* ---------- XP・レベル・連続記録・バッジ ---------- */
  const levelAt = (xp) => Math.floor((1 + Math.sqrt(1 + xp / 12.5)) / 2);
  const xpFor = (lv) => 50 * lv * (lv - 1);
  const TITLES = [[1, '見習い'], [3, '挑戦者'], [6, '探究者'], [10, '実践者'], [15, '熟達者'], [20, 'エキスパート'], [30, 'マスター'], [40, 'グランドマスター'], [50, 'レジェンド']];
  const titleOf = (lv) => TITLES.filter((t) => lv >= t[0]).pop()[1];
  const streakNow = () => (S.last != null && S.last >= dayNo() - 1 ? S.streak : 0);
  function addXP(n) {
    if (n <= 0) return;
    const t = dayNo();
    if (S.last !== t) { S.streak = S.last === t - 1 ? S.streak + 1 : 1; S.best = Math.max(S.best, S.streak); S.last = t; }
    const before = levelAt(S.xp), todayBefore = S.hist[t] || 0;
    S.xp += n; S.hist[t] = todayBefore + n;
    if (todayBefore < S.settings.dailyGoal && S.hist[t] >= S.settings.dailyGoal) { toast('🎯 今日の目標達成！この調子！', 'good'); confetti(40); }
    const after = levelAt(S.xp);
    if (after > before) levelUpModal(after);
    save(); hud();
  }
  const countCrowns = () => Object.values(S.courses).reduce((a, c) => a + Object.keys(c.crowns || {}).length, 0);
  const BADGES = [
    ['first', '🌱', 'はじめの一歩', '最初のレッスンを完了', () => S.totals.lessons >= 1],
    ['l10', '📗', '学びの習慣', 'レッスンを10個完了', () => S.totals.lessons >= 10],
    ['l30', '📚', '知の探究者', 'レッスンを30個完了', () => S.totals.lessons >= 30],
    ['c100', '🎯', '百問突破', '100問正解', () => S.totals.correct >= 100],
    ['c500', '🏹', '五百問突破', '500問正解', () => S.totals.correct >= 500],
    ['c2000', '🏆', '二千問の猛者', '2000問正解', () => S.totals.correct >= 2000],
    ['s3', '🔥', '3日連続', '3日連続で学習', () => S.best >= 3],
    ['s7', '⚡', '1週間連続', '7日連続で学習', () => S.best >= 7],
    ['s30', '🌋', '30日連続', '30日連続で学習', () => S.best >= 30],
    ['combo10', '💫', '集中ゾーン', '10問連続正解', () => S.maxCombo >= 10],
    ['combo25', '🌟', '無双状態', '25問連続正解', () => S.maxCombo >= 25],
    ['exam1', '📝', '本番の空気', '模試・認定テストを受験', () => S.totals.exams >= 1],
    ['crown1', '👑', '初めての王冠', 'ユニット習得認定に合格', () => countCrowns() >= 1],
    ['crown10', '💎', '王冠コレクター', '10ユニットで王冠を獲得', () => countCrowns() >= 10],
    ['cards200', '🃏', '単語ハンター', 'カードを200回復習', () => S.totals.cards >= 200],
    ['lv10', '🚀', 'Lv.10到達', 'レベル10に到達', () => levelAt(S.xp) >= 10],
    ['m1', '🛠', '実践者の一歩', '実践課題を1つ完了', () => (S.totals.missions || 0) >= 1],
    ['m10', '🏗', '現場力', '実践課題を10個完了', () => (S.totals.missions || 0) >= 10],
    ['r1', '📖', '多読デビュー', '多読ライブラリで1話読了', () => (S.totals.reads || 0) >= 1],
    ['r10k', '📚', '1万語リーダー', '多読で累計1万語', () => (S.totals.readWords || 0) >= 10000],
    ['r50k', '🗼', '5万語リーダー', '多読で累計5万語', () => (S.totals.readWords || 0) >= 50000],
    ['r100k', '🌍', '10万語リーダー', '多読で累計10万語', () => (S.totals.readWords || 0) >= 100000],
    ['w300', '🔤', '語彙300', '単語カードを300語定着（2回以上正解）', () => wordStats().learned >= 300],
  ];
  function checkBadges() {
    BADGES.forEach(([id, ic, name, , test]) => { if (!S.badges[id] && test()) { S.badges[id] = dayNo(); toast(`${ic} バッジ獲得：${name}`, 'gold'); } });
    save();
  }

  /* ---------- 演出 ---------- */
  function toast(msg, kind = '') {
    const el = document.createElement('div');
    el.className = 'toast ' + kind; el.textContent = msg;
    $('#toasts').appendChild(el);
    setTimeout(() => el.classList.add('out'), 2600);
    setTimeout(() => el.remove(), 3100);
  }
  function confetti(n = 60) {
    const colors = ['#4a63e7', '#16915f', '#f0b43c', '#e2557a', '#7b5cf0', '#2bb3c0'];
    const box = document.createElement('div'); box.className = 'confetti';
    for (let i = 0; i < n; i++) {
      const p = document.createElement('i');
      p.style.left = Math.random() * 100 + 'vw'; p.style.background = colors[i % colors.length];
      p.style.animationDelay = Math.random() * 0.4 + 's'; p.style.animationDuration = 1.6 + Math.random() * 1.3 + 's';
      box.appendChild(p);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 3600);
  }
  function levelUpModal(lv) {
    confetti(90);
    const m = document.createElement('div'); m.className = 'modal';
    m.innerHTML = `<div class="modal-card pop"><div class="lvup">LEVEL UP!</div><div class="lvnum">Lv.${lv}</div><div class="lvtitle">称号「${titleOf(lv)}」</div><p>積み重ねが確実に力になっています。</p><button class="btn primary">続ける</button></div>`;
    m.onclick = (e) => { if (e.target === m || e.target.tagName === 'BUTTON') m.remove(); };
    document.body.appendChild(m);
  }
  function ring(r, size = 48) {
    r = clamp(r || 0, 0, 1);
    const h = size / 2, R = h - 4, C = 2 * Math.PI * R;
    return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${h}" cy="${h}" r="${R}" class="ring-bg"/><circle cx="${h}" cy="${h}" r="${R}" class="ring-fg ${r >= 0.8 ? 'full' : ''}" stroke-dasharray="${(C * r).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 ${h} ${h})"/><text x="${h}" y="${h}" dominant-baseline="central" text-anchor="middle" style="font-size:${Math.max(10, size / 4.2)}px">${pct(r)}%</text></svg>`;
  }
  function hud() {
    const lv = levelAt(S.xp), cur = S.xp - xpFor(lv), need = xpFor(lv + 1) - xpFor(lv);
    const today = S.hist[dayNo()] || 0, goal = S.settings.dailyGoal, r = clamp(today / goal, 0, 1), C = 2 * Math.PI * 9;
    $('#hud').innerHTML = `<span class="chip" title="連続学習日数">🔥 ${streakNow()}</span>
      <span class="chip lv" title="${titleOf(lv)}：次のレベルまで ${need - cur} XP">Lv.${lv}<span class="mini"><i style="width:${pct(cur / need)}%"></i></span></span>
      <span class="chip" title="今日の目標 ${today}/${goal} XP"><svg width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="11" r="9" class="ring-bg"/><circle cx="11" cy="11" r="9" class="ring-fg ${r >= 1 ? 'full' : ''}" stroke-dasharray="${(C * r).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 11 11)"/></svg>${today}</span>`;
    const due = dueItems(App.courses).length;
    $('#dueBadge').textContent = due ? due : '';
  }

  /* ---------- 英語音声（Web Speech API） ---------- */
  function pickVoice() {
    if (!('speechSynthesis' in window)) return null;
    const vs = speechSynthesis.getVoices();
    if (S.settings.voice) { const v = vs.find((x) => x.name === S.settings.voice); if (v) return v; }
    return vs.find((v) => /en-US/i.test(v.lang) && /Natural|Online|Google/i.test(v.name)) || vs.find((v) => /en-US/i.test(v.lang)) || vs.find((v) => /^en/i.test(v.lang)) || null;
  }
  App.say = function (text, rate) {
    if (!('speechSynthesis' in window)) { toast('この環境では音声読み上げが使えません'); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = rate || S.settings.rate;
    const v = pickVoice(); if (v) u.voice = v;
    speechSynthesis.speak(u);
  };
  function decorate(root) {
    $$('.say', root).forEach((el) => {
      if (el.dataset.done) return;
      el.dataset.done = 1;
      const text = el.dataset.text || el.textContent.trim();
      const b = document.createElement('button');
      b.className = 'say-btn'; b.type = 'button'; b.textContent = '🔊'; b.title = '読み上げ';
      b.onclick = (e) => { e.stopPropagation(); e.preventDefault(); App.say(text); };
      el.appendChild(b);
    });
    $$('[data-say]', root).forEach((b) => { b.onclick = (e) => { e.preventDefault(); App.say(b.dataset.say, +b.dataset.rate || undefined); }; });
  }

  /* ---------- 画面部品 ---------- */
  const crumbs = (list) => `<nav class="crumbs"><a href="#/">ホーム</a>${list.map(([t, h]) => ' › ' + (h ? `<a href="${h}">${esc(t)}</a>` : esc(t))).join('')}</nav>`;
  const mission = (ic, title, sub, href, btn) => `<div class="mission"><div class="m-ic">${ic}</div><div class="m-b"><b>${esc(title)}</b><span>${esc(sub)}</span></div>${href ? `<a class="btn primary" href="${href}">${btn || '開く'}</a>` : ''}</div>`;
  function greet() {
    const h = new Date().getHours(), s = streakNow();
    const base = h < 5 ? '夜更かしの学び、えらい。' : h < 11 ? 'おはようございます。' : h < 18 ? 'こんにちは。' : 'こんばんは。今日もひと伸び。';
    return base + (s >= 2 ? ` ${s}日連続中🔥` : '');
  }
  function heatmap() {
    const t = dayNo(), wd = (t + 4) % 7, W = 18, start = t - wd - 7 * (W - 1), goal = S.settings.dailyGoal;
    let cells = '';
    for (let w = 0; w < W; w++) for (let d = 0; d < 7; d++) {
      const n = start + w * 7 + d; if (n > t) continue;
      const x = S.hist[n] || 0, k = x === 0 ? 0 : x < goal / 2 ? 1 : x < goal ? 2 : x < goal * 2 ? 3 : 4;
      cells += `<rect x="${w * 15}" y="${d * 15}" width="12" height="12" rx="2.5" class="hm${k}"><title>${dayStr(n)}：${x} XP</title></rect>`;
    }
    return `<div class="heat"><svg viewBox="0 0 ${W * 15} ${7 * 15}" width="${W * 15}" height="${7 * 15}">${cells}</svg></div>`;
  }
  function statsRow() {
    const T = S.totals;
    return `<div class="stats"><div><b>${S.xp}</b><span>累計XP</span></div><div><b>${T.lessons}</b><span>完了レッスン</span></div><div><b>${T.answered}</b><span>解いた問題</span></div><div><b>${T.answered ? pct(T.correct / T.answered) : 0}%</b><span>初回正答率</span></div><div><b>${T.cards}</b><span>カード復習</span></div><div><b>${S.best}日</b><span>最長連続</span></div></div>`;
  }
  function courseCard(c) {
    const st = cs(c.id), m = courseMastery(c);
    return `<a class="card course" href="#/c/${c.id}" style="--cc:${c.color || 'var(--accent)'}"><div class="c-ic">${c.icon}</div><div class="c-body"><h3>${esc(c.title)}</h3><p>${esc(c.tagline || '')}</p><div class="bar"><i style="width:${pct(m)}%"></i></div><small class="muted">${st.setup ? `習得度 ${pct(m)}% ・ ${c.units.length}ユニット` : '未設定 — はじめる →'}</small></div></a>`;
  }

  /* ---------- 画面: ホーム ---------- */
  function viewHome() {
    const t = dayNo(), lv = levelAt(S.xp), today = S.hist[t] || 0, goal = S.settings.dailyGoal;
    const due = dueItems(App.courses);
    let ms = due.length
      ? mission('🔁', `復習 ${due.length}件が待っています`, '忘れかける直前の復習が、記憶を長期保存に変える最も効率の良い方法です。', '#/review', '復習する')
      : mission('✅', '今日の復習は完了', '新しい内容を進めて、明日の復習の種をまきましょう。');
    App.courses.forEach((c) => { if (!cs(c.id).setup) return; const n = nextStep(c); if (n) ms += mission(c.icon, `${c.title}：${n.label}`, n.sub, n.href, '進める'); });
    if (!App.courses.some((c) => cs(c.id).setup)) ms += mission('🧭', 'まずは学ぶコースを設定しよう', '下のコースを選び、現在地・目標・目的を決めると最適な学習ルートが作られます。');
    view().innerHTML = `
      <section class="hero"><div><h1>${greet()}</h1><p class="muted">Lv.${lv}「${titleOf(lv)}」・次のレベルまで ${xpFor(lv + 1) - S.xp} XP・最長連続 ${S.best}日</p></div>
        <div class="goal-ring">${ring(today / goal, 64)}<div><b>${today}</b> / ${goal} XP<br><span class="muted small">今日の目標</span></div></div></section>
      <h2 class="sec">今日のミッション</h2><div class="missions">${ms}</div>
      <h2 class="sec">コース</h2><div class="grid courses">${App.courses.map(courseCard).join('')}</div>
      <h2 class="sec">学習の記録</h2><div class="card">${heatmap()}${statsRow()}</div>
      <h2 class="sec">バッジ</h2><div class="badges">${BADGES.map((b) => `<div class="badge ${S.badges[b[0]] ? '' : 'locked'}"><span>${b[1]}</span><b>${b[2]}</b><small>${b[3]}</small></div>`).join('')}</div>`;
  }

  /* ---------- 画面: コース ---------- */
  function skillMap(c) {
    const W = 230, H = 50, GX = 46, GY = 12, TOP = 34, L = 8;
    const cols = c.stages.map((_, i) => c.units.filter((u) => u.stage === i));
    const pos = {};
    cols.forEach((us, ci) => us.forEach((u, ri) => (pos[u.id] = { x: L + ci * (W + GX), y: TOP + ri * (H + GY) })));
    const maxRows = Math.max(1, ...cols.map((x) => x.length));
    const width = L * 2 + cols.length * W + (cols.length - 1) * GX + 24, height = TOP + maxRows * (H + GY) + 4;
    const cst = cs(c.id), nx = nextUnit(c);
    let heads = '', edges = '', nodes = '';
    c.stages.forEach((s, i) => (heads += `<text x="${L + i * (W + GX)}" y="18" class="map-stage">STAGE ${i + 1}　${esc(s.title)}</text>`));
    c.units.forEach((u) => u.prereq.forEach((p) => {
      const a = pos[p], b = pos[u.id]; if (!a || !b) return;
      const on = c.unitMap[p] && unitMastery(c.unitMap[p]) >= 0.8 ? 'on' : '';
      if (a.x === b.x) { const x = a.x + W; edges += `<path d="M${x} ${a.y + H / 2} C${x + 22} ${a.y + H / 2} ${x + 22} ${b.y + H / 2} ${x} ${b.y + H / 2}" class="map-edge ${on}"/>`; }
      else edges += `<path d="M${a.x + W} ${a.y + H / 2} C${a.x + W + GX / 2} ${a.y + H / 2} ${b.x - GX / 2} ${b.y + H / 2} ${b.x} ${b.y + H / 2}" class="map-edge ${on}"/>`;
    }));
    c.units.forEach((u) => {
      const p = pos[u.id], m = unitMastery(u);
      const cls = (m >= 0.8 ? 'm3' : m >= 0.4 ? 'm2' : m > 0 ? 'm1' : 'm0') + (nx === u ? ' next' : '');
      const pre = (cst.crowns[u.id] ? '👑' : '') + (isKey(c, u) ? '★' : '');
      const max = 15 - pre.length;
      const title = u.title.length > max ? u.title.slice(0, max - 1) + '…' : u.title;
      nodes += `<a href="#/c/${c.id}/u/${u.id}"><g class="map-node ${cls}"><title>${esc(u.title)}（習得度 ${pct(m)}%）</title><rect x="${p.x}" y="${p.y}" width="${W}" height="${H}" rx="10"/><rect x="${p.x + 10}" y="${p.y + H - 11}" width="${W - 20}" height="4" rx="2" class="map-track"/><rect x="${p.x + 10}" y="${p.y + H - 11}" width="${((W - 20) * m).toFixed(1)}" height="4" rx="2" class="map-fill"/><text x="${p.x + 12}" y="${p.y + 23}">${pre}${esc(title)}</text></g></a>`;
    });
    return `<div class="map-wrap"><svg class="skillmap" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${heads}${edges}${nodes}</svg></div>`;
  }
  function unitRow(c, u) {
    const m = unitMastery(u), cst = cs(c.id);
    return `<a class="unit-row" href="#/c/${c.id}/u/${u.id}"><div>${ring(m, 44)}</div><div class="u-b"><b>${cst.crowns[u.id] ? '👑 ' : ''}${isKey(c, u) ? '<span class="star">★</span> ' : ''}${esc(u.title)}</b><span class="muted">${esc(u.summary)}</span></div><span class="u-n">${u.lessons.length}レッスン・${u.questions.length}問</span></a>`;
  }
  function stageBlock(c, s, i) {
    const s0 = (cs(c.id).setup || {}).startStage || 0;
    const us = c.units.filter((u) => u.stage === i);
    return `<section><h2 class="sec">STAGE ${i + 1}　${esc(s.title)} ${i < s0 ? '<span class="tag">スタート地点より前：復習・確認用</span>' : ''}</h2>${s.desc ? `<p class="muted">${s.desc}</p>` : ''}<div class="units">${us.map((u) => unitRow(c, u)).join('')}</div></section>`;
  }
  function paceHtml(p, su) {
    if (!p) return '';
    let h = `<p>残りの推定学習量：<b>約${Math.round(p.rem / 6) / 10}時間</b></p>`;
    if (p.finish) h += `<p>1日${su.minutes}分なら <b>${dayStr(p.finish)}</b> ごろ一巡</p>`;
    if (p.daysLeft != null) h += p.daysLeft > 0 ? `<p>目標日まで残り${p.daysLeft}日 → 必要ペース <b>1日${p.need}分</b> ${p.need <= su.minutes ? '<span class="tag good">順調</span>' : '<span class="tag warn">ペースアップが必要</span>'}</p>` : '<p class="muted">目標日を過ぎています。目標日を再設定しましょう。</p>';
    return h + '<p class="muted small">※ 復習・単語カードの時間は別に1日10〜15分を見込んでください。</p>';
  }
  function examHistory(c) {
    const ex = cs(c.id).exams;
    if (!ex.length) return '';
    return `<h2 class="sec">模試の記録</h2><div class="card"><table class="tbl"><tr><th>日付</th><th>テスト</th><th>スコア</th></tr>${ex.slice(-10).reverse().map((r) => `<tr><td>${dayStr(r.day)}</td><td>${esc((c.exams.find((e) => e.id === r.id) || {}).title || r.id)}</td><td><b>${r.score}</b></td></tr>`).join('')}</table></div>`;
  }
  function viewCourse(c) {
    const st = cs(c.id);
    if (!st.setup) return viewSetup(c);
    const su = st.setup, lvl = c.levels.find((l) => l.id === su.level), n = nextStep(c);
    const due = dueItems([c]).length, goals = c.goals.filter((g) => su.goals.includes(g.id));
    view().innerHTML = `${crumbs([[c.title]])}
      <section class="c-head" style="--cc:${c.color || 'var(--accent)'}"><div class="c-ic big">${c.icon}</div><div>
        <h1>${esc(c.title)}</h1><p class="muted">${esc(c.tagline || '')}</p>
        <div class="chips">${lvl ? `<span class="tag">現在地：${esc(lvl.label)}</span>` : ''}<span class="tag">開始：STAGE ${(su.startStage || 0) + 1}</span>${goals.map((g) => `<span class="tag key">★ ${esc(g.label)}</span>`).join('')}</div>
        ${su.purpose ? `<p class="purpose">目的：${esc(su.purpose)}</p>` : ''}
        <a href="#/c/${c.id}/setup" class="small">現在地・目標・目的を変更</a></div></section>
      <div class="grid two">
        <div class="card">${n ? `<h3>▶ 次にやること</h3><p><b>${esc(n.label)}</b><br><span class="muted">${esc(n.sub)}</span></p><a class="btn primary" href="${n.href}">進める →</a>` : '<h3>すべて習得済み！</h3>'}</div>
        <div class="card"><h3>📅 ペース</h3>${paceHtml(pace(c), su)}</div>
      </div>
      <div class="actions">
        <a class="btn" href="#/c/${c.id}/review">🔁 このコースの復習 ${due}件</a>
        <a class="btn" href="#/c/${c.id}/mix">🔀 ミックス演習</a>
        <a class="btn" href="#/c/${c.id}/notebook">📓 間違いノート ${notebookCount(c)}</a>
        <a class="btn" href="#/c/${c.id}/diag">🩺 診断テスト</a>
        ${c.exams.map((e) => `<a class="btn" href="#/c/${c.id}/exam/${e.id}">📝 ${esc(e.title)}</a>`).join('')}
        ${(typeof c.links === 'function' ? c.links() : c.links || []).map(([t, h]) => `<a class="btn gold" href="${h}">${esc(t)}</a>`).join('')}
        ${c.id === READ_COURSE ? `<a class="btn gold" href="#/words">🔤 単語ジム（${wordStats().total}語）</a><a class="btn gold" href="#/read">📚 多読ライブラリ（${App.readings.length}話）</a>` : ''}
        ${c.decks.filter((d) => !d.hidden && !d.group).map((d) => `<a class="btn" href="#/c/${c.id}/deck/${d.id}">🃏 ${esc(d.title)}</a>`).join('')}
      </div>
      <details class="card overview" ${courseMastery(c) < 0.05 ? 'open' : ''}><summary><h2>🗺 全体像 — まずここで地図を頭に入れる</h2> <span class="muted small">（クリックで開閉）</span></summary><div class="lesson">${c.overview || ''}</div></details>
      <h2 class="sec">スキルマップ</h2>
      <p class="muted small">線は前提関係（左→右に進む）。★＝目的に直結、👑＝習得認定済み、オレンジ枠＝次のおすすめ。ノードをクリックで開く。</p>
      ${skillMap(c)}
      ${c.stages.map((s, i) => stageBlock(c, s, i)).join('')}
      ${missionSummary(c)}
      ${examHistory(c)}`;
    decorate(view());
  }
  function viewSetup(c) {
    const su = cs(c.id).setup || {};
    view().innerHTML = `${crumbs([[c.title, '#/c/' + c.id], ['目標設定']])}
      <section class="card setup"><h1>${c.icon} ${esc(c.title)}：目標設定</h1>
      <p class="muted">「現在地」「目標」「目的」をはっきりさせると、学習ルート（★）と必要なペースが自動で決まります。後からいつでも変更できます。</p>
      ${c.setupNote ? `<div class="box tip">${c.setupNote}</div>` : ''}
      <form id="setup">
        <h3>1. 現在のレベル</h3><div class="opts">${c.levels.map((l, i) => `<label class="opt"><input type="radio" name="level" value="${l.id}" ${(su.level ? su.level === l.id : i === 0) ? 'checked' : ''}><span><b>${esc(l.label)}</b><small>${esc(l.desc || '')}</small></span></label>`).join('')}</div>
        <h3>2. 目標（複数選択可・★として学習ルートに反映）</h3><div class="opts">${c.goals.map((g) => `<label class="opt"><input type="checkbox" name="goals" value="${g.id}" ${(su.goals || c.goals.map((x) => x.id)).includes(g.id) ? 'checked' : ''}><span><b>${esc(g.label)}</b><small>${esc(g.desc || '')}</small></span></label>`).join('')}</div>
        <h3>3. 目的・使いみち（自由記述）</h3><textarea name="purpose" rows="3" placeholder="${esc(c.purposeHint || '例：仕事で使うため')}">${esc(su.purpose || '')}</textarea>
        <div class="grid two"><label><h3>4. 1日の学習時間</h3><select name="minutes">${[15, 30, 45, 60, 90, 120].map((m) => `<option value="${m}" ${(su.minutes || 30) == m ? 'selected' : ''}>${m}分</option>`).join('')}</select></label>
        <label><h3>5. 目標達成日（任意）</h3><input type="date" name="target" value="${su.target || ''}"></label></div>
        <p><button class="btn primary big">この設定で学習を始める →</button></p>
        <p class="muted small">設定後、コース画面の「診断テスト」で実力を測り、最適なスタート地点に自動調整することもできます。</p>
      </form></section>`;
    $('#setup').onsubmit = (e) => {
      e.preventDefault();
      const f = new FormData(e.target), level = f.get('level'), lv = c.levels.find((l) => l.id === level);
      cs(c.id).setup = { level, startStage: lv ? lv.stage || 0 : 0, goals: f.getAll('goals'), purpose: String(f.get('purpose') || '').trim(), minutes: +f.get('minutes'), target: f.get('target') || '' };
      save(); toast('設定しました。さあ、始めよう！', 'good'); go('#/c/' + c.id);
    };
  }

  /* ---------- 画面: ユニット・レッスン ---------- */
  function viewUnit(c, u) {
    const cst = cs(c.id), m = unitMastery(u);
    const pre = u.prereq.map((id) => c.unitMap[id]).filter(Boolean), nxt = c.units.filter((x) => x.prereq.includes(u.id));
    const seen = u.questions.filter((q) => cst.q[q.id]), weak = seen.filter((q) => strength(cst.q[q.id]) < 0.75);
    const link = (x) => `<a class="link" href="#/c/${c.id}/u/${x.id}">${esc(x.title)}（${pct(unitMastery(x))}%）</a>`;
    view().innerHTML = `${crumbs([[c.title, '#/c/' + c.id], [u.title]])}
      <section class="u-head"><div>${ring(m, 80)}</div><div>
        <span class="tag">STAGE ${u.stage + 1}　${esc(c.stages[u.stage].title)}</span>${isKey(c, u) ? '<span class="tag key">★ 目的に直結</span>' : ''}${cst.crowns[u.id] ? '<span class="tag gold">👑 習得認定</span>' : ''}
        <h1>${esc(u.title)}</h1><p>${esc(u.summary)}</p></div></section>
      ${u.outcomes.length ? `<div class="card"><h3>🎯 このユニットのゴール</h3><ul class="check">${u.outcomes.map((o) => `<li>${o}</li>`).join('')}</ul></div>` : ''}
      <div class="card"><h3>📖 レッスン</h3><div class="lessons">${u.lessons.map((l) => `<a class="lesson-row ${cst.lessons[l.id] ? 'done' : ''}" href="#/c/${c.id}/l/${u.id}/${l.idx}"><span class="ck">${cst.lessons[l.id] ? '✔' : l.idx + 1}</span><b>${esc(l.title)}</b><span class="muted small">${l.minutes}分</span></a>`).join('')}</div></div>
      <div class="card"><h3>✍ 練習と定着</h3><p class="muted">全${u.questions.length}問・挑戦済み${seen.length}問・要強化${weak.length}問</p>${levelBoxes(c, u)}
        <div class="actions"><a class="btn primary" href="#/c/${c.id}/practice/${u.id}">練習問題</a>
        ${weak.length ? `<a class="btn" href="#/c/${c.id}/practice/${u.id}/weak">苦手だけ ${weak.length}問</a>` : ''}
        <a class="btn gold" href="#/c/${c.id}/unittest/${u.id}">👑 習得認定テスト</a></div>
        <p class="small muted">練習：1問ごとに解説。間違えた問題はセッションの最後にもう一度出題され、翌日以降も自動で復習に回ります。<br>習得認定テスト：解説なしで全問。正答率90%以上で王冠を獲得。</p></div>
      ${u.missions.length ? `<div class="card"><h3>🛠 実践課題</h3><p class="muted small">知識を「できる」に変えるのは実践だけ。アプリの外で取り組み、ここに記録しよう。</p><div class="lessons">${u.missions.map((m) => missionRow(c, m)).join('')}</div></div>` : ''}
      <div class="grid two"><div class="card"><h3>⬅ 前提となるユニット</h3>${pre.length ? pre.map(link).join('') : '<p class="muted">なし（ここから始められます）</p>'}</div>
        <div class="card"><h3>➡ この先につながるユニット</h3>${nxt.length ? nxt.map(link).join('') : '<p class="muted">—</p>'}</div></div>`;
  }

  /* ---------- 授業（ステップ方式のレッスン） ---------- */
  function stepHtml(c, st) {
    if (st.t === 'talk') return `<div class="talk"><div class="t-av" title="${esc(c.teacher.name)}">${c.teacher.icon}</div><div class="t-bubble">${st.html}</div></div>`;
    if (st.t === 'key') return `<div class="keyline"><div class="k-lb">🔑 決め台詞</div><div class="k-f">${st.front}</div><div class="k-b">${st.back}</div></div>`;
    if (st.t === 'trap') return `<div class="box warn"><b>⚠ ひっかけ注意</b>${st.html}</div>`;
    return `<div class="blk">${st.html || ''}</div>`;
  }
  function runSteps(c, l, box, showAll, onEnd) {
    let k = 0;
    const next = (scroll) => {
      const chunk = document.createElement('div');
      chunk.className = 'chunk';
      box.appendChild(chunk);
      while (k < l.steps.length) {
        const st = l.steps[k++];
        if (st.t !== 'q') { chunk.insertAdjacentHTML('beforeend', stepHtml(c, st)); continue; }
        const el = document.createElement('div');
        el.className = 'inq';
        chunk.appendChild(el);
        inlineQ(st.q, el, (fb) => {
          if (showAll) return;
          const b = document.createElement('button');
          b.className = 'btn primary'; b.textContent = k < l.steps.length ? '続きへ ↓' : 'まとめへ ↓';
          b.onclick = () => { b.remove(); next(true); };
          fb.appendChild(b);
          setTimeout(() => b.focus(), 60);
        });
        if (!showAll) { decorate(chunk); if (scroll) chunk.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
      }
      decorate(chunk);
      if (scroll) chunk.scrollIntoView({ behavior: 'smooth', block: 'start' });
      onEnd();
    };
    next(false);
  }
  function inlineQ(q, el, after) {
    const audio = q.audio ? `<div class="audio-row"><button class="btn" data-say="${esc(q.audio)}">🔊 再生</button><button class="btn ghost" data-say="${esc(q.audio)}" data-rate="0.7">🐢 ゆっくり</button></div>` : '';
    el.innerHTML = `<div class="inq-h">✋ ここで確認</div>${q.passage ? `<div class="passage">${q.passage}</div>` : ''}<div class="q-text">${q.q || ''}</div>${audio}<div class="iq-body"></div><div class="iq-fb"></div>`;
    const body = $('.iq-body', el), fb = $('.iq-fb', el);
    const show = (ok, ci) => {
      const why = !ok && q.why && ci != null && q.why[ci] ? `<div class="whywrong">💭 ${q.why[ci]}</div>` : '';
      fb.innerHTML = `<div class="fb ${ok ? 'ok' : 'ng'} pop"><div class="fb-h">${ok ? '✔ その通り！' : '✘ おしい！ここが分かれ道'}</div>${ok ? '' : `<div class="fb-ans">正解：<b>${esc(expectedOf(q))}</b></div>`}${why}${q.explain ? `<div class="explain">${q.explain}</div>` : ''}</div>`;
      decorate(fb);
      after(fb);
    };
    if (q.type === 'mc') {
      const idx = q.shuffle === false ? q.choices.map((_, i) => i) : shuffle(q.choices.map((_, i) => i));
      body.innerHTML = `<div class="choices">${idx.map((ci, n) => `<button class="choice" data-ci="${ci}"><span class="key">${n + 1}</span><span>${q.choices[ci]}</span></button>`).join('')}</div>`;
      $$('.choice', body).forEach((b) => (b.onclick = () => {
        if (body.dataset.locked) return;
        body.dataset.locked = 1;
        const ci = +b.dataset.ci, ok = ci === q.answer;
        $$('.choice', body).forEach((x) => { x.disabled = true; if (+x.dataset.ci === q.answer) x.classList.add('right'); });
        if (!ok) b.classList.add('wrong');
        show(ok, ci);
      }));
    } else {
      body.innerHTML = `<div class="inrow"><input class="ans" autocomplete="off" spellcheck="false" placeholder="答えを入力">${q.suffix ? `<span class="suffix">${esc(q.suffix)}</span>` : ''}<button class="btn primary">答え合わせ</button></div>`;
      const inp = $('input', body), btn = $('button', body);
      const chk = () => {
        const v = inp.value.trim(); if (!v) return;
        inp.disabled = btn.disabled = true;
        const ok = q.type === 'dict' ? words(q.answer || q.audio).join(' ') === words(v).join(' ') : checkInput(q, v);
        inp.classList.add(ok ? 'right' : 'wrong'); show(ok, null);
      };
      btn.onclick = chk;
      inp.onkeydown = (e) => { if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); chk(); } };
    }
    decorate(el);
  }

  /* ---------- レベル別・間違いノート・実践課題 ---------- */
  function levelBoxes(c, u) {
    const cst = cs(c.id), lvs = [1, 2, 3].filter((v) => u.questions.some((q) => q.lv === v));
    if (!lvs.length) return '';
    return `<div class="lvboxes">${lvs.map((v) => {
      const qs = u.questions.filter((q) => q.lv === v), m = qs.filter((q) => strength(cst.q[q.id]) >= 0.75).length;
      return `<a class="lvbox lv${v}" href="#/c/${c.id}/practice/${u.id}/lv${v}"><b>${LV[v]}</b><span>${m}/${qs.length} 定着</span><div class="bar"><i style="width:${pct(m / qs.length)}%"></i></div></a>`;
    }).join('')}</div><p class="small muted">基礎 → 標準 → 応用の順に解くと最短で伸びます。「練習問題」も自動でこの順に出題します。</p>`;
  }
  function notebookCount(c) { const cst = cs(c.id); return Object.keys(cst.q).filter((id) => c.qMap[id] && cst.q[id].ng > 0 && strength(cst.q[id]) < 0.75).length; }
  function viewNotebook(c) {
    const cst = cs(c.id);
    const list = Object.keys(cst.q).map((id) => ({ q: c.qMap[id], s: cst.q[id] })).filter((x) => x.q && x.s.ng > 0)
      .sort((a, b) => strength(a.s) - strength(b.s) || b.s.ng - a.s.ng);
    const open = list.filter((x) => strength(x.s) < 0.75).length;
    view().innerHTML = `${crumbs([[c.title, '#/c/' + c.id], ['間違いノート']])}
      <div class="card"><h1>📓 間違いノート</h1><p class="muted">一度でも間違えた問題の一覧です。<b>間違いは、あなた専用の最高の教材。</b>解説を読み、「なぜ間違えたか」を一言で言えるようにしてから解き直しましょう。</p>
      <div class="actions">${open ? `<a class="btn primary" href="#/c/${c.id}/notebook/practice">克服中の ${open}問を解き直す</a>` : '<span class="tag good">すべて克服済み！</span>'}</div></div>
      <div class="rev">${list.map(({ q, s }) => {
        const done = strength(s) >= 0.75;
        return `<details class="rev-item ${done ? 'ok' : 'ng'}"><summary><span>${done ? '✔ 克服' : '✘ 克服中'}</span> ${esc(stripTags(q.q || q.text || '').slice(0, 80))} <small class="muted">（${esc(c.unitMap[q.unit].title)}・間違い ${s.ng}回）</small></summary><div class="rev-body">${q.passage ? '<p class="muted small">（長文問題）</p>' : ''}${q.audio ? `<p>音声：<span class="say">${esc(q.audio)}</span></p>` : ''}<p>正解：<b>${esc(expectedOf(q))}</b></p>${q.explain ? `<div class="explain">${q.explain}</div>` : ''}</div></details>`;
      }).join('') || '<div class="card muted">まだ間違えた問題はありません。</div>'}</div>`;
    decorate(view());
  }
  function startMix(c) {
    const cst = cs(c.id);
    const learned = c.units.filter((u) => u.lessons.some((l) => cst.lessons[l.id]) || u.questions.some((q) => cst.q[q.id]));
    const pool = [].concat(...learned.map((u) => u.questions)).filter((q) => q.type !== 'speak');
    const weak = shuffle(pool.filter((q) => cst.q[q.id] && strength(cst.q[q.id]) < 0.75)).slice(0, 8);
    const rest = shuffle(pool.filter((q) => !weak.includes(q))).slice(0, 15 - weak.length);
    startSession({ title: 'ミックス演習', mode: 'practice', items: qItems(shuffle(weak.concat(rest))), back: '#/c/' + c.id, emptyMsg: 'まだ学んだユニットがありません', emptyHtml: '<p class="muted">レッスンを1つ以上終えると、学んだ範囲をシャッフルして出題します。単元を混ぜて解くと「どの解き方を使うか」を選ぶ力がつきます。</p>' });
  }
  const MSTAT = { doing: ['取り組み中', 'warn'], done: ['✔ 完了', 'good'] };
  function missionRow(c, m) {
    const st = cs(c.id).missions[m.id] || {}, ms = MSTAT[st.status] || ['未着手', ''];
    return `<a class="lesson-row ${st.status === 'done' ? 'done' : ''}" href="#/c/${c.id}/m/${m.unit}/${m.idx}"><span class="ck">${st.status === 'done' ? '✔' : '🛠'}</span><b>${esc(m.title)}</b><span class="tag ${ms[1]}">${ms[0]}</span><span class="muted small">${esc(m.time || '')}</span></a>`;
  }
  function missionSummary(c) {
    const all = [].concat(...c.units.map((u) => u.missions));
    if (!all.length) return '';
    const done = all.filter((m) => (cs(c.id).missions[m.id] || {}).status === 'done').length;
    return `<h2 class="sec">🛠 実践課題 <span class="muted small">${done}/${all.length} 完了</span></h2><div class="lessons">${all.map((m) => missionRow(c, m)).join('')}</div>`;
  }
  function viewMission(c, u, m) {
    const cst = cs(c.id), st = cst.missions[m.id] || {}, crit = m.criteria || [], ms = MSTAT[st.status] || ['未着手', ''];
    view().innerHTML = `${crumbs([[c.title, '#/c/' + c.id], [u.title, `#/c/${c.id}/u/${u.id}`], [m.title]])}
      <article class="card lesson-wrap"><div class="l-meta"><span class="tag">${esc(u.title)}</span> 実践課題・目安 ${esc(m.time || '')} <span class="tag ${ms[1]}">${ms[0]}</span></div>
      <h1>🛠 ${esc(m.title)}</h1>
      ${m.why ? `<div class="talk"><div class="t-av">${c.teacher.icon}</div><div class="t-bubble">${m.why}</div></div>` : ''}
      <h3>やること</h3><ol class="steps-ol">${(m.steps || []).map((x) => `<li>${x}</li>`).join('')}</ol>
      ${m.deliverable ? `<div class="box point"><b>成果物</b>${m.deliverable}</div>` : ''}
      ${crit.length ? `<h3>できたかチェック（合格基準）</h3><div class="crit">${crit.map((t, i) => `<label class="opt"><input type="checkbox" data-i="${i}" ${st.checks && st.checks[i] ? 'checked' : ''}><span>${t}</span></label>`).join('')}</div>` : ''}
      <h3>振り返りメモ</h3><textarea id="mnote" rows="5" placeholder="やってみて分かったこと・難しかったこと・次に試すこと">${esc(st.notes || '')}</textarea>
      <label class="field">実際にかかった時間 <input type="number" id="mmin" min="0" step="5" value="${st.minutes || ''}" style="width:110px"> 分</label>
      <div class="l-foot"><a class="btn" href="#/c/${c.id}/u/${u.id}">← ユニットへ</a><div class="actions"><button class="btn" id="msave">記録を保存</button><button class="btn primary" id="mdone">${st.status === 'done' ? '✔ 完了済み（記録を更新）' : '完了にする'}</button></div></div></article>`;
    decorate(view());
    const collect = () => {
      const x = (cst.missions[m.id] = cst.missions[m.id] || {});
      x.checks = $$('.crit input').map((i) => i.checked); x.notes = $('#mnote').value; x.minutes = +$('#mmin').value || 0;
      if (!x.status) x.status = 'doing';
      return x;
    };
    $('#msave').onclick = () => { collect(); save(); toast('記録しました', 'good'); viewMission(c, u, m); };
    $('#mdone').onclick = () => {
      const x = collect();
      if (crit.length && x.checks.some((v) => !v) && !confirm('チェックが付いていない基準があります。完了にしますか？')) return;
      const first = x.status !== 'done';
      x.status = 'done'; x.day = dayNo(); save();
      if (first) { S.totals.missions = (S.totals.missions || 0) + 1; addXP(100); confetti(80); toast('🛠 実践課題を完了！ +100 XP', 'gold'); checkBadges(); }
      else toast('記録を更新しました', 'good');
      viewMission(c, u, m);
    };
  }

  function viewLesson(c, u, li) {
    const l = u.lessons[li]; if (!l) return notFound();
    const cst = cs(c.id), last = li === u.lessons.length - 1;
    view().innerHTML = `${crumbs([[c.title, '#/c/' + c.id], [u.title, `#/c/${c.id}/u/${u.id}`], [l.title]])}
      <article class="card lesson-wrap"><div class="l-meta"><span class="tag">${esc(u.title)}</span> レッスン ${li + 1}/${u.lessons.length}・約${l.minutes}分</div>
      <h1>${esc(l.title)}</h1>${l.steps ? '<div class="lesson steps" id="steps"></div>' : `<div class="lesson">${l.html}</div>`}
      <div class="l-foot">${li > 0 ? `<a class="btn" href="#/c/${c.id}/l/${u.id}/${li - 1}">← 前のレッスン</a>` : `<a class="btn" href="#/c/${c.id}/u/${u.id}">← ユニットへ</a>`}
      <button class="btn primary big ${l.steps && !cst.lessons[l.id] ? 'hidden' : ''}" id="done">${cst.lessons[l.id] ? '✔ ' : ''}${last ? '理解した！確認問題へ →' : '理解した！次のレッスンへ →'}</button></div></article>`;
    decorate(view());
    if (l.steps) runSteps(c, l, $('#steps'), !!cst.lessons[l.id], () => { const d = $('#done'); if (d) d.classList.remove('hidden'); });
    $('#done').onclick = () => {
      if (!cst.lessons[l.id]) { cst.lessons[l.id] = dayNo(); S.totals.lessons++; addXP(30); toast('📖 レッスン完了 +30 XP', 'good'); checkBadges(); }
      save(); go(last ? `#/c/${c.id}/practice/${u.id}` : `#/c/${c.id}/l/${u.id}/${li + 1}`);
    };
  }
  function viewDeckList(c, d) {
    view().innerHTML = `${crumbs([[c.title, '#/c/' + c.id], [d.title]])}<div class="card"><h1>🃏 ${esc(d.title)}</h1><p class="muted">${esc(d.desc || '')}</p>
      <div class="actions"><a class="btn primary" href="#/c/${c.id}/deck/${d.id}">学習する</a></div>
      <table class="tbl"><tr><th>表</th><th>意味</th><th>例</th></tr>${d.cards.map((cd) => `<tr><td>${d.say ? `<span class="say">${esc(cd.f)}</span>` : esc(cd.f)}</td><td>${cd.b}</td><td class="small">${cd.ex ? (d.say ? `<span class="say">${cd.ex}</span>` : cd.ex) : ''}</td></tr>`).join('')}</table></div>`;
    decorate(view());
  }

  /* ---------- セッション（練習・復習・模試・カード） ---------- */
  let SES = null, timer = null, keyFn = null;
  document.addEventListener('keydown', (e) => { if (keyFn) keyFn(e); });
  const isTest = () => SES && (SES.mode === 'exam' || SES.mode === 'diag');

  function startSession(o) {
    clearInterval(timer);
    const items = o.items.filter(Boolean);
    SES = { ...o, queue: items.map((x) => ({ ...x })), total: items.length, results: [], combo: 0, maxCombo: 0, xp: 0, retried: {}, t0: Date.now(), endAt: o.minutes ? Date.now() + o.minutes * 60000 : 0 };
    if (!items.length) { view().innerHTML = `<div class="card empty"><h2>${o.emptyMsg || '出題できる問題がありません'}</h2>${o.emptyHtml || ''}<p><a class="btn primary" href="${o.back || '#/'}">戻る</a></p></div>`; return; }
    if (SES.endAt) timer = setInterval(tick, 1000);
    step();
  }
  function tick() {
    if (!SES) return clearInterval(timer);
    const left = Math.max(0, SES.endAt - Date.now()), el = $('#timer');
    if (el) { el.textContent = '⏱ ' + Math.floor(left / 60000) + ':' + String(Math.floor(left / 1000) % 60).padStart(2, '0'); el.classList.toggle('hurry', left < 60000); }
    if (!left) {
      clearInterval(timer); toast('時間切れ！採点します', 'bad');
      SES.queue.forEach((it) => { if (!it.retry) SES.results.push({ it, correct: false, given: '（未解答）', expected: expectedOf(it.q) }); });
      SES.queue = []; finish();
    }
  }
  function step() {
    keyFn = null;
    const it = SES.queue[0]; if (!it) return finish();
    const doneN = SES.results.length;
    const c = App.courseMap[it.kind === 'card' ? it.course : it.q.course];
    const u = it.kind === 'q' ? c.unitMap[it.q.unit] : null;
    view().innerHTML = `<div class="session">
      <div class="ses-top"><a class="btn ghost" href="${SES.back || '#/'}" title="中断して戻る">✕</a><div class="pbar"><i style="width:${pct(doneN / SES.total)}%"></i></div><span class="ses-n">${Math.min(doneN + 1, SES.total)}/${SES.total}</span>${SES.endAt ? '<span id="timer" class="timer"></span>' : ''}</div>
      <div class="ses-meta"><b>${esc(SES.title)}</b>${u ? `<span class="muted">${c.icon} ${esc(u.title)}</span>` : `<span class="muted">${c.icon} 単語カード</span>`}${it.kind === 'q' && it.q.lv ? `<span class="tag lv${it.q.lv}">${LV[it.q.lv]}</span>` : ''}${it.retry ? '<span class="tag warn">もう一度</span>' : ''}<span class="combo ${SES.combo >= 3 ? 'on' : ''}">${SES.combo >= 3 ? '🔥 ' + SES.combo + ' COMBO' : ''}</span></div>
      <div class="card qcard" id="qbox"></div><div id="fb"></div></div>`;
    if (SES.endAt) tick();
    if (!SES) return;
    if (it.kind === 'card') renderCard(it); else renderQ(it);
  }
  function renderQ(it) {
    const q = it.q, box = $('#qbox'), test = isTest();
    let head = (q.passage ? `<div class="passage">${q.passage}</div>` : '') + (q.q ? `<div class="q-text">${q.q}</div>` : '');
    if (q.audio && q.type !== 'speak') head += `<div class="audio-row"><button class="btn" data-say="${esc(q.audio)}">🔊 もう一度再生</button><button class="btn ghost" data-say="${esc(q.audio)}" data-rate="0.7">🐢 ゆっくり</button></div>`;
    const done = (res) => answered(it, res);
    if (q.audio && q.type !== 'speak') setTimeout(() => App.say(q.audio), 350);
    if (q.type === 'mc') mcQ(box, head, q, done, test);
    else if (q.type === 'input') inputQ(box, head, q, done);
    else if (q.type === 'order') orderQ(box, head, q, done);
    else if (q.type === 'dict') dictQ(box, head, q, done);
    else if (q.type === 'speak') speakQ(box, head, q, done);
    else box.innerHTML = head + '未対応の問題形式：' + esc(q.type);
  }
  function mcQ(box, head, q, done, test) {
    const idx = q.shuffle === false ? q.choices.map((_, i) => i) : shuffle(q.choices.map((_, i) => i));
    box.innerHTML = head + `<div class="choices">${idx.map((ci, k) => `<button class="choice" data-ci="${ci}"><span class="key">${k + 1}</span><span>${q.choices[ci]}</span></button>`).join('')}</div>`;
    decorate(box);
    const pick = (btn) => {
      if (!btn || box.dataset.locked) return;
      box.dataset.locked = 1;
      const ci = +btn.dataset.ci, ok = ci === q.answer;
      $$('.choice', box).forEach((b) => { b.disabled = true; if (!test && +b.dataset.ci === q.answer) b.classList.add('right'); });
      btn.classList.add(test ? 'picked' : ok ? 'right' : 'wrong');
      done({ correct: ok, given: stripTags(q.choices[ci]), expected: stripTags(q.choices[q.answer]), ci });
    };
    $$('.choice', box).forEach((b) => (b.onclick = () => pick(b)));
    keyFn = (e) => { const n = +e.key; if (!isTyping(e) && n >= 1 && n <= idx.length) pick($$('.choice', box)[n - 1]); };
  }
  function checkInput(q, v) {
    if (typeof q.answer === 'number') {
      const t = v.normalize('NFKC').replace(/[,\s]/g, '').replace(/[−–‐ー]/g, '-'), fr = /^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/.exec(t);
      const x = fr ? parseFloat(fr[1]) / parseFloat(fr[2]) : parseFloat(t);
      if (isNaN(x)) return false;
      const tol = q.tol != null ? q.tol : Math.max(Math.abs(q.answer) * 0.01, 1e-9);
      return Math.abs(x - q.answer) <= tol + 1e-12;
    }
    return [].concat(q.answer).some((a) => norm(a) === norm(v));
  }
  function expectedOf(q) {
    if (q.type === 'mc') return stripTags(q.choices[q.answer]);
    if (q.type === 'order') return q.tokens.join(' ');
    if (q.type === 'dict') return q.answer || q.audio;
    if (q.type === 'speak') return q.text;
    return String([].concat(q.answer)[0]) + (q.suffix ? ' ' + q.suffix : '');
  }
  function inputQ(box, head, q, done) {
    box.innerHTML = head + `<div class="inrow"><input class="ans" id="ans" autocomplete="off" spellcheck="false" placeholder="${esc(q.ph || '答えを入力')}">${q.suffix ? `<span class="suffix">${esc(q.suffix)}</span>` : ''}<button class="btn primary" id="chk">答え合わせ</button></div>${q.hint ? `<details class="hint"><summary>ヒントを見る</summary>${q.hint}</details>` : ''}`;
    decorate(box);
    const inp = $('#ans', box); inp.focus();
    const check = () => {
      const v = inp.value.trim(); if (!v) return;
      inp.disabled = true; $('#chk', box).disabled = true;
      const ok = checkInput(q, v); inp.classList.add(ok ? 'right' : 'wrong');
      done({ correct: ok, given: v, expected: expectedOf(q) });
    };
    $('#chk', box).onclick = check;
    inp.onkeydown = (e) => { if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); check(); } };
  }
  function orderQ(box, head, q, done) {
    const toks = q.tokens;
    let pool = shuffle(toks.map((_, i) => i));
    if (toks.length > 1 && pool.every((v, i) => v === i)) pool.reverse();
    const picked = [];
    const draw = () => {
      box.innerHTML = head + `<div class="ord-ans">${picked.map((i, k) => `<button class="tok on" data-k="${k}">${esc(toks[i])}</button>`).join('') || '<span class="muted small">下の語句をクリックして正しい順に並べる（並べた語をクリックで戻す）</span>'}</div><div class="ord-pool">${pool.map((i, k) => `<button class="tok" data-p="${k}">${esc(toks[i])}</button>`).join('')}</div><div class="row"><button class="btn primary" id="chk" ${pool.length ? 'disabled' : ''}>答え合わせ</button></div>`;
      decorate(box);
      $$('[data-p]', box).forEach((b) => (b.onclick = () => { picked.push(pool.splice(+b.dataset.p, 1)[0]); draw(); }));
      $$('[data-k]', box).forEach((b) => (b.onclick = () => { pool.push(picked.splice(+b.dataset.k, 1)[0]); draw(); }));
      $('#chk', box).onclick = () => {
        const given = picked.map((i) => toks[i]).join(' ');
        const ok = [toks.join(' ')].concat(q.alts || []).some((a) => norm(a) === norm(given));
        $$('.tok', box).forEach((b) => (b.disabled = true)); $('#chk', box).disabled = true;
        $('.ord-ans', box).classList.add(ok ? 'right' : 'wrong');
        done({ correct: ok, given, expected: toks.join(' ') });
      };
    };
    draw();
  }
  function dictQ(box, head, q, done) {
    const target = q.answer || q.audio;
    box.innerHTML = head + `<p class="muted small">聞こえた英文をそのまま入力（大文字小文字・句読点は無視されます）</p><div class="inrow"><input class="ans" id="ans" autocomplete="off" spellcheck="false" placeholder="type what you hear"><button class="btn primary" id="chk">答え合わせ</button></div>`;
    decorate(box);
    const inp = $('#ans', box); inp.focus();
    const check = () => {
      const v = inp.value.trim(); if (!v) return;
      inp.disabled = true; $('#chk', box).disabled = true;
      const tw = words(target), gw = words(v), ok = tw.join(' ') === gw.join(' ');
      const pool = gw.slice();
      const marked = tw.map((w) => { const k = pool.indexOf(w); if (k >= 0) { pool.splice(k, 1); return `<span class="w-ok">${esc(w)}</span>`; } return `<span class="w-ng">${esc(w)}</span>`; }).join(' ');
      inp.classList.add(ok ? 'right' : 'wrong');
      done({ correct: ok, given: v, expected: target, extra: `<div class="diff">聞き取れた語（緑）／聞き逃した語（赤）：<br>${marked}</div>` });
    };
    $('#chk', box).onclick = check;
    inp.onkeydown = (e) => { if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); check(); } };
  }
  function similarity(a, b) {
    const A = words(a), B = words(b), pool = B.slice();
    let hit = 0;
    A.forEach((w) => { const k = pool.indexOf(w); if (k >= 0) { hit++; pool.splice(k, 1); } });
    return hit / Math.max(A.length, B.length, 1);
  }
  function speakQ(box, head, q, done) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    box.innerHTML = head + `<div class="speak-target en"><span class="say">${esc(q.text)}</span></div>${q.ja ? `<p class="muted">${esc(q.ja)}</p>` : ''}
      <div class="row">${SR ? '<button class="btn primary" id="mic">🎤 話す</button>' : ''}<button class="btn good" id="selfok">言えた</button><button class="btn" id="selfng">詰まった</button></div>
      <p id="heard" class="muted small">${SR ? '🔊でお手本を聞き、🎤を押して声に出す（マイクが使えない場合は、音読してから自己評価）' : 'お手本を聞いて、声に出して3回言ってから自己評価'}</p>`;
    decorate(box);
    let fin = false;
    const end = (ok, given) => { if (fin) return; fin = true; $$('.row button', box).forEach((b) => (b.disabled = true)); done({ correct: ok, given, expected: q.text }); };
    $('#selfok', box).onclick = () => end(true, '（自己評価：言えた）');
    $('#selfng', box).onclick = () => end(false, '（自己評価：詰まった）');
    if (SR) $('#mic', box).onclick = () => {
      const out = $('#heard', box);
      try {
        const r = new SR(); r.lang = 'en-US'; r.interimResults = false; r.maxAlternatives = 3;
        out.textContent = '🎙 聞いています…';
        r.onresult = (e) => {
          const best = Array.from(e.results[0]).map((a) => [a.transcript, similarity(q.text, a.transcript)]).sort((x, y) => y[1] - x[1])[0];
          out.innerHTML = `認識結果：「${esc(best[0])}」 一致度 ${pct(best[1])}%`;
          if (best[1] >= 0.75) end(true, best[0]); else out.innerHTML += '<br>もう一度挑戦するか、自己評価で進んでください。';
        };
        r.onerror = (e) => { out.textContent = `音声認識が使えませんでした（${e.error}）。自己評価で進んでください。`; };
        r.start();
      } catch (err) { out.textContent = '音声認識を開始できませんでした。自己評価で進んでください。'; }
    };
  }
  const PRAISE = ['✔ 正解！', '✔ お見事！', '✔ その通り！', '✔ 完璧！', '✔ ナイス！'];
  function answered(it, res) {
    keyFn = null;
    const q = it.q, first = !it.retry;
    if (first) { SES.results.push({ it, ...res }); S.totals.answered++; if (res.correct) S.totals.correct++; }
    if (isTest()) {
      if (SES.mode === 'exam') gradeQ(q, res.correct ? 2 : 0);
      SES.queue.shift(); setTimeout(step, 200); return;
    }
    let gain;
    if (res.correct) { SES.combo++; SES.maxCombo = Math.max(SES.maxCombo, SES.combo); S.maxCombo = Math.max(S.maxCombo, SES.combo); gain = first ? 10 + Math.min(10, Math.floor(SES.combo / 2)) : 4; }
    else { SES.combo = 0; gain = 1; }
    SES.xp += gain; addXP(gain);
    const en = App.courseMap[q.course].lang === 'en' && /[a-z]/i.test(res.expected) && !/[぀-ヿ一-鿿]/.test(res.expected);
    const fb = $('#fb');
    fb.innerHTML = `<div class="fb ${res.correct ? 'ok' : 'ng'} pop"><div class="fb-h">${res.correct ? PRAISE[Math.floor(Math.random() * PRAISE.length)] : '✘ 惜しい！ここが伸びしろ'}<span class="xpg">+${gain} XP</span></div>
      ${!res.correct ? `<div class="fb-ans">正解：<b>${esc(res.expected)}</b>${en ? ` <button class="say-btn" data-say="${esc(res.expected)}">🔊</button>` : ''}</div>` : ''}
      ${q.audio && q.type !== 'dict' ? `<div class="fb-ans small">音声：<span class="say">${esc(q.audio)}</span></div>` : ''}
      ${!res.correct && q.why && res.ci != null && q.why[res.ci] ? `<div class="whywrong">💭 ${q.why[res.ci]}</div>` : ''}
      ${res.extra || ''}${q.explain ? `<div class="explain">${q.explain}</div>` : ''}
      <div class="fb-act">${res.correct && first ? '<label class="unsure"><input type="checkbox" id="unsure"> 自信がなかった（早めに再出題する）</label>' : '<span></span>'}<button class="btn primary" id="next">次へ →</button></div></div>`;
    decorate(fb);
    if (res.correct && SES.combo > 0 && SES.combo % 5 === 0) toast(`🔥 ${SES.combo}問連続正解！`, 'gold');
    const nb = $('#next');
    setTimeout(() => { nb.focus(); fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 60);
    nb.onclick = () => {
      if (first) gradeQ(q, res.correct ? ($('#unsure') && $('#unsure').checked ? 1 : 2) : 0);
      SES.queue.shift();
      if (!res.correct && !SES.retried[q.id]) { SES.retried[q.id] = 1; SES.queue.push({ ...it, retry: true }); }
      step();
    };
  }
  function renderCard(it) {
    const cd = it.card, box = $('#qbox');
    const front = cd.say ? `<span class="say en">${esc(cd.f)}</span>` : esc(cd.f);
    box.innerHTML = `<div class="flash"><div class="f-front">${front}</div><div class="f-back hidden"><div class="f-mean">${cd.b}</div>${cd.ex ? `<div class="f-ex">${cd.say ? `<span class="say en">${cd.ex}</span>` : cd.ex}</div>` : ''}</div>
      <div class="row center" id="cardAct"><button class="btn primary big" id="flip">答えを見る（Space）</button></div></div>`;
    decorate(box);
    if (cd.say) setTimeout(() => App.say(cd.f), 250);
    const flip = () => {
      $('.f-back', box).classList.remove('hidden');
      $('#cardAct', box).innerHTML = [['もう一度', 0, 'bad'], ['難しい', 1, ''], ['覚えてた', 2, 'good'], ['簡単', 3, 'primary']].map(([t, g, k], i) => `<button class="btn ${k}" data-g="${g}"><span class="key">${i + 1}</span>${t}</button>`).join('');
      $$('[data-g]', box).forEach((b) => (b.onclick = () => gradeCard(it, +b.dataset.g)));
      keyFn = (e) => { const n = +e.key; if (!isTyping(e) && n >= 1 && n <= 4) gradeCard(it, n - 1); };
    };
    $('#flip', box).onclick = flip;
    keyFn = (e) => { if (e.code === 'Space' && !isTyping(e)) { e.preventDefault(); flip(); } };
  }
  function gradeCard(it, g) {
    keyFn = null;
    const cd = it.card;
    if (!it.retry) {
      const st = cs(it.course).cards, s = (st[cd.id] = st[cd.id] || { seen: 0 });
      s.seen++; srs(s, g); S.totals.cards++;
      SES.results.push({ it, correct: g >= 2, given: '', expected: cd.b });
    }
    if (g === 0 && !SES.retried[cd.id]) { SES.retried[cd.id] = 1; SES.queue.push({ ...it, retry: true }); }
    const gain = g === 0 ? 1 : 3; SES.xp += gain; addXP(gain);
    SES.queue.shift(); step();
  }
  function reviewList(s) {
    const test = s.mode === 'exam' || s.mode === 'diag';
    const rows = s.results.filter((r) => r.it.kind === 'q' && (test || !r.correct));
    if (!rows.length) return '';
    return `<h2 class="sec">${test ? '解答と解説' : '間違えた問題の解説'}</h2><div class="rev">${rows.map((r) => {
      const q = r.it.q;
      return `<details class="rev-item ${r.correct ? 'ok' : 'ng'}"><summary><span>${r.correct ? '✔' : '✘'}</span> ${esc(stripTags(q.q || q.text || '').slice(0, 90))}</summary><div class="rev-body">${q.audio ? `<p>音声：<span class="say">${esc(q.audio)}</span></p>` : ''}<p>あなたの解答：${esc(r.given)}</p><p>正解：<b>${esc(r.expected)}</b></p>${!r.correct && q.why && r.ci != null && q.why[r.ci] ? `<div class="whywrong">💭 ${q.why[r.ci]}</div>` : ''}${q.explain ? `<div class="explain">${q.explain}</div>` : ''}</div></details>`;
    }).join('')}</div>`;
  }
  function finish() {
    clearInterval(timer); keyFn = null;
    const s = SES, n = s.results.length, ok = s.results.filter((r) => r.correct).length, acc = n ? ok / n : 0;
    const mins = Math.max(1, Math.round((Date.now() - s.t0) / 60000));
    S.totals.sessions++;
    if (s.mode === 'exam') S.totals.exams++;
    const extra = (s.onFinish && s.onFinish(s, acc)) || '';
    const bonus = s.mode === 'exam' ? 50 : s.mode === 'diag' ? 20 : 15;
    s.xp += bonus; addXP(bonus);
    checkBadges(); save();
    const wrong = s.results.filter((r) => !r.correct && r.it.kind === 'q');
    const msg = acc >= 0.9 ? '素晴らしい！完全に自分のものにしつつあります。' : acc >= 0.7 ? 'いい調子！間違えた所こそ一番の伸びしろです。' : acc >= 0.4 ? '理解が進んでいます。解説を読み直して、もう一度挑戦しよう。' : '最初はこれでOK。レッスンに戻って全体像を確認してから再挑戦しよう。';
    view().innerHTML = `<div class="result"><div class="card pop"><div class="res-top">${ring(acc, 120)}<div><h1>${esc(s.title)} 完了！</h1><p class="lead">${msg}</p>
      <div class="stats"><div><b>${ok}/${n}</b><span>${s.mode === 'cards' ? '覚えていた' : '正解'}</span></div><div><b>+${s.xp}</b><span>獲得XP（完走ボーナス${bonus}）</span></div><div><b>${s.maxCombo}</b><span>最大コンボ</span></div><div><b>${mins}分</b><span>学習時間</span></div></div></div></div></div>
      ${extra}${reviewList(s)}
      <div class="actions center">${wrong.length ? '<button class="btn primary" id="again">間違えた問題をもう一度</button>' : ''}<a class="btn" href="${s.back || '#/'}">戻る</a><a class="btn ghost" href="#/">ホーム</a></div></div>`;
    decorate(view());
    if (acc >= 0.9 && n >= 5) confetti(70);
    const ag = $('#again');
    if (ag) ag.onclick = () => startSession({ title: '間違えた問題の再挑戦', mode: 'practice', items: wrong.map((r) => ({ kind: 'q', q: r.it.q })), back: s.back });
    SES = null;
  }

  /* ---------- セッションの組み立て ---------- */
  const qItems = (qs) => qs.map((q) => ({ kind: 'q', q }));
  const byLv = (a, b) => (a.lv || 2) - (b.lv || 2);
  function practiceOrder(c, qs) {
    const cst = cs(c.id);
    if (!qs.some((q) => cst.q[q.id])) return qs.slice().sort(byLv);
    const weak = qs.filter((q) => strength(cst.q[q.id]) < 0.75), rest = qs.filter((q) => strength(cst.q[q.id]) >= 0.75);
    return shuffle(weak).sort(byLv).concat(shuffle(rest));
  }
  function startExam(c, ex) {
    const items = [];
    ex.sections.forEach((sec, i) => {
      const units = sec.units ? sec.units.map((id) => c.unitMap[id]).filter(Boolean) : c.units;
      let pool = [].concat(...units.map((u) => u.questions)).filter((q) => q.type !== 'speak' && (!sec.types || sec.types.includes(q.type)));
      shuffle(pool).slice(0, sec.count || 10).forEach((q) => items.push({ kind: 'q', q, sec: i }));
    });
    startSession({ title: ex.title, mode: 'exam', items, minutes: ex.minutes, back: '#/c/' + c.id, onFinish: examFinish(c, ex) });
  }
  function examFinish(c, ex) {
    return (s, acc) => {
      const secs = ex.sections.map((sec, i) => { const rs = s.results.filter((r) => r.it.sec === i); return { title: sec.title, part: sec.part, ok: rs.filter((r) => r.correct).length, n: rs.length }; });
      let html, score;
      if (ex.score === 'toeic') {
        const part = (p) => { const ss = secs.filter((x) => x.part === p), n = ss.reduce((a, x) => a + x.n, 0); return n ? ss.reduce((a, x) => a + x.ok, 0) / n : 0; };
        const L = Math.round((5 + 490 * part('L')) / 5) * 5, R = Math.round((5 + 490 * part('R')) / 5) * 5;
        score = L + R;
        html = `<div class="score-big">推定スコア <b>${score}</b> <span class="muted">（Listening ${L} / Reading ${R}）</span></div><p class="muted small">※ 問題数が少ないため簡易推定です。実際のTOEICとは誤差があります。伸びの目安として、定期的に受けて推移を見てください。</p>`;
      } else {
        score = pct(acc);
        const pass = ex.pass || 0.7;
        html = `<div class="score-big"><b>${score}</b>点 / 100 ${acc >= pass ? '<span class="tag good">合格ライン突破</span>' : `<span class="tag warn">合格ライン ${pct(pass)}点</span>`}</div>`;
      }
      cs(c.id).exams.push({ id: ex.id, day: dayNo(), score, acc }); save();
      return `<div class="card">${html}<table class="tbl"><tr><th>セクション</th><th>正解</th><th>正答率</th></tr>${secs.map((x) => `<tr><td>${esc(x.title)}</td><td>${x.ok}/${x.n}</td><td>${x.n ? pct(x.ok / x.n) : 0}%</td></tr>`).join('')}</table></div>`;
    };
  }
  function startDiag(c) {
    const per = c.units.length < 8 ? 2 : 1, items = [];
    c.units.forEach((u) => shuffle(u.questions.filter((q) => q.type === 'mc' || q.type === 'input' || q.type === 'order')).slice(0, per).forEach((q) => items.push({ kind: 'q', q })));
    startSession({
      title: c.title + ' 診断テスト', mode: 'diag', items, back: '#/c/' + c.id,
      onFinish: (s) => {
        const accs = c.stages.map((_, i) => { const rs = s.results.filter((r) => c.unitMap[r.it.q.unit].stage === i); return rs.length ? rs.filter((r) => r.correct).length / rs.length : null; });
        let rec = accs.findIndex((a) => a != null && a < 0.7);
        if (rec < 0) rec = c.stages.length - 1;
        cs(c.id).diag = { day: dayNo(), accs }; save();
        setTimeout(() => {
          const b = $('#applyDiag');
          if (b) b.onclick = () => { const su = cs(c.id).setup; if (su) { su.startStage = rec; save(); } toast(`スタート地点を STAGE ${rec + 1} に設定しました`, 'good'); go('#/c/' + c.id); };
        }, 0);
        return `<div class="card"><h3>🩺 診断結果</h3><table class="tbl"><tr><th>ステージ</th><th>正答率</th><th>判定</th></tr>${c.stages.map((st, i) => `<tr><td>STAGE ${i + 1} ${esc(st.title)}</td><td>${accs[i] == null ? '—' : pct(accs[i]) + '%'}</td><td>${accs[i] == null ? '—' : accs[i] >= 0.7 ? '<span class="tag good">基礎OK</span>' : '<span class="tag warn">ここを学ぶ</span>'}</td></tr>`).join('')}</table>
          <p>おすすめのスタート地点：<b>STAGE ${rec + 1}「${esc(c.stages[rec].title)}」</b></p><p class="muted small">正答率70%未満の最初のステージから始めるのが最も効率的です。それより前のステージもスキルマップからいつでも復習できます。</p>
          <button class="btn primary" id="applyDiag">このステージから始める</button></div>`;
      },
    });
  }
  function startDeck(c, d, all) {
    const st = cs(c.id).cards, t = dayNo();
    let items;
    if (all) items = shuffle(d.cards).slice(0, 20);
    else {
      const due = d.cards.filter((cd) => st[cd.id] && st[cd.id].due <= t);
      const fresh = d.cards.filter((cd) => !st[cd.id]).slice(0, S.settings.newCards);
      items = shuffle(due).concat(fresh);
    }
    startSession({
      title: d.title, mode: 'cards', items: items.map((card) => ({ kind: 'card', card, course: c.id })), back: c.id === READ_COURSE ? '#/words' : '#/c/' + c.id,
      emptyMsg: '今日のカードはすべて完了！', emptyHtml: `<p class="muted">次の復習日まで待つと記憶効率が最大になります。</p><p><a class="btn" href="#/c/${c.id}/deck/${d.id}/all">ランダム20枚で自主練</a> <a class="btn" href="#/c/${c.id}/deck/${d.id}/list">カード一覧</a></p>`,
    });
  }

  /* ---------- 多読ライブラリ ----------
   * readers/*.js で LearnApp.addReadings([...]) により登録する（README.md 参照）。
   * 1話 = { id, lv(1-5), title, ja, emoji, genre, sum, text:[段落...], gloss:[[本文の形, 見出し語, 意味] or [語, 意味]], phrases:[[本文の形, 意味]], qs:[{q,c,a,e}] }
   * 登場した単語・フレーズは英語コースの「多読の単語帳」に自動で入り、タップで復習に追加できる。 */
  App.readings = [];
  App.readingMap = {};
  const RLV = [null,
    { name: 'Lv1 はじめの一歩', hint: '中学1〜2年の語彙・〜200語' },
    { name: 'Lv2 やさしい', hint: '中学〜高1・230〜260語' },
    { name: 'Lv3 ふつう', hint: '高校・英検2級程度・300〜350語' },
    { name: 'Lv4 しっかり', hint: 'TOEIC 600〜800・350〜450語' },
    { name: 'Lv5 本格', hint: 'TOEIC 800+・論説/ニュース調・500語前後' },
  ];
  const READ_COURSE = 'english', READ_DECK = 'reading';
  const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const wordRe = (w) => new RegExp('(^|[^A-Za-z])(' + reEsc(w).replace(/\\\.\\\.\\\./g, '[^.]*?').replace(/\s+/g, '\\s+') + ')(?![A-Za-z])', 'i');
  const countWords = (t) => (t.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) || []).length;
  App.addReadings = function (list) {
    list.forEach((r) => {
      const R = { ...r };
      R.gloss = (r.gloss || []).map((g) => (g.length === 2 ? { form: g[0], head: g[0], mean: g[1] } : { form: g[0], head: g[1], mean: g[2] }));
      R.phrases = (r.phrases || []).map((p) => ({ form: p[0], head: p[2] || p[0], mean: p[1], phrase: true }));
      R.words = r.text.reduce((a, p) => a + countWords(p), 0);
      R.qs = (r.qs || []).map((q, i) => normQ(q, READ_COURSE, 'read-' + r.id, i));
      App.readings.push(R); App.readingMap[R.id] = R;
    });
  };
  // 全話を登録し終えたあとに「多読の単語帳」を作る：頻出（何話に出てくるか）順に並べる
  function buildReadingDeck() {
    const c = App.courseMap[READ_COURSE];
    if (!c || !App.readings.length || c.decks.some((d) => d.id === READ_DECK)) return;
    App.readings.sort((a, b) => a.lv - b.lv || a.words - b.words);
    const all = App.readings.map((r) => r.text.join('\n'));
    const map = {};
    App.readings.forEach((r) => r.gloss.concat(r.phrases).forEach((g) => {
      const k = g.head.toLowerCase();
      if (map[k]) { map[k].from.push(r.id); return; }
      const sent = (r.text.join(' ').match(/[^.!?"]*[.!?]/g) || []).find((x) => wordRe(g.form).test(x)) || '';
      map[k] = { f: g.head, b: g.mean, ex: sent.trim(), from: [r.id], phrase: !!g.phrase };
    }));
    const cards = Object.values(map).map((x) => {
      const re = wordRe(x.f);
      x.meet = all.filter((t, i) => re.test(t) || x.from.includes(App.readings[i].id)).length;
      return x;
    }).sort((a, b) => b.meet - a.meet);
    const deck = normDeck(c, { id: READ_DECK, title: '多読の単語帳（よく出る順）', say: true, hidden: true, desc: '多読ライブラリに出てくる単語・フレーズ。たくさんの話に登場する語ほど先に出題します。', cards });
    c.decks.push(deck);
    App.readings.forEach((r) => r.gloss.concat(r.phrases).forEach((g) => { g.card = c.cardMap[READ_DECK + ':' + map[g.head.toLowerCase()].f]; }));
  }
  const rst = (id) => (S.read[id] = S.read[id] || { n: 0 });
  function addCardToReview(cd) {
    const st = cs(READ_COURSE).cards;
    if (st[cd.id]) return false;
    st[cd.id] = { seen: 0, due: dayNo() }; save(); hud();
    return true;
  }
  const inReview = (cd) => !!cs(READ_COURSE).cards[cd.id];
  function readStats() {
    const done = App.readings.filter((r) => S.read[r.id] && S.read[r.id].n > 0);
    const w = done.map((r) => S.read[r.id].wpm).filter(Boolean).slice(-5);
    return { done: done.length, words: S.totals.readWords || 0, wpm: w.length ? Math.round(w.reduce((a, b) => a + b, 0) / w.length) : 0 };
  }
  function recommendStory() {
    const read = (r) => S.read[r.id] && S.read[r.id].n > 0;
    const lvRead = App.readings.filter(read).map((r) => r.lv);
    let lv = lvRead.length ? Math.max(...lvRead) : 1;
    for (; lv <= 5; lv++) { const r = App.readings.find((x) => x.lv === lv && !read(x)); if (r) return r; }
    return App.readings.find((x) => !read(x)) || null;
  }
  const MILES = [3000, 10000, 30000, 50000, 100000, 300000, 1000000];
  function storyCard(r) {
    const s = S.read[r.id];
    return `<a class="card story ${s && s.n ? 'done' : ''}" href="#/read/${r.id}"><div class="st-em">${r.emoji || '📄'}</div><div class="st-b">
      <div class="st-meta"><span class="tag rlv${r.lv}">Lv${r.lv}</span><span class="muted small">${r.words}語・${esc(r.genre || '')}</span></div>
      <b class="st-t">${esc(r.title)}</b><span class="muted small">${esc(r.ja || '')}</span>
      ${s && s.n ? `<span class="tag good">✔ 読了${s.n > 1 ? ' ×' + s.n : ''}${s.wpm ? ' ・' + s.wpm + ' WPM' : ''}</span>` : ''}</div></a>`;
  }
  function viewReadHub(filter) {
    const st = readStats(), next = MILES.find((m) => m > st.words) || MILES[MILES.length - 1], prev = MILES.filter((m) => m <= st.words).pop() || 0;
    const rec = recommendStory(), lv = +filter || 0;
    const list = App.readings.filter((r) => !lv || r.lv === lv);
    view().innerHTML = `${crumbs([['多読ライブラリ']])}
      <section class="hero read-hero"><div><h1>📚 多読ライブラリ</h1><p class="muted">やさしい英文を、たくさん、楽しく。${App.readings.length}話・合計 ${App.readings.reduce((a, r) => a + r.words, 0).toLocaleString()}語。わからない単語は<b>タップ</b>すれば意味が出ます。</p></div>
        <div class="stats"><div><b>${st.words.toLocaleString()}</b><span>累計語数</span></div><div><b>${st.done}/${App.readings.length}</b><span>読んだ話</span></div><div><b>${st.wpm || '–'}</b><span>最近の速さ WPM</span></div></div>
        <div class="mile"><div class="bar"><i style="width:${pct((st.words - prev) / (next - prev))}%"></i></div><span class="small muted">次の目標 ${next.toLocaleString()}語まで あと ${(next - st.words).toLocaleString()}語</span></div></section>
      ${rec ? `<div class="card rec"><h3>▶ 次のおすすめ</h3>${storyCard(rec)}</div>` : '<div class="card"><h3>🎉 全話読了！</h3><p>2周目は<b>音読</b>や<b>速読（WPM更新）</b>に挑戦すると、さらに力がつきます。</p></div>'}
      <details class="card"><summary><b>📏 多読の4つのルール</b> <span class="muted small">（クリックで開く）</span></summary><div class="lesson">
        <ol><li><b>辞書は引かない。</b>止まらずに最後まで読む。どうしても気になる語だけタップ。</li>
        <li><b>9割以上わかるレベルを選ぶ。</b>1ページに知らない語が5つ以上なら、1つ下のレベルへ。難しい文を少し読むより、やさしい文をたくさん読む方が速く伸びます。</li>
        <li><b>つまらなければやめていい。</b>楽しいことが一番の継続のコツ。</li>
        <li><b>毎日10分。</b>1話150〜550語。1日1話（平均約330語）で1か月約1万語、1年で10万語を超えます。</li></ol>
        ${D.flow([['読む', '止まらずに'], ['タップ', '気になる語だけ'], ['単語帳へ', '1タップで追加'], ['復習', '間隔反復'], ['再会', '別の話でまた出会う']], { cap: '多読と単語帳をつなぐ：出会った単語は、復習と「別の話での再会」で定着する' })}
      </div></details>
      <div class="chips lvfilter"><a class="btn ${!lv ? 'primary' : ''}" href="#/read">すべて</a>${[1, 2, 3, 4, 5].map((v) => `<a class="btn ${lv === v ? 'primary' : ''}" href="#/read/lv/${v}" title="${esc(RLV[v].hint)}">Lv${v}</a>`).join('')}</div>
      ${[1, 2, 3, 4, 5].filter((v) => !lv || v === lv).map((v) => { const rs = list.filter((r) => r.lv === v); return rs.length ? `<h2 class="sec">${RLV[v].name} <span class="muted small">${RLV[v].hint}</span></h2><div class="stories">${rs.map(storyCard).join('')}</div>` : ''; }).join('')}`;
  }
  function markText(r, para) {
    const items = r.phrases.concat(r.gloss).map((g, i) => ({ g, i, re: wordRe(g.form) }));
    let out = '', rest = para;
    // 段落内で各語の最初の出現だけ印をつける（長いフレーズ優先）
    const hits = [];
    items.sort((a, b) => b.g.form.length - a.g.form.length).forEach((it) => {
      const m = it.re.exec(para); if (!m) return;
      const s = m.index + m[1].length, e = s + m[2].length;
      if (hits.some((h) => s < h.e && e > h.s)) return;
      hits.push({ s, e, it });
    });
    hits.sort((a, b) => a.s - b.s);
    let pos = 0;
    hits.forEach((h) => { out += esc(para.slice(pos, h.s)) + `<mark class="gl ${h.it.g.phrase ? 'ph' : ''}" data-k="${r.phrases.concat(r.gloss).indexOf(h.it.g)}">${esc(para.slice(h.s, h.e))}</mark>`; pos = h.e; });
    rest = para.slice(pos);
    return out + esc(rest);
  }
  function glossPop(g, anchor) {
    let pop = $('#gpop');
    if (!pop) {
      pop = document.createElement('div'); pop.id = 'gpop'; document.body.appendChild(pop);
      document.addEventListener('click', (e) => { if (!pop.contains(e.target) && !e.target.closest('mark.gl')) pop.className = ''; });
      window.addEventListener('hashchange', () => (pop.className = ''));
    }
    const cd = g.card, meet = cd ? cd.meet || 1 : 1;
    pop.innerHTML = `<div class="gp-h"><b class="en">${esc(g.head)}</b><button class="btn ghost" data-say="${esc(g.head)}">🔊</button><button class="btn ghost gp-x" title="閉じる">✕</button></div>
      <div class="gp-m">${esc(g.mean)}</div>${g.form.toLowerCase() !== g.head.toLowerCase() ? `<div class="small muted">本文の形：${esc(g.form)}</div>` : ''}
      <div class="gp-f"><span class="small muted">📚 ${meet}話に登場</span>${cd ? `<button class="btn ${inReview(cd) ? '' : 'primary'}" id="gpadd" ${inReview(cd) ? 'disabled' : ''}>${inReview(cd) ? '✔ 単語帳に追加済み' : '＋ 単語帳に追加'}</button>` : ''}</div>`;
    pop.className = 'show';
    const rc = anchor.getBoundingClientRect();
    if (window.innerWidth > 760) { pop.style.left = Math.min(document.documentElement.clientWidth - 336, Math.max(10, rc.left)) + 'px'; pop.style.top = (rc.bottom + window.scrollY + 6) + 'px'; }
    else { pop.style.left = ''; pop.style.top = ''; }
    decorate(pop);
    $('.gp-x', pop).onclick = () => (pop.className = '');
    const add = $('#gpadd', pop);
    if (add) add.onclick = () => { addCardToReview(cd); anchor.classList.add('added'); toast('📥 単語帳に追加しました（今日の復習に出ます）', 'good'); glossPop(g, anchor); };
  }
  function sayAll(paras, from = 0, to = paras.length) {
    if (!('speechSynthesis' in window)) { toast('この環境では音声読み上げが使えません'); return; }
    speechSynthesis.cancel();
    $$('.rd-p').forEach((el) => el.classList.remove('reading'));
    const v = pickVoice(), list = paras.slice(from, to);
    list.forEach((p, k) => {
      const u = new SpeechSynthesisUtterance(p); u.lang = 'en-US'; u.rate = S.settings.rate; if (v) u.voice = v;
      u.onstart = () => { $$('.rd-p').forEach((el, i) => el.classList.toggle('reading', i === from + k)); };
      u.onend = () => { if (k === list.length - 1) $$('.rd-p').forEach((el) => el.classList.remove('reading')); };
      speechSynthesis.speak(u);
    });
  }
  function viewStory(r) {
    const s = S.read[r.id], i = App.readings.indexOf(r), nx = App.readings[i + 1];
    const all = r.phrases.concat(r.gloss), t0 = Date.now();
    view().innerHTML = `${crumbs([['多読ライブラリ', '#/read'], [r.title]])}
      <article class="card reader">
        <div class="rd-meta"><span class="tag rlv${r.lv}">Lv${r.lv}</span><span class="muted small">${r.words}語・目安 ${Math.max(1, Math.round(r.words / 100))}分・${esc(r.genre || '')}</span>${s && s.n ? `<span class="tag good">✔ 読了 ×${s.n}${s.wpm ? '（前回 ' + s.wpm + ' WPM）' : ''}</span>` : ''}</div>
        <h1 class="rd-title en">${r.emoji || ''} ${esc(r.title)}</h1>
        <div class="rd-tools"><button class="btn" id="playall">🔊 全文を聞く</button><button class="btn ghost" id="stopall">⏹ 停止</button><span class="muted small">⏱ 計測中… 読み終わったら下のボタン。<mark class="gl">点線の語</mark>はタップで意味。</span></div>
        <div class="rd-text en">${r.text.map((p, k) => `<p class="rd-p" data-k="${k}">${markText(r, p)}<button class="say-btn rd-say" data-k="${k}" title="この段落を読み上げ">🔊</button></p>`).join('')}</div>
        <div class="actions center" id="rdfin"><button class="btn primary big" id="finish">読み終わった！</button></div>
        <div id="rdafter"></div>
      </article>`;
    $$('.rd-text mark.gl').forEach((m) => {
      const g = all[+m.dataset.k];
      if (g.card && inReview(g.card)) m.classList.add('added');
      m.onclick = (e) => { e.stopPropagation(); glossPop(g, m); };
    });
    $$('.rd-say').forEach((b) => (b.onclick = (e) => { e.stopPropagation(); const k = +b.dataset.k; sayAll(r.text, k, k + 1); }));
    $('#playall').onclick = () => sayAll(r.text);
    $('#stopall').onclick = () => { if ('speechSynthesis' in window) speechSynthesis.cancel(); $$('.rd-p').forEach((el) => el.classList.remove('reading')); };
    $('#finish').onclick = () => {
      const min = (Date.now() - t0) / 60000, wpm = min > 0.2 ? Math.round(r.words / min) : 0;
      const x = rst(r.id), first = !x.n;
      x.n++; x.last = dayNo(); if (wpm && wpm < 600) { x.wpm = wpm; x.best = Math.max(x.best || 0, wpm); }
      S.totals.reads = (S.totals.reads || 0) + 1; S.totals.readWords = (S.totals.readWords || 0) + r.words;
      const gain = (first ? 10 : 5) + Math.round(r.words / 40); addXP(gain); checkBadges(); save();
      $('#rdfin').innerHTML = '';
      const speed = !wpm ? '' : wpm < 80 ? 'まずは止まらずに読み切ることが大事。慣れると自然に速くなります。' : wpm < 130 ? '良いペース。このレベルを何話か読むと、さらに速くなります。' : wpm < 200 ? '速い！ 内容も分かっていれば、1つ上のレベルに進む目安です。' : 'ネイティブの黙読に近い速さ。理解度チェックも満点なら上のレベルへ。';
      $('#rdafter').innerHTML = `<div class="card rd-res pop"><h2>📖 読了！ +${gain} XP</h2>
        <div class="stats"><div><b>${wpm && wpm < 600 ? wpm : '–'}</b><span>WPM（1分あたりの語数）</span></div><div><b>${r.words}</b><span>今回の語数</span></div><div><b>${S.totals.readWords.toLocaleString()}</b><span>累計語数</span></div></div>
        ${speed ? `<p class="muted">${speed}</p>` : ''}</div>
        ${r.qs.length ? `<h2 class="sec">✋ 理解チェック</h2><div id="rdqs"></div>` : ''}
        ${r.sum ? `<details class="card"><summary><b>📝 あらすじ（日本語）</b> <span class="muted small">読み終わってから確認</span></summary><p>${esc(r.sum)}</p></details>` : ''}
        <h2 class="sec">🔤 この話の単語・フレーズ <span class="muted small">📚＝ライブラリ全体で登場する話の数（多いほど優先して覚える）</span></h2>
        <div class="card"><div class="actions"><button class="btn primary" id="addall">＋ まだの語を全部 単語帳に追加</button><a class="btn" href="#/words">🔤 単語ジムへ</a></div>
        <table class="tbl"><tr><th>単語・フレーズ</th><th>意味</th><th>📚</th><th></th></tr>${all.slice().sort((a, b) => ((b.card && b.card.meet) || 0) - ((a.card && a.card.meet) || 0)).map((g) => `<tr><td><span class="say en">${esc(g.head)}</span>${g.phrase ? ' <span class="tag">フレーズ</span>' : ''}</td><td>${esc(g.mean)}</td><td>${g.card ? g.card.meet : 1}</td><td>${g.card ? `<button class="btn small-btn addone" data-id="${esc(g.card.id)}" ${inReview(g.card) ? 'disabled' : ''}>${inReview(g.card) ? '✔' : '＋'}</button>` : ''}</td></tr>`).join('')}</table></div>
        <div class="card"><h3>🔁 もう一度読むなら</h3><p class="muted">2回目は<b>音読</b>がおすすめ。🔊で聞いてから、同じスピードで声に出して読むと、語順のまま理解する力と発音が同時に伸びます。</p></div>
        <div class="actions center"><a class="btn" href="#/read">📚 ライブラリへ</a>${nx ? `<a class="btn primary" href="#/read/${nx.id}">次の話：${esc(nx.title)} →</a>` : ''}</div>`;
      decorate($('#rdafter'));
      const qbox = $('#rdqs');
      if (qbox) r.qs.forEach((q) => { const el = document.createElement('div'); el.className = 'card inq'; qbox.appendChild(el); inlineQ(q, el, () => {}); $('.inq-h', el).textContent = '✋ 内容を覚えているかな？'; });
      const refresh = () => $$('.addone').forEach((b) => { const cd = cardById(b.dataset.id); if (cd && inReview(cd)) { b.disabled = true; b.textContent = '✔'; } });
      $$('.addone').forEach((b) => (b.onclick = () => { addCardToReview(cardById(b.dataset.id)); refresh(); }));
      $('#addall').onclick = () => { const n = all.filter((g) => g.card && addCardToReview(g.card)).length; refresh(); toast(n ? `📥 ${n}語を単語帳に追加しました` : 'すべて追加済みです', 'good'); };
      $('#rdafter').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
  }
  const cardById = (id) => App.courseMap[READ_COURSE].cardMap[id];

  /* ---------- 単語ジム（語彙の全体像と作戦） ---------- */
  const DECK_ORDER = ['core-v', 'core-a', 'core-n', 'core-talk', 'toeic600', 'toeic', 'core-b', 'toeic730', 'toeic860', 'phrasal', 'core-ac', 'roots', 'tech', 'biz', READ_DECK];
  function vocabDecks() {
    const c = App.courseMap[READ_COURSE];
    if (!c) return [];
    return c.decks.filter((d) => d.id !== 'keys').sort((a, b) => (DECK_ORDER.indexOf(a.id) + 1 || 99) - (DECK_ORDER.indexOf(b.id) + 1 || 99));
  }
  function wordStats() {
    const c = App.courseMap[READ_COURSE];
    if (!c) return { total: 0, learned: 0, seen: 0 };
    const st = cs(READ_COURSE).cards, uniq = {};
    vocabDecks().forEach((d) => d.cards.forEach((cd) => {
      const k = cd.f.toLowerCase(), s = st[cd.id], v = !s ? 0 : (s.reps || 0) >= 2 ? 2 : s.seen ? 1 : 0;
      uniq[k] = Math.max(uniq[k] || 0, v);
    }));
    const vals = Object.values(uniq);
    return { total: vals.length, learned: vals.filter((v) => v === 2).length, seen: vals.filter((v) => v >= 1).length };
  }
  function viewWords() {
    const c = App.courseMap[READ_COURSE];
    if (!c) return notFound();
    const ws = wordStats(), st = cs(READ_COURSE).cards, t = dayNo();
    const due = Object.keys(st).filter((id) => c.cardMap[id] && st[id].due != null && st[id].due <= t).length;
    const row = (d) => {
      const n = d.cards.length, l = d.cards.filter((cd) => st[cd.id] && (st[cd.id].reps || 0) >= 2).length, sn = d.cards.filter((cd) => st[cd.id]).length, dd = d.cards.filter((cd) => st[cd.id] && st[cd.id].due <= t).length;
      return `<div class="deck-row"><div class="dr-b"><b>${esc(d.title)}</b><span class="muted small">${esc(d.desc || '')}</span><div class="bar"><i style="width:${pct(l / n)}%"></i></div><span class="small muted">定着 ${l}/${n}・学習中 ${sn - l}${dd ? `・<b class="warn">今日の復習 ${dd}</b>` : ''}</span></div>
        <div class="dr-a"><a class="btn primary" href="#/c/${c.id}/deck/${d.id}">学習</a><a class="btn ghost" href="#/c/${c.id}/deck/${d.id}/list">一覧</a></div></div>`;
    };
    view().innerHTML = `${crumbs([['単語ジム']])}
      <section class="hero"><div><h1>🔤 単語ジム</h1><p class="muted">覚える → 出会う → 思い出す。この3つを回すと、単語は「知っている」から「使える」に変わります。</p></div>
        <div class="stats"><div><b>${ws.total}</b><span>収録語数</span></div><div><b>${ws.learned}</b><span>定着した語</span></div><div><b>${ws.seen - ws.learned}</b><span>学習中</span></div><div><b>${due}</b><span>今日の復習</span></div></div>
        <div class="actions">${due ? `<a class="btn primary big" href="#/c/${c.id}/review">🔁 今日の復習 ${due}件</a>` : ''}<a class="btn ${due ? '' : 'primary big'}" href="#/c/${c.id}/deck/${(vocabDecks().find((d) => d.cards.some((cd) => !st[cd.id])) || vocabDecks()[0]).id}">＋ 新しい単語を覚える</a><a class="btn" href="#/read">📚 多読で単語に出会う</a></div></section>
      <details class="card" ${ws.seen < 30 ? 'open' : ''}><summary><h2 style="display:inline">🧠 単語を「速く・大量に」覚える作戦</h2> <span class="muted small">（クリックで開閉）</span></summary><div class="lesson">
        <p>単語力は才能ではなく<b>やり方</b>で決まります。ポイントは5つ。</p>
        <h3>① よく出る語から覚える（効率の作戦）</h3>
        <p>英語の文章は、ごく一部の頻出語でほとんどができています。下は目安（研究や数え方で数字は変わります）。<b>最初の2000語で、ふつうの英文の大部分が読める</b>ようになります。だからこのジムは、<b>コア①〜⑥ → TOEIC → 専門</b>の順に並べています。</p>
        ${D.bars([['1000語', 75], ['2000語', 85], ['4000語', 95], ['8000語', 98, 1]], { unit: '%', max: 100, title: '知っている語数と、英文中の語のカバー率（目安）', cap: '98%（知らない語が50語に1つ）を超えると、辞書なしで楽しく読める' })}
        <h3>② 見るより「思い出す」（記憶の作戦）</h3>
        <p>カードは裏返す<b>前に</b>、意味を口に出してから確かめます。思い出そうとする瞬間に記憶が強くなります。眺めるだけの復習は、やった気になるだけで残りません。</p>
        <h3>③ 忘れかけた頃に復習（間隔反復）</h3>
        <p>このアプリは「もう一度／難しい／覚えてた／簡単」の答えで次の出題日を自動で決めます。1日 <b>新しい語15個＋復習</b>（約15分）で、<b>1か月で約450語、1年で約5000語</b>のペースです（新しい語の数は設定で変えられます）。</p>
        ${D.cycle([['覚える', 'カード（新しい語）'], ['出会う', '多読で文の中で'], ['集める', 'タップ→単語帳へ'], ['思い出す', '間隔反復で復習']], { center: '単語が定着するサイクル', cap: '1回で覚えようとしない。何度も「出会い直す」仕組みで覚える' })}
        <h3>④ 文の中で出会い直す（多読の作戦）</h3>
        <p>単語は<b>6〜10回以上</b>いろいろな文で出会うと定着すると言われます。多読ライブラリの話には、コアの頻出語やフレーズが何度も出てくるように書いてあります。気になった語は<b>タップ → 単語帳に追加</b>。カードで覚えた語に、物語の中で再会できます。</p>
        <h3>⑤ 部品とセットで覚える（推測の作戦）</h3>
        <p>「in（中を）＋spect（見る）＝inspect」のように部品で覚えると、知らない単語の意味も推測できます（語根カード）。また make a decision のように<b>相性のいい語とセット</b>で覚えると、話すときにすぐ出てきます。</p>
        <div class="callout">📅 <b>おすすめの1日（約25分）</b>：① 今日の復習 → ② 新しい語15個 → ③ 多読1話（気になる語を追加）</div>
      </div></details>
      <h2 class="sec">単語帳 <span class="muted small">上から順に進めるのがおすすめ（よく出る順）</span></h2>
      <div class="card">${vocabDecks().map(row).join('')}</div>`;
    decorate(view());
  }

  /* ---------- 設定 ---------- */
  function viewSettings() {
    const voices = 'speechSynthesis' in window ? speechSynthesis.getVoices().filter((v) => /^en/i.test(v.lang)) : [];
    const nU = App.courses.reduce((a, c) => a + c.units.length, 0), nQ = App.courses.reduce((a, c) => a + Object.keys(c.qMap).length, 0), nC = App.courses.reduce((a, c) => a + Object.keys(c.cardMap).length, 0);
    const opt = (v, cur, label) => `<option value="${v}" ${String(cur) === String(v) ? 'selected' : ''}>${label}</option>`;
    view().innerHTML = `<h1>設定</h1>
      <div class="card"><h3>学習</h3>
        <label class="field">1日の目標XP <select id="goal">${[30, 60, 100, 150, 200, 300].map((x) => opt(x, S.settings.dailyGoal, `${x} XP（目安 ${Math.round(x / 3)}分）`)).join('')}</select></label>
        <label class="field">1回の新しいカード枚数 <select id="newc">${[5, 10, 15, 20, 30, 50].map((x) => opt(x, S.settings.newCards, x + '枚')).join('')}</select></label></div>
      <div class="card"><h3>表示</h3><label class="field">テーマ <select id="theme">${opt('auto', S.settings.theme, '端末に合わせる')}${opt('light', S.settings.theme, 'ライト')}${opt('dark', S.settings.theme, 'ダーク')}</select></label></div>
      <div class="card"><h3>英語音声</h3>
        <label class="field">話す速さ <input type="range" id="rate" min="0.6" max="1.3" step="0.05" value="${S.settings.rate}"> <span id="rateV">${S.settings.rate}</span></label>
        <label class="field">音声 <select id="voice">${opt('', S.settings.voice, '自動（おすすめ）')}${voices.map((v) => opt(esc(v.name), S.settings.voice, esc(v.name + ' (' + v.lang + ')'))).join('')}</select></label>
        <button class="btn" data-say="This is a sample sentence for listening practice.">🔊 試聴</button>
        <p class="muted small">Microsoft Edge の「Natural」音声が最も自然です。音声が出ない場合は Edge か Chrome で開いてください。</p></div>
      <div class="card" id="pwaCard"></div>
      <div class="card"><h3>データ（学習記録）</h3><p class="muted small">記録はこのブラウザ内に保存されています。ブラウザのデータ削除で消えるため、定期的にバックアップしてください。別のPCへの引っ越しにも使えます。</p>
        <div class="actions"><button class="btn" id="exp">バックアップを保存</button><label class="btn">バックアップから復元<input type="file" id="imp" accept=".json" hidden></label><button class="btn bad" id="reset">記録をすべてリセット</button></div></div>
      <div class="card"><h3>このアプリについて</h3><p class="small muted">コース ${App.courses.length}・ユニット ${nU}・問題 ${nQ}・カード ${nC}<br>新しいコースは courses フォルダにファイルを追加し、index.html に1行足すだけで増やせます（README.md 参照）。</p></div>`;
    decorate(view());
    if (App.pwa) App.pwa.paint();
    $('#goal').onchange = (e) => { S.settings.dailyGoal = +e.target.value; save(); hud(); };
    $('#newc').onchange = (e) => { S.settings.newCards = +e.target.value; save(); };
    $('#theme').onchange = (e) => { S.settings.theme = e.target.value; save(); applyTheme(); };
    $('#rate').oninput = (e) => { S.settings.rate = +e.target.value; $('#rateV').textContent = e.target.value; save(); };
    $('#voice').onchange = (e) => { S.settings.voice = e.target.value; save(); };
    $('#exp').onclick = () => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' }));
      a.download = `learnapp-backup-${dayStr(dayNo())}.json`; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    };
    $('#imp').onchange = (e) => {
      const f = e.target.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = () => { try { const d = JSON.parse(r.result); if (typeof d.xp !== 'number' || !d.courses) throw new Error(); localStorage.setItem(KEY, JSON.stringify(d)); location.reload(); } catch (err) { toast('バックアップファイルを読み込めませんでした', 'bad'); } };
      r.readAsText(f);
    };
    $('#reset').onclick = () => { if (confirm('すべての学習記録を消去します。元に戻せません。よろしいですか？')) { localStorage.removeItem(KEY); location.reload(); } };
  }
  function applyTheme() { const t = S.settings.theme; if (t === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', t); }
  function notFound() { view().innerHTML = '<div class="card empty"><h2>ページが見つかりません</h2><a class="btn primary" href="#/">ホームへ</a></div>'; }

  /* ---------- ルーター ---------- */
  function route() {
    clearInterval(timer); keyFn = null; SES = null;
    leaveFns.splice(0).forEach((f) => { try { f(); } catch (e) { console.warn(e); } });
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    const p = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
    $$('.top nav a').forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#/' + (p[0] || '')));
    window.scrollTo(0, 0);
    if (!p.length) viewHome();
    else if (p[0] === 'review') startSession({ title: '総合復習', mode: 'practice', items: dueItems(App.courses).slice(0, 50), back: '#/', emptyMsg: '今日の復習はすべて完了しています 🎉' });
    else if (p[0] === 'settings') viewSettings();
    else if (p[0] === 'read' && !p[1]) viewReadHub();
    else if (p[0] === 'read' && p[1] === 'lv') viewReadHub(p[2]);
    else if (p[0] === 'read' && App.readingMap[p[1]]) viewStory(App.readingMap[p[1]]);
    else if (p[0] === 'words') viewWords();
    else if (App.routes[p[0]]) App.routes[p[0]](p.slice(1));
    else if (p[0] === 'c' && App.courseMap[p[1]]) {
      const c = App.courseMap[p[1]], u = c.unitMap[p[3]], back = '#/c/' + c.id;
      const needSetup = p[2] && !['setup', 'deck', 'review'].includes(p[2]) && !cs(c.id).setup;
      if (needSetup) viewSetup(c);
      else if (!p[2]) viewCourse(c);
      else if (p[2] === 'setup') viewSetup(c);
      else if (p[2] === 'u' && u) viewUnit(c, u);
      else if (p[2] === 'l' && u) viewLesson(c, u, +p[4] || 0);
      else if (p[2] === 'practice' && u) {
        const cst = cs(c.id);
        const lvm = /^lv([123])$/.exec(p[4] || '');
        const qs = p[4] === 'weak' ? u.questions.filter((q) => cst.q[q.id] && strength(cst.q[q.id]) < 0.75) : lvm ? u.questions.filter((q) => q.lv === +lvm[1]) : u.questions;
        startSession({ title: (p[4] === 'weak' ? '苦手克服：' : lvm ? LV[+lvm[1]] + '：' : '練習：') + u.title, mode: 'practice', items: qItems(practiceOrder(c, qs)), back: `#/c/${c.id}/u/${u.id}` });
      } else if (p[2] === 'unittest' && u) {
        startSession({
          title: '習得認定：' + u.title, mode: 'exam', items: qItems(shuffle(u.questions.filter((q) => q.type !== 'speak'))), back: `#/c/${c.id}/u/${u.id}`,
          onFinish: (s, acc) => {
            if (acc >= 0.9) {
              const was = cs(c.id).crowns[u.id]; cs(c.id).crowns[u.id] = dayNo(); save();
              if (!was) { setTimeout(() => confetti(110), 100); return '<div class="card crown-get">👑 習得認定 合格！王冠を獲得しました</div>'; }
              return '<div class="card crown-get">👑 認定を更新しました</div>';
            }
            return '<div class="card">認定まであと少し（合格ライン 90%）。「苦手だけ」で練習してから再挑戦しよう。</div>';
          },
        });
      } else if (p[2] === 'review') startSession({ title: c.title + ' の復習', mode: 'practice', items: dueItems([c]).slice(0, 40), back, emptyMsg: 'このコースの今日の復習は完了しています 🎉' });
      else if (p[2] === 'exam' && c.exams.find((e) => e.id === p[3])) startExam(c, c.exams.find((e) => e.id === p[3]));
      else if (p[2] === 'diag') startDiag(c);
      else if (p[2] === 'mix') startMix(c);
      else if (p[2] === 'notebook' && p[3] === 'practice') {
        const cst = cs(c.id);
        const qs = Object.keys(cst.q).map((id) => c.qMap[id]).filter((q) => q && cst.q[q.id].ng > 0 && strength(cst.q[q.id]) < 0.75);
        startSession({ title: '間違いノートの解き直し', mode: 'practice', items: qItems(shuffle(qs).slice(0, 30)), back: `#/c/${c.id}/notebook`, emptyMsg: '克服中の問題はありません 🎉' });
      } else if (p[2] === 'notebook') viewNotebook(c);
      else if (p[2] === 'm' && u && u.missions[+p[4]]) viewMission(c, u, u.missions[+p[4]]);
      else if (p[2] === 'deck' && c.decks.find((d) => d.id === p[3])) {
        const d = c.decks.find((x) => x.id === p[3]);
        if (p[4] === 'list') viewDeckList(c, d); else startDeck(c, d, p[4] === 'all');
      } else notFound();
    } else notFound();
    hud();
  }

  /* ---------- 拡張モジュール用の道具箱（js/speed.js などが使う） ---------- */
  App.routes = {};
  const leaveFns = [];
  App.kit = {
    get S() { return S; }, save, addXP, checkBadges, toast, confetti, ring, decorate, inlineQ, crumbs, go, view,
    $, $$, esc, shuffle, pct, clamp, dayNo, dayStr, BADGES, pickVoice,
    setKey: (fn) => { keyFn = fn; },
    onLeave: (fn) => leaveFns.push(fn),
  };

  App.start = function () {
    buildReadingDeck();
    applyTheme();
    if ('speechSynthesis' in window) speechSynthesis.getVoices();
    window.addEventListener('hashchange', route);
    route();
  };
})();
