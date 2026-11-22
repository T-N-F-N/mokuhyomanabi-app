/* =========================================================
 * 経営シミュレーション（#/bizsim）
 * 検査装置の会社の社長になり、12四半期（3年）を経営する。
 * 価格・採用・開発の重点・広告・借り入れ・出資を決め、損益と現金の動きを体験する。
 * 「経営とコンサルティング思考」コースの、損益分岐点・運転資金・値下げ・資金調達の実践編。
 * 計算の本体は App.bizsimModel（画面なしでも動く）。
 * ========================================================= */
(function () {
  'use strict';
  const App = window.LearnApp, K = App.kit;
  const { $, $$, esc } = K;
  const view = () => K.view();
  const QN = 12;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const yen = (v) => (v < 0 ? '−' : '') + Math.abs(Math.round(v)).toLocaleString() + '万円';
  const oku = (v) => (Math.abs(v) >= 10000 ? (v < 0 ? '−' : '') + (Math.abs(v) / 10000).toFixed(2) + '億円' : yen(v));
  const pc = (v) => Math.round(v * 100) + '%';

  /* ---------- 計算の本体 ---------- */
  const COST = { eng: 180, sales: 160, office: 100, perHead: 10, hire: 100, fire: 100 };
  const ADS = { 0: 0, 100: 6, 300: 15, 600: 24 };
  const EVENTS = {
    bulk: { t: '🏭 大口の引き合い', d: '大手の食品メーカーから「8台まとめて買いたい。ただし2割引きで、支払いは2四半期後」と連絡が来た。', c: [['accept', '受ける（8台・2割引き・入金は2四半期後）'], ['counter', '交渉する（5台・1割引き・ふつうの入金。成功は6割ほど）'], ['decline', '断る']] },
    compet: { t: '⚔️ 競合の参入', d: '大手メーカーが、似た装置を安く発売した。これから受注率が下がる。品質か、導入の簡単さが 70 以上なら、影響は半分ですむ。' },
    parts: { t: '📦 部品の値上がり', d: 'カメラと計算機の部品が値上がりした。この四半期と次の四半期、1台あたりの変動費が 12% 上がる。' },
    poach: { t: '🧑‍💻 技術者への引き抜き', d: '中心の技術者に、他社から誘いが来ている。', c: [['raise', '昇給して引きとめる（技術者の人件費が、今後ずっと1人あたり15万円上がる）'], ['let', '見送る（技術者が1人減り、品質が3下がる）']] },
    subsidy: { t: '🏛️ 省人化の補助金', d: '国の補助金が始まり、検査の自動化への関心が高まった。この四半期と次の四半期、引き合いが4割増える。' },
    investor: { t: '💼 投資家からの打診', d: '投資家が関心を示している。この四半期に出資を受けると決めれば、会社の評価額が3割高くなる（持ち分のうすまり方が小さくなる）。' },
    quality: { t: '🔍 品質の評判', d: '' },
  };
  function shuffle(a, rnd) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function newGame(diff, rnd = Math.random) {
    const ids = shuffle(Object.keys(EVENTS), rnd).slice(0, 5), events = {};
    [2, 4, 6, 8, 10].forEach((q, i) => (events[q] = ids[i]));
    return { v: 1, diff, q: 1, cash: diff === 'hard' ? 3500 : 5000, debt: 0, share: 1, eng: 3, sales: 1, quality: 50, ease: 40, aware: 20, cum: 0, installed: 0, costMul: 1, backlog: [], recv: [0, 0], eqIn: 0, eqRounds: 0, raiseAdd: 0, fx: { compet: 0, parts: 0, subsidy: 0, investor: 0 }, events, hist: [], over: null, last: { price: 500, focus: 'e', ads: 100 } };
  }
  const unitCost = (s) => 300 * s.costMul * Math.pow((s.cum + 30) / 30, Math.log2(0.9)) * (s.fx.parts > 0 ? 1.12 : 1);
  const ttm = (s, k) => s.hist.slice(-4).reduce((a, h) => a + (h[k] || 0), 0);
  const preMoney = (s) => Math.max(20000, 2.5 * ttm(s, 'rev')) * (s.fx.investor > 0 ? 1.3 : 1);
  const loanCap = (s) => Math.max(1500, Math.round((0.4 * ttm(s, 'rev')) / 100) * 100);
  const valuation = (s) => { const profit = Math.max(0, ttm(s, 'op')) * 6, maint = ttm(s, 'maintRev') * 3, net = s.cash + s.eqIn - s.debt; return { profit, maint, net, total: net + profit + maint }; };
  // この四半期の見こみ（乱数なし）。画面の「見こみ」と、実際の計算の両方で使う
  function plan(s, d) {
    const eng = Math.max(1, s.eng + d.hireE), sales = Math.max(0, s.sales + d.hireS), newS = Math.max(0, d.hireS);
    const aware = clamp(s.aware * 0.85 + ADS[d.ads] + s.installed * 0.15, 0, 100);
    const leads = (5 + 0.35 * aware) * (s.fx.subsidy > 0 ? 1.4 : 1);
    const cap = 3 + 8 * (sales - newS) + 4 * newS;
    const win = clamp(0.32 + 0.004 * (s.quality - 50) + 0.003 * (s.ease - 40) - 0.002 * (d.price - 500) - s.fx.compet, 0.02, 0.8);
    const perEng = 2 * (1 + s.ease / 100), instCap = eng * perEng, uc = unitCost(s);
    const fixed = eng * (COST.eng + s.raiseAdd) + sales * COST.sales + COST.office + (eng + sales) * COST.perHead;
    const maint = s.installed * 7 * 0.8;
    return { eng, sales, newS, aware, leads, cap, win, perEng, instCap, uc, fixed, maint, margin: d.price - uc };
  }
  function step(s, d, rnd = Math.random) {
    const ev = s.events[s.q], h = { q: s.q, ev: ev || null, evNote: '', price: d.price, focus: d.focus, adsCost: d.ads };
    let evCost = 0, awareAdd = 0;
    if (ev === 'compet') s.fx.compet = s.quality >= 70 || s.ease >= 70 ? 0.035 : 0.07;
    if (ev === 'parts') s.fx.parts = 2;
    if (ev === 'subsidy') s.fx.subsidy = 2;
    if (ev === 'investor') s.fx.investor = 1;
    if (ev === 'quality') { if (s.quality < 55) { evCost = 400; awareAdd = -8; h.evNote = '品質が低く、納品先で不具合が起きた。対応に 400万円かかり、評判も落ちた。'; } else { awareAdd = 8; h.evNote = '品質の高さが業界の展示会で話題になり、知名度が上がった。'; } }
    if (ev === 'poach') { if (d.evc === 'raise') { s.raiseAdd += 15; h.evNote = '昇給して引きとめた。'; } else { s.eng = Math.max(1, s.eng - 1); s.quality -= 3; h.evNote = '技術者が1人、会社を去った。'; } }
    const p = plan(s, d);
    const hireCost = COST.hire * (Math.max(0, d.hireE) + Math.max(0, d.hireS)) + COST.fire * (Math.max(0, -d.hireE) + Math.max(0, -d.hireS));
    const leads = Math.round(p.leads * (0.85 + 0.3 * rnd())), handled = Math.min(leads, p.cap);
    const orders = Math.round(handled * p.win * (0.9 + 0.2 * rnd()));
    let queue = s.backlog.slice();
    if (ev === 'bulk') {
      if (d.evc === 'accept') { for (let i = 0; i < 8; i++) queue.push({ p: Math.round(d.price * 0.8), b: 1 }); h.evNote = '大口の注文（8台）を受けた。'; }
      else if (d.evc === 'counter') { if (rnd() < 0.6) { for (let i = 0; i < 5; i++) queue.push({ p: Math.round(d.price * 0.9), b: 0 }); h.evNote = '交渉が成立し、5台を1割引きで受注した。'; } else h.evNote = '交渉はまとまらず、注文は流れた。'; }
      else h.evNote = '大口の引き合いを断った。';
    }
    for (let i = 0; i < orders; i++) queue.push({ p: d.price, b: 0 });
    const delivered = Math.min(queue.length, Math.round(p.instCap)), done = queue.slice(0, delivered);
    let rest = queue.slice(delivered);
    const cancel = Math.round(rest.length * 0.25); if (cancel) rest = rest.slice(0, rest.length - cancel);
    const rev = done.reduce((a, x) => a + x.p, 0), revN = done.filter((x) => !x.b).reduce((a, x) => a + x.p, 0), revB = rev - revN;
    const varCost = delivered * p.uc, maintRev = s.installed * 7, maintCost = maintRev * 0.2;
    const interest = Math.round(s.debt * 0.01);
    const op = rev + maintRev - varCost - maintCost - p.fixed - d.ads - hireCost - evCost;
    // 開発：納品に使わなかった技術者の時間だけが、開発に回る
    const free = Math.max(0, p.eng - delivered / p.perEng);
    if (d.focus === 'q') s.quality += 1.3 * free * (s.quality > 80 ? 0.5 : 1);
    if (d.focus === 'c') s.costMul = Math.max(0.7, s.costMul - 0.012 * free);
    if (d.focus === 'e') s.ease = clamp(s.ease + 1.5 * free, 0, 100);
    s.quality = clamp(s.quality - 1, 0, 100);
    // 現金：装置の代金は、今期に3割、来期に7割。大口（受けた場合）は2四半期後に全額
    const collect = revN * 0.3 + s.recv[0];
    s.recv = [s.recv[1] + revN * 0.7, revB];
    let loan = d.loan || 0;
    if (loan > 0) loan = Math.max(0, Math.min(loan, loanCap(s) - s.debt)); else loan = -Math.min(-loan, s.debt);
    const eqArrive = s.eqIn; s.eqIn = 0;
    let dil = 0;
    if (d.equity > 0 && s.eqRounds < 2) { const pre = preMoney(s); dil = d.equity / (pre + d.equity); s.share *= 1 - dil; s.eqIn = d.equity; s.eqRounds++; h.pre = pre; }
    const cash0 = s.cash;
    s.debt += loan;
    s.cash += collect + maintRev - varCost - maintCost - p.fixed - d.ads - hireCost - evCost - interest + loan + eqArrive;
    Object.assign(h, { leads, cap: p.cap, handled, win: p.win, orders, delivered, cancel, backlog: rest.length, instCap: p.instCap, rev, maintRev, varCost: varCost + maintCost, fixed: p.fixed, hireCost, evCost, interest, op, profit: op - interest, collect, loan, eqArrive, eqNew: s.eqIn, dil, cash0, cash: s.cash, recv: s.recv[0] + s.recv[1], uc: p.uc, free, eng: p.eng, sales: p.sales, margin: p.margin });
    s.backlog = rest; s.eng = p.eng; s.sales = p.sales; s.aware = clamp(p.aware + awareAdd, 0, 100); s.cum += delivered; s.installed += delivered;
    Object.assign(h, { quality: s.quality, ease: s.ease, aware: s.aware, debt: s.debt, share: s.share, installed: s.installed });
    ['parts', 'subsidy', 'investor'].forEach((k) => { if (s.fx[k] > 0) s.fx[k]--; });
    s.hist.push(h); s.last = { price: d.price, focus: d.focus, ads: d.ads }; s.q++;
    if (s.cash < 0) s.over = 'bankrupt'; else if (s.q > QN) s.over = 'done';
    return h;
  }
  function score(s) {
    const v = valuation(s), mine = s.over === 'bankrupt' ? 0 : Math.max(0, v.total) * s.share;
    const rank = s.over === 'bankrupt' ? 'D' : mine >= 60000 ? 'S' : mine >= 30000 ? 'A' : mine >= 15000 ? 'B' : 'C';
    return { v, mine, rank };
  }
  App.bizsimModel = { newGame, plan, step, score, valuation, preMoney, loanCap, unitCost, ttm, QN };

  /* ---------- 記録 ---------- */
  const ST = () => { const S = K.S; S.bizsim = S.bizsim || {}; const x = S.bizsim; x.runs = x.runs || []; return x; };
  const RANK = { S: '🏆 名経営者', A: '🥇 成長企業', B: '🥈 堅実な会社', C: '🥉 生き残った', D: '💥 資金が尽きた' };

  /* ---------- 画面：入口 ---------- */
  function hub() {
    const x = ST(), best = x.runs.reduce((a, r) => Math.max(a, r.mine), 0);
    view().innerHTML = `${K.crumbs([['経営シミュレーション']])}
      <section class="hero"><div><h1>📈 経営シミュレーション</h1><p class="muted">あなたは、中小の食品工場向けに<b>AI検査装置</b>を作る会社の社長です。四半期ごとに、価格・採用・開発・広告・資金を決めて、<b>3年間（12四半期）</b>経営します。</p></div>
        <div class="stats"><div><b>${x.runs.length}</b><span>プレイ回数</span></div><div><b>${best ? oku(best) : '—'}</b><span>自己ベスト（あなたの持ち分の価値）</span></div></div></section>
      ${x.cur && !x.cur.over ? `<div class="card rec"><h3>▶ 続きから</h3><p>第${x.cur.q}四半期・現金 ${yen(x.cur.cash)}</p><div class="actions"><a class="btn primary" href="#/bizsim/play">続きをプレイ</a></div></div>` : ''}
      <div class="card"><h3>🎮 新しく始める</h3>
        <div class="actions"><button class="btn primary" data-new="normal">ふつう（手元の資金 5,000万円）</button><button class="btn" data-new="hard">きびしい（手元の資金 3,500万円）</button></div>
        <p class="small muted">${x.cur && !x.cur.over ? '新しく始めると、途中のゲームは消えます。' : '1回 10〜15分ほど。途中で閉じても、続きから再開できます。'}</p></div>
      <div class="card lesson"><h3>📋 しくみ（最初に読んでください）</h3>
        <table class="tbl"><tr><th>決めること</th><th>何が起きるか</th></tr>
        <tr><td><b>価格</b></td><td>高いほど1台の儲けは大きいが、受注率が下がる。安いほど売れるが、儲けはうすい</td></tr>
        <tr><td><b>営業の人数</b></td><td>対応できる引き合いの数が増える（1人で1四半期に8件。入ったばかりの人は4件）</td></tr>
        <tr><td><b>技術者の人数</b></td><td>納品できる台数が増える。<b>納品に使わなかった時間だけ</b>が、開発に回る</td></tr>
        <tr><td><b>開発の重点</b></td><td>品質（受注率が上がる）／原価低減（変動費が下がる）／導入の簡単さ（受注率と、納品できる台数が上がる）</td></tr>
        <tr><td><b>広告・展示会</b></td><td>知名度が上がり、引き合いが増える。何もしないと、知名度は少しずつ下がる</td></tr>
        <tr><td><b>借り入れ</b></td><td>すぐ現金が入る。利子は1四半期に1%。借りられる額には上限がある</td></tr>
        <tr><td><b>出資</b></td><td>返さなくてよいが、あなたの持ち分がうすまる。<b>現金が入るのは次の四半期</b>。2回まで</td></tr></table>
        <div class="box warn"><b>一番大事なこと</b>装置の代金は、納品した四半期に3割、次の四半期に7割が入ります。部品代と給料は、その四半期に払います。<b>売れるほど、先に現金が出ていきます</b>。期末の現金がマイナスになったら、そこでゲーム終了です。</div>
        <p class="small muted">成績は、3年後の<b>「会社の価値 × あなたの持ち分」</b>で決まります。会社の価値は、手元の現金 − 借入金 ＋ 直近1年の利益の6倍 ＋ 直近1年の保守収入の3倍、で計算します（学習用の簡単な式です）。数字や出来事は、学習用に作ったものです。</p></div>
      ${x.runs.length ? `<h2 class="sec">これまでの記録</h2><div class="card"><table class="tbl"><tr><th>日付</th><th>難しさ</th><th>結果</th><th>持ち分の価値</th><th>持ち分</th></tr>${x.runs.slice(-8).reverse().map((r) => `<tr><td>${esc(r.d)}</td><td>${r.diff === 'hard' ? 'きびしい' : 'ふつう'}</td><td>${RANK[r.rank]}${r.q <= QN ? `（第${r.q}四半期）` : ''}</td><td>${oku(r.mine)}</td><td>${pc(r.share)}</td></tr>`).join('')}</table></div>` : ''}
      <div class="actions center"><a class="btn" href="#/c/consult">💼 コースへ戻る</a></div>`;
    $$('[data-new]').forEach((b) => (b.onclick = () => { ST().cur = newGame(b.dataset.new); K.save(); location.hash = '#/bizsim/play'; }));
    window.scrollTo(0, 0);
  }

  /* ---------- 画面：プレイ ---------- */
  const FOCUS = { q: '品質を上げる', c: '原価を下げる', e: '導入を簡単にする' };
  function chart(s) {
    const hs = s.hist; if (hs.length < 2) return '';
    const W = 600, H = 170, L = 46, R = 12, T = 14, B = 26, vals = hs.map((h) => h.cash), mx = Math.max(1000, ...vals), mn = Math.min(0, ...vals);
    const x = (i) => L + ((W - L - R) * i) / (QN - 1), y = (v) => T + ((H - T - B) * (mx - v)) / (mx - mn || 1);
    const bw = 14, pmax = Math.max(500, ...hs.map((h) => Math.abs(h.profit)));
    return `<div class="bz-chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="現金と利益の推移">
      <line x1="${L}" y1="${y(0)}" x2="${W - R}" y2="${y(0)}" style="stroke:var(--line)"/>
      ${hs.map((h, i) => { const ph = (Math.abs(h.profit) / pmax) * 34; return `<rect x="${x(i) - bw / 2}" y="${h.profit >= 0 ? y(0) - ph : y(0)}" width="${bw}" height="${ph}" rx="2" style="fill:var(--${h.profit >= 0 ? 'good' : 'bad'});opacity:.35"/>`; }).join('')}
      <polyline points="${hs.map((h, i) => x(i).toFixed(1) + ',' + y(h.cash).toFixed(1)).join(' ')}" style="fill:none;stroke:var(--accent);stroke-width:3"/>
      ${hs.map((h, i) => `<circle cx="${x(i)}" cy="${y(h.cash)}" r="4" style="fill:var(--accent)"/><text x="${x(i)}" y="${H - 8}" text-anchor="middle" style="font-size:11px;fill:var(--ink2)">${h.q}</text>`).join('')}
      <text x="4" y="${y(mx) + 4}" style="font-size:11px;fill:var(--ink2)">${Math.round(mx / 100) / 100}億</text><text x="4" y="${y(0) + 4}" style="font-size:11px;fill:var(--ink2)">0</text>
    </svg><p class="small muted">線：期末の現金。棒：その四半期の利益（緑＝黒字、赤＝赤字）。横の数字は四半期</p></div>`;
  }
  function hints(s, h) {
    const out = [];
    if (h.leads > h.cap) out.push(`引き合い ${h.leads}件のうち、${h.leads - h.cap}件に対応できませんでした。<b>営業が足りていません</b>。`);
    if (h.backlog + h.cancel > 0) out.push(`納品が追いつかず、${h.backlog}台が次の四半期に持ちこし${h.cancel ? `、${h.cancel}台はキャンセル` : ''}になりました。<b>技術者を増やすか、導入を簡単にする</b>必要があります。`);
    if (h.free < 0.3 && h.delivered > 0) out.push('技術者の時間が<b>ほぼすべて納品に使われ</b>、開発が進んでいません。');
    if (h.profit > 0 && h.cash < h.cash0 && !h.loan) out.push('<b>利益は黒字なのに、現金は減りました</b>。売った代金の7割がまだ入っていないためです（売掛金 ' + yen(h.recv) + '）。');
    if (h.margin < 120) out.push(`1台あたりの限界利益が ${yen(h.margin)} しかありません。<b>値段が安すぎる</b>か、変動費が高すぎます。`);
    if (h.win < 0.15) out.push(`受注率が ${pc(h.win)} まで下がっています。値段が高すぎるか、品質・簡単さが足りません。`);
    const burn = h.cash0 - h.cash + h.loan + h.eqArrive;
    if (burn > 0 && s.cash > 0 && s.cash / burn < 3) out.push(`このペースだと、現金は<b>あと約${Math.max(1, Math.floor(s.cash / burn))}四半期</b>で尽きます。出資は、決めてから入るまで1四半期かかります。`);
    if (h.profit > 0 && !out.length) out.push('黒字です。この調子で、次の伸ばし方（値上げ・保守・人の増やし方）を考えましょう。');
    return out;
  }
  function report(s, h) {
    const row = (a, b, cls = '') => `<tr class="${cls}"><td>${a}</td><td class="num">${b}</td></tr>`;
    return `<div class="card pop"><h3>📄 第${h.q}四半期の結果</h3>
      ${h.ev ? `<div class="box ex"><b>${EVENTS[h.ev].t}</b>${esc(h.evNote || EVENTS[h.ev].d)}</div>` : ''}
      <div class="grid two"><div><h4>儲け（損益）</h4><table class="tbl bz-t">
        ${row('装置の売上（' + h.delivered + '台）', yen(h.rev))}${row('保守の売上', yen(h.maintRev))}${row('変動費', '−' + yen(h.varCost))}
        ${row('人件費・家賃など', '−' + yen(h.fixed))}${row('広告・展示会', '−' + yen(h.adsCost))}${h.hireCost ? row('採用・退職の費用', '−' + yen(h.hireCost)) : ''}${h.evCost ? row('不具合の対応', '−' + yen(h.evCost)) : ''}${h.interest ? row('利子', '−' + yen(h.interest)) : ''}
        ${row('<b>利益</b>', `<b class="${h.profit >= 0 ? 'good' : 'bad'}">${yen(h.profit)}</b>`, 'tot')}</table></div>
      <div><h4>現金の動き</h4><table class="tbl bz-t">
        ${row('期首の現金', yen(h.cash0))}${row('入金（装置の代金・保守）', yen(h.collect + h.maintRev))}${row('支払い', '−' + yen(h.varCost + h.fixed + h.adsCost + h.hireCost + h.evCost + h.interest))}
        ${h.loan ? row(h.loan > 0 ? '借り入れ' : '返済', yen(h.loan)) : ''}${h.eqArrive ? row('出資の入金', yen(h.eqArrive)) : ''}
        ${row('<b>期末の現金</b>', `<b class="${h.cash >= 0 ? '' : 'bad'}">${yen(h.cash)}</b>`, 'tot')}${row('まだ入っていない代金（売掛金）', yen(h.recv))}${h.eqNew ? row('次の四半期に入る出資', yen(h.eqNew) + '（持ち分 −' + pc(h.dil) + '）') : ''}</table></div></div>
      <div class="stats"><div><b>${h.leads}</b><span>引き合い</span></div><div><b>${h.handled}</b><span>対応できた数</span></div><div><b>${pc(h.win)}</b><span>受注率</span></div><div><b>${h.orders}</b><span>受注</span></div><div><b>${h.delivered}</b><span>納品</span></div><div><b>${Math.round(h.uc)}</b><span>1台の変動費（万円）</span></div></div>
      ${hints(s, h).map((t) => `<p class="bz-hint">💡 ${t}</p>`).join('')}</div>`;
  }
  function play() {
    const x = ST(), s = x.cur;
    if (!s) return hub();
    if (s.over) return final();
    const ev = s.events[s.q], E = ev && EVENTS[ev], last = s.hist[s.hist.length - 1], cap = loanCap(s), room = Math.max(0, cap - s.debt);
    const sel = (id, opts, cur) => `<select id="${id}">${opts.map(([v, l]) => `<option value="${v}" ${String(v) === String(cur) ? 'selected' : ''}>${l}</option>`).join('')}</select>`;
    const prices = []; for (let p = 350; p <= 650; p += 25) prices.push([p, p + '万円']);
    const hire = [[-1, '1人減らす'], [0, 'そのまま'], [1, '1人増やす'], [2, '2人増やす']];
    const loans = [[0, 'なし']]; if (room >= 1000) loans.push([1000, '1,000万円 借りる']); if (room >= 2000) loans.push([2000, '2,000万円 借りる']); if (s.debt >= 1000) loans.push([-1000, '1,000万円 返す']);
    const canEq = s.eqRounds < 2 && !s.eqIn, pre = preMoney(s);
    const eqs = [[0, '受けない']]; if (canEq) [5000, 10000].forEach((a) => eqs.push([a, `${oku(a)}（持ち分が ${pc(a / (pre + a))} うすまる）`]));
    const evDesc = ev === 'quality' ? (s.quality < 55 ? '納品先から、不具合の連絡が相次いでいる。品質が 55 より低いと、対応の費用がかかり、評判も落ちる。' : '品質の高さが、業界で話題になり始めている。') : E && E.d;
    view().innerHTML = `${K.crumbs([['経営シミュレーション', '#/bizsim'], ['第' + s.q + '四半期']])}
      <div class="card bz-head"><h1>第${s.q}四半期 <span class="muted small">／ 全${QN}（${Math.ceil(s.q / 4)}年目）</span></h1>
        <div class="bar"><i style="width:${Math.round(((s.q - 1) / QN) * 100)}%"></i></div>
        <div class="stats"><div><b class="${s.cash < 1500 ? 'bad' : ''}">${yen(s.cash)}</b><span>現金</span></div><div><b>${yen(s.debt)}</b><span>借入金</span></div><div><b>${pc(s.share)}</b><span>あなたの持ち分</span></div><div><b>${s.installed}台</b><span>これまでの納品</span></div><div><b>${s.eng}人／${s.sales}人</b><span>技術者／営業</span></div></div>
        <div class="stats"><div><b>${Math.round(s.quality)}</b><span>品質</span></div><div><b>${Math.round(s.ease)}</b><span>導入の簡単さ</span></div><div><b>${Math.round(s.aware)}</b><span>知名度</span></div><div><b>${Math.round(unitCost(s))}万円</b><span>1台の変動費</span></div><div><b>${s.backlog.length}台</b><span>納品待ち</span></div></div>
        ${s.eqIn ? `<p class="small">💰 この四半期に、出資の ${oku(s.eqIn)} が入金されます。</p>` : ''}</div>
      ${last ? report(s, last) : `<div class="card"><h3>👋 創業</h3><p>手元の資金は ${yen(s.cash)}。技術者3人、営業1人（あなた自身も営業をします）。装置の単価は 500万円、1台の変動費は 300万円から始まります。まずは下の「見こみ」を見ながら、最初の四半期の方針を決めてください。</p></div>`}
      ${chart(s)}
      ${E ? `<div class="card bz-ev"><h3>${E.t}</h3><p>${esc(evDesc)}</p>${E.c ? `<div class="bz-evc">${E.c.map(([v, l], i) => `<label><input type="radio" name="evc" value="${v}" ${i === E.c.length - 1 ? 'checked' : ''}> ${esc(l)}</label>`).join('')}</div>` : ''}</div>` : ''}
      <div class="card"><h3>🧭 この四半期の方針</h3><div class="bz-form">
        <label>価格（1台）${sel('price', prices, s.last.price)}</label>
        <label>営業の人数（今 ${s.sales}人）${sel('hireS', hire, 0)}</label>
        <label>技術者の人数（今 ${s.eng}人）${sel('hireE', hire, 0)}</label>
        <label>開発の重点${sel('focus', Object.entries(FOCUS), s.last.focus)}</label>
        <label>広告・展示会${sel('ads', [[0, 'なし'], [100, '100万円'], [300, '300万円'], [600, '600万円']], s.last.ads)}</label>
        <label>借り入れ（上限 ${yen(cap)}）${sel('loan', loans, 0)}</label>
        <label>出資を受ける${canEq ? '' : '（今は選べません）'}${sel('equity', eqs, 0)}</label></div>
        <div class="bz-plan" id="plan"></div>
        <div class="actions center"><button class="btn primary big" id="go">この方針で、四半期を進める →</button></div></div>
      <div class="actions center"><a class="btn ghost" href="#/bizsim">中断する（続きは保存されます）</a></div>`;
    const read = () => ({ price: +$('#price').value, hireS: +$('#hireS').value, hireE: +$('#hireE').value, focus: $('#focus').value, ads: +$('#ads').value, loan: +$('#loan').value, equity: +$('#equity').value, evc: ($('input[name=evc]:checked') || {}).value });
    const show = () => {
      const d = read(), fx = JSON.parse(JSON.stringify(s)), p = plan(fx, d);
      const be = p.margin > 0 ? (p.fixed + d.ads - p.maint) / p.margin : Infinity, exp = Math.min(p.leads, p.cap) * p.win;
      $('#plan').innerHTML = `<h4>📐 見こみ（出来事や運で、上下します）</h4><div class="stats">
        <div><b>${Math.round(p.leads)}件</b><span>引き合い</span></div><div><b class="${p.cap < p.leads ? 'bad' : ''}">${p.cap}件</b><span>営業が対応できる数</span></div><div><b>${pc(p.win)}</b><span>受注率</span></div>
        <div><b>${exp.toFixed(1)}台</b><span>受注の見こみ</span></div><div><b class="${p.instCap < exp + s.backlog.length ? 'bad' : ''}">${Math.round(p.instCap)}台</b><span>納品できる上限</span></div></div>
        <div class="stats"><div><b class="${p.margin < 120 ? 'bad' : ''}">${yen(p.margin)}</b><span>1台の限界利益</span></div><div><b>${yen(p.fixed + d.ads)}</b><span>固定費＋広告</span></div>
        <div><b class="${be > exp ? 'bad' : 'good'}">${isFinite(be) ? Math.max(0, be).toFixed(1) + '台' : '—'}</b><span>損益分岐点（この四半期）</span></div></div>
        <p class="small muted">損益分岐点 ＝（固定費 ＋ 広告 − 保守の儲け）÷ 1台の限界利益。受注の見こみがこれを下回ると、この四半期は赤字です。</p>`;
    };
    $$('.bz-form select').forEach((e) => (e.onchange = show)); show();
    $('#go').onclick = () => { step(s, read()); K.addXP(3); K.save(); if (s.over) finish(s); play(); window.scrollTo(0, 0); };
    window.scrollTo(0, 0);
  }

  /* ---------- 画面：結果と講評 ---------- */
  function finish(s) {
    const x = ST(), sc = score(s);
    x.runs.push({ d: K.dayStr(K.dayNo()), diff: s.diff, rank: sc.rank, mine: Math.round(sc.mine), share: s.share, q: s.over === 'bankrupt' ? s.q - 1 : QN + 1 });
    if (x.runs.length > 30) x.runs.splice(0, x.runs.length - 30);
    K.addXP(s.over === 'bankrupt' ? 10 : 30); K.checkBadges(); K.save();
    if (sc.rank === 'S' || sc.rank === 'A') K.confetti();
  }
  function review(s) {
    const hs = s.hist, out = [], lastH = hs[hs.length - 1];
    const minC = hs.reduce((a, h) => (h.cash < a.cash ? h : a), hs[0]);
    const avgP = hs.reduce((a, h) => a + h.price, 0) / hs.length, units = hs.reduce((a, h) => a + h.delivered, 0);
    const lost = hs.reduce((a, h) => a + Math.max(0, h.leads - h.cap), 0), canc = hs.reduce((a, h) => a + h.cancel, 0);
    const firstBlack = hs.find((h) => h.profit > 0);
    out.push(['💰 資金', `現金が一番少なかったのは第${minC.q}四半期の ${yen(minC.cash)} でした。${s.over === 'bankrupt' ? '現金が尽きたのは、利益が出ていなかったからだけではありません。<b>入金より支払いが先</b>だからです。資金は、足りなくなる2〜3四半期前に手当てします。' : minC.cash < 1000 ? 'かなり危ない場面がありました。「あと何四半期もつか」を毎回確かめましょう。' : '資金に余裕を持って経営できました。'}`, 'cs-pl']);
    out.push(['📐 損益分岐点', firstBlack ? `初めて黒字になったのは第${firstBlack.q}四半期でした。黒字にする道は3つだけ（固定費を下げる・単価を上げる・変動費を下げる）、そして数を売ることです。` : '最後まで黒字になりませんでした。「見こみ」の損益分岐点と、受注の見こみを比べて、届く方針を探してみてください。', 'cs-unit']);
    out.push(['🏷️ 価格', `平均の価格は ${yen(avgP)} でした。${avgP < 450 ? '<b>安く売りすぎ</b>かもしれません。1割の値下げで、限界利益は2〜3割減ります。' : avgP > 560 ? '高めの価格でした。品質や簡単さがそれを支えていれば正解、受注率が低すぎたなら、機会を逃しています。' : '中くらいの価格でした。品質が上がったあとに値上げを試すと、利益が大きく変わります。'}`, 'cs-unit']);
    out.push(['📉 経験曲線', `${units}台を納品し、1台の変動費は 300万円から ${Math.round(lastH.uc)}万円 になりました。作るほど安くなる効果と、原価を下げる開発の両方が効いています。`, 'cs-advantage']);
    if (lost + canc > 5) out.push(['🚧 ボトルネック', `対応できなかった引き合いが ${lost}件、キャンセルが ${canc}台 ありました。広告で引き合いを増やしても、<b>営業と納品の力が足りなければ売上になりません</b>。一番せまい所を広げるのが先です。`, 'cs-org']);
    if (s.eqRounds) out.push(['🤝 出資', `出資を ${s.eqRounds}回受け、持ち分は ${pc(s.share)} になりました。小さなパイの100%より、大きなパイの一部のほうが大きいこともあります。会社の価値が上がってから受けるほど、うすまり方は小さくなります。`, 'cs-invest']);
    else out.push(['🤝 出資', '出資を受けずに経営しました。持ち分は100%のままです。もっと早く人や広告に投資していたら、どうなっていたでしょうか。別の方針でも試してみてください。', 'cs-invest']);
    if (s.debt > 0) out.push(['🏦 借入金', `借入金が ${yen(s.debt)} 残っています。会社の価値からは、この分が引かれます。`, 'cs-invest']);
    return out;
  }
  function final() {
    const x = ST(), s = x.cur;
    if (!s || !s.over) return hub();
    const sc = score(s), v = sc.v, last = s.hist[s.hist.length - 1];
    view().innerHTML = `${K.crumbs([['経営シミュレーション', '#/bizsim'], ['結果']])}
      <div class="card pop center"><h1>${RANK[sc.rank]}</h1><p class="muted">${s.over === 'bankrupt' ? `第${s.q - 1}四半期の終わりに、現金が尽きました。` : '3年間の経営、おつかれさまでした。'}</p>
        <div class="stats"><div><b>${oku(sc.mine)}</b><span>あなたの持ち分の価値</span></div><div><b>${oku(Math.max(0, v.total))}</b><span>会社の価値</span></div><div><b>${pc(s.share)}</b><span>あなたの持ち分</span></div><div><b>${s.installed}台</b><span>納品した装置</span></div></div>
        ${s.over === 'bankrupt' ? '' : `<p class="small muted">会社の価値 ＝ 現金 − 借入金（${oku(v.net)}）＋ 直近1年の利益 × 6（${oku(v.profit)}）＋ 直近1年の保守収入 × 3（${oku(v.maint)}）</p>`}</div>
      ${chart(s)}
      ${report(s, last)}
      <h2 class="sec">🧑‍💼 コンサルタントの講評</h2>
      <div class="card">${review(s).map(([t, b, u]) => `<div class="bz-rev"><b>${t}</b><p>${b} <a href="#/c/consult/u/${u}">→ 関連するユニット</a></p></div>`).join('')}</div>
      <h2 class="sec">📊 12四半期のまとめ</h2>
      <div class="card bz-scroll"><table class="tbl bz-t"><tr><th>四半期</th><th>価格</th><th>受注率</th><th>納品</th><th>売上</th><th>利益</th><th>期末の現金</th></tr>${s.hist.map((h) => `<tr><td>${h.q}</td><td class="num">${h.price}</td><td class="num">${pc(h.win)}</td><td class="num">${h.delivered}</td><td class="num">${Math.round(h.rev + h.maintRev).toLocaleString()}</td><td class="num ${h.profit >= 0 ? 'good' : 'bad'}">${Math.round(h.profit).toLocaleString()}</td><td class="num">${Math.round(h.cash).toLocaleString()}</td></tr>`).join('')}</table><p class="small muted">金額の単位は万円</p></div>
      <div class="card"><h3>🔁 次に試してみること</h3><ul><li>最初の1年で、営業と技術者のどちらを先に増やすと、結果はどう変わるか</li><li>品質を上げてから値上げすると、利益はどう変わるか</li><li>出資を早く受ける場合と、遅く受ける場合で、持ち分の価値はどうちがうか</li><li>大口の注文を受けたとき、現金はどう動くか</li></ul>
        <div class="actions center"><button class="btn primary" id="again">もう一度プレイ</button><a class="btn" href="#/bizsim">📈 入口へ</a><a class="btn" href="#/c/consult">💼 コースへ</a></div></div>`;
    $('#again').onclick = () => { ST().cur = newGame(s.diff); K.save(); play(); };
    window.scrollTo(0, 0);
  }

  App.routes.bizsim = function (p) {
    if (p[0] === 'play') return play();
    hub();
  };
})();
