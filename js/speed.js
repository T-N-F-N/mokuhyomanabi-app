/* =========================================================
 * 速読ジム — 速読トレーニング一式（#/speed）
 * 練習文は speed/*.js で LearnApp.addSpeedTexts([...]) により登録する（README.md 参照）。
 * 英語の多読ライブラリ（readers/*.js）の話も、そのまま練習文として使える。
 * ========================================================= */
(function () {
  'use strict';
  const App = window.LearnApp, K = App.kit, D = App.D;
  const { $, $$, esc, shuffle, clamp, dayNo, dayStr } = K;
  const view = () => K.view();

  /* ---------- 練習文の登録 ---------- */
  App.speedTexts = [];
  App.speedTextMap = {};
  const jaLen = (s) => String(s).replace(/\s/g, '').length;
  const normQ = (q) => ({ type: 'mc', q: q.q, choices: q.c || q.choices, answer: q.a != null ? q.a : q.answer, explain: q.e || q.explain || '' });
  App.addSpeedTexts = function (list) {
    list.forEach((t) => {
      const T = { ...t, lang: 'ja', unit: '字', paras: t.body, size: t.body.reduce((a, p) => a + jaLen(p), 0) };
      T.q = (t.q || []).map(normQ); T.g = (t.g || []).map(normQ); T.sc = t.sc || []; T.kw = t.kw || []; T.nk = t.nk || [];
      App.speedTexts.push(T); App.speedTextMap['ja:' + t.id] = T;
    });
  };
  // 英語の多読ライブラリを練習文として使う形にそろえる
  let enDone = false;
  function enTexts() {
    if (enDone) return;
    enDone = true;
    const heads = (r) => r.gloss.map((g) => g.form);
    (App.readings || []).forEach((r) => {
      const others = shuffle([].concat(...App.readings.filter((x) => x !== r).map(heads))).filter((w) => !new RegExp('\\b' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i').test(r.text.join(' ')));
      const T = { id: r.id, title: r.title, genre: '英語 Lv' + r.lv, lv: r.lv, lang: 'en', unit: '語', paras: r.text, size: r.words, q: r.qs, g: r.qs.slice(0, 2), sc: [], kw: shuffle(heads(r)).slice(0, 6), nk: [...new Set(others)].slice(0, 6), emoji: r.emoji };
      App.speedTexts.push(T); App.speedTextMap['en:' + r.id] = T;
    });
  }
  const key = (t) => t.lang + ':' + t.id;
  const textsOf = (lang, need) => { enTexts(); return App.speedTexts.filter((t) => t.lang === lang && (!need || need(t))); };

  /* ---------- 記録 ---------- */
  const CAP = { ja: 3000, en: 900 }; // ふつうに読んだとは考えにくい速さ（ベースラインに使わない）
  const REF = { ja: 500, en: 150 }; // 基準（測定前の仮の値）：日本語 字/分・英語 語/分
  function SP() {
    const S = K.S;
    const x = (S.speed = S.speed || {});
    x.base = x.base || {}; x.log = x.log || []; x.best = x.best || {}; x.books = x.books || []; x.outs = x.outs || []; x.used = x.used || {};
    return x;
  }
  const base = (lang) => (SP().base[lang] && SP().base[lang].eff) || REF[lang];
  const hasBase = (lang) => !!SP().base[lang];
  const mult = (v, lang) => Math.round((v / base(lang)) * 10) / 10;
  const unitOf = (lang) => (lang === 'en' ? '語/分' : '字/分');
  function rec(kind, lang, v, extra = {}) {
    const x = SP(), e = { d: dayNo(), k: kind, l: lang, v: Math.round(v), ...extra };
    x.log.push(e); if (x.log.length > 800) x.log.splice(0, x.log.length - 800);
    const bk = kind + ':' + lang, better = !x.best[bk] || e.v > x.best[bk].v;
    if (better) x.best[bk] = e;
    if (extra.tid) x.used[kind + ':' + extra.tid] = (x.used[kind + ':' + extra.tid] || 0) + 1;
    K.save(); K.checkBadges();
    return better;
  }
  const best = (kind, lang) => SP().best[kind + ':' + lang];
  const bestOf = (kinds, lang) => kinds.map((k) => best(k, lang)).filter(Boolean).sort((a, b) => b.v - a.v)[0];
  const today = (kind) => SP().log.some((e) => e.k === kind && e.d === dayNo());
  // 3つの倍率：精読（ふつうに読んで理解）・把握（要点をつかむ）・探索（必要な情報を探す）
  const METRICS = [
    ['seido', '精読速度', ['measure', 'pacer'], '理解度つきで「全部読む」速さ。科学的に最も伸ばしにくい。現実的な目標は1.5〜3倍。'],
    ['haaku', '把握速度', ['skim', 'multi'], '要点・構造をつかむ速さ。目的を絞って読み飛ばすので 5〜20倍が狙える。'],
    ['tansaku', '探索速度', ['scan'], '必要な情報を探し当てる速さ。全文を読まないので 10〜100倍以上になる。'],
  ];

  K.BADGES.push(
    ['sp1', '⚡', '速読デビュー', '速読ジムで現在地を測定', () => !!(K.S.speed && K.S.speed.base && Object.keys(K.S.speed.base).length)],
    ['sp2x', '🏃', '精読2倍', '精読速度がベースラインの2倍', () => spMult('seido') >= 2],
    ['sp10x', '🚄', '把握10倍', '把握速度がベースラインの10倍', () => spMult('haaku') >= 10],
    ['sp100x', '🚀', '探索100倍', '探索速度がベースラインの100倍', () => spMult('tansaku') >= 100],
    ['spb1', '📕', '1冊を回し読み', '実書籍トレーニングで1冊完了', () => !!(K.S.speed && K.S.speed.books && K.S.speed.books.length >= 1)],
    ['spb10', '📚', '10冊突破', '実書籍トレーニングで10冊', () => !!(K.S.speed && K.S.speed.books && K.S.speed.books.length >= 10)],
    ['spo30', '✍', 'アウトプット30', '1分アウトプットを30回', () => !!(K.S.speed && K.S.speed.outs && K.S.speed.outs.length >= 30)],
  );
  function spMult(m) {
    if (!K.S.speed) return 0;
    const M = METRICS.find((x) => x[0] === m);
    return Math.max(0, ...['ja', 'en'].filter(hasBase).map((l) => { const b = bestOf(M[2], l); return b ? b.v / base(l) : 0; }));
  }

  /* ---------- タイマー管理（画面を離れたら必ず止める） ---------- */
  let tids = [], raf = 0;
  const later = (f, ms) => { const id = setTimeout(f, ms); tids.push(id); return id; };
  const every = (f, ms) => { const id = setInterval(f, ms); tids.push(id); return id; };
  function stopAll() { tids.forEach((id) => { clearTimeout(id); clearInterval(id); }); tids = []; cancelAnimationFrame(raf); K.setKey(null); }
  const sec = (ms) => (ms / 1000).toFixed(1) + '秒';
  const fmt = (n) => Math.round(n).toLocaleString();

  /* ---------- 画面の枠 ---------- */
  function page(title, inner, lead) {
    stopAll();
    view().innerHTML = `${K.crumbs([['速読ジム', '#/speed'], [title]])}<div class="card sp-wrap"><h1>${title}</h1>${lead ? `<p class="muted">${lead}</p>` : ''}<div id="spbody">${inner}</div></div>`;
    window.scrollTo(0, 0);
    return $('#spbody');
  }
  const opt = (v, cur, label) => `<option value="${esc(v)}" ${String(cur) === String(v) ? 'selected' : ''}>${esc(label)}</option>`;
  function textSelect(kind, lang, need) {
    const ts = textsOf(lang, need), used = SP().used;
    const fresh = ts.filter((t) => !used[kind + ':' + key(t)]);
    const pick = (fresh.length ? fresh : ts)[0];
    return `<label class="field">練習文 <select id="tsel">${ts.map((t) => opt(key(t), pick && key(pick), `${used[kind + ':' + key(t)] ? '✔ ' : ''}${t.title}（${t.size}${t.unit}・${t.genre || ''}）`)).join('')}</select></label>`;
  }
  const langTabs = (kind, lang, onlyJa) => onlyJa ? '' : `<div class="lvfilter">${['ja', 'en'].map((l) => `<a class="tag ${l === lang ? 'key' : ''}" href="#/speed/${kind}/${l}">${l === 'ja' ? '日本語' : '英語（多読ライブラリ）'}</a>`).join('')}</div>`;
  const selText = () => App.speedTextMap[$('#tsel').value];
  function countdown(box, then) {
    let n = 3;
    box.innerHTML = `<div class="sp-count">${n}</div>`;
    every(function f() { n--; if (n > 0) box.innerHTML = `<div class="sp-count">${n}</div>`; }, 600);
    later(() => { stopAll(); then(); }, 1800);
  }
  function textHtml(t, cls = '') { return `<div class="sp-text ${t.lang === 'en' ? 'en' : ''} ${cls}">${t.paras.map((p) => `<p>${esc(p)}</p>`).join('')}</div>`; }

  // 四択クイズ（まとめて表示し、全部答えたら done(正答数, 問題数)）
  function mcQuiz(box, qs, done, head) {
    if (!qs.length) { done(0, 0); return; }
    let left = qs.length, ok = 0;
    box.innerHTML = (head ? `<h3>${head}</h3>` : '') + qs.map((q, i) => `<div class="inq sp-q" data-i="${i}"><div class="q-text">Q${i + 1}. ${q.q}</div><div class="choices">${shuffle(q.choices.map((_, ci) => ci)).map((ci, n) => `<button class="choice" data-ci="${ci}"><span class="key">${n + 1}</span><span>${q.choices[ci]}</span></button>`).join('')}</div><div class="iq-fb"></div></div>`).join('');
    $$('.sp-q', box).forEach((el) => {
      const q = qs[+el.dataset.i];
      $$('.choice', el).forEach((b) => (b.onclick = () => {
        if (el.dataset.locked) return;
        el.dataset.locked = 1;
        const ci = +b.dataset.ci, right = ci === q.answer;
        $$('.choice', el).forEach((x) => { x.disabled = true; if (+x.dataset.ci === q.answer) x.classList.add('right'); });
        if (!right) b.classList.add('wrong'); else ok++;
        $('.iq-fb', el).innerHTML = `<div class="fb ${right ? 'ok' : 'ng'}"><div class="fb-h">${right ? '✔ 正解' : '✘ 正解は「' + q.choices[q.answer] + '」'}</div>${q.explain ? `<div class="explain">${q.explain}</div>` : ''}</div>`;
        if (--left === 0) done(ok, qs.length);
      }));
    });
  }
  const outBtn = (t) => `<a class="btn" href="#/speed/output/${encodeURIComponent(key(t))}">✍ 1分アウトプット</a>`;
  function resultCard(rows, msg, t, again) {
    return `<div class="card sp-res pop"><div class="stats">${rows.map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join('')}</div>${msg ? `<p>${msg}</p>` : ''}
      <div class="actions center">${again ? `<button class="btn primary" id="again">もう一度</button>` : ''}${t ? outBtn(t) : ''}<a class="btn" href="#/speed">⚡ ジムへ戻る</a></div></div>`;
  }
  const multTag = (v, lang) => `<span class="tag ${mult(v, lang) >= 2 ? 'gold' : ''}">×${mult(v, lang)}</span>`;

  /* =========================================================
   * ハブ（ダッシュボード）
   * ========================================================= */
  const TRAINERS = [
    ['計測', [
      ['measure', '📏', '速度測定', 'ふつうに読んで理解度クイズ。実効速度＝速さ×理解度。すべての基準になる。'],
    ]],
    ['① 目と視野（SRS式の視読の土台）', [
      ['eye', '👀', '視点移動', '点を目だけで追う。行替え・ジャンプを速く正確に。反応チェック付き。'],
      ['schulte', '🔢', 'シュルツテーブル', '中央を見たまま 1→25 を順に探す。周辺視野と集中力。'],
      ['span', '↔️', '視幅拡大・瞬間数字', '一瞬だけ出る左右の文字／長い数字を読み取る。一度に見える範囲を広げる。'],
    ]],
    ['② 瞬間認識（瞬読式の土台）', [
      ['flash', '⚡', '瞬間フレーズ', '一瞬だけ出る1行を読み取る。表示時間はどんどん短く、行はどんどん長く。'],
      ['scramble', '🔀', 'バラバラ文字', '文字が入れ替わった言葉を一瞬で見抜く。予測して読む脳を作る。'],
    ]],
    ['③ 流れを速くする（内言・返り読みを外す）', [
      ['rsvp', '🎞', '高速表示（RSVP）', '画面の中央に「かたまり」が高速で流れる。声に出す読み方から卒業する。'],
      ['pacer', '📏', 'ペーサー読み', 'ガイドが一定速度で進む。読んだ行を消す「返り読み禁止」モードあり。'],
    ]],
    ['④ 把握型速読（10倍〜100倍の領域）', [
      ['skim', '🛩', 'スキミング', '基準の5倍・10倍・20倍の制限時間で、要点と構造だけをつかむ。'],
      ['scan', '🔍', 'スキャニング', '問いを先に見てから、答えだけを探し当てる。最も倍率が出る読み方。'],
      ['multi', '🌀', '高速多回転読み', '同じ文章を「キーワード→構造→詳細」と3回転で読む。1冊を短時間で回す型。'],
      ['kw', '🎯', 'キーワード・フラッシュ', '10倍速で眺め、出てきたキーワードを当てる。拾う目を作る。'],
    ]],
    ['⑤ アウトプットと実戦', [
      ['output', '✍', '1分アウトプット', '読んだら60秒で「キーワード3つ・一言要約・使い道」を書く。読書を成果に変える。'],
      ['book', '📕', '実書籍トレーニング', '手元の本を「目的→下見→3回転→アウトプット」で読み切る。1冊何分かを記録。'],
    ]],
  ];
  const BEST_LABEL = {
    measure: (b) => `${fmt(b.v)}${unitOf(b.l)}`, pacer: (b) => `${fmt(b.v)}${unitOf(b.l)}`, rsvp: (b) => `${fmt(b.v)}${unitOf(b.l)}`,
    skim: (b) => `${fmt(b.v)}${unitOf(b.l)}`, scan: (b) => `${fmt(b.v)}${unitOf(b.l)}`, multi: (b) => `${fmt(b.v)}${unitOf(b.l)}`, kw: (b) => `${b.v}%`,
    eye: (b) => `${b.v}回/分`, schulte: (b) => `${b.size}×${b.size} ${sec(b.ms)}`, span: (b) => (b.mode === 'digits' ? `${b.v}桁` : `幅${b.v}`),
    flash: (b) => `${b.lvl ? 'Lv' + b.lvl + '・' : ''}${b.chars}字/${b.ms}ms`, scramble: (b) => `${b.lvl ? 'Lv' + b.lvl + '・' : ''}${b.ms}ms`,
  };
  function bestLabel(k) {
    const b = ['ja', 'en'].map((l) => best(k, l)).filter(Boolean)[0];
    if (k === 'output') return SP().outs.length ? `${SP().outs.length}回` : '';
    if (k === 'book') return SP().books.length ? `${SP().books.length}冊` : '';
    return b && BEST_LABEL[k] ? BEST_LABEL[k](b) : '';
  }
  const MENUS = {
    15: [['eye', '2分'], ['flash', '3分'], ['pacer', '5分'], ['skim', '4分'], ['output', '1分']],
    30: [['eye', '2分'], ['schulte', '2分'], ['flash', '3分'], ['rsvp', '5分'], ['pacer', '5分'], ['multi', '8分'], ['scan', '4分'], ['output', '1分']],
  };
  const PROGRAM = [
    ['1週目', '土台づくり', '測定 → 視点移動・シュルツ → ペーサー（基準の1.2倍）。「声に出さず、止まらず」に慣れる。'],
    ['2週目', '瞬間認識', '瞬間フレーズ・バラバラ文字・RSVP。「1文字ずつ」ではなく「1行をひと目で」に切り替える。'],
    ['3週目', '把握型へ', 'スキミング5倍→10倍、スキャニング。「全部読まない」勇気と、目的から読む型を身につける。'],
    ['4週目', '実戦', '高速多回転読み＋実書籍トレーニングを毎日1冊（または1章）。最終日に速度測定で伸びを確認。'],
  ];
  // 成長グラフ：日ごとの最高倍率を、精読・把握・探索の3本の線で（縦は対数目盛）
  function growthChart(lang) {
    const log = SP().log.filter((e) => e.l === lang), days = [...new Set(log.map((e) => e.d))].sort((a, b) => a - b).slice(-20);
    if (days.length < 2) return '<p class="muted small">2日以上トレーニングすると、ここに「日ごとの最高倍率」のグラフが出ます。</p>';
    const series = METRICS.map(([, name, kinds], i) => ({
      name, cls: ['la', 'lg', 'lr'][i], fc: ['fA', 'fG', 'fR'][i],
      pts: days.map((d, k) => { const vs = log.filter((e) => e.d === d && kinds.includes(e.k)).map((e) => e.v); return vs.length ? [k, Math.max(...vs) / base(lang)] : null; }).filter(Boolean),
    }));
    const maxM = Math.max(2, ...[].concat(...series.map((x) => x.pts.map((q) => q[1]))));
    const W = Math.min(620, Math.max(220, (window.innerWidth || 620) - 124)), H = 250, L = 46, R = 14, T = 34, B = 34, LG = Math.min(120, (W - L - 20) / 3), lo = Math.log(0.5), hi = Math.log(maxM * 1.25);
    const X = (k) => L + (k / (days.length - 1)) * (W - L - R), Y = (m) => T + (1 - (Math.log(Math.max(0.5, m)) - lo) / (hi - lo)) * (H - T - B);
    let g = '';
    [1, 2, 5, 10, 20, 50, 100, 200, 500].filter((t) => t <= maxM * 1.25).forEach((t) => { g += `<path d="M${L} ${Y(t).toFixed(1)} L${W - R} ${Y(t).toFixed(1)}" class="l2 dash" style="opacity:.45"/><text x="${L - 6}" y="${(Y(t) + 4).toFixed(1)}" class="s" style="text-anchor:end">×${t}</text>`; });
    [0, days.length - 1].forEach((k) => { g += `<text x="${X(k).toFixed(1)}" y="${H - 12}" class="tm s">${dayStr(days[k]).slice(5)}</text>`; });
    series.forEach((x, i) => {
      g += `<circle cx="${L + 6 + i * LG}" cy="14" r="5" class="${x.fc}"/><text x="${L + 15 + i * LG}" y="18" class="s">${x.name.replace('速度', '')}</text>`;
      if (!x.pts.length) return;
      if (x.pts.length > 1) g += `<polyline points="${x.pts.map(([k, m]) => X(k).toFixed(1) + ',' + Y(m).toFixed(1)).join(' ')}" class="${x.cls}"/>`;
      g += x.pts.map(([k, m]) => `<circle cx="${X(k).toFixed(1)}" cy="${Y(m).toFixed(1)}" r="4" class="${x.fc}"><title>${dayStr(days[k])} ${x.name} ×${(Math.round(m * 10) / 10)}</title></circle>`).join('');
    });
    return D.svg(g, W, H, '日ごとの最高倍率（ベースライン＝×1）。縦は対数目盛なので、同じ幅の上昇は「同じ倍率の伸び」を表す');
  }
  function viewHub() {
    stopAll(); enTexts();
    const x = SP(), lang = hasBase('ja') || !hasBase('en') ? 'ja' : 'en', b = x.base[lang];
    const first = x.log.length ? x.log[0].d : null, dayN = first == null ? 0 : dayNo() - first + 1, wk = Math.min(3, Math.floor(Math.max(0, dayN - 1) / 7));
    let menu = 15; try { menu = localStorage.getItem('sp.menu') === '30' ? 30 : 15; } catch (e) { /* 既定の15分 */ }
    const tiles = METRICS.map(([id, name, kinds, desc]) => {
      const bb = bestOf(kinds, lang);
      return `<div class="sp-tile"><span class="muted small">${name}</span><b>${bb ? '×' + mult(bb.v, lang) : '—'}</b><span class="small">${bb ? fmt(bb.v) + unitOf(lang) : '未測定'}</span><small class="muted">${desc}</small></div>`;
    }).join('');
    const hist = x.log.filter((e) => e.l === lang && ['measure', 'pacer', 'skim', 'multi', 'scan'].includes(e.k)).slice(-10);
    const books = x.books.slice(-5).reverse();
    view().innerHTML = `${K.crumbs([['速読ジム']])}
      <section class="read-hero sp-hero"><div><h1>⚡ 速読ジム</h1><p class="muted">目 → 瞬間認識 → 流れ → 把握 → アウトプット。5つの力を順に鍛えて、<b>「1冊を何分で、何を得たか」</b>を圧倒的に変える。</p>
        ${b ? `<p>ベースライン（${lang === 'ja' ? '日本語' : '英語'}）：<b>${fmt(b.eff)}${unitOf(lang)}</b> <span class="muted small">（速さ ${fmt(b.cpm)}・理解度 ${Math.round(b.comp * 100)}%・${dayStr(b.d)}）</span> <a class="small" href="#/speed/measure/${lang}-rebase">測り直す</a></p>` : `<div class="box point"><b>まず現在地を測ろう（3分）</b>倍率はすべて「今のあなた」との比較で出します。<div class="actions"><a class="btn primary" href="#/speed/measure/ja">📏 日本語で測定</a><a class="btn" href="#/speed/measure/en">英語で測定</a></div></div>`}
        <p class="small"><a href="#/c/speed">🎓 速読コース（理論とトレーニングの意味）を読む →</a></p></div></section>
      <h2 class="sec">📈 3つの倍率 <span class="muted small">ベースラインに対する自己ベスト</span></h2>
      <div class="sp-tiles">${tiles}</div>
      <div class="callout small">「10倍・100倍」は主に<b>把握速度・探索速度</b>で出ます。精読（全部を理解しながら読む）の速さには、目と言語処理の限界があり、ここを2〜3倍にするだけでも大きな成果です。<b>目的に応じて読み方を切り替える</b>のが、本当に速い読み手です。</div>
      <h2 class="sec">📉 成長グラフ <span class="muted small">直近20日（${lang === 'ja' ? '日本語' : '英語'}）</span></h2><div class="card">${growthChart(lang)}</div>
      <div class="grid two">
        <div class="card"><h3>🗓 今日のメニュー <span class="lvfilter" style="display:inline-flex"><a class="tag ${menu === 15 ? 'key' : ''}" href="#/speed" data-menu="15">15分</a><a class="tag ${menu === 30 ? 'key' : ''}" href="#/speed" data-menu="30">30分</a></span></h3>
          <ol class="sp-menu">${MENUS[menu].map(([k, m]) => { const tr = [].concat(...TRAINERS.map((g) => g[1])).find((t) => t[0] === k); return `<li class="${today(k) || (k === 'output' && x.outs.some((o) => o.d === dayNo())) ? 'done' : ''}"><a href="#/speed/${k}">${tr[1]} ${tr[2]}</a> <span class="muted small">${m}</span></li>`; }).join('')}</ol></div>
        <div class="card"><h3>🧭 30日プログラム ${dayN ? `<span class="tag key">${dayN}日目</span>` : ''}</h3>${PROGRAM.map(([w, t, d], i) => `<p class="${i === wk ? 'sp-now' : 'muted'} small"><b>${w}：${t}</b><br>${d}</p>`).join('')}</div>
      </div>
      ${TRAINERS.map(([g, list]) => `<h2 class="sec">${g}</h2><div class="sp-grid">${list.map(([k, ic, name, desc]) => `<a class="card sp-card" href="#/speed/${k}"><div class="sp-ic">${ic}</div><div><b>${name}</b>${bestLabel(k) ? ` <span class="tag good">🏅 ${bestLabel(k)}</span>` : ''}<p class="muted small">${desc}</p></div></a>`).join('')}</div>`).join('')}
      ${hist.length ? `<h2 class="sec">最近の記録（${lang === 'ja' ? '字' : '語'}/分）</h2><div class="card">${D.bars(hist.map((e) => [({ measure: '測定', pacer: 'ペーサー', skim: 'スキム', multi: '多回転', scan: '探索' })[e.k] + ' ' + dayStr(e.d).slice(5), e.v, e.k === 'measure']), { cap: '濃い棒が速度測定（ふつうに読んだ実効速度）' })}</div>` : ''}
      ${books.length ? `<h2 class="sec">📕 最近の実書籍</h2><div class="card"><table class="tbl"><tr><th>日付</th><th>本</th><th>時間</th><th>換算速度</th></tr>${books.map((bk) => `<tr><td>${dayStr(bk.d)}</td><td>${esc(bk.title)}</td><td>${bk.min}分</td><td>${fmt(bk.cpm)}字/分 ${multTag(bk.cpm, 'ja')}</td></tr>`).join('')}</table></div>` : ''}`;
    $$('[data-menu]').forEach((a) => (a.onclick = (e) => { e.preventDefault(); try { localStorage.setItem('sp.menu', a.dataset.menu); } catch (err) { /* 保存できなくても表示は切り替える */ } viewHub(); }));
  }

  /* =========================================================
   * 📏 速度測定
   * ========================================================= */
  function measure(lang, reb) {
    const body = page('📏 速度測定', `${langTabs('measure', lang)}
      <div class="box tip"><b>ルール</b>いつも通りのペースで、内容を理解しながら読む。読み終わったらボタン。そのあと文章を見ずに${lang === 'ja' ? '3' : '2〜3'}問に答えます。<br><b>実効速度 ＝ 読む速さ × 理解度</b>。速くても理解していなければ意味がない、という考え方です。</div>
      ${textSelect('measure', lang, (t) => t.q.length >= 2)}<p><button class="btn primary big" id="go">読み始める（計測スタート）</button></p>`, '速読の成果はすべて「今のあなた」との比較で測ります。');
    $('#go').onclick = () => {
      const t = selText(), t0 = Date.now();
      body.innerHTML = `<div class="sp-bar"><span class="muted small" id="el">0秒</span></div>${textHtml(t)}<div class="actions center"><button class="btn primary big" id="fin">読み終わった！</button></div>`;
      every(() => { const e = $('#el'); if (e) e.textContent = Math.round((Date.now() - t0) / 1000) + '秒'; }, 1000);
      $('#fin').onclick = () => {
        const ms = Date.now() - t0; stopAll();
        const cpm = t.size / (ms / 60000);
        body.innerHTML = '<div id="qz"></div><div id="rs"></div>';
        mcQuiz($('#qz'), t.q, (ok, n) => {
          const comp = n ? ok / n : 0, eff = cpm * comp, x = SP(), ok2 = cpm <= CAP[lang], firstBase = !x.base[lang] && ok2;
          if (firstBase || (reb && ok2)) x.base[lang] = { cpm: Math.round(cpm), comp, eff: Math.max(Math.round(eff), Math.round(cpm * 0.34)), d: dayNo() };
          if (ok2) { rec('measure', lang, eff, { tid: key(t), cpm: Math.round(cpm), comp }); K.addXP(10); } else K.save();
          const msg = (!ok2 ? `<b>⚠ 読み終わるのが速すぎるため（${fmt(cpm)}${unitOf(lang)}）、ベースラインには登録しませんでした。</b>いつも通りに内容を理解しながら読んで、もう一度測りましょう。<br>` : '') + (firstBase || (reb && ok2) ? '<b>ベースラインを登録しました。</b>ここからの伸びを倍率で表示します。<br>' : '') + (comp < 0.6 ? '理解度が低めです。速さより「分かって読む」を優先しましょう（目安：理解度67%以上）。' : cpm < REF[lang] ? 'まずはペーサー読みで「止まらずに読む」感覚をつかむと伸びが早いです。' : '良いバランス。次は瞬間フレーズとスキミングで「見る範囲」と「読み方の切り替え」を鍛えましょう。');
          $('#rs').innerHTML = resultCard([[fmt(cpm), '速さ（' + unitOf(lang) + '）'], [Math.round(comp * 100) + '%', '理解度'], [fmt(eff), '実効速度'], ['×' + mult(eff, lang), 'ベースライン比']], msg, t, true);
          $('#again').onclick = () => measure(lang);
          $('#rs').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, '✋ 文章を見ずに答えよう');
      };
    };
  }
  function rebase(lang) { measure(lang, true); }

  /* =========================================================
   * 👀 視点移動
   * ========================================================= */
  const PATTERNS = { lr: '左右', ud: '上下', diag: '斜め', zig: 'ジグザグ（行読み）', circle: '円', rand: 'ランダム' };
  function eye() {
    const last = best('eye', 'ja'), tempo0 = last ? Math.min(300, last.v + 20) : 90;
    const body = page('👀 視点移動', `<div class="box tip"><b>やり方</b>顔は動かさず、<b>目だけ</b>で点を追う。点が<b class="sp-star">★</b>に変わったら、すぐスペースキー（スマホは画面タップ）。読書中の「行替え」「視線のジャンプ」を速く正確にする準備運動です。</div>
      <div class="grid two"><label class="field">パターン <select id="pat">${Object.entries(PATTERNS).map(([k, v]) => opt(k, 'zig', v)).join('')}</select></label>
      <label class="field">テンポ <select id="tempo">${[60, 90, 120, 150, 180, 210, 240, 270, 300].map((v) => opt(v, Math.round(tempo0 / 30) * 30, v + '回/分')).join('')}</select></label>
      <label class="field">時間 <select id="dur">${[30, 60].map((v) => opt(v, 30, v + '秒')).join('')}</select></label></div>
      <p><button class="btn primary big" id="go">スタート</button></p>`, '眼球運動の準備運動。2分あれば十分です。');
    $('#go').onclick = () => {
      const pat = $('#pat').value, tempo = +$('#tempo').value, dur = +$('#dur').value * 1000, step = 60000 / tempo;
      body.innerHTML = `<div class="sp-stage sp-eye" id="stg"><i class="sp-dot" id="dot"></i></div><div class="sp-bar"><div class="pbar"><i id="pb"></i></div></div>`;
      const stg = $('#stg'), dot = $('#dot');
      let n = 0, targets = 0, hits = 0, falses = 0, isT = false, gotT = false;
      const P = (i) => {
        const r = (a) => Math.round(a * 100) / 100;
        if (pat === 'lr') return [i % 2 ? 0.92 : 0.08, 0.5];
        if (pat === 'ud') return [0.5, i % 2 ? 0.9 : 0.1];
        if (pat === 'diag') return [[0.08, 0.92, 0.92, 0.08][i % 4], [0.1, 0.9, 0.1, 0.9][i % 4]];
        if (pat === 'zig') { const row = Math.floor(i / 2) % 6; return [i % 2 ? 0.92 : 0.08, 0.1 + row * 0.16]; }
        if (pat === 'circle') { const a = (i / 12) * 2 * Math.PI; return [r(0.5 + 0.42 * Math.cos(a)), r(0.5 + 0.4 * Math.sin(a))]; }
        return [0.06 + Math.random() * 0.88, 0.08 + Math.random() * 0.84];
      };
      const press = () => { if (isT && !gotT) { gotT = true; hits++; stg.classList.add('hit'); later(() => stg.classList.remove('hit'), 150); } else if (!isT) falses++; };
      K.setKey((e) => { if (e.code === 'Space') { e.preventDefault(); press(); } });
      stg.onpointerdown = press;
      const t0 = Date.now();
      const move = () => {
        const [x, y] = P(n++);
        isT = n > 3 && Math.random() < 0.12; gotT = false; if (isT) targets++;
        dot.style.left = x * 100 + '%'; dot.style.top = y * 100 + '%'; dot.classList.toggle('star', isT);
        $('#pb').style.width = Math.min(100, ((Date.now() - t0) / dur) * 100) + '%';
      };
      move();
      every(move, step);
      later(() => {
        stopAll();
        const acc = targets ? (hits - falses * 0.5) / targets : 1, good = acc >= 0.8;
        if (good) rec('eye', 'ja', tempo, { pat });
        K.addXP(3);
        body.innerHTML = resultCard([[n, '視点移動の回数'], [`${hits}/${targets}`, '★の反応'], [falses, 'お手つき'], [tempo + '回/分', 'テンポ']], good ? '✔ 正確に追えています。次は<b>テンポを30上げて</b>みましょう。' : '★を見逃しています。テンポを下げて「正確に止まる」ことを優先しましょう。速さは正確さの後からついてきます。', null, true);
        $('#again').onclick = eye;
      }, dur);
    };
  }

  /* =========================================================
   * 🔢 シュルツテーブル
   * ========================================================= */
  const KANA = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん'.split('');
  function schulte() {
    const body = page('🔢 シュルツテーブル', `<div class="box tip"><b>やり方</b>マス目の<b>中央の点を見たまま</b>、1から順にタップ（クリック）する。目を動かさずに周りを「感じる」のがコツ。最初は目が動いても大丈夫、だんだん中央に固定できるようにしていきます。</div>
      <div class="grid two"><label class="field">サイズ <select id="sz">${[3, 4, 5, 6, 7].map((v) => opt(v, 5, `${v}×${v}（${v * v}個）`)).join('')}</select></label>
      <label class="field">中身 <select id="md">${opt('num', 'num', '数字 1→')}${opt('kana', 'num', 'ひらがな あ→')}</select></label></div>
      <p><button class="btn primary big" id="go">スタート</button></p>
      ${[3, 4, 5, 6, 7].map((s) => { const b = SP().log.filter((e) => e.k === 'schulte' && e.size === s).sort((a, c) => a.ms - c.ms)[0]; return b ? `<span class="tag">${s}×${s} ベスト ${sec(b.ms)}</span> ` : ''; }).join('')}
      <p class="muted small">目安（5×5・数字）：40秒＝ふつう／25秒＝速い／15秒台＝かなり鍛えられている</p>`, '周辺視野と集中力のトレーニング。');
    $('#go').onclick = () => {
      const s = +$('#sz').value, md = $('#md').value, N = s * s, lab = (i) => (md === 'kana' ? KANA[i] : String(i + 1));
      const cells = shuffle([...Array(N).keys()]);
      let next = 0, miss = 0;
      body.innerHTML = `<div class="sp-bar"><span>次：<b id="nx">${lab(0)}</b></span><span class="muted small" id="el">0.0秒</span><span class="muted small">ミス <b id="ms">0</b></span></div>
        <div class="sp-schulte" style="--n:${s}">${cells.map((i) => `<button class="sp-cell" data-i="${i}">${lab(i)}</button>`).join('')}<i class="sp-center"></i></div>`;
      const t0 = Date.now();
      every(() => { const e = $('#el'); if (e) e.textContent = sec(Date.now() - t0); }, 100);
      $$('.sp-cell').forEach((b) => (b.onclick = () => {
        if (+b.dataset.i !== next) { miss++; $('#ms').textContent = miss; b.classList.add('bad'); later(() => b.classList.remove('bad'), 250); return; }
        b.classList.add('ok'); next++;
        if (next < N) { $('#nx').textContent = lab(next); return; }
        const ms = Date.now() - t0; stopAll();
        const prev = SP().log.filter((e) => e.k === 'schulte' && e.size === s).sort((a, c) => a.ms - c.ms)[0];
        SP().log.push({ d: dayNo(), k: 'schulte', l: 'ja', v: Math.round(N * 60000 / ms), size: s, ms, miss }); K.save();
        const bk = SP().best['schulte:ja'];
        if (!bk || s > bk.size || (s === bk.size && ms < bk.ms)) { SP().best['schulte:ja'] = { size: s, ms, v: 0 }; K.save(); }
        K.addXP(3);
        body.innerHTML = resultCard([[sec(ms), `${s}×${s} のタイム`], [miss, 'ミス'], [prev ? sec(prev.ms) : '—', 'これまでのベスト']], !prev || ms < prev.ms ? '🏅 自己ベスト！' : 'ミスが減るほど、視野を「感じる」力がついています。', null, true);
        $('#again').onclick = schulte;
      }));
    };
  }

  /* =========================================================
   * ↔️ 視幅拡大・瞬間数字
   * ========================================================= */
  function span(mode) {
    mode = mode === 'digits' ? 'digits' : 'wide';
    const body = page('↔️ 視幅拡大・瞬間数字', `<div class="lvfilter"><a class="tag ${mode === 'wide' ? 'key' : ''}" href="#/speed/span/wide">視幅拡大（左右）</a><a class="tag ${mode === 'digits' ? 'key' : ''}" href="#/speed/span/digits">瞬間数字（桁数）</a></div>
      <div class="box tip">${mode === 'wide' ? '<b>やり方</b>中央の「＋」を見つめる。左右に一瞬だけ数字が出るので、<b>目を動かさずに</b>2つとも読み取って入力（左→右の順、例：37）。正解すると間隔が広がります。' : '<b>やり方</b>一瞬だけ数字の列が出ます。<b>ひと目で</b>覚えて入力。正解すると桁が増えます。1文字ずつ読まず「かたまり」で写真のように見るのがコツ。'}</div>
      <p><button class="btn primary big" id="go">スタート（15回）</button></p>`, '一度に「見える範囲」を広げる。速読のすべての土台。');
    $('#go').onclick = () => {
      let trial = 0, lvl = mode === 'wide' ? 4 : 4, top = 0, ok = 0, ms = mode === 'wide' ? 180 : 400;
      body.innerHTML = `<div class="sp-bar"><span class="muted small" id="tr"></span><span class="muted small" id="lv"></span></div><div class="sp-stage sp-flash" id="stg"></div><div id="inp"></div>`;
      const stg = $('#stg'), inp = $('#inp');
      const one = () => {
        if (trial >= 15) return end();
        trial++;
        $('#tr').textContent = `${trial}/15`; $('#lv').textContent = mode === 'wide' ? `間隔 ${lvl}` : `${lvl}桁・${ms}ms`;
        inp.innerHTML = '';
        stg.innerHTML = '<span class="sp-fix">＋</span>';
        const ans = mode === 'wide' ? String(Math.floor(Math.random() * 10)) + String(Math.floor(Math.random() * 10)) : Array.from({ length: lvl }, (_, i) => Math.floor(Math.random() * (i ? 10 : 9)) + (i ? 0 : 1)).join('');
        later(() => {
          stg.innerHTML = mode === 'wide' ? `<span class="sp-fix">＋</span><b class="sp-side" style="left:calc(50% - ${lvl * 3.4}%)">${ans[0]}</b><b class="sp-side" style="left:calc(50% + ${lvl * 3.4}%)">${ans[1]}</b>` : `<b class="sp-num">${ans}</b>`;
          later(() => {
            stg.innerHTML = mode === 'wide' ? '<span class="sp-fix">＋</span><span class="sp-mask" style="left:calc(50% - ' + lvl * 3.4 + '%)">▒</span><span class="sp-mask" style="left:calc(50% + ' + lvl * 3.4 + '%)">▒</span>' : `<b class="sp-num sp-maskt">${'▒'.repeat(lvl)}</b>`;
            inp.innerHTML = `<div class="inrow"><input class="ans" id="a" inputmode="numeric" autocomplete="off" placeholder="${mode === 'wide' ? '左右の数字（例：37）' : '見えた数字'}"><button class="btn primary" id="ck">OK</button></div>`;
            const a = $('#a'); a.focus();
            const chk = () => {
              const v = a.value.replace(/\D/g, ''); if (!v) return;
              const right = v === ans;
              if (right) { ok++; top = Math.max(top, lvl); lvl = mode === 'wide' ? Math.min(14, lvl + 1) : lvl + 1; if (mode === 'digits' && lvl > 9) ms = Math.max(150, ms - 50); }
              else lvl = Math.max(mode === 'wide' ? 1 : 3, lvl - 1);
              stg.innerHTML = `<span class="sp-fb ${right ? 'ok' : 'ng'}">${right ? '✔' : '✘ ' + ans}</span>`;
              later(one, right ? 450 : 1100);
            };
            $('#ck').onclick = chk;
            a.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); chk(); } };
          }, ms);
        }, 700);
      };
      const end = () => {
        stopAll();
        if (top) rec('span', 'ja', top, { mode });
        K.addXP(3);
        body.innerHTML = resultCard([[`${ok}/15`, '正解'], [mode === 'wide' ? `間隔 ${top}` : `${top}桁`, '最高到達']], mode === 'wide' ? '間隔8以上で、1行の半分ほどを「ひと目」で捉えられている状態です。' : '7桁前後がふつう。9桁以上を安定させると、文章も「かたまり」で見えるようになってきます。', null, true);
        $('#again').onclick = () => span(mode);
      };
      one();
    };
  }

  /* =========================================================
   * 瞬間ドリル（瞬間フレーズ・バラバラ文字で共通）
   * ========================================================= */
  function flashDrill(body, o) {
    let trial = 0, lvl = clamp(o.lvl0 || 0, 0, o.maxLvl), ms = o.ms0, ok = 0, streak = 0, bestR = null, top = -1;
    const N = 15;
    body.innerHTML = `<div class="sp-bar"><span class="muted small" id="tr"></span><span class="muted small" id="lv"></span></div><div class="sp-stage sp-flash" id="stg"></div><div id="ch"></div>`;
    const stg = $('#stg'), ch = $('#ch');
    const one = () => {
      if (trial >= N) return end();
      trial++;
      const it = o.gen(lvl), showMs = o.showMs ? o.showMs(ms, it, lvl) : ms;
      $('#tr').textContent = `${trial}/${N}`; $('#lv').textContent = `レベル ${lvl + 1}/${o.maxLvl + 1}${o.lvName ? '：' + o.lvName(lvl) : ''}・表示 ${showMs}ms`;
      ch.innerHTML = ''; stg.innerHTML = '<span class="sp-fix">＋</span>';
      later(() => {
        stg.innerHTML = `<b class="sp-line ${o.lang === 'en' ? 'en' : ''}">${esc(it.show)}</b>`;
        later(() => {
          stg.innerHTML = `<b class="sp-line sp-maskt">${'▒'.repeat(Math.min(24, Math.ceil(it.show.length / (o.lang === 'en' ? 2.5 : 1))))}</b>`;
          const shownLvl = lvl, shownMs = showMs;
          const cs = shuffle([it.ans, ...it.wrong]);
          ch.innerHTML = `<p class="muted small center">${o.ask}</p><div class="choices">${cs.map((c, n) => `<button class="choice ${o.lang === 'en' ? 'en' : ''}" data-c="${esc(c)}"><span class="key">${n + 1}</span><span>${esc(c)}</span></button>`).join('')}</div>`;
          const pick = (b) => {
            if (ch.dataset.lock === String(trial)) return;
            ch.dataset.lock = String(trial);
            const right = b.dataset.c === it.ans;
            $$('.choice', ch).forEach((x) => { x.disabled = true; if (x.dataset.c === it.ans) x.classList.add('right'); });
            if (!right) b.classList.add('wrong');
            if (right) {
              ok++; streak++;
              const len = it.len || it.ans.length;
              top = Math.max(top, shownLvl);
              if (!bestR || shownLvl > bestR.lvl || (shownLvl === bestR.lvl && (len > bestR.chars || (len === bestR.chars && shownMs < bestR.ms)))) bestR = { chars: len, ms: shownMs, lvl: shownLvl };
              ms = Math.max(o.min, Math.round(ms * 0.82));
              if (streak >= 2) { lvl = Math.min(o.maxLvl, lvl + 1); streak = 0; }
            } else { streak = 0; ms = Math.min(o.max, Math.round(ms * 1.3)); lvl = Math.max(0, lvl - 1); }
            later(one, right ? 500 : 1300);
          };
          $$('.choice', ch).forEach((b) => (b.onclick = () => pick(b)));
          K.setKey((e) => { const n = +e.key; if (n >= 1 && n <= cs.length) pick($$('.choice', ch)[n - 1]); });
        }, showMs);
      }, 600);
    };
    const end = () => {
      stopAll();
      if (bestR) rec(o.kind, o.lang, o.score(bestR), { chars: bestR.chars, ms: bestR.ms, lvl: top + 1 });
      K.addXP(4);
      const more = ok === N && top >= o.maxLvl ? '<b>🏆 最高レベルで全問正解！</b>次は開始レベルを最高にして、表示時間をどこまで縮められるかに挑戦しましょう（正解するたびに短くなります）。<br>' : ok === N ? `<b>🎯 全問正解！</b>次回は「開始レベル」を${Math.min(o.maxLvl + 1, top + 2)}以上にして挑戦しましょう。全問正解できる練習は、もう簡単すぎます。<br>` : ok >= N - 2 && top >= o.maxLvl ? '<b>最高レベルに到達！</b>表示時間をさらに縮めるのが次の目標です。<br>' : '';
      body.innerHTML = resultCard([[`${ok}/${N}`, '正解'], [top >= 0 ? `${top + 1}/${o.maxLvl + 1}` : '—', '到達レベル'], [bestR ? `${bestR.chars}${o.lang === 'en' ? '文字' : '字'}` : '—', 'その時の長さ'], [bestR ? bestR.ms + 'ms' : '—', 'その時の表示時間']], more + o.tip, null, true);
      $('#again').onclick = o.again;
    };
    one();
  }
  // 開始レベルの選択（前回の到達レベルの1つ下をおすすめにする）
  function lvlSelect(kind, lang, names) {
    const last = Math.max(0, ...SP().log.filter((e) => e.k === kind && e.l === lang && e.lvl).map((e) => e.lvl));
    const def = clamp(last - 1, 1, names.length);
    return `<label class="field">開始レベル <select id="lv0">${names.map((n, i) => opt(i + 1, def, `${i + 1}：${n}`)).join('')}</select></label>${last ? `<p class="muted small">前回の到達レベル：${last}（おすすめの開始レベルを選んであります）</p>` : ''}`;
  }
  // 見た目が似ているほど高い点（同じ文字・同じ最初/最後・近い長さ）
  function simScore(a, b) {
    const A = [...a], B = [...b], cnt = {};
    A.forEach((c) => (cnt[c] = (cnt[c] || 0) + 1));
    let shared = 0; B.forEach((c) => { if (cnt[c] > 0) { shared++; cnt[c]--; } });
    return (shared / Math.max(A.length, B.length)) * 6 + (A[0] === B[0] ? 3 : 0) + (A[A.length - 1] === B[B.length - 1] ? 3 : 0) + (A[1] === B[1] ? 1 : 0) - Math.abs(A.length - B.length) * 0.8;
  }
  // 候補から選択肢を選ぶ。hard 0：長さが近いもの／1：似ている上位から／2：最も似ているものから
  function nearDecoys(ans, pool, n, hard) {
    const cs = [...new Set(pool)].filter((x) => x !== ans);
    if (!hard) return shuffle(cs.filter((x) => Math.abs(x.length - ans.length) <= 3)).concat(shuffle(cs)).filter((x, i, a) => a.indexOf(x) === i).slice(0, n);
    const ranked = shuffle(cs).map((x) => [x, simScore(ans, x)]).sort((a, b) => b[1] - a[1]).map((x) => x[0]);
    return shuffle(ranked.slice(0, Math.max(n, Math.round(n * (hard >= 2 ? 1.3 : 2.5))))).slice(0, n);
  }
  // 「ほとんど同じだが違う」選択肢（助詞・小さな単語の入れ替え、かたまりの入れ替え）
  const PSWAP = { は: 'が', が: 'は', を: 'に', に: 'を', で: 'に', と: 'や', も: 'は', へ: 'に', の: 'が' };
  const ESWAP = { the: 'a', a: 'the', in: 'on', on: 'in', of: 'for', for: 'of', to: 'at', at: 'to', was: 'is', is: 'was', and: 'but', but: 'and', he: 'she', she: 'he', his: 'her', her: 'his' };
  function mutants(ans, lang, chunkSwap) {
    const out = new Set();
    if (lang === 'en') {
      const w = ans.split(' ');
      w.forEach((x, i) => {
        const k = x.toLowerCase();
        if (ESWAP[k]) { const y = w.slice(), r = ESWAP[k]; y[i] = x[0] === x[0].toUpperCase() ? r[0].toUpperCase() + r.slice(1) : r; out.add(y.join(' ')); }
      });
      if (chunkSwap) for (let i = 1; i < w.length - 1; i++) { const y = w.slice(); [y[i], y[i + 1]] = [y[i + 1], y[i]]; out.add(y.join(' ')); }
    } else {
      const a = [...ans];
      a.forEach((c, i) => { if (i > 0 && PSWAP[c] && !PSWAP[a[i - 1]] && !PSWAP[a[i + 1] || '']) { const y = a.slice(); y[i] = PSWAP[c]; out.add(y.join('')); } });
      if (chunkSwap) { const ch = jaChunks(ans, 5); for (let i = 0; i < ch.length - 1; i++) { const y = ch.slice(); [y[i], y[i + 1]] = [y[i + 1], y[i]]; out.add(y.join('')); } }
    }
    out.delete(ans);
    return shuffle([...out]);
  }
  // 日本語の文章を「意味のかたまり」に区切る
  function jaChunks(s, size) {
    const parts = s.split(/(?<=[、。！？」』）])|(?<=[^、。]{2}(?:は|が|を|に|で|と|も|へ|から|まで|より|ので|けれど|ても|ては|れば|たら|ながら))(?=[^、。！？」』）ーぁぃぅぇぉゃゅょっ])/).filter(Boolean);
    const out = []; let cur = '';
    parts.forEach((p) => { if (cur && (cur + p).length > size) { out.push(cur); cur = p; } else cur += p; });
    if (cur) out.push(cur);
    return out;
  }
  function phrasePool(lang) {
    if (lang === 'en') {
      enTexts();
      return [].concat(...textsOf('en').map((t) => t.paras.join(' ').split(/(?<=[,.;:!?])\s+/))).map((s) => s.replace(/["“”]/g, '').trim()).filter((s) => s.length >= 8 && s.length <= 70);
    }
    return [].concat(...textsOf('ja').map((t) => [].concat(...t.paras.map((p) => p.split(/(?<=[、。！？])/))))).map((s) => s.replace(/[「」『』]/g, '').trim()).filter((s) => s.length >= 5 && s.length <= 34);
  }
  const FLASH_NAMES = {
    ja: ['〜6字', '〜9字・似た行', '〜12字・似た行', '〜16字・そっくり1つ', '〜20字・そっくり1つ', '〜26字・そっくり2つ', '〜34字・そっくり2つ'],
    en: ['〜12文字', '〜20文字・似た行', '〜28文字・そっくり1つ', '〜38文字・そっくり1つ', '〜50文字・そっくり2つ', '〜70文字・そっくり2つ'],
  };
  function flash(lang) {
    lang = lang === 'en' ? 'en' : 'ja';
    const body = page('⚡ 瞬間フレーズ', `${langTabs('flash', lang)}<div class="box tip"><b>やり方</b>中央の「＋」を見る。1行が一瞬だけ出るので、<b>1文字ずつではなく、行全体を写真のように</b>見て、どれだったかを選ぶ。正解するたびに表示は短く、行は長くなります。<br>キーボードなら 1〜4 で選べます。</div>
      ${lvlSelect('flash', lang, FLASH_NAMES[lang])}
      <p><button class="btn primary big" id="go">スタート（15問）</button></p><p class="muted small">レベルが上がると、助詞や語順だけが違う「そっくりな選択肢」が混ざります。</p>`, '瞬間的に「行ごと」意味をつかむ力。瞬読などで重視される、速読の核心トレーニング。');
    $('#go').onclick = () => {
      const lvl0 = +$('#lv0').value - 1;
      const pool = phrasePool(lang), L = lang === 'en' ? [12, 20, 28, 38, 50, 70] : [6, 9, 12, 16, 20, 26, 34];
      const bucket = (lv) => { const lo = lv ? L[lv - 1] : 0, hi = L[lv]; const xs = pool.filter((s) => s.length > lo && s.length <= hi); return xs.length >= 4 ? xs : pool; };
      flashDrill(body, {
        kind: 'flash', lang, lvl0, ms0: lvl0 >= 3 ? 400 : 600, min: 40, max: 1500, maxLvl: L.length - 1, ask: 'いま見えた行は？', lvName: (lv) => FLASH_NAMES[lang][lv],
        gen: (lv) => {
          const xs = bucket(lv), ans = shuffle(xs)[0], nm = (lang === 'en' ? lv >= 4 : lv >= 5) ? 2 : (lang === 'en' ? lv >= 2 : lv >= 3) ? 1 : 0;
          const mu = mutants(ans, lang, true).slice(0, nm);
          return { show: ans, ans, wrong: mu.concat(nearDecoys(ans, xs, 3 - mu.length, lv >= 2 ? 2 : lv >= 1 ? 1 : 0)) };
        },
        score: (b) => Math.round(b.chars * 60000 / b.ms),
        tip: lang === 'ja' ? '20字（ほぼ1行）を200ms以下で読み取れれば、文章を「行単位」で見る準備ができています。選択肢が似ているほど、本当に読めているかが試されます。' : '英語は「単語の形」で見分ける力。30文字前後を300ms以下で読めれば、チャンク読みの準備ができています。',
        again: () => flash(lang),
      });
    };
  }
  const JA_WORDS = 'チョコレート,エレベーター,カレンダー,インターネット,コンピューター,スケジュール,プレゼンテーション,レストラン,キーボード,ハンバーガー,アイスクリーム,オーケストラ,スーパーマーケット,テレビゲーム,ボランティア,エネルギー,ダイヤモンド,パイナップル,ブロッコリー,カフェテリア,トランポリン,マラソンランナー,ライオンキング,サンドイッチ,ミネラルウォーター,クリスマス,バレンタイン,ドキュメント,プログラム,データベース,アルゴリズム,ネットワーク,セキュリティ,カメラマン,スマートフォン,ヘッドホン,シャンプー,ドライヤー,タンブラー,フライパン,ストップウォッチ,トレーニング,ストレッチ,モチベーション,コミュニケーション,リーダーシップ,マネジメント,イノベーション,オリンピック,サッカーボール,バスケットボール,ゴールキーパー,ホームラン,アナウンサー,パイロット,エンジニア,デザイナー,プロフェッショナル,ベストセラー,ミステリー,ファンタジー,アドベンチャー,ジャングルジム,メリーゴーランド,ジェットコースター,キャンプファイヤー,おにぎり,たこやき,おこのみやき,すきやき,みそしる,かきごおり,ひまわり,あさがお,かたつむり,とうもろこし,さつまいも,だいこんおろし,たんぽぽ,かみなり,にじいろ,ゆきだるま,すべりだい,なわとび,かくれんぼ,おにごっこ,しんかんせん,ひこうき,じてんしゃ,としょかん,びじゅつかん,すいぞくかん,どうぶつえん,ゆうえんち,こうさてん,しょうがっこう,ちゅうがっこう,たいいくかん,おんがくしつ,りかしつ,れいぞうこ,せんたくき,そうじき,でんしレンジ,はみがき,おふろば,ものほし,ほうれんそう,きゅうり,にんじん,じゃがいも,たまねぎ,ピーマン,かぼちゃ,なすび,さくらんぼ,いちごみるく,みかんばたけ,すいかわり'.split(',');
  // keep=true：最初と最後の文字は残す。false：全部まぜる。英語の句は単語ごとにまぜる
  function scrambleWord(w, keep = true) {
    const a = [...w]; if (a.length < 3) return w;
    for (let k = 0; k < 12; k++) {
      const s = keep ? a[0] + shuffle(a.slice(1, -1)).join('') + a[a.length - 1] : shuffle(a).join('');
      if (s !== w) return s;
    }
    return w;
  }
  const scrambleText = (t, lang, keep) => (lang === 'en' ? t.split(' ').map((w) => (w.length >= 4 ? scrambleWord(w, keep) : w)).join(' ') : scrambleWord(t, keep));
  // [名前, 種類, 長さの下限, 上限（日本語は字数・英語の句は語数）, 最初と最後を残すか, 選択肢の似せ方, そっくり選択肢の数]
  const SCR = {
    ja: [
      ['言葉・4字〜', 'word', 4, 99, true, 0, 0], ['言葉・5字〜・似た選択肢', 'word', 5, 99, true, 1, 0], ['言葉・6字〜・そっくりな選択肢', 'word', 6, 99, true, 2, 0],
      ['言葉・全部バラバラ', 'word', 4, 99, false, 1, 0], ['言葉・7字〜・全部バラバラ＋そっくり', 'word', 7, 99, false, 2, 0],
      ['短い句（6〜10字）', 'phrase', 6, 10, true, 1, 1], ['句（9〜14字）・そっくり', 'phrase', 9, 14, true, 2, 1],
      ['長い句（12〜18字）・そっくり2つ', 'phrase', 12, 18, true, 2, 2], ['長い句・全部バラバラ', 'phrase', 10, 16, false, 2, 2],
    ],
    en: [
      ['単語・5文字〜', 'word', 5, 99, true, 0, 0], ['単語・7文字〜・似た選択肢', 'word', 7, 99, true, 1, 0], ['単語・9文字〜・そっくり', 'word', 9, 99, true, 2, 0],
      ['単語・全部バラバラ', 'word', 5, 99, false, 1, 0], ['単語・8文字〜・全部バラバラ＋そっくり', 'word', 8, 99, false, 2, 0],
      ['短い句（3〜4語）', 'phrase', 3, 4, true, 1, 1], ['句（5〜6語）・そっくり', 'phrase', 5, 6, true, 2, 1],
      ['長い句（7〜9語）・そっくり2つ', 'phrase', 7, 9, true, 2, 2], ['長い句・全部バラバラ', 'phrase', 5, 7, false, 2, 2],
    ],
  };
  function scramble(lang) {
    lang = lang === 'en' ? 'en' : 'ja';
    const LV = SCR[lang];
    const body = page('🔀 バラバラ文字', `${langTabs('scramble', lang)}<div class="box tip"><b>やり方</b>文字の順番がバラバラになった言葉が一瞬出ます。<b>元の言葉はどれか</b>を選ぶ。脳は文字を1つずつ読まず、形と予測で読んでいます。その「予測する力」を鍛えます。<br>例：<b>チレコョート</b> → チョコレート<br>
      レベルが上がると、①選択肢がそっくりになる ②最初と最後の文字までバラバラになる ③言葉ではなく「句」になる、の順に難しくなります。</div>
      ${lvlSelect('scramble', lang, LV.map((x) => x[0]))}
      <p><button class="btn primary big" id="go">スタート（15問）</button></p>`, '予測読み・推測読みの土台。瞬読などで使われる考え方を、このアプリ流のドリルにしたもの。');
    $('#go').onclick = () => {
      const lvl0 = +$('#lv0').value - 1;
      const words = lang === 'en'
        ? [...new Set([].concat(...App.courseMap.english.decks.filter((d) => /^core-|toeic|tech|roots/.test(d.id)).map((d) => d.cards.map((c) => c.f))).filter((w) => /^[a-z]{5,14}$/.test(w)))]
        : JA_WORDS;
      const phrases = lang === 'en'
        ? [...new Set([].concat(...phrasePool('en').map((c) => {
          const w = c.replace(/[.,;:!?"“”()]/g, '').split(/\s+/).filter(Boolean), out = [];
          for (let i = 0; i + 3 <= w.length; i += 2) for (let n = 3; n <= 9 && i + n <= w.length; n += 2) out.push(w.slice(i, i + n).join(' '));
          return out;
        })))]
        : [...new Set([].concat(...phrasePool('ja').map((c) => c.split(/[、。！？「」『』（）・\s]/))).map((x) => x.trim()).filter((x) => x.length >= 6))];
      const size = (x) => (lang === 'en' ? x.split(' ').length : x.length);
      const poolOf = (lv) => {
        const [, kind, lo, hi] = LV[lv];
        const xs = kind === 'word' ? words.filter((x) => x.length >= lo) : phrases.filter((x) => size(x) >= lo && size(x) <= hi);
        return xs.length >= 8 ? xs : kind === 'word' ? words : phrases;
      };
      flashDrill(body, {
        kind: 'scramble', lang, lvl0, ms0: lvl0 >= 3 ? 900 : 1500, min: 80, max: 3000, maxLvl: LV.length - 1, ask: '元の言葉は？', lvName: (lv) => LV[lv][0],
        // 句は長さに応じて表示時間をのばす（6文字ぶんが基準）
        showMs: (ms, it, lv) => (LV[lv][1] === 'phrase' ? Math.round(ms * Math.max(1, it.ans.replace(/\s/g, '').length / (lang === 'en' ? 12 : 6))) : ms),
        gen: (lv) => {
          const [, , , , keep, hard, nm] = LV[lv], xs = poolOf(lv), ans = shuffle(xs)[0];
          const mu = mutants(ans, lang, false).slice(0, nm);
          return { show: scrambleText(ans, lang, keep), ans, wrong: mu.concat(nearDecoys(ans, xs, 3 - mu.length, hard)), len: ans.replace(/\s/g, '').length };
        },
        score: (b) => Math.round((b.lvl + 1) * 10000 + 10000 / b.ms),
        tip: 'レベル6以上（句）を速く見抜けるようになると、文章中のよく知っている言い回しは一瞬で処理されるようになります。そっくりな選択肢で間違えたら、どこが違ったかを確かめてから次へ。',
        again: () => scramble(lang),
      });
    };
  }

  /* =========================================================
   * 🎞 高速表示（RSVP）
   * ========================================================= */
  function chunksOf(t, size) {
    if (t.lang === 'en') {
      const ws = t.paras.join(' ').split(/\s+/), out = [];
      for (let i = 0; i < ws.length;) { let n = size, j = i; const part = []; while (j < ws.length && n-- > 0) { part.push(ws[j]); if (/[.,;:!?]$/.test(ws[j++])) break; } out.push(part.join(' ')); i = j; }
      return out;
    }
    return [].concat(...t.paras.map((p) => jaChunks(p, size)));
  }
  function rsvp(lang) {
    lang = lang === 'en' ? 'en' : 'ja';
    const b0 = base(lang), sp = lang === 'en' ? [150, 200, 250, 300, 400, 500, 600, 800, 1000] : [400, 600, 800, 1000, 1200, 1500, 2000, 2500, 3000, 4000, 5000];
    const def = sp.reduce((a, v) => (Math.abs(v - b0 * 1.5) < Math.abs(a - b0 * 1.5) ? v : a), sp[0]);
    const body = page('🎞 高速表示（RSVP）', `${langTabs('rsvp', lang)}<div class="box tip"><b>やり方</b>画面中央に文章が「かたまり」で次々に出ます。目を動かす必要がないので、<b>頭の中で音読する暇がない速さ</b>を体験できます。ベースラインの1.5倍から始め、理解度が67%以上なら1段ずつ上げる。スペースキーで一時停止。</div>
      ${textSelect('rsvp', lang)}
      <div class="grid two"><label class="field">速さ <select id="spd">${sp.map((v) => opt(v, def, `${v}${unitOf(lang)}（×${Math.round((v / b0) * 10) / 10}）`)).join('')}</select></label>
      <label class="field">かたまりの大きさ <select id="csz">${(lang === 'en' ? [[1, '1語'], [2, '2語'], [3, '3語'], [5, '5語']] : [[6, '小（〜6字）'], [10, '中（〜10字）'], [15, '大（〜15字）'], [22, '特大（〜22字）']]).map(([v, l]) => opt(v, lang === 'en' ? 3 : 10, l)).join('')}</select></label>
      <label class="field">加速モード <select id="acc">${opt('0', '1', 'なし（一定）')}${opt('1', '1', 'あり（0.8倍→1.5倍へ加速）')}</select></label></div>
      <p><button class="btn primary big" id="go">スタート</button></p>`, '目の移動と頭の中の音読を外して、「見た瞬間に意味」に近づける。');
    $('#go').onclick = () => {
      const t = selText(), spd = +$('#spd').value, acc = $('#acc').value === '1', cs = chunksOf(t, +$('#csz').value), unitLen = (s) => (lang === 'en' ? s.split(/\s+/).length : jaLen(s));
      countdown(body, () => {
        body.innerHTML = `<div class="sp-stage sp-rsvp"><b class="sp-line ${lang === 'en' ? 'en' : ''}" id="w"></b></div><div class="sp-bar"><div class="pbar"><i id="pb"></i></div><span class="muted small" id="sv"></span></div><p class="muted small center">スペース：一時停止／再開</p>`;
        let i = 0, paused = false, sumMs = 0;
        const show = () => {
          if (paused) return;
          if (i >= cs.length) return done();
          const s = cs[i], f = acc ? 0.8 + 0.7 * (i / cs.length) : 1, v = spd * f;
          $('#w').textContent = s; $('#pb').style.width = ((i + 1) / cs.length) * 100 + '%'; $('#sv').textContent = Math.round(v) + unitOf(lang);
          let ms = (unitLen(s) / v) * 60000; if (/[。.!?！？]$/.test(s)) ms *= 1.35;
          ms = Math.max(70, ms); sumMs += ms; i++;
          later(show, ms);
        };
        K.setKey((e) => { if (e.code === 'Space') { e.preventDefault(); paused = !paused; if (!paused) show(); } });
        const done = () => {
          stopAll();
          const effSpd = t.size / (sumMs / 60000);
          body.innerHTML = '<div id="qz"></div><div id="rs"></div>';
          mcQuiz($('#qz'), t.q, (ok, n) => {
            const comp = n ? ok / n : 0;
            rec('rsvp', lang, effSpd * comp, { tid: key(t), cpm: Math.round(effSpd), comp });
            K.addXP(6);
            $('#rs').innerHTML = resultCard([[fmt(effSpd), '表示速度（平均）'], [Math.round(comp * 100) + '%', '理解度'], [fmt(effSpd * comp), '実効'], ['×' + mult(effSpd * comp, lang), 'ベースライン比']], comp >= 0.67 ? '✔ 理解できています。次は1段階速くしてみましょう。' : '速さに理解が追いついていません。1段階遅くするか、かたまりを大きくしてみましょう。', t, true);
            $('#again').onclick = () => rsvp(lang);
          }, '✋ 内容チェック');
        };
        show();
      });
    };
  }

  /* =========================================================
   * 📏 ペーサー読み
   * ========================================================= */
  function linesOf(t, per) {
    const out = [];
    t.paras.forEach((p, pi) => {
      if (t.lang === 'en') { const ws = p.split(/\s+/); for (let i = 0; i < ws.length; i += per) out.push({ s: ws.slice(i, i + per).join(' '), n: Math.min(per, ws.length - i), p: pi }); }
      else { const cs = [...p]; for (let i = 0; i < cs.length; i += per) { const s = cs.slice(i, i + per).join(''); out.push({ s, n: jaLen(s), p: pi }); } }
    });
    return out;
  }
  function pacer(lang) {
    lang = lang === 'en' ? 'en' : 'ja';
    const b0 = base(lang), sp = lang === 'en' ? [120, 150, 180, 220, 260, 300, 350, 400, 500] : [400, 500, 600, 700, 800, 900, 1000, 1200, 1500, 1800, 2200];
    const def = sp.reduce((a, v) => (Math.abs(v - b0 * 1.2) < Math.abs(a - b0 * 1.2) ? v : a), sp[0]);
    const body = page('📏 ペーサー読み', `${langTabs('pacer', lang)}<div class="box tip"><b>やり方</b>ガイド（色の帯）が一定の速さで行を進みます。帯から<b>遅れない</b>ように読む。「返り読み禁止」モードでは、読み終えた行が消えていくので、戻って読み直すクセが外れます。指やペンで行をなぞる速読法を、画面で再現したものです。</div>
      ${textSelect('pacer', lang)}
      <div class="grid two"><label class="field">速さ <select id="spd">${sp.map((v) => opt(v, def, `${v}${unitOf(lang)}（×${Math.round((v / b0) * 10) / 10}）`)).join('')}</select></label>
      <label class="field">モード <select id="md">${opt('guide', 'mask', 'ガイドのみ')}${opt('mask', 'mask', '返り読み禁止（読んだ行が消える）')}</select></label></div>
      <p><button class="btn primary big" id="go">スタート</button></p>`, '「止まらず・戻らず・一定のリズム」で読む習慣を作る。精読速度を伸ばす王道。');
    $('#go').onclick = () => {
      const t = selText(), spd = +$('#spd').value, md = $('#md').value, L = linesOf(t, lang === 'en' ? (innerWidth < 600 ? 6 : 9) : (innerWidth < 600 ? 15 : 24));
      body.innerHTML = `<div class="sp-bar"><div class="pbar"><i id="pb"></i></div><span class="muted small">${spd}${unitOf(lang)}</span></div>
        <div class="sp-pacer ${lang === 'en' ? 'en' : ''}">${L.map((l, i) => `<div class="pl ${i && L[i - 1].p !== l.p ? 'np' : ''}" data-i="${i}">${esc(l.s)}</div>`).join('')}</div><p class="muted small center">スペース：一時停止／再開</p>`;
      const els = $$('.sp-pacer .pl');
      let i = 0, paused = false;
      const t0 = Date.now();
      const stepL = () => {
        if (paused) return;
        if (i > 0) { els[i - 1].classList.remove('on'); if (md === 'mask') els[i - 1].classList.add('gone'); }
        if (i >= L.length) return done();
        els[i].classList.add('on');
        const r = els[i].getBoundingClientRect(); if (r.bottom > innerHeight - 80 || r.top < 60) els[i].scrollIntoView({ block: 'center', behavior: 'smooth' });
        $('#pb').style.width = ((i + 1) / L.length) * 100 + '%';
        later(stepL, Math.max(120, (L[i++].n / spd) * 60000));
      };
      K.setKey((e) => { if (e.code === 'Space') { e.preventDefault(); paused = !paused; if (!paused) stepL(); } });
      const done = () => {
        stopAll();
        const realSpd = t.size / ((Date.now() - t0) / 60000), v = Math.min(spd, realSpd);
        body.innerHTML = '<div id="qz"></div><div id="rs"></div>';
        window.scrollTo(0, 0);
        mcQuiz($('#qz'), t.q, (ok, n) => {
          const comp = n ? ok / n : 0;
          rec('pacer', lang, v * comp, { tid: key(t), cpm: Math.round(v), comp });
          K.addXP(6);
          $('#rs').innerHTML = resultCard([[fmt(v), 'ペース'], [Math.round(comp * 100) + '%', '理解度'], [fmt(v * comp), '実効速度'], ['×' + mult(v * comp, lang), 'ベースライン比']], comp >= 0.67 ? '✔ このペースで理解できています。次回は1段階上げよう。「少しきつい」速さが一番伸びます。' : 'ペースが速すぎます。1段階下げて、理解度67%以上をキープしましょう。', t, true);
          $('#again').onclick = () => pacer(lang);
        }, '✋ 内容チェック');
      };
      stepL();
    };
  }

  /* =========================================================
   * 🛩 スキミング
   * ========================================================= */
  function timedView(body, t, ms, label, then) {
    body.innerHTML = `<div class="sp-bar"><span class="tag key">${label}</span><div class="pbar sp-time"><i id="pb"></i></div><span class="muted small" id="left"></span><button class="btn small-btn" id="end">もう分かった</button></div>${textHtml(t, 'sp-skim')}`;
    const t0 = Date.now();
    const fin = () => { stopAll(); then(Date.now() - t0); };
    every(() => { const el = Date.now() - t0, pb = $('#pb'), lf = $('#left'); if (!pb) return; pb.style.width = Math.max(0, 100 - (el / ms) * 100) + '%'; lf.textContent = Math.max(0, Math.ceil((ms - el) / 1000)) + '秒'; }, 100);
    later(fin, ms);
    $('#end').onclick = fin;
  }
  function skim(lang) {
    lang = lang === 'en' ? 'en' : 'ja';
    const body = page('🛩 スキミング', `${langTabs('skim', lang)}<div class="box tip"><b>やり方</b>文章が<b>制限時間だけ</b>表示されます。全部は読めない時間なので、<b>①タイトル ②各段落の最初の1文 ③数字・固有名詞・「しかし」「つまり」の後</b>だけを拾い、「何の話で、結論は何か」をつかむ。時間が来たら要旨の問題に答えます。</div>
      ${textSelect('skim', lang, (t) => t.g.length)}
      <label class="field">倍率（ベースライン ${fmt(base(lang))}${unitOf(lang)} に対して） <select id="mx">${[2, 3, 5, 10, 20, 30].map((v) => opt(v, 5, `×${v}`)).join('')}</select></label>
      <p><button class="btn primary big" id="go">スタート</button></p>`, '要点だけを抜く読み方。目的が「全体像」なら、全部を読む必要はない。');
    $('#go').onclick = () => {
      const t = selText(), mx = +$('#mx').value, ms = Math.max(3000, (t.size / (base(lang) * mx)) * 60000);
      countdown(body, () => timedView(body, t, ms, `×${mx}・${sec(ms)}`, (used) => {
        body.innerHTML = '<div id="qz"></div><div id="rs"></div>';
        mcQuiz($('#qz'), t.g, (ok, n) => {
          const comp = n ? ok / n : 0, cpm = t.size / (used / 60000), v = cpm * comp;
          rec('skim', lang, v, { tid: key(t), cpm: Math.round(cpm), comp });
          K.addXP(6);
          $('#rs').innerHTML = resultCard([[fmt(cpm), '処理速度'], [Math.round(comp * 100) + '%', '要旨の正解率'], [fmt(v), '把握速度'], ['×' + mult(v, lang), 'ベースライン比']], comp >= 0.99 ? '🛩 要旨を完全につかめています。倍率を上げて挑戦しよう。' : comp >= 0.5 ? '半分つかめています。段落の最初の1文に目を集中させると精度が上がります。' : '倍率を下げて、「段落の頭だけ読む」型を体に入れましょう。', t, true);
          $('#again').onclick = () => skim(lang);
        }, '✋ 要旨チェック（全体として何を言っていた？）');
      }));
    };
  }

  /* =========================================================
   * 🔍 スキャニング
   * ========================================================= */
  function scan() {
    const body = page('🔍 スキャニング', `<div class="box tip"><b>やり方</b>先に<b>問い</b>が出ます。「探す」を押すと文章が出るので、答えが見つかった瞬間に「見つけた！」。そのあと答えを選びます。<b>文章を読まず、答えの形（数字・人名・カタカナ…）だけを探して目を走らせる</b>のがコツ。辞書を引く、資料から数字を拾う——実務で最も時間を節約できる読み方です。</div>
      ${textSelect('scan', 'ja', (t) => t.sc.length)}<p><button class="btn primary big" id="go">スタート</button></p>`, '「探す読み」は全部を読まないので、倍率は桁違いに出ます。');
    $('#go').onclick = () => {
      const t = selText(), tasks = shuffle(t.sc);
      let k = 0, tot = 0, okN = 0, bestV = 0;
      const one = () => {
        if (k >= tasks.length) return end();
        const s = tasks[k++];
        body.innerHTML = `<div class="sp-bar"><span class="muted small">${k}/${tasks.length}</span></div><div class="card sp-ask"><b>🔍 ${esc(s.q)}</b></div><p class="center"><button class="btn primary big" id="find">探す</button></p>`;
        $('#find').onclick = () => {
          const t0 = Date.now();
          body.innerHTML = `<div class="sp-bar"><span class="tag key">🔍 ${esc(s.q)}</span><span class="muted small" id="el"></span><button class="btn primary" id="got">見つけた！</button></div>${textHtml(t)}`;
          every(() => { const e = $('#el'); if (e) e.textContent = sec(Date.now() - t0); }, 100);
          $('#got').onclick = () => {
            const ms = Date.now() - t0; stopAll();
            body.innerHTML = `<div class="sp-bar"><span class="muted small">${sec(ms)}</span></div><div id="qz"></div>`;
            mcQuiz($('#qz'), [normQ(s)], (ok) => {
              tot += ms; if (ok) { okN++; bestV = Math.max(bestV, t.size / (ms / 60000)); }
              $('#qz').insertAdjacentHTML('beforeend', '<p class="center"><button class="btn primary" id="nx">次へ</button></p>');
              $('#nx').onclick = one;
            }, '答えは？');
          };
        };
      };
      const end = () => {
        const avg = tot / tasks.length, v = okN ? (t.size / (avg / 60000)) * (okN / tasks.length) : 0;
        if (v) rec('scan', 'ja', v, { tid: key(t), cpm: Math.round(bestV) });
        K.addXP(6);
        body.innerHTML = resultCard([[`${okN}/${tasks.length}`, '正解'], [sec(avg), '平均の発見時間'], [fmt(v), '探索速度（字/分）'], ['×' + mult(v, 'ja'), 'ベースライン比']], '探索速度は「全文を読んだとしたら」の換算です。これが100倍を超えることは珍しくありません——<b>読む量を減らすことこそ、最大の速読</b>だからです。', t, true);
        $('#again').onclick = scan;
      };
      one();
    };
  }

  /* =========================================================
   * 🌀 高速多回転読み
   * ========================================================= */
  const MULTI = { std: ['標準', [1 / 8, 1 / 6, 1 / 4]], fast: ['高速', [1 / 15, 1 / 10, 1 / 8]], ultra: ['超高速', [1 / 30, 1 / 20, 1 / 15]] };
  function kwPick(box, t, done) {
    const opts = shuffle(t.kw.concat(t.nk));
    box.innerHTML = `<h3>🎯 出てきた言葉をすべて選んでください</h3><p class="muted small">本文に出てきたのは ${t.kw.length}個。分からなければ選ばない（お手つきは減点）。</p><div class="sp-kws ${t.lang === 'en' ? 'en' : ''}">${opts.map((w) => `<button class="sp-kw" data-w="${esc(w)}">${esc(w)}</button>`).join('')}</div><p class="center"><button class="btn primary" id="kwok">決定</button></p>`;
    $$('.sp-kw', box).forEach((b) => (b.onclick = () => b.classList.toggle('on')));
    $('#kwok').onclick = () => {
      let hit = 0, fa = 0;
      $$('.sp-kw', box).forEach((b) => { const real = t.kw.includes(b.dataset.w), on = b.classList.contains('on'); b.disabled = true; b.classList.add(real ? 'real' : 'fake'); if (on && real) hit++; if (on && !real) fa++; });
      $('#kwok').remove();
      const score = clamp((hit - fa) / t.kw.length, 0, 1);
      box.insertAdjacentHTML('beforeend', `<p class="center">拾えた ${hit}/${t.kw.length}・お手つき ${fa} → <b>${Math.round(score * 100)}点</b></p>`);
      done(score);
    };
  }
  function multi(lang) {
    lang = lang === 'en' ? 'en' : 'ja';
    const body = page('🌀 高速多回転読み', `${langTabs('multi', lang)}<div class="box tip"><b>やり方</b>同じ文章を、短い時間で<b>3回</b>読みます。<br>① 1回転目：キーワードを拾う（何の話？）→ 出てきた言葉を当てる<br>② 2回転目：構造をつかむ（結論は？ 流れは？）→ 要旨の問題<br>③ 3回転目：詳細を拾う → 内容の問題<br>1回で完璧に読もうとせず、<b>粗く → 細かく</b>と網の目を細かくしていくのがコツ。本1冊を短時間で読む方法の、ミニチュア版です。</div>
      ${textSelect('multi', lang, (t) => t.kw.length && t.q.length)}
      <label class="field">スピード <select id="lv">${Object.entries(MULTI).map(([k, [n, f]]) => opt(k, 'fast', `${n}（合計で通常の約${Math.round(100 / (f[0] + f[1] + f[2])) / 100}倍速）`)).join('')}</select></label>
      <p><button class="btn primary big" id="go">スタート</button></p>`, '速読で「1冊◯分」を実現する、中心的なトレーニング。');
    $('#go').onclick = () => {
      const t = selText(), f = MULTI[$('#lv').value][1], tn = (t.size / base(lang)) * 60000, used = [];
      const scores = [];
      const round = (r) => countdown(body, () => timedView(body, t, Math.max(2500, tn * f[r]), `${r + 1}回転目 ${['キーワード', '構造', '詳細'][r]}`, (ms) => {
        used.push(ms);
        body.innerHTML = '<div id="qz"></div>';
        const next = (sc) => { scores.push(sc); $('#qz').insertAdjacentHTML('beforeend', `<p class="center"><button class="btn primary" id="nx">${r < 2 ? (r + 2) + '回転目へ →' : '結果を見る'}</button></p>`); $('#nx').onclick = () => (r < 2 ? round(r + 1) : end()); };
        if (r === 0) kwPick($('#qz'), t, next);
        else mcQuiz($('#qz'), r === 1 ? t.g : t.q, (ok, n) => next(n ? ok / n : 0), r === 1 ? '✋ 構造・要旨' : '✋ 詳細');
      }));
      const end = () => {
        const tot = used.reduce((a, b) => a + b, 0), cpm = t.size / (tot / 60000), comp = scores[0] * 0.2 + scores[1] * 0.4 + scores[2] * 0.4, v = cpm * comp;
        rec('multi', lang, v, { tid: key(t), cpm: Math.round(cpm), comp });
        K.addXP(10);
        body.innerHTML = resultCard([[sec(tot), '合計時間'], [fmt(cpm), '処理速度'], [Math.round(comp * 100) + '%', '総合理解度'], [fmt(v), '把握速度'], ['×' + mult(v, lang), 'ベースライン比']], `回転ごとの得点：キーワード ${Math.round(scores[0] * 100)}・構造 ${Math.round(scores[1] * 100)}・詳細 ${Math.round(scores[2] * 100)}。<br>${comp >= 0.7 ? '十分つかめています。スピードを上げてみよう。' : '1回転目で「見出し・段落の頭」を拾えると、2回転目以降が楽になります。'}`, t, true);
        $('#again').onclick = () => multi(lang);
      };
      round(0);
    };
  }

  /* =========================================================
   * 🎯 キーワード・フラッシュ
   * ========================================================= */
  function kw(lang) {
    lang = lang === 'en' ? 'en' : 'ja';
    const body = page('🎯 キーワード・フラッシュ', `${langTabs('kw', lang)}<div class="box tip"><b>やり方</b>文章が<b>ベースラインの10倍速</b>の時間だけ表示されます。読もうとせず、ページ全体を眺めて「目に飛び込んでくる言葉」を拾う。そのあと、出てきた言葉を当てます。</div>
      ${textSelect('kw', lang, (t) => t.kw.length)}<p><button class="btn primary big" id="go">スタート</button></p>`, '大事な言葉は、探さなくても目に飛び込んでくる——その感覚を育てる。');
    $('#go').onclick = () => {
      const t = selText(), ms = Math.max(2500, (t.size / (base(lang) * 10)) * 60000);
      countdown(body, () => timedView(body, t, ms, `×10・${sec(ms)}`, () => {
        body.innerHTML = '<div id="qz"></div>';
        kwPick($('#qz'), t, (sc) => {
          rec('kw', lang, sc * 100, { tid: key(t) });
          K.addXP(4);
          $('#qz').insertAdjacentHTML('beforeend', resultCard([[Math.round(sc * 100) + '点', 'キーワード得点']], sc >= 0.67 ? '良い目です。ページ全体をぼんやり見る「広い目」ができてきています。' : '1点を凝視せず、ページ全体を少し遠くから眺めるように見てみましょう。', t, true));
          $('#again').onclick = () => kw(lang);
        });
      }));
    };
  }

  /* =========================================================
   * ✍ 1分アウトプット
   * ========================================================= */
  function output(tid) {
    const t = tid && App.speedTextMap[tid];
    const outs = SP().outs.slice(-12).reverse();
    const body = page('✍ 1分アウトプット', `<div class="box tip"><b>なぜ書くのか</b>読んだ直後に思い出して書くと、記憶への残り方が大きく変わります（テスト効果）。そして、<b>読書の価値は「何を得て、何をするか」</b>で決まります。速く読んで、すぐ出す。これが「圧倒的なアウトプット」の最小単位です。</div>
      <label class="field">読んだもの <input id="ot" value="${esc(t ? t.title : '')}" placeholder="本・記事・練習文のタイトル"></label>
      <p><button class="btn primary big" id="go">60秒スタート</button></p>
      ${outs.length ? `<h3>これまでのアウトプット（${SP().outs.length}回）</h3>${outs.map((o) => `<div class="card sp-out"><b>${esc(o.title || '（無題）')}</b> <span class="muted small">${dayStr(o.d)}</span><p class="small">🔑 ${esc(o.kw)}<br>💡 ${esc(o.sum)}<br>🚀 ${esc(o.act)}</p></div>`).join('')}` : ''}`, '読書を「成果」に変える60秒。');
    $('#go').onclick = () => {
      const title = $('#ot').value.trim();
      let left = 60;
      body.innerHTML = `<div class="sp-bar"><span class="tag key">${esc(title || '（無題）')}</span><span class="sp-big" id="lf">60</span></div>
        <label class="field">🔑 キーワード3つ <input id="o1" placeholder="例：チャンク、熟達、パターン"></label>
        <label class="field">💡 ひとことで言うと？ <textarea id="o2" rows="2" placeholder="この文章（本）の主張を1文で"></textarea></label>
        <label class="field">🚀 自分はどう使う？ <textarea id="o3" rows="2" placeholder="明日から試すこと・仕事への応用を1つ"></textarea></label>
        <p class="center"><button class="btn primary" id="sv">保存する</button></p>`;
      $('#o1').focus();
      every(() => { left--; const e = $('#lf'); if (e) { e.textContent = Math.max(0, left); e.classList.toggle('hurry', left <= 10); } if (left <= 0) stopAll(); }, 1000);
      $('#sv').onclick = () => {
        const o = { d: dayNo(), title, kw: $('#o1').value.trim(), sum: $('#o2').value.trim(), act: $('#o3').value.trim() };
        if (!o.kw && !o.sum && !o.act) { K.toast('何か1つは書いてみよう'); return; }
        stopAll(); SP().outs.push(o); K.save(); K.addXP(5); K.checkBadges();
        K.toast('✍ アウトプットを保存しました +5 XP', 'good');
        output(tid);
      };
    };
  }

  /* =========================================================
   * 📕 実書籍トレーニング
   * ========================================================= */
  const BOOK_STEPS = [
    ['🎯 目的を決める', '1分', 'この本から<b>何を持ち帰るか</b>を、問いの形で書く。「〜するには？」「〜はなぜ？」。目的があると、脳は関係ある情報だけを拾い始めます。', 'q'],
    ['🗺 下見（構造をつかむ）', '3分', '表紙・帯・著者紹介 → <b>目次</b>（全体の地図）→ まえがき → あとがき。目次で「目的に効きそうな章」に印をつける。', 'map'],
    ['🌀 1回転目：めくる', '1ページ1〜2秒', '読まない。<b>見出し・太字・図表・箇条書き</b>だけが目に入ればOK。全体の「どこに何があるか」をつかむ。', 'r1'],
    ['🌀 2回転目：拾う', '1ページ3〜5秒', '各段落の最初の1文と、目的に関係ありそうな言葉を拾う。<b>気になったページに付箋（折り目）</b>。', 'r2'],
    ['🔎 3回転目：付箋だけ精読', '自由', '付箋を付けた所だけ、ふつうの速さでしっかり読む。ここが本当の「読書」。全体の1〜2割で十分なことが多い。', 'r3'],
    ['✍ アウトプット', '3分', '問いへの答え・学び3つ・明日やること1つを書く。<b>書いた分だけが、あなたの成果になる。</b>', 'out'],
  ];
  function book() {
    const bs = SP().books.slice().reverse();
    const body = page('📕 実書籍トレーニング', `<div class="talk"><div class="t-av">⚡</div><div class="t-bubble">ここが<b>10倍〜100倍の本番</b>です。本1冊（約10万字）をふつうに読むと、500字/分でおよそ<b>3時間20分</b>。これを「目的 → 下見 → 3回転 → アウトプット」で<b>20〜30分</b>にすれば約7〜10倍、目的の答えだけを探すなら数分＝数十倍以上です。<br>大事なのは「全部読んだか」ではなく、<b>「目的の答えと行動を持ち帰ったか」</b>。</div></div>
      <div class="grid two"><label class="field">本のタイトル <input id="bt" placeholder="例：〇〇の教科書"></label><label class="field">ページ数 <input id="bp" type="number" min="10" value="200"></label>
      <label class="field">1ページの字数（目安） <select id="bc">${[[400, '400（大きい字・図が多い）'], [600, '600（ビジネス書・新書）'], [800, '800（文字が多い）']].map(([v, l]) => opt(v, 600, l)).join('')}</select></label></div>
      <p><button class="btn primary big" id="go">トレーニング開始</button></p>
      <h3>手順（全6ステップ）</h3><ol class="steps-ol">${BOOK_STEPS.map(([a, m, d]) => `<li><b>${a}</b> <span class="muted small">${m}</span><br><span class="small">${d}</span></li>`).join('')}</ol>
      ${bs.length ? `<h3>これまでの本（${bs.length}冊）</h3><table class="tbl"><tr><th>日付</th><th>本</th><th>時間</th><th>換算速度</th><th>問い → 答え</th></tr>${bs.map((b) => `<tr><td>${dayStr(b.d)}</td><td>${esc(b.title)}</td><td>${b.min}分</td><td>${fmt(b.cpm)}字/分 ${multTag(b.cpm, 'ja')}</td><td class="small">${esc(b.q || '')}${b.ans ? ' → ' + esc(b.ans) : ''}</td></tr>`).join('')}</table>` : ''}`, '手元の本を、このアプリのタイマーとガイドで読み切る。');
    $('#go').onclick = () => {
      const B = { title: $('#bt').value.trim() || '（無題の本）', pages: Math.max(10, +$('#bp').value || 200), cpp: +$('#bc').value, laps: [], notes: {} };
      let s = 0, ts = Date.now();
      const t0 = Date.now();
      const render = () => {
        const [a, m, d, id] = BOOK_STEPS[s], est = id === 'r1' ? `目安 ${Math.round(B.pages * 1.5 / 60)}分` : id === 'r2' ? `目安 ${Math.round(B.pages * 4 / 60)}分` : '目安 ' + m;
        body.innerHTML = `<div class="sp-bar"><span class="tag key">${esc(B.title)}</span><span class="muted small">ステップ ${s + 1}/6</span><span class="sp-big" id="el">0:00</span></div>
          <div class="pbar"><i style="width:${(s / 6) * 100}%"></i></div>
          <div class="card sp-ask"><h2>${a}</h2><p class="muted small">${est}</p><p>${d}</p>
          ${id === 'q' ? '<label class="field">この本への問い <input id="bq" placeholder="例：部下のやる気を引き出すには？"></label>' : ''}
          ${id === 'map' ? '<label class="field">目次で印をつけた章（メモ） <input id="bm" placeholder="例：2章・5章"></label>' : ''}
          ${id === 'out' ? `<label class="field">問いへの答え <textarea id="ba" rows="2" placeholder="${esc(B.q || '問いへの答え')}"></textarea></label><label class="field">学び3つ <textarea id="bl" rows="3"></textarea></label><label class="field">明日やること1つ <input id="bd"></label>` : ''}</div>
          <p class="center"><button class="btn primary big" id="nx">${s < 5 ? '次のステップへ →' : '完了して記録する'}</button></p>`;
        every(() => { const e = $('#el'); if (!e) return; const sx = Math.floor((Date.now() - ts) / 1000); e.textContent = Math.floor(sx / 60) + ':' + String(sx % 60).padStart(2, '0'); }, 500);
        $('#nx').onclick = () => {
          stopAll();
          B.laps.push(Math.round((Date.now() - ts) / 1000)); ts = Date.now();
          if (id === 'q') B.q = $('#bq').value.trim();
          if (id === 'map') B.notes.map = $('#bm').value.trim();
          if (id === 'out') { B.ans = $('#ba').value.trim(); B.notes.learn = $('#bl').value.trim(); B.notes.todo = $('#bd').value.trim(); }
          if (s < 5) { s++; render(); return; }
          const min = Math.max(1, Math.round((Date.now() - t0) / 60000)), cpm = (B.pages * B.cpp) / min;
          const rec2 = { d: dayNo(), title: B.title, pages: B.pages, min, cpm: Math.round(cpm), q: B.q, ans: B.ans, laps: B.laps, notes: B.notes };
          SP().books.push(rec2);
          if (B.ans || B.notes.learn) SP().outs.push({ d: dayNo(), title: B.title, kw: B.notes.learn || '', sum: B.ans || '', act: B.notes.todo || '' });
          K.save(); K.addXP(50); K.checkBadges(); K.confetti(70);
          const normal = (B.pages * B.cpp) / base('ja');
          body.innerHTML = resultCard([[min + '分', 'かかった時間'], [fmt(cpm) + '字/分', '換算速度'], ['×' + mult(cpm, 'ja'), 'ベースライン比'], [Math.round(normal) + '分', 'ふつうに読んだ場合']], `📕 1冊完了！ +50 XP<br>ステップごとの時間：${B.laps.map((x, i) => `${i + 1}) ${Math.round(x / 60)}分`).join('・')}<br>この「本の換算速度」は、全部を精読した速さではなく<b>目的を持ち帰るまでの速さ</b>です。持ち帰った答えと行動が、そのまま成果です。`, null, false);
        };
      };
      render();
    };
  }

  /* ---------- ルート ---------- */
  App.routes.speed = function (p) {
    K.onLeave(stopAll);
    const [k, a] = p;
    if (!k) return viewHub();
    if (k === 'measure') return a && a.endsWith('rebase') ? rebase(a.startsWith('en') ? 'en' : 'ja') : measure(a === 'en' ? 'en' : 'ja');
    const map = { eye, schulte, span, flash, scramble, rsvp, pacer, skim, scan, multi, kw, output, book };
    if (map[k]) return map[k](a);
    view().innerHTML = '<div class="card empty"><h2>ページが見つかりません</h2><a class="btn primary" href="#/speed">速読ジムへ</a></div>';
  };
})();
