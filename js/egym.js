/* =========================================================
 * 英語ジム — 口と手を動かすアウトプット練習（#/egym）
 * 瞬間英作文・ディクテーション・シャドーイング・Part 5 タイムアタック。
 * 例文は courses/english-sentences.js で LearnApp.addSentences([[型, 日本語, 英語], ...]) により登録する。
 * ========================================================= */
(function () {
  'use strict';
  const App = window.LearnApp, K = App.kit, D = App.D;
  const { $, $$, esc, shuffle, dayNo, dayStr } = K;
  const view = () => K.view();

  /* ---------- 例文 ---------- */
  const PATTERNS = [
    ['p1', '文の骨格（5文型）', '🧱'], ['p2', '時制', '⏱'], ['p3', '現在完了', '✅'], ['p4', '助動詞・依頼', '🙏'], ['p5', '受動態', '🔁'],
    ['p6', '不定詞・動名詞', '🧩'], ['p7', '分詞・関係詞', '🔗'], ['p8', '接続詞', '➕'], ['p9', '比較', '⚖️'], ['p10', '仮定法・ていねい表現', '💭'],
    ['p11', 'ビジネスの定型', '💼'], ['p12', '海外・雑談', '✈️'], ['p13', '技術説明・プレゼン', '📊'],
  ];
  const PNAME = {}; PATTERNS.forEach(([id, n, e]) => (PNAME[id] = e + ' ' + n));
  const SENT = [];
  App.addSentences = (list) => list.forEach(([p, ja, en]) => SENT.push({ id: p + ':' + en, p, ja, en }));
  App.egymSentences = SENT;

  /* ---------- 記録 ---------- */
  const ST = () => {
    const S = K.S;
    S.egym = S.egym || {};
    const x = S.egym;
    x.sent = x.sent || {}; x.log = x.log || []; x.p5 = x.p5 || [];
    return x;
  };
  const mastered = (s) => { const r = ST().sent[s.id]; return !!r && r.ok >= 2 && r.last === 1; };
  function mark(s, ok) { const x = ST(), r = (x.sent[s.id] = x.sent[s.id] || { ok: 0, ng: 0 }); if (ok) r.ok++; else r.ng++; r.last = ok ? 1 : 0; r.d = dayNo(); }
  function logRun(k, n, ok, sec) { const x = ST(); x.log.push({ d: dayNo(), k, n, ok, s: Math.round(sec) }); if (x.log.length > 400) x.log.splice(0, x.log.length - 400); K.save(); }
  const todayN = () => ST().log.filter((e) => e.d === dayNo()).reduce((a, e) => a + e.n, 0);

  /* ---------- 共通の道具 ---------- */
  let timer = null, tmo = null, seq = 0;
  const stopAll = () => { clearInterval(timer); clearTimeout(tmo); timer = tmo = null; seq++; if ('speechSynthesis' in window) speechSynthesis.cancel(); K.setKey(null); };
  function speak(text, rate, onend) {
    if (!('speechSynthesis' in window)) { K.toast('この環境では音声読み上げが使えません'); if (onend) onend(); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text), v = K.pickVoice();
    u.lang = 'en-US'; u.rate = rate || K.S.settings.rate; if (v) u.voice = v;
    if (onend) { let done = false; const fin = () => { if (!done) { done = true; onend(); } }; u.onend = fin; u.onerror = fin; }
    speechSynthesis.speak(u);
  }
  const norm = (s) => String(s).normalize('NFKC').toLowerCase().replace(/[’‘`]/g, "'").replace(/[.,!?;:"“”()]/g, ' ').replace(/\s+/g, ' ').trim();
  const wordsOf = (s) => norm(s).split(' ').filter(Boolean);
  const tilesOf = (en) => en.replace(/[.,!?]/g, '').split(/\s+/).filter(Boolean);
  const opt = (v, cur, label) => `<option value="${esc(v)}" ${String(cur) === String(v) ? 'selected' : ''}>${esc(label)}</option>`;
  function page(title, inner, lead) {
    stopAll();
    view().innerHTML = `${K.crumbs([['英語ジム', '#/egym'], [title]])}<div class="card sp-wrap"><h1>${title}</h1>${lead ? `<p class="muted">${lead}</p>` : ''}<div id="egbody">${inner}</div></div>`;
    window.scrollTo(0, 0);
    return $('#egbody');
  }
  const result = (rows, msg, extra = '') => `<div class="card sp-res pop"><div class="stats">${rows.map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join('')}</div>${msg ? `<p>${msg}</p>` : ''}${extra}
    <div class="actions center"><button class="btn primary" id="again">もう一度</button><a class="btn" href="#/egym">🗣 英語ジムへ戻る</a></div></div>`;
  const patSelect = (cur, withWeak = true) => `<label class="field">文の型 <select id="pat">${opt('all', cur, 'すべての型からまぜる')}${withWeak ? opt('weak', cur, 'まちがえた文・まだ言えない文を優先') : ''}${PATTERNS.map(([id, n, e]) => opt(id, cur, `${e} ${n}（${SENT.filter((s) => s.p === id).length}文）`)).join('')}</select></label>`;
  // 練習する文を選ぶ：まだ言えない文 → まちがえた文 → 久しぶりの文、の順に優先
  function pick(pat, n, filter) {
    let pool = SENT.filter((s) => (pat === 'all' || pat === 'weak' || s.p === pat) && (!filter || filter(s)));
    const sent = ST().sent;
    const score = (s) => { const r = sent[s.id]; if (!r) return pat === 'weak' ? 1 : 2; if (r.last === 0) return 3; return mastered(s) ? 0 : 1; };
    pool = shuffle(pool).sort((a, b) => score(b) - score(a));
    return shuffle(pool.slice(0, n));
  }
  // 単語の並びの最長共通部分（どの単語が合っていたかを出す）
  function lcsMark(target, input) {
    const n = target.length, m = input.length, dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = target[i] === input[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    const hit = new Array(n).fill(false);
    let i = 0, j = 0;
    while (i < n && j < m) { if (target[i] === input[j]) { hit[i] = true; i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++; }
    return hit;
  }
  const sayBtn = (en) => `<button class="btn" data-say="${esc(en)}">🔊 聞く</button><button class="btn ghost" data-say="${esc(en)}" data-rate="0.7">🐢 ゆっくり</button>`;

  /* ---------- ハブ ---------- */
  function hub() {
    stopAll();
    const x = ST(), total = x.log.reduce((a, e) => a + e.n, 0), m = SENT.filter(mastered).length, best = x.p5.reduce((a, e) => Math.max(a, e.ok / e.n), 0);
    const days = []; for (let d = dayNo() - 6; d <= dayNo(); d++) days.push([dayStr(d).slice(5), x.log.filter((e) => e.d === d).reduce((a, e) => a + e.n, 0), d === dayNo()]);
    const dmax = Math.max(10, ...days.map((d) => d[1]));
    const card = (k, ic, name, desc, tag) => `<a class="card sp-card" href="#/egym/${k}"><div class="sp-ic">${ic}</div><div><b>${name}</b>${tag ? ` <span class="tag good">${tag}</span>` : ''}<p class="muted small">${desc}</p></div></a>`;
    view().innerHTML = `${K.crumbs([['英語ジム']])}
      <section class="hero"><div><h1>🗣 英語ジム</h1><p class="muted">授業で「わかった」英語を、<b>口と手から出せる</b>英語に変える場所。日本語を見て1秒で英語にする、聞いて書き取る、音に重ねて話す、時間内に解く。</p></div>
        <div class="stats"><div><b>${todayN()}</b><span>今日の練習（文・問）</span></div><div><b>${total}</b><span>累計</span></div><div><b>${m}/${SENT.length}</b><span>すぐ言える文</span></div><div><b>${x.p5.length ? Math.round(best * 100) + '%' : '—'}</b><span>Part 5 自己ベスト</span></div></div></section>
      <div class="sp-grid">
        ${card('compose', '⚡', '瞬間英作文', '日本語を見て、すぐ英語に。単語を並べるモードと、自分で打つモード。まちがえた文は優先的にもう一度出ます。', `${SENT.length}文`)}
        ${card('dict', '✍️', 'ディクテーション', '音声を聞いて書き取る。どの単語が聞き取れなかったかを色で表示。リスニングの弱点が見える。')}
        ${card('shadow', '🎧', 'シャドーイング', `聞く → 文字を見て重ねる → 文字なしで影のようについていく。多読ライブラリの${(LearnApp.readings || []).length}話も教材になる。`)}
        ${card('p5', '⏱', 'Part 5 タイムアタック', '空所補充を1問20秒で20問。TOEIC 本番のペースに体を慣らす。分野ごとの正解率も出る。')}
      </div>
      <div class="grid two">
        <div class="card"><h3>🗓 おすすめの15分</h3><ol class="small"><li><a href="#/egym/compose">瞬間英作文</a> 10文（5分）</li><li><a href="#/egym/dict">ディクテーション</a> 8文（5分）</li><li><a href="#/egym/shadow">シャドーイング</a> 1本（5分）</li></ol><p class="small muted">TOEIC の前は <a href="#/egym/p5">Part 5 タイムアタック</a>を1日1回。</p></div>
        <div class="card"><h3>📈 この7日間（文・問）</h3><div class="eg-days">${days.map(([lb, v, td]) => `<div><span class="n">${v || ''}</span><i class="${td ? 'td' : ''}" style="height:${Math.round((v / dmax) * 70)}%"></i><span class="d">${lb}</span></div>`).join('')}</div></div>
      </div>
      <h2 class="sec">型ごとの「すぐ言える文」</h2>
      <div class="card">${PATTERNS.map(([id, n, e]) => { const ss = SENT.filter((s) => s.p === id), k = ss.filter(mastered).length; return `<div class="deck-row"><div class="dr-b"><b>${e} ${n}</b><div class="bar"><i style="width:${Math.round((k / ss.length) * 100)}%"></i></div><span class="small muted">すぐ言える ${k}/${ss.length}</span></div><div class="dr-a"><a class="btn primary" href="#/egym/compose/${id}">練習</a></div></div>`; }).join('')}</div>
      <p class="small muted">「すぐ言える」＝2回以上正解し、直近も正解した文。<a href="#/c/english">🎓 英語コース（授業）へ →</a></p>`;
  }

  /* ---------- ⚡ 瞬間英作文 ---------- */
  function compose(pat0) {
    let mode = 'tile'; try { mode = localStorage.getItem('eg.mode') === 'type' ? 'type' : 'tile'; } catch (e) { /* 既定は並べ替え */ }
    const body = page('⚡ 瞬間英作文', `<div class="box tip"><b>やり方</b>日本語を見たら、<b>考え込まずに</b>英語にします。完ぺきな訳より<b>スピード</b>。正解したら音声が流れるので、<b>声に出してまねる</b>ところまでが1セットです。</div>
      ${patSelect(PATTERNS.some((p) => p[0] === pat0) ? pat0 : 'weak')}
      <label class="field">答え方 <select id="mode">${opt('tile', mode, '単語を並べる（まずはこちら）')}${opt('type', mode, '自分で打つ（ヒントなし・上級）')}</select></label>
      <p><button class="btn primary big" id="go">スタート（10文）</button></p>`, '文法を「知っている」から「使える」へ。同じ型の文を続けて作ると、型が口になじみます。');
    $('#go').onclick = () => {
      const pat = $('#pat').value; mode = $('#mode').value;
      try { localStorage.setItem('eg.mode', mode); } catch (e) { /* 保存できなくても続ける */ }
      runCompose(body, pick(pat, 10), mode, () => compose(pat));
    };
  }
  function runCompose(body, items, mode, again) {
    let i = 0, ok = 0, tsum = 0;
    const miss = [];
    const finish = () => {
      stopAll();
      const n = items.length, xp = ok * 2 + 5;
      K.addXP(xp); logRun('compose', n, ok, tsum); if (ok === n) K.confetti(50);
      body.innerHTML = result([[`${ok}/${n}`, '正解'], [(tsum / n).toFixed(1) + '秒', '1文あたり'], ['+' + xp, 'XP']], ok === n ? '全問正解！ 次は「自分で打つ」モードや、別の型に進みましょう。' : 'まちがえた文は、次回優先的に出ます。下の文を声に出してから「もう一度」。',
        miss.length ? `<h3>まちがえた文</h3><div class="eg-list">${miss.map((s) => `<div><div class="muted small">${esc(s.ja)}</div><span class="say en">${esc(s.en)}</span></div>`).join('')}</div>${miss.length ? '<p><button class="btn gold" id="retry">まちがえた文だけもう一度</button></p>' : ''}` : '');
      K.decorate(body);
      $('#again').onclick = again;
      if ($('#retry')) $('#retry').onclick = () => runCompose(body, miss.slice(), mode, again);
    };
    const show = () => {
      if (i >= items.length) return finish();
      const s = items[i], target = tilesOf(s.en), t0 = Date.now();
      let tiles = shuffle(target.map((w, k) => ({ w, k })));
      if (target.length > 1 && tiles.every((t, k) => t.w === target[k])) tiles = tiles.slice().reverse();
      const picked = [];
      body.innerHTML = `<div class="sp-bar"><span class="tag">${i + 1} / ${items.length}</span><span class="tag key">${PNAME[s.p]}</span></div>
        <div class="eg-ja">${esc(s.ja)}</div>
        ${mode === 'type' ? `<input class="eg-in en" id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="英語で入力して Enter">` : `<div class="eg-slots en" id="slots"></div><div class="eg-tiles en" id="tiles"></div>`}
        <div class="actions">${mode === 'tile' ? '<button class="btn" id="undo">← 1つ戻す</button>' : ''}<button class="btn primary" id="chk">確認</button><button class="btn ghost" id="giveup">わからない</button></div><div id="fb"></div>`;
      const draw = () => {
        $('#slots').innerHTML = picked.length ? picked.map((t) => `<span class="eg-tile on">${esc(t.w)}</span>`).join('') : '<span class="muted small">下の単語を、正しい順にタップ</span>';
        $('#tiles').innerHTML = tiles.map((t, k) => `<button class="eg-tile ${picked.includes(t) ? 'used' : ''}" data-k="${k}">${esc(t.w)}</button>`).join('');
        $$('#tiles .eg-tile').forEach((b) => (b.onclick = () => { const t = tiles[+b.dataset.k]; if (picked.includes(t)) return; picked.push(t); draw(); if (picked.length === tiles.length) judge(); }));
      };
      const judge = (gave) => {
        const sec = (Date.now() - t0) / 1000, mine = mode === 'type' ? $('#ans').value : picked.map((t) => t.w).join(' ');
        const good = !gave && wordsOf(mine).join(' ') === wordsOf(s.en).join(' ');
        tsum += Math.min(sec, 60);
        $$('#egbody .actions button, #tiles button').forEach((b) => (b.disabled = true));
        if ($('#ans')) $('#ans').disabled = true;
        const next = (isOk) => { mark(s, isOk); if (isOk) ok++; else miss.push(s); i++; show(); };
        $('#fb').innerHTML = `<div class="box ${good ? 'point' : 'warn'}"><b>${good ? `⭕ 正解！（${sec.toFixed(1)}秒）` : '❌ 模範解答'}</b>
          <div class="eg-model en">${esc(s.en)}</div>${good || gave ? '' : `<div class="small muted">あなたの答え：<span class="en">${esc(mine) || '（なし）'}</span></div>`}
          <div class="actions">${sayBtn(s.en)}<button class="btn primary" id="nx">次へ（Enter）</button>${good || gave ? '' : '<button class="btn ghost" id="mine">自分の答えも正しい</button>'}</div>
          <p class="small muted">🔊 を聞いて、<b>声に出して1回まねる</b>。それから次へ。</p></div>`;
        K.decorate($('#fb'));
        speak(s.en);
        $('#nx').onclick = () => next(good);
        if ($('#mine')) $('#mine').onclick = () => next(true);
        K.setKey((e) => { if (e.key === 'Enter') { e.preventDefault(); next(good); } });
        $('#nx').scrollIntoView({ block: 'nearest' });
      };
      if (mode === 'tile') { draw(); $('#undo').onclick = () => { picked.pop(); draw(); }; }
      else { $('#ans').focus(); $('#ans').onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); judge(); } }; }
      K.setKey(null);
      $('#chk').onclick = () => judge();
      $('#giveup').onclick = () => judge(true);
    };
    show();
  }

  /* ---------- ✍️ ディクテーション ---------- */
  const DLV = [['easy', 'やさしい（短い文）', (n) => n <= 6], ['mid', 'ふつう（7〜9語）', (n) => n >= 7 && n <= 9], ['hard', '難しい（10語以上）', (n) => n >= 10], ['all', 'すべて', () => true]];
  function dict() {
    const body = page('✍️ ディクテーション', `<div class="box tip"><b>やり方</b>音声を聞いて、聞こえた通りに打ちます。何度聞き直しても OK。答え合わせで<b>赤くなった単語</b>が、あなたの耳がまだ拾えていない音です。そこだけ「ゆっくり」で聞き直すのが一番効きます。</div>
      <label class="field">長さ <select id="lv">${DLV.map(([k, n]) => opt(k, 'mid', n)).join('')}</select></label>
      <label class="field">速さ <select id="rate">${opt(0.8, 1, 'ゆっくり（0.8倍）')}${opt(1, 1, 'ふつう')}${opt(1.15, 1, '速い（1.15倍）')}</select></label>
      ${patSelect('all', false)}
      <p><button class="btn primary big" id="go">スタート（8文）</button></p>`, '聞き取れない原因は、知らない単語より「音のつながり・弱い音」であることが多い。書き取ると、それがはっきり分かります。');
    $('#go').onclick = () => {
      const lv = DLV.find((x) => x[0] === $('#lv').value), rate = +$('#rate').value, pat = $('#pat').value;
      let items = pick(pat, 8, (s) => lv[2](tilesOf(s.en).length));
      if (items.length < 4) items = pick(pat, 8);
      runDict(body, items, rate);
    };
  }
  function runDict(body, items, rate) {
    let i = 0, full = 0, hitSum = 0, wSum = 0;
    const t0 = Date.now();
    const finish = () => {
      stopAll();
      const n = items.length, acc = wSum ? hitSum / wSum : 0, xp = full * 2 + Math.round(acc * 8);
      K.addXP(xp); logRun('dict', n, full, (Date.now() - t0) / 1000); if (full === n) K.confetti(50);
      body.innerHTML = result([[Math.round(acc * 100) + '%', '単語の聞き取り率'], [`${full}/${n}`, '完全に書けた文'], ['+' + xp, 'XP']], acc >= 0.9 ? 'よく聞き取れています。速さを1段階上げるか、長い文に挑戦しましょう。' : '聞き取れなかった単語は、音のつながりで形が変わっていることがほとんどです。英語コースの「英語の音」も読み直してみましょう。');
      $('#again').onclick = dict;
    };
    const show = () => {
      if (i >= items.length) return finish();
      const s = items[i];
      body.innerHTML = `<div class="sp-bar"><span class="tag">${i + 1} / ${items.length}</span></div>
        <div class="actions"><button class="btn primary" id="play">🔊 再生</button><button class="btn" id="slow">🐢 ゆっくり</button></div>
        <input class="eg-in en" id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="聞こえた英語を入力して Enter">
        <div class="actions"><button class="btn primary" id="chk">答え合わせ</button></div><div id="fb"></div>`;
      $('#play').onclick = () => speak(s.en, rate);
      $('#slow').onclick = () => speak(s.en, 0.7);
      K.setKey(null);
      const judge = () => {
        const target = wordsOf(s.en), hit = lcsMark(target, wordsOf($('#ans').value)), h = hit.filter(Boolean).length, good = h === target.length && wordsOf($('#ans').value).length === target.length;
        hitSum += h; wSum += target.length; if (good) full++;
        mark(s, good);
        $('#ans').disabled = true; $('#chk').disabled = true;
        const orig = tilesOf(s.en);
        $('#fb').innerHTML = `<div class="box ${good ? 'point' : 'warn'}"><b>${good ? '⭕ 完ぺき！' : `聞き取れた単語：${h}/${target.length}`}</b>
          <div class="eg-model en">${orig.map((w, k) => `<span class="${hit[k] ? 'eg-ok' : 'eg-ng'}">${esc(w)}</span>`).join(' ')}</div><div class="small muted">${esc(s.ja)}</div>
          <div class="actions">${sayBtn(s.en)}<button class="btn primary" id="nx">次へ（Enter）</button></div></div>`;
        K.decorate($('#fb'));
        $('#nx').onclick = () => { i++; show(); };
        K.setKey((e) => { if (e.key === 'Enter') { e.preventDefault(); i++; show(); } });
      };
      $('#ans').focus();
      $('#ans').onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); judge(); } };
      $('#chk').onclick = judge;
      tmo = setTimeout(() => speak(s.en, rate), 400);
    };
    show();
  }

  /* ---------- 🎧 シャドーイング ---------- */
  const splitSent = (paras) => [].concat(...paras.map((p) => p.split(/(?<=[.!?]["”]?)\s+/))).map((x) => x.trim()).filter((x) => x.length > 1);
  function shadow() {
    const reads = (App.readings || []).slice().sort((a, b) => a.lv - b.lv);
    const body = page('🎧 シャドーイング', `<div class="box tip"><b>3つの段階</b>① <b>聞く</b>：文字を見ずに、意味を取りながら聞く。② <b>オーバーラッピング</b>：文字を見ながら、音声と<b>同時に</b>声を出す。③ <b>シャドーイング</b>：文字を隠し、音声の<b>すぐ後ろ</b>を影のようについていく。<br>うまく言えない文は、「リピーティング」（1文ごとに間があく）で確かめます。</div>
      <label class="field">教材 <select id="mat">${PATTERNS.map(([id, n, e]) => opt('p:' + id, 'p:p11', `例文：${e} ${n}`)).join('')}${reads.map((r) => opt('r:' + r.id, '', `多読 Lv${r.lv}：${r.title}（${r.words}語）`)).join('')}</select></label>
      <label class="field">速さ <select id="rate">${opt(0.8, 0.9, 'ゆっくり（0.8倍）')}${opt(0.9, 0.9, 'やや ゆっくり（0.9倍）')}${opt(1, 0.9, 'ふつう')}${opt(1.1, 0.9, '速い（1.1倍）')}</select></label>
      <p><button class="btn primary big" id="go">この教材で始める</button></p>`, 'リスニングとスピーキングを同時に鍛える練習。音・リズム・語順が、体に入ります。');
    $('#go').onclick = () => {
      const [k, id] = $('#mat').value.split(':'), rate = +$('#rate').value;
      const r = k === 'r' ? App.readingMap[id] : null;
      const lines = r ? splitSent(r.text).map((en) => ({ en })) : SENT.filter((s) => s.p === id).map((s) => ({ en: s.en, ja: s.ja }));
      runShadow(body, r ? r.title : PNAME[id], lines, rate);
    };
  }
  function runShadow(body, title, lines, rate) {
    let cur = -1, playing = false, hide = false, gap = 0;
    const t0 = Date.now();
    body.innerHTML = `<div class="sp-bar"><span class="tag key">${esc(title)}</span><span class="tag">${lines.length}文</span></div>
      <div class="actions"><button class="btn primary" id="pl">▶ 最初から連続再生</button><button class="btn" id="st">⏹ 停止</button></div>
      <div class="eg-modes"><label><input type="radio" name="md" value="listen" checked> ① 聞く／② 文字を見て重ねる</label><label><input type="radio" name="md" value="shadow"> ③ 文字を隠してシャドーイング</label><label><input type="radio" name="md" value="repeat"> リピーティング（1文ごとに間）</label></div>
      <ol class="eg-sh en" id="sh">${lines.map((l, k) => `<li data-k="${k}"><span class="t">${esc(l.en)}</span>${l.ja ? `<span class="j">${esc(l.ja)}</span>` : ''}</li>`).join('')}</ol>
      <div class="actions center"><button class="btn primary big" id="done">練習した！（記録する）</button></div>`;
    const paint = () => { $$('#sh li').forEach((li, k) => li.classList.toggle('on', k === cur)); $('#sh').classList.toggle('hide', hide); const on = $('#sh li.on'); if (on && playing) on.scrollIntoView({ block: 'center', behavior: 'smooth' }); };
    const stop = () => { playing = false; seq++; clearTimeout(tmo); if ('speechSynthesis' in window) speechSynthesis.cancel(); };
    const playFrom = (k, chain) => {
      stop(); playing = true; cur = k; paint();
      const my = seq;
      const step = () => {
        if (my !== seq || cur >= lines.length) { playing = false; cur = -1; paint(); return; }
        paint();
        const en = lines[cur].en;
        speak(en, rate, () => {
          if (my !== seq) return;
          if (!chain) { playing = false; return; }
          cur++;
          tmo = setTimeout(step, gap ? Math.max(1200, en.split(' ').length * 420) : 250);
        });
      };
      step();
    };
    $$('input[name="md"]').forEach((r) => (r.onchange = () => { hide = r.value === 'shadow'; gap = r.value === 'repeat' ? 1 : 0; paint(); }));
    $('#pl').onclick = () => playFrom(0, true);
    $('#st').onclick = () => { stop(); cur = -1; paint(); };
    $$('#sh li').forEach((li) => (li.onclick = () => playFrom(+li.dataset.k, false)));
    $('#done').onclick = () => {
      stop();
      const sec = (Date.now() - t0) / 1000;
      if (sec < 20) { K.toast('もう少し練習してから記録しましょう'); return; }
      K.addXP(10); logRun('shadow', lines.length, lines.length, sec);
      body.innerHTML = result([[lines.length + '文', '練習した量'], [Math.max(1, Math.round(sec / 60)) + '分', '時間'], ['+10', 'XP']], '同じ教材を<b>3日続けて</b>行うと、口が音を覚えて効果が出やすくなります。言いにくかった文は、瞬間英作文でも確かめましょう。');
      $('#again').onclick = shadow;
    };
    paint();
  }

  /* ---------- ⏱ Part 5 タイムアタック ---------- */
  const P5U = ['en-tense', 'en-noun', 'en-modal', 'en-verbal', 'en-clause', 'en-toeic5', 'en-ifcomp', 'en-biz', 'en-writing', 'en-present'];
  const p5pool = () => { const c = App.courseMap.english; return c ? [].concat(...P5U.map((u) => (c.unitMap[u] ? c.unitMap[u].questions : []))).filter((q) => q.type === 'mc' && !q.passage && !q.audio && /___/.test(q.q) && q.choices.length >= 3) : []; };
  function p5() {
    const pool = p5pool(), x = ST(), last = x.p5.slice(-5).reverse();
    const body = page('⏱ Part 5 タイムアタック', `<div class="box tip"><b>ルール</b>空所補充を<b>1問20秒</b>で20問。時間が切れたら不正解で次へ進みます。解説は最後にまとめて表示。<br>TOEIC の Part 5 は30問を約10分（1問20秒）で解くのが目安です。<b>「選択肢を見る → 品詞か意味かを判断 → 空所の前後だけ読む」</b>の順で。</div>
      <p class="muted small">出題プール：${pool.length}問（文法・語彙・ビジネス表現の空所補充）</p>
      ${last.length ? `<table class="tbl"><tr><th>日付</th><th>正解</th><th>平均</th></tr>${last.map((e) => `<tr><td>${dayStr(e.d)}</td><td>${e.ok}/${e.n}</td><td>${e.s.toFixed(1)}秒</td></tr>`).join('')}</table>` : ''}
      <p><button class="btn primary big" id="go">スタート（20問・約7分）</button></p>`, '知識があっても、時間内に出せなければ点になりません。本番のペースを体に入れます。');
    $('#go').onclick = () => runP5(body, shuffle(pool).slice(0, 20));
  }
  function runP5(body, items) {
    const LIMIT = 20, res = [];
    let i = 0;
    const c = App.courseMap.english;
    const finish = () => {
      stopAll();
      const n = items.length, ok = res.filter((r) => r.ok).length, avg = res.reduce((a, r) => a + r.sec, 0) / n, xp = ok * 2 + 5;
      const x = ST(); x.p5.push({ d: dayNo(), n, ok, s: +avg.toFixed(1) }); if (x.p5.length > 60) x.p5.shift();
      K.addXP(xp); logRun('p5', n, ok, avg * n); if (ok / n >= 0.9) K.confetti(60);
      const by = {}; res.forEach((r) => { const u = r.q.unit; by[u] = by[u] || [0, 0]; by[u][1]++; if (r.ok) by[u][0]++; });
      const wrong = res.filter((r) => !r.ok);
      body.innerHTML = result([[`${ok}/${n}`, '正解'], [avg.toFixed(1) + '秒', '1問あたり'], [res.filter((r) => r.to).length, '時間切れ'], ['+' + xp, 'XP']],
        ok / n >= 0.9 ? '本番でも通用するペースと正確さです。' : ok / n >= 0.7 ? 'あと一歩。まちがえた分野のユニットを復習しましょう。' : '時間に追われて落とした問題が多いはずです。まず下の解説で「どこを見れば解けたか」を確かめましょう。',
        `<h3>分野ごとの正解率</h3><table class="tbl"><tr><th>ユニット</th><th>正解</th><th></th></tr>${Object.keys(by).map((u) => `<tr><td>${esc(c.unitMap[u].title)}</td><td>${by[u][0]}/${by[u][1]}</td><td><a href="#/c/english/u/${u}">復習する</a></td></tr>`).join('')}</table>
        ${wrong.length ? `<h3>まちがえた問題（${wrong.length}問）</h3><div class="eg-list">${wrong.map((r) => `<div><div>${r.q.q}</div><div class="small"><b class="eg-ok">正解：${esc(r.q.choices[r.q.answer])}</b>${r.to ? '　<span class="tag warn">時間切れ</span>' : `　<span class="eg-ng">あなた：${esc(r.q.choices[r.pick])}</span>`}</div><div class="small muted">${r.q.explain}</div></div>`).join('')}</div>` : ''}`);
      $('#again').onclick = p5;
    };
    const show = () => {
      if (i >= items.length) return finish();
      clearInterval(timer);
      const q = items[i], order = shuffle(q.choices.map((_, k) => k)), t0 = Date.now();
      let done = false;
      body.innerHTML = `<div class="sp-bar"><span class="tag">${i + 1} / ${items.length}</span><div class="eg-timer"><i id="tb"></i></div><span class="tag" id="tl">${LIMIT}</span></div>
        <div class="eg-q">${q.q}</div><div class="eg-ch">${order.map((k, n) => `<button class="btn" data-k="${k}"><b>${n + 1}</b> <span class="en">${esc(q.choices[k])}</span></button>`).join('')}</div>`;
      const answer = (k, to) => {
        if (done) return; done = true; clearInterval(timer);
        const ok = !to && k === q.answer;
        res.push({ q, ok, pick: k, to: !!to, sec: Math.min(LIMIT, (Date.now() - t0) / 1000) });
        $$('.eg-ch button').forEach((b) => { b.disabled = true; if (+b.dataset.k === q.answer) b.classList.add('good'); else if (+b.dataset.k === k) b.classList.add('bad'); });
        tmo = setTimeout(() => { i++; show(); }, 450);
      };
      $$('.eg-ch button').forEach((b) => (b.onclick = () => answer(+b.dataset.k)));
      K.setKey((e) => { const n = +e.key; if (n >= 1 && n <= order.length) { e.preventDefault(); answer(order[n - 1]); } });
      timer = setInterval(() => {
        const left = LIMIT - (Date.now() - t0) / 1000, tb = $('#tb'), tl = $('#tl');
        if (!tb) return clearInterval(timer);
        tb.style.width = Math.max(0, (left / LIMIT) * 100) + '%'; tb.classList.toggle('hurry', left < 6); tl.textContent = Math.max(0, Math.ceil(left));
        if (left <= 0) answer(-1, true);
      }, 100);
    };
    show();
  }

  /* ---------- ルート ---------- */
  App.routes.egym = function (p) {
    K.onLeave(stopAll);
    const [k, a] = p;
    if (!k) return hub();
    if (k === 'compose') return compose(a);
    if (k === 'dict') return dict();
    if (k === 'shadow') return shadow();
    if (k === 'p5') return p5();
    hub();
  };
})();
