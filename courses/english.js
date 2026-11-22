/* ===== コース：英語（中高レベル → TOEIC 800-900・ビジネス・海外・論文） ===== */
(function () {
  const D = LearnApp.D;
  // 読解問題で共有する英文
  const P_MAIL = `<p class="en"><b>Subject: Delay in Shipment — Order #4471</b></p>
<p class="en">Dear Mr. Sato,</p>
<p class="en">Thank you for your recent order of twelve LED bar lights (model BL-300). Unfortunately, due to a shortage of electronic components at our supplier, the shipment will be delayed by approximately two weeks. We now expect to ship your order on June 18 instead of June 4.</p>
<p class="en">We sincerely apologize for the inconvenience. If this delay affects your project schedule, we can send six units immediately from our current stock and the remaining six units on June 18. Alternatively, you may cancel the order without any charge.</p>
<p class="en">Please let us know which option you prefer by replying to this e-mail by May 30.</p>
<p class="en">Best regards,<br>Linda Moore<br>Customer Service, BrightTech Lighting</p>`;

  const P_ABS = `<p class="en"><b>Abstract</b> — Visual inspection of industrial products often suffers from a lack of defective samples for training. In this paper, we propose a lightweight anomaly detection method that learns only from normal images. Our method extracts multi-scale features from a pretrained convolutional network and compares them with a memory bank of normal features. Experiments on a public benchmark show that the proposed method achieves an image-level AUROC of 98.7%, outperforming previous state-of-the-art approaches, while running at 45 frames per second on an embedded GPU. An ablation study indicates that multi-scale features contribute most to the improvement. These results suggest that the method may be suitable for real-time inspection on production lines.</p>`;

  const P_NOTICE = `<p class="en"><b>Notice to All Staff</b></p>
<p class="en">The third-floor cafeteria will be closed from July 8 to July 19 for renovation. During this period, a temporary dining area will be available in Conference Room A on the first floor from 11:30 a.m. to 2:00 p.m.</p>
<p class="en">Employees may also use meal vouchers at Cafe Lumo, located across the street. Vouchers can be picked up at the reception desk starting July 5.</p>
<p class="en">We apologize for any inconvenience. — Facilities Management</p>`;

  const P_RATES = `<p class="en"><b>[Document 1] Grand Harbor Hotel — Meeting Room Rates</b></p>
<table class="tbl en"><tr><th>Room</th><th>Capacity</th><th>Price per day</th></tr>
<tr><td>Room A</td><td>up to 20 people</td><td>$300</td></tr><tr><td>Room B</td><td>up to 50 people</td><td>$550</td></tr><tr><td>Room C</td><td>up to 120 people</td><td>$900</td></tr></table>
<p class="en">Projector rental: $50 per day. A 10% discount is applied to the total for bookings made at least 30 days in advance.</p>
<p class="en"><b>[Document 2] E-mail</b><br>To: events@grandharbor.com<br>From: Akiko Mori<br>Date: April 2</p>
<p class="en">Hello, I would like to reserve a meeting room for our training seminar on May 15. We expect about 40 participants, and we will need a projector. Could you also let me know whether lunch can be provided for the participants?<br>Best regards,<br>Akiko Mori, Sanwa Electronics</p>`;

  const A_VM = 'Hi, this is Karen from Delta Logistics. I am calling about your order of conveyor belts. Unfortunately, one of the parts is out of stock, so the delivery will be two days late. We can deliver it on Thursday instead of Tuesday. If that is a problem, please call me back at 555-0142 before five o\'clock today. Thank you.';
  const A_AIR = 'Attention, all passengers. Flight 208 to Singapore has been delayed due to bad weather. The new departure time is 6:40 p.m. Passengers may collect a meal voucher at the service counter near gate 15. We apologize for the inconvenience.';
  const A_CONV = 'Hi Lisa, have you finished the inspection report? ... Almost. I just need the test results from the second line. ... The technician said they will be ready this afternoon. ... Great. Then I can send the report to the client tomorrow morning.';
  const A_MTG = 'Good morning, everyone. Before we start, I would like to welcome our new engineer, Daniel, who joined us from our Berlin office. Daniel will be leading the camera system upgrade on Line 3. Over the next two weeks, he will be meeting with each team to learn about our current processes. Please make him feel welcome.';

  LearnApp.registerCourse({
    id: 'english',
    title: '英語',
    icon: '🌏',
    color: '#3b82f6',
    lang: 'en',
    teacher: { name: '先生', icon: '🧑‍🏫' },
    tagline: '苦手意識ゼロから、TOEIC 800-900・ビジネス・海外・論文で通用する英語へ',
    purposeHint: '例：海外の客先で装置の説明ができるようになりたい／AIの英語論文を読みたい',
    setupNote: '英語は「文法の骨格 → 音 → 大量のインプット → アウトプット」の順に積み上げると最短です。苦手意識がある場合は、STAGE 1 から始めて「わかる」を積み重ねるのがおすすめです。',
    levels: [
      { id: 'jhs', label: '中学英語から不安', desc: 'be動詞・一般動詞の区別があいまい', stage: 0 },
      { id: 'hs', label: '高校英語の基礎はある', desc: 'TOEIC 350〜450 程度', stage: 0 },
      { id: 't600', label: 'TOEIC 550〜650', desc: '文法は一通りわかる', stage: 1 },
      { id: 't750', label: 'TOEIC 700以上', desc: '実戦・実務の英語を磨きたい', stage: 2 },
    ],
    goals: [
      { id: 'toeic', label: 'TOEIC 800〜900', desc: '試験形式に慣れ、時間内に解き切る力' },
      { id: 'biz', label: 'ビジネス会話・メール', desc: '会議・メール・電話で困らない' },
      { id: 'travel', label: '海外でのコミュニケーション', desc: '出張・旅行・現地対応' },
      { id: 'paper', label: '技術論文を読む', desc: 'AI・エンジニアリング論文の読解' },
    ],
    stages: [
      { title: '文の骨格をつかむ', desc: '英語は「語順」の言語。ここで英文を前から正しく読む土台を作ります。TOEICの文法問題の8割はこの範囲です。' },
      { title: '音と試験の実戦スキル', desc: '聞き取れない原因を音の仕組みから解決し、TOEICの各パートの解き方を身につけます。' },
      { title: '実世界で使う英語', desc: 'ビジネス・海外・論文。目的別に「そのまま使える型」を身につけます。' },
    ],
    overview: `
<p>英語力は、ばらばらの知識の寄せ集めではなく、<b>下の層が上の層を支える「積み上げ構造」</b>です。苦手意識の多くは、土台（語彙・文法・音）が不安定なまま、上の層（長文・会話）に挑んでいることから生まれます。</p>
<div class="fig"><svg viewBox="0 0 640 300" width="640">
  <rect x="40" y="230" width="560" height="50" rx="8" class="l fa"/><text x="320" y="252" class="tm b">① 語彙 ＋ 文法（語順）</text><text x="320" y="270" class="tm s">単語の意味と「どの位置に何が来るか」— すべての土台</text>
  <rect x="90" y="170" width="460" height="50" rx="8" class="l fg"/><text x="320" y="192" class="tm b">② 音（発音・音の変化）</text><text x="320" y="210" class="tm s">知っている単語でも「音」を知らなければ聞き取れない</text>
  <rect x="140" y="110" width="360" height="50" rx="8" class="l fw"/><text x="320" y="132" class="tm b">③ インプット（読む・聞く）</text><text x="320" y="150" class="tm s">大量に・速く・前から理解 ← TOEICが測るのはここ</text>
  <rect x="190" y="50" width="260" height="50" rx="8" class="l fr"/><text x="320" y="72" class="tm b">④ アウトプット（話す・書く）</text><text x="320" y="90" class="tm s">インプットした「型」を口から出す</text>
  <text x="320" y="32" class="tm b ta">目標：ビジネス・海外・論文で通用する英語</text>
  <path d="M610 270 L610 60" class="la" marker-end="url(#ara)"/><text x="618" y="170" class="s">積</text><text x="618" y="186" class="s">み</text><text x="618" y="202" class="s">上</text><text x="618" y="218" class="s">げ</text>
</svg><p class="cap">英語力の4層構造。上の層は下の層の上にしか建たない</p></div>
<h3>このコースの進め方</h3>
<ol>
<li><b>STAGE 1：文の骨格</b> — 英語は「位置」で意味が決まる言語。5文型・時制・修飾の仕組みを理解すると、長い文も前から読めるようになります。</li>
<li><b>STAGE 2：音と実戦</b> — リスニングは「音の変化」を知れば伸びます。ディクテーション（書き取り）とシャドーイングで耳を作り、TOEICの各パートの解き方を身につけます。</li>
<li><b>STAGE 3：実世界</b> — 会議・メール・現地対応・論文。目的に合った「型」を覚えて使います。</li>
</ol>
<div class="box point"><b>TOEIC 350 → 850 の現実的な道のり</b>一般に TOEIC を 100 点上げるには 200〜300 時間の学習が目安と言われます。500 点アップなら 1000 時間以上。1日1時間なら約3年、2時間なら1年半です。<br>近道はありませんが、<b>「毎日・復習を欠かさず・弱点から」</b>やれば最短になります。このアプリの復習機能（間隔反復）は、忘れかけるタイミングで出題して、最小の時間で記憶を定着させます。</div>
<div class="box tip"><b>毎日のおすすめメニュー（60分の場合）</b>
① 復習（アプリの復習・単語カード）15分 → ② 新しいレッスン＋練習問題 25分 → ③ 音読・シャドーイング 10分 → ④ 英文を読む／聞く（多読・多聴）10分</div>
<p>🔊 マークの付いた英文はクリックで読み上げられます。<span class="say">Let's get started!</span></p>`,
    units: [
      /* ================= STAGE 1 ================= */
      {
        id: 'en-structure', stage: 0, core: true, tags: ['toeic', 'biz', 'travel', 'paper'],
        title: '英文の骨格：語順と5文型',
        sum: '英語は「席順」で意味が決まる。動詞を見つけ、5つの型で文の骨格を一瞬でつかむ。',
        goals: ['英語は「席順」で役割が決まることを、日本語と比べて説明できる', 'どんな長い文でも、本物の動詞と主語を見抜ける', '「＝テスト」で SVC・SVOO・SVOC を見分けられる', '3ステップ・マーキングで長文の骨格を抜き出せる'],
        lessons: [
          {
            title: '英語は「席順」で意味が決まる', min: 10, steps: [
              { t: 'talk', html: 'いきなりクイズです。<b>「犬が男をかんだ」</b>と<b>「男を犬がかんだ」</b>。語順を入れ替えたのに、意味はまったく同じですよね。なぜでしょう？' },
              { t: 'talk', html: '答えは <b>「が」と「を」</b>。日本語の単語には、助詞という<b>名札</b>が付いているんです。「犬<b>が</b>」という名札があれば、どこに座っていても「かんだ側」だとわかる。' },
              { t: 'talk', html: 'ところが英語の単語には、この名札がありません。じゃあ英語はどうやって役割を決めているのか。<br><b>座っている「席」で決めているんです。</b>' },
              { t: 'html', html: `<div class="fig"><svg viewBox="0 0 600 190" width="600">
<rect x="30" y="60" width="160" height="60" rx="10" class="l fa"/><text x="110" y="88" class="tm b en">Dog</text><text x="110" y="108" class="tm s">1番目の席＝主語（だれが）</text>
<rect x="220" y="60" width="160" height="60" rx="10" class="l fW"/><text x="300" y="88" class="tm b en" style="fill:#fff">bites</text><text x="300" y="108" class="tm s" style="fill:#fff">2番目の席＝動詞（する）</text>
<rect x="410" y="60" width="160" height="60" rx="10" class="l fg"/><text x="490" y="88" class="tm b en">man.</text><text x="490" y="108" class="tm s">3番目の席＝残り（何を）</text>
<text x="300" y="40" class="tm b">犬が男をかむ</text>
<text x="300" y="155" class="tm">席を入れ替えて <tspan class="en b">Man bites dog.</tspan> にすると…</text>
<text x="300" y="178" class="tm b tr">「男が犬をかむ」。意味が逆になる！</text>
</svg></div>` },
              { t: 'q', q: { q: '<span class="en">Man bites dog.</span> かまれているのはどっち？', c: ['dog（犬）', 'man（男）', 'どちらとも言えない'], a: 0, shuffle: false, why: ['', 'man は1番目の席（動詞の左）に座っています。かむ側です。', '英語は席順で役割がはっきり決まります。あいまいにはなりません。'], e: '動詞の左がかむ側、右がかまれる側。新聞の世界には「犬が人をかんでもニュースにならないが、人が犬をかめばニュースになる」という有名な言葉があります。席を入れ替えるだけで、そのくらい意味が変わるということです。' } },
              { t: 'key', front: '英語で単語の役割を決めているものは？', back: '席順（位置）。日本語は助詞という名札、英語は席順' },
              { t: 'talk', html: 'ここから、英語を読むときの<b>最強のルール</b>が生まれます。席順の真ん中に座っているのは<b>動詞</b>。つまり、動詞さえ見つければ、<b>その左が主語、右が残り</b>。文の役割が全部決まるんです。' },
              { t: 'key', front: '英文を読むとき、最初に探すものは？', back: '動詞。動詞の左が主語、右が残り' },
              { t: 'talk', html: '英語が苦手な人の多くは、単語を左から1つずつ日本語にして、最後に並べ替えようとします。それだと長い文で必ず迷子になります。<br><b>まず動詞を探す。</b>これだけで英文の見え方が変わりますよ。' },
              { t: 'q', q: { q: '<span class="en">The new camera captures 60 images per second.</span> の動詞は？', c: ['captures', 'camera', 'images', 'second'], a: 0, why: ['', 'camera は名詞。動詞の左にいる「主語」の一部です。', 'images は動詞の右＝「何を撮るか」です。', 'per second は「1秒あたり」という飾りです。'], e: '動詞 captures の左「The new camera」が主語、右「60 images」が目的語。カメラの仕様書に出てくる典型的な文です。仕事の英文も、まったく同じ方法で読めます。' } },
            ],
          },
          {
            title: '5文型の正体は「動詞の右側」の5パターン', min: 12, steps: [
              { t: 'talk', html: '「5文型」と聞いただけで、ちょっと嫌な気持ちになった人もいるかもしれませんね。でも安心してください。5文型の正体は、とてもシンプルです。' },
              { t: 'talk', html: '前のレッスンで「動詞の右は"残り"」と言いました。実は、その<b>"残り"の形は、たった5パターンしかありません</b>。それが5文型です。暗記するものではなく、<b>動詞の右に何が来ているかを見るだけ</b>です。' },
              { t: 'html', html: `<table class="tbl"><tr><th>動詞の右に…</th><th>型</th><th>例</th><th>意味</th></tr>
<tr><td>何もない</td><td>SV</td><td><span class="say">The system works.</span></td><td>システムが動く</td></tr>
<tr><td>主語の<b>説明</b>（S ＝ C）</td><td>SVC</td><td><span class="say">The result is good.</span></td><td>結果は良い</td></tr>
<tr><td><b>相手</b>が1つ</td><td>SVO</td><td><span class="say">We use a camera.</span></td><td>カメラを使う</td></tr>
<tr><td><b>相手</b>が2つ（人に・物を）</td><td>SVOO</td><td><span class="say">He sent me the data.</span></td><td>私にデータを送った</td></tr>
<tr><td><b>相手とその説明</b>（O ＝ C）</td><td>SVOC</td><td><span class="say">The light makes the scratch visible.</span></td><td>照明が傷を見えるようにする</td></tr></table>` },
              { t: 'html', html: D.grid(['S（主語）', 'V（動詞）', '右側 ①', '右側 ②'], ['SV', 'SVC', 'SVO', 'SVOO', 'SVOC'], [
  [['The system', 'fa'], ['works', 'fr'], ['（なし）', 'f1'], ['', 'f1']],
  [['The light', 'fa'], ['is', 'fr'], ['bright\nC：＝主語', 'fw'], ['', 'f1']],
  [['We', 'fa'], ['check', 'fr'], ['the parts\nO：相手', 'fg'], ['', 'f1']],
  [['She', 'fa'], ['gave', 'fr'], ['him\nO：人に', 'fg'], ['a report\nO：物を', 'fg']],
  [['They', 'fa'], ['call', 'fr'], ['it\nO', 'fg'], ['Unit A\nC：＝ it', 'fw']]], { cw: 120, ch: 54, cap: '5文型は「動詞の右側」に何が来るかの5パターン。緑＝O（相手）、黄＝C（＝で結べる説明）' }) },
              { t: 'talk', html: '覚える記号は2つだけ。<b>O（目的語）＝ 動作の相手</b>、<b>C（補語）＝ 説明</b>。そして C を見分ける魔法の道具が、<b>イコール（＝）</b>です。' },
              { t: 'key', front: 'C（補語）の見分け方は？', back: '前の名詞と「＝」で結べたら C（The result is good → result ＝ good）' },
              { t: 'q', q: { q: '<span class="en">The result looks good.</span> の good は O と C のどちら？', c: ['C（result ＝ good が成り立つ）', 'O（look の相手）'], a: 0, shuffle: false, why: ['', '「結果が good を見る」では意味が通りません。result ＝ good（結果は良さそう）が成り立つので C です。'], e: 'look（〜に見える）、become（〜になる）、remain（〜のままだ）、seem（〜のようだ）は be 動詞の仲間。右に「説明」の C を連れてきます。' } },
              { t: 'talk', html: 'では、このレッスンで一番大事なところです。テストで最も狙われる2つの文を比べてみましょう。' },
              { t: 'html', html: `<div class="cols"><div class="box ex"><b>A</b><span class="say">She made him a coffee.</span><br>him ＝ a coffee？ → 「彼がコーヒー」？ <b>×</b><br>→ 相手が2つ（彼に・コーヒーを）＝ <b>SVOO</b><br>「彼にコーヒーを入れた」</div><div class="box ex"><b>B</b><span class="say">She made him happy.</span><br>him ＝ happy？ → 「彼が幸せ」 <b>○</b><br>→ 相手とその説明 ＝ <b>SVOC</b><br>「彼を幸せにした」</div></div>` },
              { t: 'html', html: D.compare({ title: 'SVOO：him ≠ a coffee', icon: '☕', lines: ['She made him a coffee.', '彼に・コーヒーを作った', '「彼＝コーヒー」は変 → O と O'], color: 'fg' }, { title: 'SVOC：him ＝ happy', icon: '😊', lines: ['She made him happy.', '彼を・幸せにした', '「彼＝幸せ」が成り立つ → O と C'], color: 'fw' }, { vs: '＝?', cap: '見分け方は1つ：O と後ろを「＝」で結んでみる' }) },
              { t: 'key', front: 'SVOO と SVOC の見分け方は？', back: 'O と後ろを「＝」で結ぶ。結べたら SVOC、結べなければ SVOO' },
              { t: 'q', q: { q: '<span class="en">The light makes the scratch visible.</span> の文型は？', c: ['SVOC', 'SVOO', 'SVO', 'SVC'], a: 0, why: ['', 'scratch ＝ visible（傷が見える状態）が成り立つので、SVOO ではありません。', 'SVO だと visible の役割が説明できません。visible は scratch の状態を説明する C です。', '動詞 makes の右に相手（the scratch）がいるので、SVC ではありません。'], e: '「照明が傷を見える状態にする」。画像検査の現場で、そのまま使える文です。' } },
              { t: 'trap', html: '「SVOO は"人に・物を"」とだけ覚えていると、<span class="en">They elected him leader.</span>（彼をリーダーに選んだ）で間違えます。him ＝ leader が成り立つので SVOC です。<b>迷ったら、必ず「＝テスト」。</b>' },
              { t: 'talk', html: '最後に、とても大事な話をします。5文型の名前を当てることがゴールではありません。TOEIC で「この文は第何文型？」と聞かれることはまずありません。<br>でも、<b>長い文を前から一度で読めるかどうか</b>は、骨格を一瞬でつかめるかどうかで決まります。5文型は、そのための<b>道具</b>です。' },
            ],
          },
          {
            title: '長い文は「飾り」にカッコ — 骨格を一瞬で抜き出す', min: 12, steps: [
              { t: 'talk', html: '論文やマニュアルの英文は長いですよね。でも、どんなに長い文でも<b>骨格は5文型のどれか</b>です。長く見えるのは、<b>飾り（修飾語）</b>がたくさん付いているだけです。' },
              { t: 'talk', html: 'そこで使うのが「<b>3ステップ・マーキング</b>」です。<br>① 本物の動詞に下線　② その主語に丸　③ 飾りにカッコ<br>実際にやってみせますね。' },
              { t: 'html', html: `<div class="box ex"><b>例文</b><span class="say">The system that we developed last year can detect defects smaller than 0.1 millimeters.</span>
<ol><li><b>動詞に下線</b>：developed？ → that の後ろなので飾りの中。本物は <u><b>can detect</b></u></li>
<li><b>主語に丸</b>：can detect の左 → <b>(The system)</b></li>
<li><b>飾りにカッコ</b>：[that we developed last year]、[smaller than 0.1 millimeters]</li></ol>
<b>骨格</b>：The system can detect defects.（SVO）→「そのシステムは欠陥を検出できる」<br>あとは飾りを足すだけ：「（去年私たちが開発した）システムは、（0.1mmより小さい）欠陥を検出できる」</div>` },
              { t: 'html', html: D.chunks([['The system', '主語 S', 'fa'], ['that we developed last year', '飾り（カッコ）', 'f1'], ['can detect', '本物の動詞 V', 'fr'], ['defects', '目的語 O', 'fg'], ['smaller than 0.1 mm', '飾り（カッコ）', 'f1']], { cap: '飾りをカッコでくくると、骨格「The system can detect defects」だけが残る' }) },
              { t: 'talk', html: 'ここで多くの人がひっかかるのが、<b>「動詞っぽいけど、本物の動詞じゃない語」</b>です。' },
              { t: 'trap', html: '偽物の動詞は3タイプです。<br>① <b>who / which / that の後ろの動詞</b>：飾りの中の動詞（who designed this system）<br>② <b>名詞の後ろに付いた -ing 形・過去分詞</b>：飾り（engineers working on…、data collected by…）<br>③ <b>to ＋ 動詞</b>：目的や説明（to reduce costs）' },
              { t: 'key', front: '長い文で、最初に見つけた「動詞っぽい語」は本物？', back: 'まず疑う。who/which/that の後ろ、名詞の後ろの -ing/-ed、to＋動詞 は飾りの中' },
              { t: 'q', q: { q: '<span class="en">Engineers working on the project often stay late.</span> の本物の動詞は？', c: ['stay', 'working', 'often', 'project'], a: 0, why: ['', 'working は Engineers の後ろに付いた -ing。「プロジェクトに取り組んでいる」という飾りです（偽物タイプ②）。', 'often は「よく」という副詞で、飾りです。', 'project は名詞です。'], e: 'Engineers [working on the project] often <u>stay</u> late. 骨格は「エンジニアたちは遅くまで残る」。' } },
              { t: 'talk', html: '次は少し手ごわいですよ。今度はヒントなしでいきます。' },
              { t: 'q', q: { q: '<span class="en">The data collected by the sensors shows that the new method is effective.</span> 文全体の動詞は？', c: ['shows', 'collected', 'is', 'effective'], a: 0, why: ['', 'collected は data の後ろに付いた過去分詞。「センサで集められた」という飾りです（偽物タイプ②）。', 'is は that の後ろ、つまり「何を示すか」の中身の動詞です。文全体の動詞ではありません。', 'effective は形容詞です。'], e: 'The data [collected by the sensors] <u>shows</u> [that the new method is effective]. 骨格は SVO で、that 以下が「何を示すか」です。論文の結果の部分によく出る形です。' } },
              { t: 'key', front: '3ステップ・マーキングとは？', back: '① 本物の動詞に下線 ② その主語に丸 ③ 飾りにカッコ' },
              { t: 'talk', html: 'この技は、<b>1日5文・2週間</b>続けると身につきます。このユニットの「実践課題」に、そのためのメニューを用意しました。英文を読むスピードが変わるのを、ぜひ体感してください。' },
            ],
          },
        ],
        qs: [
          { id: 'b1', lv: 1, q: '英語で、単語の役割（主語・目的語など）を決めているものは？', c: ['文の中の位置（席順）', '単語の語尾', '助詞', '大文字か小文字か'], a: 0, why: ['', '英語にも語尾の変化はありますが、主語か目的語かを決めるのは主に位置です。', '助詞（が・を）で役割を決めるのは日本語です。', '大文字は文頭や固有名詞のしるしで、役割とは関係ありません。'], e: '英語は「席順」の言語。だから最初に動詞（真ん中の席）を探すのが読解の基本です。' },
          { id: 'b2', lv: 1, q: '<span class="en">Dog bites man.</span> かまれているのは？', c: ['man', 'dog', 'どちらとも言えない'], a: 0, shuffle: false, why: ['', 'dog は動詞の左＝主語なので、かむ側です。', '席順で役割は一つに決まります。'], e: '動詞の右（3番目の席）が「動作の相手」。' },
          { id: 'b3', lv: 1, q: '<span class="en">The result is good.</span> の文型は？', c: ['SVC', 'SVO', 'SV', 'SVOC'], a: 0, why: ['', 'good は「相手」ではなく、result の説明です（result ＝ good）。', '動詞の右に good があるので SV ではありません。', '相手（O）がいないので SVOC ではありません。'], e: 'be 動詞の右は主語の説明（C）。＝テストで result ＝ good が成り立ちます。' },
          { id: 'b4', lv: 1, q: '<span class="en">We use a camera.</span> の文型は？', c: ['SVO', 'SVC', 'SVOO', 'SV'], a: 0, why: ['', 'We ＝ a camera ではないので、C ではありません。', '相手は a camera の1つだけです。', '動詞の右に a camera があります。'], e: '動詞の右に「相手」が1つ → SVO。英文の中で最も多い型です。' },
          { id: 'b5', lv: 1, q: '<span class="en">He gave me a manual.</span> の文型は？', c: ['SVOO', 'SVOC', 'SVO', 'SVC'], a: 0, why: ['', 'me ＝ a manual（私がマニュアル）は成り立たないので、SVOC ではありません。', '相手が me と a manual の2つあります。', '動詞の右に相手がいるので SVC ではありません。'], e: '「人に・物を」の2つの相手 → SVOO。give, send, show, tell, offer などが代表です。' },
          { id: 's1', lv: 2, q: '<span class="en">She made him happy.</span> の文型は？', c: ['SVOC', 'SVOO', 'SVO', 'SVC'], a: 0, why: ['', 'him ＝ happy（彼が幸せ）が成り立つので、SVOO ではなく SVOC です。', 'SVO だと happy の役割が説明できません。', '動詞の右に him（相手）がいます。'], e: '＝テストで him ＝ happy が成り立つので O ＝ C → SVOC。「彼を幸せにした」。' },
          { id: 's2', lv: 2, q: '<span class="en">She made him a coffee.</span> の文型は？', c: ['SVOO', 'SVOC', 'SVO', 'SVC'], a: 0, why: ['', 'him ＝ a coffee（彼がコーヒー）は成り立たないので、SVOC ではありません。', '相手が him と a coffee の2つあります。', '動詞の右に相手がいます。'], e: '同じ made でも、後ろの形で文型と意味が変わります。「彼にコーヒーを入れた」。' },
          { id: 's3', lv: 2, q: '<span class="en">The results remained stable.</span> の文型は？', c: ['SVC', 'SVO', 'SV', 'SVOC'], a: 0, why: ['', 'stable は「相手」ではなく、results の状態の説明です。', '動詞の右に stable があります。', '相手（O）がいません。'], e: 'remain（〜のままだ）は be 動詞の仲間。results ＝ stable（結果は安定したままだった）。論文で頻出の形です。' },
          { id: 's4', lv: 2, q: '<span class="en">Please keep the door closed.</span> の文型は？', c: ['SVOC', 'SVOO', 'SVO', 'SVC'], a: 0, why: ['', 'door ＝ closed（ドアが閉まった状態）が成り立つので、SVOO ではありません。', 'closed は door の状態を説明する C です。', '動詞 keep の右に the door（相手）がいます。'], e: 'keep O C ＝「O を C のままにしておく」。命令文なので主語の You が省略されています。' },
          { id: 's5', lv: 2, q: '<span class="en">There are three cameras on the line.</span> の主語は？', c: ['three cameras', 'There', 'the line', 'are'], a: 0, why: ['', 'There は「席をとっておく」ための形式的な語で、本当の主語ではありません。', 'on the line は場所を表す飾りです。', 'are は動詞です。'], e: 'There is / are 構文では、be 動詞の後ろの名詞が本当の主語。だから複数の cameras に合わせて are になります。' },
          { id: 's6', lv: 2, t: 'order', q: '「私はその報告書が重要だとわかった」', tokens: ['I', 'found', 'the', 'report', 'important'], e: 'SVOC。the report ＝ important。find O C ＝「O が C だとわかる・思う」。' },
          { id: 'a1', lv: 3, q: '<span class="en">The engineer who designed this system works in Osaka.</span> 文全体の動詞は？', c: ['works', 'designed', 'system', 'engineer'], a: 0, why: ['', 'designed は who の後ろ、つまり「どんなエンジニアか」を説明する飾りの中の動詞です。', 'system は名詞です。', 'engineer は名詞（主語）です。'], e: 'The engineer [who designed this system] <u>works</u> (in Osaka). 骨格は「そのエンジニアは働いている」。' },
          { id: 'a2', lv: 3, q: '<span class="en">Engineers working on the project often stay late.</span> 文全体の動詞は？', c: ['stay', 'working', 'often', 'late'], a: 0, why: ['', 'working は Engineers の後ろに付いた -ing（飾り）です。', 'often は副詞です。', 'late は「遅くまで」という副詞です。'], e: '名詞の後ろの -ing は飾り。偽物の動詞タイプ②です。' },
          { id: 'a3', lv: 3, q: '<span class="en">The data collected by the sensors shows that the new method is effective.</span> 文全体の動詞は？', c: ['shows', 'collected', 'is', 'method'], a: 0, why: ['', 'collected は data を後ろから説明する過去分詞（飾り）です。', 'is は that の中身の動詞です。', 'method は名詞です。'], e: 'The data [collected by the sensors] <u>shows</u> [that …]. 論文の「結果」でよく見る形です。' },
          { id: 'a4', lv: 3, q: '<span class="en">What the customer needs is a faster system.</span> の主語は？', c: ['What the customer needs', 'the customer', 'a faster system', 'What'], a: 0, why: ['', 'the customer は What 節の中の主語です。文全体の主語は What 節のカタマリです。', 'a faster system は is の右、つまり説明（C）です。', 'What 1語ではなく、「What the customer needs（お客様が必要としているもの）」というカタマリが主語です。'], e: '[What the customer needs] <u>is</u> a faster system. 「お客様が必要としているのは、もっと速いシステムだ」。カタマリ全体が1つの主語になれます。' },
          { id: 'a5', lv: 3, t: 'order', q: '「この照明は傷を見やすくする」', tokens: ['This', 'lighting', 'makes', 'scratches', 'easier', 'to', 'see'], e: 'SVOC。scratches ＝ easier to see（見やすい状態）。' },
          { id: 'a6', lv: 3, t: 'order', q: '「そのデータは、新しい方法が有効であることを示している」', tokens: ['The', 'data', 'shows', 'that', 'the', 'new', 'method', 'is', 'effective'], e: 'S（The data）V（shows）O（that 以下）。that 以下のカタマリが「何を示すか」の目的語です。' },
        ],
        missions: [
          {
            title: '骨格マーキング 14日チャレンジ', time: '1日10分 × 14日',
            why: '英文を読む速さは、骨格を見抜くスピードで決まります。これは知識ではなく<b>反射</b>なので、毎日少しずつ手を動かすのが一番の近道です。',
            steps: ['毎日、英文を5つ選ぶ（ニュース、使っている装置のマニュアル、論文の Abstract など）', '紙に書き写すか印刷して、① 本物の動詞に下線 ② 主語に丸 ③ 飾りにカッコ を付ける', '骨格だけを日本語にする（例：「システムは欠陥を検出できる」）', '迷った文は、このアプリのメモ欄に書き残しておく'],
            deliverable: 'マーキングした英文 70文（14日分）',
            criteria: ['14日間、毎日5文をマーキングした', '1文あたり30秒以内で動詞を見つけられるようになった', '飾りの中の動詞（偽物）を3タイプとも見分けられる', '骨格だけで、その文の要点を日本語で言える'],
          },
          {
            title: '自分の仕事を英語5文で説明する', time: '30分',
            why: '覚えた型は、自分のことに使ったときに初めて「使える英語」になります。5文型の型に、自分の仕事を当てはめてみましょう。',
            steps: ['自分の仕事を英語で5文書く。例：I design inspection systems. / The system uses two cameras. / The lighting makes defects visible.', 'それぞれの文に文型（SV / SVC / SVO / SVOO / SVOC）を書き添える', '5つの型のうち、少なくとも3種類を使う', '音読して録音し、聞き直す'],
            deliverable: '英文5つ（文型を添えたもの）と音読の録音',
            criteria: ['5文すべてで主語と動詞をはっきり言える', '3種類以上の文型を使えた', '何も見ずに5文を言える'],
          },
        ],
      },
      {
        id: 'en-tense', stage: 0, core: true, tags: ['toeic', 'biz', 'travel', 'paper'], pre: ['en-structure'],
        title: '時制：現在・過去・完了・進行',
        sum: '時制は「時間のどこを、どんなカメラで撮るか」。写真（現在形・過去形）、動画（進行形）、タイムラプス（完了形）。',
        goals: ['現在形が「いつもそう」を表すことを説明できる', '過去形と現在完了の違いを「今とつながるか」で判断できる', '時の目印から時制問題を解ける', '未来・未来完了を使える'],
        lessons: [
          {
            title: '時制は「カメラの撮り方」', min: 13, steps: [
              { t: 'talk', html: '時制が苦手な人、多いですよね。でも、時制は<b>カメラの撮り方</b>だと考えると、ぐっと分かりやすくなります。' },
              { t: 'html', html: '<table class="tbl"><tr><th>時制</th><th>カメラで言うと</th><th>例</th></tr><tr><td>現在形</td><td><b>図鑑の写真</b>：いつもそう</td><td><span class="say">The camera captures 60 images per second.</span></td></tr><tr><td>過去形</td><td><b>アルバムの写真</b>：終わった1コマ</td><td><span class="say">We tested it yesterday.</span></td></tr><tr><td>進行形</td><td><b>動画</b>：まさに途中</td><td><span class="say">We are testing it now.</span></td></tr><tr><td>現在完了</td><td><b>タイムラプス</b>：過去から今までをつなげる</td><td><span class="say">I have worked here since 2018.</span></td></tr></table>' },
              { t: 'html', html: D.svg(`
<path d="M30 120 L570 120" class="l" marker-end="url(#ar)"/><text x="40" y="145" class="s">過去</text><text x="300" y="145" class="tm b">今</text><text x="560" y="145" class="s" text-anchor="end">未来</text>
<path d="M300 112 L300 128" class="l" style="stroke-width:3"/>
<path d="M50 100 L550 100" class="la dash" style="stroke-width:3"/><text x="430" y="92" class="tm b ta">現在形：いつもそう（図鑑の写真）</text>
<rect x="255" y="55" width="90" height="16" rx="8" class="fG" style="opacity:.8"/><text x="300" y="47" class="tm b tg">進行形：今の途中（動画）</text>
<circle cx="130" cy="70" r="8" class="fR"/><text x="130" y="47" class="tm b tr">過去形：終わった一点</text>
<circle cx="470" cy="160" r="8" class="fW"/><text x="470" y="185" class="tm b">will：これからの一点</text>`, 600, 195, '時制はカメラの撮り方。時間のどこを、どう写すか') },
              { t: 'talk', html: 'まず<b>現在形</b>。「今この瞬間」ではなく、<b>いつもそう・事実・仕様</b>を表します。図鑑の「ライオンは肉を食べる」と同じ。マニュアルや仕様書は、ほとんど現在形で書かれています。' },
              { t: 'key', front: '現在形が表すのは？', back: '「いつもそう」：習慣・事実・仕様（今この瞬間ではない）' },
              { t: 'q', q: { q: 'The sensor ___ the temperature every 10 seconds.', c: ['measures', 'is measured', 'measured yesterday', 'has been measure'], a: 0, why: ['', 'センサは測る側なので、受け身ではありません。', 'every 10 seconds は「いつも」なので過去形ではありません。', '形が正しくありません（has been measured なら受け身）。'], e: '10秒ごとに測る、という仕様 → 現在形。主語が三人称単数なので -s。' } },
              { t: 'talk', html: '次に<b>進行形</b>（be ＋ -ing）は<b>動画</b>。動作の途中を映します。Look!（ほら見て）、now、currently などが目印です。' },
              { t: 'q', q: { q: 'Look! The machine ___ again.', c: ['is stopping', 'stops', 'stopped', 'has stop'], a: 0, why: ['', 'stops は「いつも止まる」になってしまいます。', '「ほら見て」なので、今まさに起きていることです。', '形が正しくありません。'], e: 'Look! は今まさに → 進行形。' } },
            ],
          },
          {
            title: '現在完了は「今とつながる」タイムラプス', min: 14, steps: [
              { t: 'talk', html: '日本人が一番つまずくのが<b>現在完了（have ＋ 過去分詞）</b>です。ポイントは1つだけ。<b>過去の出来事が、今とつながっている</b>ことを表します。過去から今までのタイムラプス動画です。' },
              { t: 'html', html: D.svg(`
<path d="M30 110 L570 110" class="l" marker-end="url(#ar)"/><text x="40" y="135" class="s">過去</text><text x="420" y="135" class="tm b">今</text>
<path d="M420 100 L420 120" class="l" style="stroke-width:3"/>
<circle cx="150" cy="60" r="8" class="fR"/><text x="150" y="38" class="tm b tr">過去形</text><text x="150" y="85" class="tm s">I lost my key yesterday.</text><text x="150" y="160" class="tm s">過去の一点だけ。今どうかは言わない</text>
<path d="M260 60 L410 60" class="lg" style="stroke-width:3.5"/><path d="M400 52 L416 60 L400 68 Z" class="fG"/><circle cx="260" cy="60" r="8" class="fG"/><text x="340" y="38" class="tm b tg">現在完了</text><text x="340" y="85" class="tm s">I have lost my key.</text><text x="430" y="160" class="tm s">過去から「今」へつながる → 今も鍵がない</text>`, 600, 172, '現在完了は「過去」と「今」を1本の矢印で結ぶ') },
              { t: 'html', html: '<table class="tbl"><tr><th>使い方</th><th>例</th><th>目印</th></tr><tr><td>完了（終わって今手元にある）</td><td><span class="say">I have finished the report.</span></td><td>already, just, yet</td></tr><tr><td>経験（今までに）</td><td><span class="say">I have been to the US twice.</span></td><td>ever, never, twice</td></tr><tr><td>継続（今までずっと）</td><td><span class="say">I have worked here since 2018.</span></td><td>since, for ○ years</td></tr></table>' },
              { t: 'key', front: '現在完了の本質は？', back: '過去の出来事が「今」とつながっていること（完了・経験・継続）' },
              { t: 'trap', html: '<b>yesterday、last week、in 2020、ago</b> のように「過去の一点」がはっきり書いてあると、現在完了は使えません。タイムラプスではなく、アルバムの1コマだからです。<br>× I have submitted it yesterday. → ○ I submitted it yesterday.' },
              { t: 'key', front: '過去形と現在完了の見分け方は？', back: 'yesterday・ago・last ○・in 2020 など過去の一点があれば過去形。since・for・already などは現在完了' },
              { t: 'q', q: { q: 'I ___ in this company since 2018.', c: ['have worked', 'worked', 'work', 'am working'], a: 0, why: ['', 'since（〜から今まで）は今とつながるので、過去形ではありません。', '現在形では「2018年から」と合いません。', '進行形だけでは「〜から今まで」を表せません。'], e: 'since 2018 は継続の目印 → 現在完了。' } },
              { t: 'talk', html: '未来の話は <b>will</b>（その場で決めた・予想）か <b>be going to</b>（前から決まっている予定）。そして、未来のある時点までに「終わっている」なら<b>未来完了</b>（will have ＋ 過去分詞）です。<b>By the time ～、by next week</b> が目印です。' },
              { t: 'q', q: { q: 'By the time you arrive, we ___ the meeting.', c: ['will have started', 'started', 'have started', 'start'], a: 0, why: ['', 'あなたが着くのは未来なので、過去形ではありません。', '今とつながる話ではなく、未来の時点の話です。', '「始まってしまっている」という完了を表せません。'], e: 'By the time ＋ 未来の時点 → 未来完了。' } },
              { t: 'talk', html: 'TOEIC の時制問題は、意味を考える前に<b>「時の目印」を探す</b>だけで、ほとんど解けます。yesterday、since、next month、by the time、currently。目印に丸をつける練習をしましょう。' },
            ],
          },
        ],
        qs: [
          { id: 'b1', lv: 1, q: 'We ___ the report yesterday.', c: ['submitted', 'have submitted', 'submit', 'had been submitting'], a: 0, why: ['', 'yesterday（過去の一点）と現在完了は一緒に使えません。', 'yesterday なので過去です。', '形が合いません。'], e: 'yesterday → 過去形。' },
          { id: 'b2', lv: 1, q: 'Look! The machine ___ again.', c: ['is stopping', 'stops', 'stopped', 'has stop'], a: 0, why: ['', 'いつも止まる、になります。', '今まさに起きています。', '形が正しくありません。'], e: 'Look! → 進行形。' },
          { id: 'b3', lv: 1, q: 'The sensor ___ the temperature every 10 seconds.', c: ['measures', 'is measured', 'measured yesterday', 'has been measure'], a: 0, why: ['', 'センサは測る側です。', '「いつも」なので過去形ではありません。', '形が正しくありません。'], e: '仕様・習慣 → 現在形。' },
          { id: 'b4', lv: 1, q: 'How long ___ you been waiting?', c: ['have', 'did', 'are', 'were'], a: 0, why: ['', 'did は過去形の疑問文で、been とは使いません。', 'are been という形はありません。', 'were been という形はありません。'], e: '現在完了進行形 have been -ing（ずっと〜している）。' },
          { id: 's1', lv: 2, q: 'I ___ in this company since 2018.', c: ['have worked', 'worked', 'work', 'am working'], a: 0, why: ['', 'since は今とつながります。', '現在形は「〜から」と合いません。', '「〜から今まで」を表せません。'], e: 'since → 現在完了。' },
          { id: 's2', lv: 2, q: 'By the time you arrive, we ___ the meeting.', c: ['will have started', 'started', 'have started', 'start'], a: 0, why: ['', '未来の話です。', '未来の時点の話です。', '完了を表せません。'], e: 'By the time ＋ 未来 → 未来完了。' },
          { id: 's3', lv: 2, q: 'The price of the components ___ by 10% since last year.', c: ['has risen', 'rose', 'rises', 'is rising since'], a: 0, why: ['', 'since last year は今とつながるので過去形ではありません。', '「いつも上がる」になります。', '形が正しくありません。'], e: 'since → 現在完了。' },
          { id: 's4', lv: 2, q: 'When I called him, he ___ a meeting.', c: ['was attending', 'attends', 'has attended', 'will attend'], a: 0, why: ['', '電話したのは過去です。', '過去の一点の話です。', '未来ではありません。'], e: '過去のある時点で「〜している途中だった」→ 過去進行形。' },
          { id: 's5', lv: 2, t: 'input', q: '（ ）内を正しい形に：<span class="en">Have you ever ___ (be) to Germany?</span>', answer: 'been', e: '経験の現在完了 Have you ever been to 〜?' },
          { id: 'a1', lv: 3, q: 'The train ___ at 9:15 tomorrow morning.', c: ['leaves', 'has left', 'left', 'had left'], a: 0, why: ['', 'tomorrow と現在完了は合いません。', '明日のことなので過去形ではありません。', '形が合いません。'], e: '時刻表で決まっている未来は、現在形で表せます。' },
          { id: 'a2', lv: 3, q: 'By next April, I ___ here for five years.', c: ['will have worked', 'have worked', 'worked', 'am working'], a: 0, why: ['', '今ではなく、未来の時点までの話です。', '過去ではありません。', '未来の時点までの継続を表せません。'], e: 'By next April（未来の時点まで）の継続 → 未来完了。' },
          { id: 'a3', lv: 3, q: 'Ms. Kim ___ for the Berlin office next month.', c: ['will leave', 'left', 'has left', 'leaving'], a: 0, why: ['', 'next month なので過去ではありません。', '未来の予定です。', '動詞がなくなり、文になりません。'], e: 'next month → 未来。TOEIC 頻出の形です。' },
          { id: 'a4', lv: 3, t: 'order', q: '「私たちは2時間ずっとその問題に取り組んでいる」', tokens: ['We', 'have', 'been', 'working', 'on', 'the', 'problem', 'for', 'two', 'hours'], e: '現在完了進行形。今まで続いている動作を強調します。' },
          { id: 'a5', lv: 3, t: 'order', q: '「私はまだそのメールを読んでいない」', tokens: ['I', 'have', 'not', 'read', 'the', 'email', 'yet'], e: '完了の否定 have not ＋ 過去分詞 ＋ yet。read の過去分詞は read（読みは「レッド」）。' },
        ],
        missions: [
          {
            title: '「時の目印」に丸をつける 7日チャレンジ', time: '1日10分 × 7日',
            why: '時制問題は、目印が目に飛び込んでくるようになれば一瞬で解けます。これは反射なので、毎日少しずつが効きます。',
            steps: ['毎日、英文を5つ選ぶ（ニュース・マニュアル・TOEIC の問題集など）', '時の目印（yesterday・since・now・next week・by the time など）に丸をつける', '動詞の時制を書き出し、目印と合っているか確かめる', '自分の今日の仕事を、現在完了で1文書く（例：I have finished the wiring check.）'],
            deliverable: '丸をつけた英文35文と、現在完了の自作文7つ',
            criteria: ['7日間続けた', '目印から時制を説明できる', '現在完了の文を自分で7つ作った'],
          },
        ],
      },
      {
        id: 'en-noun', stage: 0, core: true, tags: ['toeic', 'biz', 'travel', 'paper'], pre: ['en-structure'],
        title: '名詞のカタマリ：冠詞・数・前置詞',
        sum: '英語は「中心の名詞」を先に言って、説明を後ろに付ける。a/the は「相手が分かるか」、前置詞は「イメージ」で覚える。',
        goals: ['名詞のカタマリの中心を見つけられる', 'a と the を「相手が分かるか」で使い分けられる', 'information・equipment など数えない名詞を正しく使える', 'in / on / at、by / until、for / during をイメージで使い分けられる'],
        lessons: [
          {
            title: '英語は「中心が先、説明は後ろ」', min: 13, steps: [
              { t: 'talk', html: '日本語は「組立ラインのための新しい検査システム」のように、説明を<b>全部前</b>に付けます。英語は違います。短い説明は前、長い説明は<b>後ろ</b>に回します。' },
              { t: 'html', html: '<div class="box ex"><span class="say">the new inspection system for the assembly line</span><br>the（冠詞）new inspection（前からの説明）<b>system</b>（中心）for the assembly line（後ろからの説明）</div>' },
              { t: 'html', html: D.chunks([['the', '冠詞', 'f1'], ['new inspection', '前から短い説明', 'fw'], ['system', '中心の名詞', 'fr'], ['for the assembly line', '後ろから長い説明', 'fa']], { cap: '中心の名詞を見つけたら、後ろへ読み進める' }) },
              { t: 'key', front: '英語の名詞のカタマリの並び方は？', back: '冠詞 ＋ 短い説明 ＋ 中心の名詞 ＋ 長い説明（後ろから）' },
              { t: 'talk', html: '読むときは、<b>中心の名詞を見つけたら、後ろへ読み進める</b>。日本語の順番に並べ替えないのがコツです。' },
              { t: 'talk', html: '次に <b>a と the</b>。ルールは1つです。<b>相手が「あれね」と分かるかどうか</b>。' },
              { t: 'html', html: '<ul><li><b>a</b>：相手がどれか分からない、数えられるものの1つ。<span class="say">I need a camera.</span>（どれでもいいカメラを1台）</li><li><b>the</b>：相手も分かる、あの・その。<span class="say">The camera on the left is broken.</span>（左のあのカメラ）</li></ul>' },
              { t: 'key', front: 'a と the の使い分けは？', back: '相手が「あれね」と特定できれば the、できなければ a' },
              { t: 'talk', html: 'そして TOEIC の頻出ポイント、<b>数えない名詞</b>。英語では、形がはっきりしないもの・まとまりとして扱うものは数えません。a も付けず、-s も付けません。' },
              { t: 'html', html: '<table class="tbl"><tr><th>数えない名詞</th><th>数えるときは</th></tr><tr><td>information（情報）</td><td>a piece of information</td></tr><tr><td>equipment（機器）</td><td>a piece of equipment</td></tr><tr><td>advice・feedback・software・furniture・luggage</td><td>some / much / a lot of を付ける</td></tr></table>' },
              { t: 'trap', html: '× informations　× an equipment　× many advices<br>○ some information　○ a piece of equipment　○ some advice' },
              { t: 'q', q: { q: 'We need more ___ about the new product.', c: ['information', 'informations', 'an information', 'many information'], a: 0, why: ['', 'information に -s は付きません。', 'information に an は付きません。', 'many は数える名詞に使います（much information なら可）。'], e: 'information は数えない名詞です。' } },
            ],
          },
          {
            title: '前置詞は「イメージ」で覚える', min: 13, steps: [
              { t: 'talk', html: '前置詞は、日本語訳で覚えると必ず混乱します。<b>イメージ</b>で覚えましょう。時間も場所も、同じイメージで使えます。' },
              { t: 'html', html: D.svg(`
<text x="100" y="22" class="tm b">at ＝ 点</text>
<path d="M30 100 L170 100" class="l"/><circle cx="100" cy="100" r="9" class="fR"/><text x="100" y="135" class="tm s">at 3 p.m. ／ at the gate</text><text x="100" y="155" class="tm s">ピンポイントの1点</text>
<text x="300" y="22" class="tm b">on ＝ 面にくっつく</text>
<rect x="230" y="95" width="140" height="14" class="fI" style="opacity:.6"/><rect x="280" y="65" width="40" height="30" rx="4" class="l fa"/><text x="300" y="135" class="tm s">on Monday ／ on the wall</text><text x="300" y="155" class="tm s">面に接している</text>
<text x="500" y="22" class="tm b">in ＝ 中に入っている</text>
<rect x="440" y="45" width="120" height="70" rx="8" class="l fw"/><circle cx="500" cy="82" r="10" class="fR"/><text x="500" y="135" class="tm s">in April ／ in the box</text><text x="500" y="155" class="tm s">広い範囲の中</text>`, 600, 165, '前置詞は訳でなく「絵」で覚える') },
              { t: 'html', html: '<table class="tbl"><tr><th>前置詞</th><th>イメージ</th><th>時間</th><th>場所</th></tr><tr><td><b>at</b></td><td>点</td><td>at 3 p.m.</td><td>at the gate</td></tr><tr><td><b>on</b></td><td>面にくっつく</td><td>on Monday</td><td>on the table</td></tr><tr><td><b>in</b></td><td>範囲の中</td><td>in June</td><td>in Tokyo</td></tr></table>' },
              { t: 'key', front: 'at / on / in のイメージは？', back: 'at＝点、on＝面にくっつく（曜日・日付）、in＝範囲の中（月・年・都市）' },
              { t: 'talk', html: '次は、ビジネスで間違えると困るペアです。' },
              { t: 'html', html: '<table class="tbl"><tr><th>ペア</th><th>違い</th><th>例</th></tr><tr><td>by / until</td><td>by ＝ <b>締め切り</b>（それまでに1回）、until ＝ <b>ずっと</b>（それまで続く）</td><td><span class="say">Submit it by Friday.</span> / <span class="say">I\'ll wait until five.</span></td></tr><tr><td>for / during</td><td>for ＋ <b>長さ</b>（数字）、during ＋ <b>出来事の名前</b></td><td>for two hours / during the meeting</td></tr><tr><td>in / within</td><td>in ten minutes ＝ 10分後に、within ＝ 以内に</td><td>within 24 hours</td></tr></table>' },
              { t: 'html', html: D.svg(`
<path d="M40 50 L540 50 M40 120 L540 120" class="l2"/>
<path d="M440 30 L440 140" class="lr dash" style="stroke-width:2"/><text x="440" y="160" class="tm b tr">金曜日</text>
<text x="40" y="30" class="b">by Friday ＝ 締め切り</text><circle cx="300" cy="50" r="9" class="fA"/><text x="300" y="78" class="tm s">それまでに1回やればOK</text>
<text x="40" y="100" class="b">until Friday ＝ ずっと続く</text><rect x="60" y="113" width="380" height="14" rx="7" class="fG" style="opacity:.8"/>`, 580, 170, 'by は「点」、until は「線」') },
              { t: 'key', front: 'by と until の違いは？', back: 'by＝締め切り（それまでに1回やる）、until＝それまでずっと続く' },
              { t: 'q', q: { q: 'Please submit the form ___ Friday.（金曜までに提出して）', c: ['by', 'until', 'during', 'for'], a: 0, why: ['', 'until だと「金曜までずっと提出し続けて」になってしまいます。', 'during の後ろは出来事の名前です。', 'for の後ろは期間の長さです。'], e: '締め切り → by。' } },
              { t: 'q', q: { q: '___ the presentation, please turn off your phone.', c: ['During', 'For', 'While', 'Within'], a: 0, why: ['', 'for の後ろは「2時間」のような長さです。', 'while は接続詞なので、後ろに主語と動詞が必要です。', 'within は「〜以内に」です。'], e: '後ろが出来事の名前（the presentation）→ During。' } },
            ],
          },
        ],
        qs: [
          { id: 'b1', lv: 1, q: 'We need more ___ about the new product.', c: ['information', 'informations', 'an information', 'many information'], a: 0, why: ['', '-s は付きません。', 'an は付きません。', 'many は数える名詞用です。'], e: '数えない名詞です。' },
          { id: 'b2', lv: 1, q: 'The meeting is scheduled ___ Monday.', c: ['on', 'in', 'at', 'by'], a: 0, why: ['', 'in は月・年などの範囲です。', 'at は時刻などの点です。', 'by は締め切りです。'], e: '曜日・日付は on。' },
          { id: 'b3', lv: 1, q: 'It takes ___ hour to get to the factory.', c: ['an', 'a', 'many', 'much'], a: 0, why: ['', 'hour は「アワー」と母音の音で始まります。', '数える名詞の単数です。', 'hour は数える名詞です。'], e: 'a / an は、つづりではなく音で決まります。' },
          { id: 'b4', lv: 1, q: 'The office is closed ___ weekends.', c: ['on', 'in', 'at', 'for'], a: 0, why: ['', '範囲の in は使いません（英国では at weekends も）。', '米国では on weekends が一般的です。', 'for は期間の長さです。'], e: '曜日・週末は on（米国）。' },
          { id: 's1', lv: 2, q: 'Please submit the form ___ Friday.（金曜までに）', c: ['by', 'until', 'during', 'for'], a: 0, why: ['', '「ずっと」になります。', '出来事の名前の前です。', '長さの前です。'], e: '締め切り → by。' },
          { id: 's2', lv: 2, q: 'I will be in the office ___ 6 p.m. today.（6時までずっといる）', c: ['until', 'by', 'within', 'on'], a: 0, why: ['', 'by は締め切りです。', 'within は「以内に」です。', 'on は曜日・日付です。'], e: 'ずっと続く → until。' },
          { id: 's3', lv: 2, q: '___ the presentation, please turn off your phone.', c: ['During', 'For', 'While', 'Within'], a: 0, why: ['', '長さの前です。', '接続詞なので主語と動詞が必要です。', '「以内」です。'], e: '出来事の名前 → During。' },
          { id: 's4', lv: 2, q: 'The factory bought a new ___ of equipment.', c: ['piece', 'number', 'many', 'few'], a: 0, why: ['', 'a number of は数える名詞に使います。', 'many は名詞の前に置く語です。', 'few は数える名詞に使います。'], e: 'equipment は数えない → a piece of equipment。' },
          { id: 's5', lv: 2, q: 'Could you give me ___ feedback on my draft?', c: ['some', 'a', 'many', 'few'], a: 0, why: ['', 'feedback に a は付きません。', 'many は数える名詞用です。', 'few は数える名詞用です。'], e: 'feedback は数えない名詞です。' },
          { id: 'a1', lv: 3, q: 'She has worked here ___ 2019.', c: ['since', 'for', 'from', 'during'], a: 0, why: ['', 'for の後ろは「5年」のような長さです。', 'from は現在完了の起点としては since を使います。', 'during の後ろは出来事の名前です。'], e: '起点（2019年から）＋ 現在完了 → since。' },
          { id: 'a2', lv: 3, q: "I'll be back ___ ten minutes.（今から10分後に）", c: ['in', 'within the', 'after the', 'on'], a: 0, why: ['', 'the が不自然です。within ten minutes なら「10分以内に」。', 'the が不自然で、未来の「〜後」には in を使います。', 'on は曜日・日付です。'], e: '今から〜後に → in。' },
          { id: 'a3', lv: 3, t: 'tf', q: '<span class="en">The number of employees are increasing.</span> は正しい。', a: false, e: 'the number of 〜（〜の数）は単数扱い → is increasing。a number of 〜（たくさんの〜）は複数扱い。TOEIC 頻出です。' },
          { id: 'a4', lv: 3, q: 'The repair will be finished ___ 24 hours.（24時間以内に）', c: ['within', 'until', 'during', 'since'], a: 0, why: ['', 'until は「ずっと」です。', 'during の後ろは出来事の名前です。', 'since は起点です。'], e: '〜以内に → within。' },
        ],
        missions: [
          {
            title: '自分の仕事の「名詞のカタマリ」を英語にする', time: '30分',
            why: '仕事で使う物の名前を英語のカタマリで言えると、説明が一気に楽になります。',
            steps: ['仕事でよく使う物を10個選ぶ（例：組立ラインの検査カメラ）', '英語の名詞のカタマリにする（例：the inspection camera on the assembly line）', 'a / the を、相手が分かるかで選ぶ', '数えない名詞（equipment・information・software など）が入っていたら、正しく使えているか確かめる', '音読する'],
            deliverable: '英語の名詞のカタマリ10個',
            criteria: ['中心の名詞を先に、長い説明を後ろにした', 'a / the の理由を説明できる', '数えない名詞を正しく使った'],
          },
        ],
      },
      {
        id: 'en-modal', stage: 0, core: true, tags: ['toeic', 'biz', 'travel', 'paper'], pre: ['en-tense'],
        title: '助動詞と受動態',
        sum: '助動詞は「気持ちのダイヤル」、過去形は「距離をとる」と丁寧になる。受動態は「何が起きたか」を主役にする。',
        goals: ['must / should / may / might / can の強さを区別できる', '丁寧さの段階を意識して依頼できる', 'must not と don\'t have to を区別できる', '受動態を作り、論文・マニュアルで正しく読める'],
        lessons: [
          {
            title: '助動詞は「気持ちのダイヤル」', min: 13, steps: [
              { t: 'talk', html: '助動詞は、話し手の<b>気持ちの強さを表すダイヤル</b>です。同じ「雨が降る」でも、ダイヤルを回すと意味が変わります。' },
              { t: 'html', html: '<table class="tbl"><tr><th>ダイヤル</th><th>意味</th><th>例</th></tr><tr><td>might（弱）</td><td>ひょっとすると</td><td><span class="say">It might rain.</span></td></tr><tr><td>may</td><td>かもしれない</td><td><span class="say">It may rain.</span></td></tr><tr><td>could / can</td><td>ありうる・できる</td><td><span class="say">It could rain.</span></td></tr><tr><td>should</td><td>〜すべき・〜のはず</td><td><span class="say">You should check it.</span></td></tr><tr><td>must（強）</td><td>〜しなければ・〜に違いない</td><td><span class="say">You must wear a helmet.</span></td></tr></table>' },
              { t: 'html', html: D.scale([['might', 'ひょっとすると'], ['may', 'かもしれない'], ['could', 'ありうる'], ['should', 'はず'], ['must', 'ちがいない']], { left: '弱い（自信がない）', right: '強い（確信している）', cap: 'It ___ rain. の空欄で、話し手の自信の強さが変わる' }) },
              { t: 'key', front: '助動詞のダイヤルの強さの順は？', back: 'might ＜ may ＜ could/can ＜ should ＜ must' },
              { t: 'trap', html: '一番大事な見分け：<br><b>must not</b> ＝ 〜してはいけない（禁止）<br><b>don\'t have to</b> ＝ 〜しなくてもいい（必要ない）<br>意味がまったく違います。「今日出さなくていいよ、明日でも」は don\'t have to。' },
              { t: 'q', q: { q: "You ___ submit the form today. Tomorrow is also fine.", c: ["don't have to", 'must not', 'must', 'should'], a: 0, why: ['', '「出してはいけない」になってしまいます。', '「必ず出せ」になります。', '「出すべき」になります。'], e: '明日でもいい → 必要ない → don\'t have to。' } },
              { t: 'talk', html: 'そしてビジネスで一番大事なのが<b>丁寧な頼み方</b>。ここにも面白いルールがあります。<b>過去形にすると、丁寧になる</b>んです。can → could、will → would。過去形は「今から少し距離をとる」形なので、押しつけがましさが消えるんですね。' },
              { t: 'html', html: '<table class="tbl"><tr><th>丁寧さ</th><th>表現</th></tr><tr><td>★</td><td><span class="say">Send me the file.</span></td></tr><tr><td>★★</td><td><span class="say">Can you send me the file?</span></td></tr><tr><td>★★★</td><td><span class="say">Could you send me the file?</span></td></tr><tr><td>★★★★</td><td><span class="say">Would you mind sending me the file?</span></td></tr><tr><td>★★★★★</td><td><span class="say">I was wondering if you could send me the file.</span></td></tr></table>' },
              { t: 'key', front: '丁寧に頼むコツは？', back: '過去形にして距離をとる（can→could、will→would）。Would you mind -ing? は特に丁寧' },
            ],
          },
          {
            title: '受動態は「何が起きたか」が主役', min: 12, steps: [
              { t: 'talk', html: '受動態（be ＋ 過去分詞）は「〜される」。でも本当の役割は、<b>誰がやったかより「何が起きたか」を主役にする</b>ことです。' },
              { t: 'talk', html: 'ニュースで「財布が盗まれた」と言いますよね。誰が盗んだか分からないし、大事なのは財布のほう。論文やマニュアルも同じで、「誰が測ったか」より「何がどう処理されたか」が大事なので、受動態がとても多いんです。' },
              { t: 'html', html: D.compare({ title: '能動態：やった人が主役', icon: '🖥️', lines: ['The GPU processes the images.', '主役 ＝ GPU'], color: 'fa' }, { title: '受動態：起きたことが主役', icon: '🖼️', lines: ['The images are processed.', '主役 ＝ 画像（by 〜 は省略可）'], color: 'fw' }, { vs: '⇄', cap: '「誰が」より「何が起きたか」を伝えたいときに受動態' }) },
              { t: 'html', html: '<ul><li><span class="say">The images are processed by the GPU.</span>（画像はGPUで処理される）</li><li><span class="say">The samples were measured three times.</span>（サンプルは3回測定された）</li></ul><table class="tbl"><tr><th>時制</th><th>受動態の形</th></tr><tr><td>現在・過去</td><td>is / was ＋ 過去分詞</td></tr><tr><td>現在完了</td><td>has <b>been</b> ＋ 過去分詞</td></tr><tr><td>助動詞</td><td>will / must <b>be</b> ＋ 過去分詞</td></tr><tr><td>進行形</td><td>is <b>being</b> ＋ 過去分詞</td></tr></table>' },
              { t: 'key', front: '受動態の本当の役割は？', back: '誰がやったかより「何が起きたか」を主役にする（論文・マニュアルに多い）' },
              { t: 'q', q: { q: 'The parts ___ in Germany.', c: ['are manufactured', 'manufacture', 'are manufacturing', 'manufactured by'], a: 0, why: ['', '部品が「製造する」のはおかしいです。', '部品が「製造している」のはおかしいです。', 'by の後ろに行為者がなく、be 動詞もありません。'], e: '部品は作「られる」側 → 受動態。' } },
              { t: 'talk', html: 'TOEIC の解き方は簡単。<b>主語が「する側」か「される側」か</b>を考えるだけです。部品・報告書・会議・システム… 物が主語なら、まず受動態を疑いましょう。' },
              { t: 'q', q: { q: 'The report must ___ by Friday.', c: ['be submitted', 'submit', 'submitted', 'be submitting'], a: 0, why: ['', '報告書が「提出する」のはおかしいです。', '助動詞の後ろは動詞の原形（be）が必要です。', '報告書が「提出している」のはおかしいです。'], e: '助動詞 ＋ be ＋ 過去分詞。' } },
            ],
          },
        ],
        qs: [
          { id: 'b1', lv: 1, q: '最も丁寧な依頼は？', c: ['Would you mind sending me the file?', 'Can you send me the file?', 'Send me the file.', 'You send me the file.'], a: 0, why: ['', '丁寧ですが、Would you mind の方がより丁寧です。', '命令です。', '依頼の形になっていません。'], e: 'Would you mind -ing? はとても丁寧な依頼です。' },
          { id: 'b2', lv: 1, q: 'The parts ___ in Germany.', c: ['are manufactured', 'manufacture', 'are manufacturing', 'manufactured by'], a: 0, why: ['', '部品が作る側になってしまいます。', '部品が作っている側になってしまいます。', '形が正しくありません。'], e: '部品は作られる側。' },
          { id: 'b3', lv: 1, q: 'You ___ wear a helmet in this area. It is required by law.', c: ['must', 'might', 'could', 'may'], a: 0, why: ['', '弱すぎます。', '「ありうる」程度です。', '「かもしれない／してもよい」です。'], e: '法律で必要 → 強い義務 → must。' },
          { id: 'b4', lv: 1, q: 'Could I ___ your pen for a moment?', c: ['borrow', 'lend', 'rent', 'take care'], a: 0, why: ['', 'lend は「貸す」です。', 'rent はお金を払って借りるときです。', '意味が合いません。'], e: 'borrow ＝ 借りる、lend ＝ 貸す。' },
          { id: 's1', lv: 2, q: "You ___ submit the form today. Tomorrow is also fine.", c: ["don't have to", 'must not', 'must', 'should'], a: 0, why: ['', '禁止になります。', '強い義務になります。', '「すべき」になります。'], e: '必要ない → don\'t have to。' },
          { id: 's2', lv: 2, q: 'It ___ rain this afternoon, so take an umbrella just in case.', c: ['might', 'must', 'should not', 'cannot'], a: 0, why: ['', '「必ず降る」と言うほどではありません（just in case ＝ 念のため）。', '意味が合いません。', '意味が合いません。'], e: '念のため → 可能性は高くない → might。' },
          { id: 's3', lv: 2, q: 'Would you mind ___ the door?', c: ['closing', 'to close', 'close', 'closed'], a: 0, why: ['', 'mind の後ろに to 不定詞は来ません。', '原形は来ません。', '過去分詞は来ません。'], e: 'mind の後ろは -ing。' },
          { id: 's4', lv: 2, q: 'The software has ___ updated to version 2.0.', c: ['been', 'being', 'be', 'was'], a: 0, why: ['', 'has being という形はありません。', 'has be という形はありません。', 'has was という形はありません。'], e: '現在完了の受動態 has been ＋ 過去分詞。' },
          { id: 's5', lv: 2, q: 'The report must ___ by Friday.', c: ['be submitted', 'submit', 'submitted', 'be submitting'], a: 0, why: ['', '報告書が提出する側になります。', '助動詞の後ろには原形が必要です。', '報告書が提出している側になります。'], e: '助動詞 ＋ be ＋ 過去分詞。' },
          { id: 'a1', lv: 3, q: 'He ___ be in the office. His car is in the parking lot.', c: ['must', 'might not', 'cannot', 'need not'], a: 0, why: ['', '根拠があるのに弱すぎます。', '根拠と逆の結論です。', '意味が合いません。'], e: '根拠のある強い推測「〜に違いない」→ must。' },
          { id: 'a2', lv: 3, q: 'You ___ have told me earlier! I could have helped you.', c: ['should', 'must', 'can', 'will'], a: 0, why: ['', 'must have は「〜したに違いない」で、意味が合いません。', 'can have は普通使いません。', 'will have は未来完了です。'], e: 'should have ＋ 過去分詞 ＝「〜すべきだったのに（しなかった）」。' },
          { id: 'a3', lv: 3, t: 'order', q: '「その問題はすぐに解決されるべきだ」', tokens: ['The', 'problem', 'should', 'be', 'solved', 'immediately'], e: '助動詞 should ＋ be ＋ 過去分詞。' },
          { id: 'a4', lv: 3, t: 'order', q: '「その画像はGPUで処理される」', tokens: ['The', 'images', 'are', 'processed', 'by', 'the', 'GPU'], e: '受動態 be ＋ 過去分詞 ＋ by（誰によって）。' },
        ],
        missions: [
          {
            title: '丁寧さのダイヤルで、同じ頼みごとを5段階で言う', time: '20分',
            why: '丁寧さを自由に調節できると、相手や場面に合わせた英語が話せるようになります。',
            steps: ['仕事でよくある頼みごとを3つ選ぶ（例：資料を送ってほしい）', 'それぞれを、このユニットの表の5段階で言い換える', '上司・お客様・同僚には、どの段階を使うか決める', '一番丁寧な言い方を3回音読する'],
            deliverable: '頼みごと3つ × 5段階の英文',
            criteria: ['5段階で言い換えられた', '相手ごとの使い分けを決めた', 'Would you mind の後ろを -ing にできた'],
          },
        ],
      },
      {
        id: 'en-verbal', stage: 0, core: true, tags: ['toeic', 'biz', 'paper'], pre: ['en-modal'],
        title: '準動詞：不定詞・動名詞・分詞',
        sum: 'to は「これから →」、-ing は「実際にやっている ●」。分詞は「する側（-ing）」か「される側（-ed）」か。',
        goals: ['to 不定詞と動名詞のイメージの違いを説明できる', 'to と -ing のどちらをとる動詞か判断できる', '-ing / -ed の分詞で名詞を説明できる', '感情の形容詞（interesting / interested）を正しく使える'],
        lessons: [
          {
            title: 'to は「これから →」、-ing は「実際の行為 ●」', min: 13, steps: [
              { t: 'talk', html: '1つの文に、メインの動詞は原則1つ。それ以外の動詞は、形を変えて「名詞」や「説明」として働きます。それが準動詞です。中でも一番迷うのが、<b>to ＋ 動詞</b> と <b>動詞 ＋ -ing</b> の使い分けですね。' },
              { t: 'talk', html: 'イメージは2つだけ。<b>to は矢印 →</b>。前置詞の to（〜へ）と同じで、<b>これから向かう</b>こと。<b>-ing は点 ●</b>。<b>実際にやっている・やったこと</b>です。' },
              { t: 'html', html: D.compare({ title: 'to ＋ 動詞 ＝ これから', icon: '➡️', lines: ['向かっていく矢印', 'I decided to change the lens.', 'want / plan / decide / hope'], color: 'fa' }, { title: '-ing ＝ 実際の行為', icon: '⚫', lines: ['やっている・やった点', 'I finished checking the data.', 'finish / enjoy / avoid / mind'], color: 'fg' }, { vs: 'vs', cap: '動詞の意味が「未来向き」か「実際の行為」かで決まる' }) },
              { t: 'html', html: '<div class="cols"><div class="box point"><b>to ＋ 動詞（これから →）</b>want, hope, plan, decide, expect, agree, promise, need, refuse<br><span class="say">We decided to postpone the test.</span></div><div class="box tip"><b>動詞 ＋ -ing（実際の行為 ●）</b>enjoy, finish, avoid, consider, suggest, mind, postpone, keep<br><span class="say">We finished testing the system.</span></div></div>' },
              { t: 'key', front: 'to 不定詞と動名詞のイメージは？', back: 'to＝これから向かう（→）、-ing＝実際にやっている・やったこと（●）' },
              { t: 'talk', html: '「決める（decide）」のは、これからやることですよね。だから to。「終える（finish）」のは、実際にやっていたことを終える。だから -ing。<b>動詞の意味から、向きを考える</b>と覚えやすいですよ。' },
              { t: 'q', q: { q: 'Have you finished ___ the report?', c: ['writing', 'to write', 'write', 'written'], a: 0, why: ['', 'finish は「やっていたことを終える」ので、これからの to ではありません。', '原形は来ません。', '過去分詞は来ません（受け身の意味になります）。'], e: 'finish ＋ -ing。' } },
              { t: 'trap', html: '<b>to の後ろに -ing が来る</b>大事な表現があります。この to は「〜へ」の前置詞なので、後ろは名詞か -ing です。<br><span class="say">I look forward to hearing from you.</span>（ご連絡をお待ちしています）<br>× look forward to hear　○ look forward to hearing' },
              { t: 'key', front: 'look forward to の後ろの形は？', back: '-ing（この to は前置詞）。I look forward to hearing from you.' },
              { t: 'html', html: '<div class="box ex"><b>意味が変わる動詞</b><span class="say">I remember meeting him.</span>（会ったことを覚えている＝過去の行為 ●）<br><span class="say">Remember to send the report.</span>（忘れずに送って＝これから →）</div>' },
            ],
          },
          {
            title: '分詞は「する側」か「される側」か', min: 12, steps: [
              { t: 'talk', html: '動詞の -ing 形と過去分詞（-ed）は、名詞を説明する形容詞にもなります。ルールはシンプル。<b>-ing は「する側」、-ed は「される側」</b>です。' },
              { t: 'html', html: D.compare({ title: '-ing ＝ する側', icon: '🤖', lines: ['the robot holding the part', 'ロボットが「つかんでいる」'], color: 'fa' }, { title: '-ed ＝ される側', icon: '🔩', lines: ['the part held by the robot', '部品が「つかまれている」'], color: 'fw' }, { vs: 'vs', cap: '説明される名詞が「する側」か「される側」か' }) },
              { t: 'html', html: '<ul><li><span class="say">the robot holding the part</span>（部品を<b>つかんでいる</b>ロボット）← ロボットがする側</li><li><span class="say">the images captured by the camera</span>（カメラで<b>撮られた</b>画像）← 画像がされる側</li></ul>' },
              { t: 'key', front: '分詞の -ing と -ed の違いは？', back: '-ing＝する側（〜している）、-ed＝される側（〜された）' },
              { t: 'talk', html: 'TOEIC で必ず出るのが<b>感情の形容詞</b>。interesting と interested、どっちがどっち？ これも「する側・される側」で一発です。' },
              { t: 'html', html: '<div class="box point"><b>物が主語 → -ing（気持ちにさせる側）</b>The paper is <b>interesting</b>.（論文が人を興味深くさせる）<br><b>人が主語 → -ed（気持ちにさせられる側）</b>I am <b>interested</b> in AI.（私は興味を持たされている）</div>' },
              { t: 'key', front: 'interesting と interested の使い分けは？', back: '物が主語（させる側）は -ing、人が主語（させられる側）は -ed' },
              { t: 'q', q: { q: 'The customers were ___ with the new service.', c: ['satisfied', 'satisfying', 'satisfy', 'satisfaction'], a: 0, why: ['', 'お客様が「満足させる側」になってしまいます。', '動詞の原形は were の後ろに来ません。', '名詞です。'], e: '人が主語 → 満足させられた → satisfied。' } },
              { t: 'q', q: { q: 'The images ___ by the camera are stored on the PC.', c: ['captured', 'capturing', 'to capture', 'capture'], a: 0, why: ['', '画像が「撮っている」のはおかしいです。', '「これから撮るための画像」になります。', '動詞が2つになってしまいます。'], e: '画像は撮「られる」側 → 過去分詞 captured が後ろから説明します。' } },
            ],
          },
        ],
        qs: [
          { id: 'b1', lv: 1, q: 'We decided ___ the project until next year.', c: ['to postpone', 'postponing', 'postpone', 'postponed'], a: 0, why: ['', 'decide はこれからのことなので to です。', '原形は来ません。', '過去分詞は来ません。'], e: 'decide ＋ to。' },
          { id: 'b2', lv: 1, q: 'Have you finished ___ the report?', c: ['writing', 'to write', 'write', 'written'], a: 0, why: ['', 'finish はやっていたことを終えるので -ing。', '原形は来ません。', '過去分詞は来ません。'], e: 'finish ＋ -ing。' },
          { id: 'b3', lv: 1, q: 'I am very ___ in machine learning.', c: ['interested', 'interesting', 'interest', 'to interest'], a: 0, why: ['', '「私は人を興味深くさせる」になってしまいます。', '名詞・動詞です。', '意味が合いません。'], e: '人が主語 → -ed。' },
          { id: 'b4', lv: 1, q: 'He avoided ___ the question.', c: ['answering', 'to answer', 'answer', 'answered'], a: 0, why: ['', 'avoid は -ing をとります。', '原形は来ません。', '過去分詞は来ません。'], e: 'avoid ＋ -ing。' },
          { id: 's1', lv: 2, q: 'The images ___ by the camera are stored on the PC.', c: ['captured', 'capturing', 'to capture', 'capture'], a: 0, why: ['', '画像は撮る側ではありません。', '意味が変わります。', '動詞が2つになります。'], e: '画像はされる側 → 過去分詞。' },
          { id: 's2', lv: 2, q: 'We look forward to ___ you at the exhibition.', c: ['seeing', 'see', 'be seen', 'saw'], a: 0, why: ['', 'この to は前置詞なので、原形は来ません。', '意味が合いません。', '過去形は来ません。'], e: 'look forward to ＋ -ing。' },
          { id: 's3', lv: 2, q: 'The manager suggested ___ the meeting to Friday.', c: ['moving', 'to move', 'move', 'moved'], a: 0, why: ['', 'suggest は to をとりません。', '原形は来ません（that 節なら可）。', '過去分詞は来ません。'], e: 'suggest ＋ -ing。' },
          { id: 's4', lv: 2, q: 'The customers were ___ with the new service.', c: ['satisfied', 'satisfying', 'satisfy', 'satisfaction'], a: 0, why: ['', 'お客様が満足させる側になります。', '形が合いません。', '名詞です。'], e: '人が主語 → -ed。' },
          { id: 's5', lv: 2, q: 'Please remember ___ the lights when you leave.', c: ['to turn off', 'turning off', 'turn off', 'turned off'], a: 0, why: ['', '「消したことを覚えている」になってしまいます。', '原形は来ません。', '過去分詞は来ません。'], e: 'これから忘れずに → remember to。' },
          { id: 'a1', lv: 3, q: 'The lecture was so ___ that many people fell asleep.', c: ['boring', 'bored', 'bore', 'to bore'], a: 0, why: ['', '講義が「退屈させられた」になります。', '動詞です。', '意味が合いません。'], e: '講義が人を退屈させる → -ing。' },
          { id: 'a2', lv: 3, q: '___ from the hill, the factory looks very small.', c: ['Seen', 'Seeing', 'To see', 'See'], a: 0, why: ['', '工場が「見ている」ことになります。', '「見るために」で意味が合いません。', '命令文になってしまいます。'], e: '分詞構文。工場は見られる側 → Seen。' },
          { id: 'a3', lv: 3, q: 'It is important ___ the data regularly.', c: ['to back up', 'backing up', 'back up', 'backed up'], a: 0, why: ['', 'It is 〜 の後ろは to 不定詞の形が基本です。', '原形は来ません。', '過去分詞は来ません。'], e: 'It は後ろの to 不定詞を指す仮の主語です。' },
          { id: 'a4', lv: 3, q: 'This software is easy ___.', c: ['to use', 'using', 'used', 'to be used it'], a: 0, why: ['', 'easy の後ろは to 不定詞です。', '意味が合いません。', 'it が余計です。'], e: '形容詞 ＋ to（〜するのが…だ）。' },
        ],
        missions: [
          {
            title: '「→ か ● か」で動詞を仕分ける', time: '30分',
            why: '丸暗記ではなく、動詞の意味から向きを考える練習をすると、初めての動詞でも当てられるようになります。',
            steps: ['このユニットの to をとる動詞と -ing をとる動詞を、カードに1枚ずつ書く', 'それぞれ「これから →」か「実際の行為 ●」かを、自分の言葉で理由づけする', '仕事に関係する例文を各1つ作る', '感情の形容詞（interesting / interested など）を使った文を、物が主語・人が主語で各1つ作る'],
            deliverable: '動詞の仕分け表と例文',
            criteria: ['向きの理由を自分の言葉で書いた', '仕事の例文を作った', '感情の形容詞を正しく使い分けた'],
          },
        ],
      },
      {
        id: 'en-clause', stage: 0, core: true, tags: ['toeic', 'biz', 'paper'], pre: ['en-verbal', 'en-noun'],
        title: '関係詞と接続詞：長い文を前から読む',
        sum: '関係詞は「名詞の後ろに付ける説明書き」。後ろが完全か欠けているかで選ぶ。長い文は「チャンク」で前から読む。',
        goals: ['who / which / that / whose / where を使い分けられる', '後ろの形で接続詞と前置詞を区別できる', 'つなぎ言葉から次の展開を予想できる', '長い文をチャンクで区切って前から読める'],
        lessons: [
          {
            title: '関係詞は「説明書きの付箋」', min: 13, steps: [
              { t: 'talk', html: '関係詞は、名詞の後ろにペタッと貼る<b>説明書きの付箋</b>です。「どのエンジニア？」→「このシステムを設計した（エンジニア）」。' },
              { t: 'html', html: D.chunks([['the engineer', '名詞', 'fa'], ['who designed the system', '付箋：どんな人？', 'fw']], { cap: '関係詞は、名詞の後ろにペタッと貼る説明の付箋' }) },
              { t: 'html', html: '<table class="tbl"><tr><th>関係詞</th><th>前の名詞</th><th>例</th></tr><tr><td>who</td><td>人</td><td>the engineer <b>who</b> designed it</td></tr><tr><td>which</td><td>物</td><td>the camera <b>which</b> we bought</td></tr><tr><td>that</td><td>人・物（万能）</td><td>the system <b>that</b> we discussed</td></tr><tr><td>whose</td><td>〜の（持ち主）</td><td>the company <b>whose</b> products are popular</td></tr><tr><td>where</td><td>場所</td><td>the factory <b>where</b> the parts are made</td></tr></table>' },
              { t: 'talk', html: '一番迷うのが <b>where と which</b>。見分け方の決め手は、<b>付箋の中身（関係詞の後ろ）が「完全な文」か「欠けた文」か</b>です。' },
              { t: 'html', html: '<div class="box point">the factory <b>where</b> [the parts are made] ← 主語も動詞もそろった完全な文 → where<br>the factory <b>which</b> [we visited ＿] ← visited の「何を」が欠けている → which / that</div>' },
              { t: 'html', html: D.compare({ title: 'where ＋ 完全な文', icon: '📍', lines: ['the factory where', '[the parts are made]', '主語も動詞もそろっている'], color: 'fg' }, { title: 'which ＋ 欠けた文', icon: '🧩', lines: ['the factory which', '[we visited ＿]', 'visited の目的語が欠けている'], color: 'fw' }, { vs: 'vs', cap: '決め手は「付箋の中身」が完全か、欠けているか' }) },
              { t: 'key', front: 'where と which の見分け方は？', back: '関係詞の後ろが完全な文なら where、何かが欠けていれば which / that' },
              { t: 'q', q: { q: 'This is the factory ___ the parts are produced.', c: ['where', 'which', 'who', 'what'], a: 0, why: ['', '後ろ（the parts are produced）は完全な文なので which は入りません。', '人ではありません。', 'what は前に名詞があるときは使いません。'], e: '後ろが完全な文 → 場所の where。' } },
              { t: 'trap', html: 'カンマの後ろの説明（補足）では <b>that は使えません</b>。<br>The camera, <b>which</b> was installed last week, has already broken down.（× , that was installed）' },
            ],
          },
          {
            title: '後ろの形で決まる：接続詞と前置詞／チャンク読み', min: 14, steps: [
              { t: 'talk', html: 'TOEIC で必ず出るのが、意味は同じなのに<b>後ろの形</b>で使い分ける組み合わせです。' },
              { t: 'html', html: D.compare({ title: 'Although ＋ 主語＋動詞', icon: '🧱', lines: ['Although the cost is high,', '後ろに文が来る（接続詞）'], color: 'fa' }, { title: 'Despite ＋ 名詞', icon: '📦', lines: ['Despite the high cost,', '後ろに名詞が来る（前置詞）'], color: 'fw' }, { vs: '＝', cap: '意味は同じ「〜にもかかわらず」。後ろの形で選ぶ' }) },
              { t: 'html', html: '<table class="tbl"><tr><th>意味</th><th>後ろに主語＋動詞（接続詞）</th><th>後ろに名詞（前置詞）</th></tr><tr><td>〜にもかかわらず</td><td>although, though</td><td>despite, in spite of</td></tr><tr><td>〜なので</td><td>because, since</td><td>because of, due to</td></tr><tr><td>〜の間</td><td>while</td><td>during</td></tr></table>' },
              { t: 'key', front: 'Although と Despite の違いは？', back: '意味は同じ。後ろが「主語＋動詞」なら Although、「名詞」なら Despite' },
              { t: 'q', q: { q: '___ the cost is high, the method is widely used.', c: ['Although', 'Despite', 'Because of', 'However'], a: 0, why: ['', 'Despite の後ろは名詞です（the cost is high は主語＋動詞）。', '意味が合わず、後ろも名詞が必要です。', 'However は2つの文をつなげられません。'], e: '後ろが主語＋動詞で逆接 → Although。' } },
              { t: 'talk', html: 'however（しかし）、therefore（したがって）、moreover（さらに）、for example（例えば）。これらは<b>次に何が来るかの予告</b>です。道路の標識のように、先の展開を教えてくれます。速く読むための大事な手がかりです。' },
              { t: 'talk', html: 'そして、長い文を読む最強の技が<b>チャンク読み（スラッシュリーディング）</b>。意味のまとまりで区切って、<b>前から順に</b>理解します。日本語の順番に並べ替える「返り読み」をしていると、リスニングにも速読にも間に合いません。' },
              { t: 'html', html: '<div class="box ex"><span class="say">The system that we developed last year / can detect defects / that are smaller than 0.1 millimeters / although it uses a low-cost camera.</span><br><br>私たちが去年開発したシステムは ／ 欠陥を検出できる ／ （それは）0.1mmより小さい ／ 安いカメラを使っているのに</div>' },
              { t: 'key', front: 'チャンク読みで区切る目安は？', back: '長い主語の後・動詞の後・前置詞／関係詞／接続詞／to の前' },
            ],
          },
        ],
        qs: [
          { id: 'b1', lv: 1, q: 'The engineer ___ designed this camera will join the meeting.', c: ['who', 'which', 'whose', 'where'], a: 0, why: ['', '人には which を使いません。', 'whose の後ろには名詞が必要です。', '場所ではありません。'], e: '人の後ろで、主語が欠けている → who。' },
          { id: 'b2', lv: 1, q: 'This is the factory ___ the parts are produced.', c: ['where', 'which', 'who', 'what'], a: 0, why: ['', '後ろが完全な文です。', '人ではありません。', '前に名詞があるときは使いません。'], e: '後ろが完全 → where。' },
          { id: 'b3', lv: 1, q: 'The model was very accurate. ___, it was too slow.', c: ['However', 'Therefore', 'For example', 'Moreover'], a: 0, why: ['', '「だから遅い」は話がつながりません。', '例を挙げていません。', '「さらに」は良いことを足すときです。'], e: '正確だった ↔ 遅すぎた → 逆接の However。' },
          { id: 's1', lv: 2, q: '___ the cost is high, the method is widely used.', c: ['Although', 'Despite', 'Because of', 'However'], a: 0, why: ['', '後ろが主語＋動詞です。', '意味も形も合いません。', '文をつなげられません。'], e: '接続詞 Although。' },
          { id: 's2', lv: 2, q: '___ the heavy rain, the event was held as scheduled.', c: ['Despite', 'Although', 'Unless', 'While'], a: 0, why: ['', '後ろが名詞（the heavy rain）です。', '「〜でない限り」で意味が合いません。', '後ろに主語＋動詞が必要です。'], e: '後ろが名詞 → 前置詞 Despite。' },
          { id: 's3', lv: 2, q: 'We will ship the order today ___ there is a problem with payment.', c: ['unless', 'despite', 'because of', 'during'], a: 0, why: ['', '後ろは主語＋動詞です。', '後ろは主語＋動詞です。', '後ろは主語＋動詞です。'], e: '「支払いに問題がない限り」→ unless。' },
          { id: 's4', lv: 2, q: 'We visited a supplier ___ products are used worldwide.', c: ['whose', 'who', 'which', 'where'], a: 0, why: ['', '後ろが「products are used」で主語が欠けていません。', '同上です。', '場所ではありません。'], e: '「その会社の製品」という持ち主の関係 → whose。' },
          { id: 's5', lv: 2, t: 'order', q: '「私たちが昨日話し合ったシステム」', tokens: ['the', 'system', 'that', 'we', 'discussed', 'yesterday'], e: 'discussed の「何を」が欠けている（＝the system）。' },
          { id: 'a1', lv: 3, q: 'The camera, ___ was installed last week, has already broken down.', c: ['which', 'that', 'what', 'who'], a: 0, why: ['', 'カンマの後ろの補足では that は使えません。', '前に名詞があります。', '物です。'], e: 'カンマの後ろの説明 → which。' },
          { id: 'a2', lv: 3, q: 'What we need ___ more time.', c: ['is', 'are', 'be', 'being'], a: 0, why: ['', 'What 節のカタマリは単数扱いです。', '原形は来ません。', '動詞がなくなります。'], e: '[What we need] is more time.' },
          { id: 'a3', lv: 3, q: "I don't know ___ he will come or not.", c: ['whether', 'that', 'what', 'which'], a: 0, why: ['', '「〜かどうか」は表せません。', '「何を」になってしまいます。', '「どちら」で意味が合いません。'], e: '〜かどうか → whether（or not）。' },
          { id: 'a4', lv: 3, q: 'Not only the price ___ the quality is important.', c: ['but also', 'and also', 'or', 'nor'], a: 0, why: ['', 'not only の相方は but also です。', '意味が合いません。', 'neither の相方です。'], e: 'not only A but also B（A だけでなく B も）。' },
        ],
        missions: [
          {
            title: '英文を「チャンク」で区切って音読する', time: '1日10分 × 7日',
            why: '前から読む力は、区切りの練習と音読で身につきます。リスニングも同時に伸びます。',
            steps: ['毎日、少し長めの英文を3つ選ぶ（ニュース・マニュアル・論文の Abstract）', '意味のまとまりでスラッシュ（／）を入れる', 'チャンクごとに日本語にする（並べ替えない）', 'スラッシュの位置で区切りながら音読する', '最後に、区切りなしで前から一度に読めるか試す'],
            deliverable: 'スラッシュを入れた英文21文',
            criteria: ['7日間続けた', '並べ替えずに前から意味をとれた', '音読でチャンクを意識できた'],
          },
        ],
      },
      /* ================= STAGE 2 ================= */
      {
        id: 'en-sound', stage: 1, core: true, tags: ['toeic', 'biz', 'travel'], pre: ['en-structure'],
        title: '英語の音：リスニングが伸びる仕組み',
        sum: '聞こえないのは耳のせいではなく「音の変化」を知らないから。自分で言える音は、聞き取れるようになる。',
        goals: ['聞き取れない3つの原因を説明できる', 'つながる・消える・弱くなる音の変化を例で言える', '強く読む語と弱く読む語のリズムが分かる', '書き取り → 音読・シャドーイングの練習を自分で回せる'],
        lessons: [
          {
            title: '聞こえないのは「音の変化」を知らないから', min: 15, steps: [
              { t: 'talk', html: '「単語は知っているのに、聞くと分からない」。これ、耳が悪いわけではありません。原因はほぼ、<b>英語の音の変化を知らない</b>ことです。' },
              { t: 'html', html: '<ol class="steps-ol"><li><b>単語・文法を知らない</b> → STAGE 1 と単語カードで解決</li><li><b>音を知らない</b>：書けば分かるのに、実際の音が予想と違う ← <b>ほとんどの人の一番の原因</b></li><li><b>処理が追いつかない</b>：前から理解する速さが足りない → チャンク読みとたくさん聞くことで解決</li></ol>' },
              { t: 'talk', html: '英語は、単語を1つずつ区切って発音しません。<b>つながったり、消えたり、弱くなったり</b>します。日本語でも「ありがとうございます」を早口で言うと「あざっす」になりますよね。あれと同じです。🔊で確かめてみましょう。' },
              { t: 'html', html: D.grid(['書くと', '聞こえ方'], ['つながる', '消える', '変わる'], [[['check it out', 'fa'], ['チェキラウ', 'fw']], [['good job', 'fa'], ['グッジョブ（d が消える）', 'fw']], [['water', 'fa'], ['ワラ（t が ラ に）', 'fw']]], { cw: 200, ch: 52, cap: '英語は単語を区切らない。音の変化を知ると聞こえるようになる' }) },
              { t: 'html', html: '<table class="tbl"><tr><th>変化</th><th>何が起きる</th><th>例</th></tr><tr><td><b>つながる</b>（リンキング）</td><td>子音＋母音がくっつく</td><td><span class="say">Check it out.</span>（チェキラウ）</td></tr><tr><td><b>消える</b>（脱落）</td><td>語尾の t・d・k が消える</td><td><span class="say">Good morning.</span>（グッモーニン）</td></tr><tr><td><b>混ざる</b>（同化）</td><td>隣の音と混ざって別の音に</td><td><span class="say">Could you help me?</span>（クッジュ）</td></tr><tr><td><b>弱くなる</b>（弱形）</td><td>to・for・and・of などが弱く短く</td><td><span class="say">a cup of coffee</span>（アカパコーフィ）</td></tr></table>' },
              { t: 'key', front: '英語が聞き取れない一番多い原因は？', back: '音の変化（つながる・消える・混ざる・弱くなる）を知らないこと' },
              { t: 'talk', html: 'もう1つ大事なのが<b>リズム</b>。英語は、<b>内容を運ぶ語（名詞・動詞・形容詞）を強く</b>、<b>文法の語（冠詞・前置詞・代名詞）を弱く</b>読みます。強いところだけ聞き取れれば、意味はほとんど分かるんです。' },
              { t: 'html', html: '<p><span class="say">I\'m going to SEND the REPORT to the CLIENT TOMORROW.</span></p>' },
              { t: 'q', q: { q: '英語で普通「強く」読まれるのは？', c: ['名詞・動詞などの内容を運ぶ語', '冠詞（a / the）', '前置詞（to / for）', '代名詞（it / them）'], a: 0, why: ['', '冠詞は弱く読まれます。', '前置詞は弱く読まれます。', '代名詞は弱く読まれることが多いです。'], e: '強い語をつなぐと、意味がつかめます。' } },
            ],
          },
          {
            title: '自分で言える音は、聞き取れる', min: 12, steps: [
              { t: 'talk', html: 'リスニングを伸ばす一番の練習法を教えます。キーワードは、<b>自分で言える音は、聞き取れる</b>。' },
              { t: 'html', html: D.cycle([['聞く', '内容を予想して'], ['書き取る', 'ディクテーション'], ['答え合わせ', '聞けなかった音を確認'], ['まねて言う', '音読・シャドーイング']], { center: '同じ音声で10回', cap: '自分で言える音は、聞き取れる' }) },
              { t: 'html', html: '<ol class="steps-ol"><li><b>聞く</b>：まず内容を予想しながら聞く</li><li><b>書き取る</b>（ディクテーション）：聞こえた通りに書く</li><li><b>答え合わせ</b>：聞き取れなかった音を見つける（ここが宝）</li><li><b>まねる</b>：音読 → テキストを見ながら重ねて読む（オーバーラッピング）→ 何も見ずに少し遅れて追いかける（シャドーイング）</li></ol>' },
              { t: 'key', front: 'リスニングの最強の練習サイクルは？', back: '聞く → 書き取る → 聞き取れない音を見つける → まねる（音読・シャドーイング）' },
              { t: 'talk', html: '書き取りで分かった「聞き取れない音」こそが、あなた専用の宝物です。その音を自分で10回言ってみる。すると不思議なことに、次から聞こえるようになります。' },
              { t: 'q', q: { t: 'dict', q: '聞こえた通りに書き取ろう', audio: 'Could you send it to me?', e: 'Could you は「クッジュ」、send it は「センディッ」とつながります。' } },
              { t: 'trap', html: '1つの音声を1回聞いて次へ…では伸びません。<b>同じ音声を10回以上</b>、全部聞き取れて言えるようになるまで繰り返すのが効果的です。' },
              { t: 'talk', html: 'このユニットの練習問題には、書き取りと、声に出して言う問題があります。マイクが使えない場合は、声に出してから自分で評価して進めてください。<b>声に出すこと</b>が、何より大事です。' },
            ],
          },
        ],
        qs: [
          { id: 'b1', lv: 1, q: '<span class="en">"a cup of coffee"</span> が「アカパコーフィ」と聞こえる主な理由は？', c: ['of が弱くなり、cup とつながるから', 'coffee の発音が国で違うから', 'a が強く読まれるから', 'cup の p が二重になるから'], a: 0, why: ['', '主な理由ではありません。', 'a は弱く読まれます。', '二重にはなりません。'], e: '文法の語 of は弱く「ア」程度になり、前の cup とつながります。' },
          { id: 'b2', lv: 1, q: '英語で普通「強く」読まれるのは？', c: ['名詞・動詞などの内容を運ぶ語', '冠詞', '前置詞', '代名詞'], a: 0, why: ['', '弱く読まれます。', '弱く読まれます。', '弱く読まれることが多いです。'], e: '強い語をつなぐと意味がつかめます。' },
          { id: 'b3', lv: 1, t: 'dict', q: '聞こえた通りに書き取ろう', audio: 'Could you send it to me?', e: 'Could you は「クッジュ」。' },
          { id: 'b4', lv: 1, t: 'dict', q: '聞こえた通りに書き取ろう', audio: 'Can I ask you a question?', e: 'Can I は「キャナイ」、ask you は「アスキュー」。' },
          { id: 's1', lv: 2, t: 'dict', q: '聞こえた通りに書き取ろう', audio: 'I will check it out later.', e: 'check it out は「チェキラウ」。' },
          { id: 's2', lv: 2, t: 'dict', q: '聞こえた通りに書き取ろう', audio: 'What are you going to do?', e: 'What are you は「ワラユ」、going to は「ゴナ」に近く聞こえます。' },
          { id: 's3', lv: 2, t: 'dict', q: '聞こえた通りに書き取ろう', audio: 'I am going to send it tomorrow.', e: 'send it は「センディッ」。' },
          { id: 's4', lv: 2, t: 'speak', q: '声に出して言ってみよう', text: 'Nice to meet you. I am in charge of the vision system.', ja: 'はじめまして。私は画像システムの担当です。', e: 'in charge of（〜の担当で）は頻出です。' },
          { id: 's5', lv: 2, q: "速い会話で can と can't を聞き分けるコツは？", c: ["can は弱く短く、can't ははっきり強く読まれることが多い", "can't の t は必ずはっきり聞こえる", '同じ音なので聞き分けられない', 'can の方が必ず長い'], a: 0, why: ['', "can't の t は消えやすいです。", '強さと長さで聞き分けられます。', '逆です。'], e: "t ではなく、母音の強さ・長さで判断します。" },
          { id: 'a1', lv: 3, t: 'dict', q: '聞こえた通りに書き取ろう', audio: 'Let me get back to you on that.', e: '「その件は改めて連絡します」。get back は「ゲッバッ」と t が消えます。' },
          { id: 'a2', lv: 3, t: 'dict', q: '聞こえた通りに書き取ろう', audio: 'We need to figure it out by Friday.', e: 'figure it out は「フィギュアリラウ」のようにつながります。' },
          { id: 'a3', lv: 3, t: 'speak', q: '声に出して言ってみよう', text: 'Could you say that again more slowly?', ja: 'もう一度ゆっくり言っていただけますか？', e: '聞き取れないときの最重要フレーズ。遠慮なく使いましょう。' },
          { id: 'a4', lv: 3, t: 'speak', q: '声に出して言ってみよう', text: 'Thank you for your time today.', ja: '本日はお時間をいただきありがとうございました。', e: '会議や訪問の締めの定番。' },
        ],
        missions: [
          {
            title: '1つの音声を「完全に」聞き取れるまで繰り返す', time: '1日15分 × 7日',
            why: '同じ音声を何度も繰り返すと、音の変化が体に入ります。7日後、聞こえ方の違いに驚くはずです。',
            steps: ['30秒〜1分の英語の音声を1つ選ぶ（TOEIC の問題集・ニュース・技術系の動画など、スクリプトがあるもの）', '1日目：聞いて書き取り、スクリプトで答え合わせ。聞き取れなかった所に印をつける', '2〜4日目：印の所を中心に音読し、オーバーラッピング（重ね読み）する', '5〜7日目：何も見ずにシャドーイング。言えない所を練習する', '7日目にもう一度書き取って、1日目と比べる'],
            deliverable: '1日目と7日目の書き取りの比較',
            criteria: ['7日間続けた', '聞き取れなかった音の変化の種類を言える', '7日目に聞き取れる量が増えた'],
          },
        ],
      },
      {
        id: 'en-toeic5', stage: 1, tags: ['toeic', 'biz'], pre: ['en-clause'],
        title: 'TOEIC 全体像と Part 5/6 攻略',
        sum: 'Part 5 の3分の1は「意味を読まずに」解ける。語尾で品詞を見分け、空欄の位置で決める。',
        goals: ['TOEIC Reading の構成と時間配分を説明できる', '語尾から品詞を見分けられる', '空欄の位置から入る品詞を決められる', '前置詞と接続詞の問題を確実に解ける'],
        lessons: [
          {
            title: 'Reading は「時間との勝負」', min: 12, steps: [
              { t: 'talk', html: 'TOEIC の Reading は 75分・100問。Part 5（短文の穴埋め）30問、Part 6（長文の穴埋め）16問、Part 7（読解）54問です。そして最大の敵は、問題の難しさではなく<b>時間</b>です。' },
              { t: 'html', html: D.bars([['Part 5', 10], ['Part 6', 10], ['Part 7', 55, true]], { unit: '分', title: 'Reading 75分の配分（目安）', cap: 'Part 5・6 を速く終えて、長文の Part 7 に時間を残す' }) },
              { t: 'html', html: '<div class="box point"><b>850点の時間配分の目安</b>Part 5：1問20秒、30問で約10分<br>Part 6：約10分<br>Part 7：残りの約55分をしっかり使う</div>' },
              { t: 'key', front: 'TOEIC Reading の時間配分の目安は？', back: 'Part 5 を約10分（1問20秒）で終え、Part 7 に約55分残す' },
              { t: 'talk', html: 'Part 5 を速く解くカギは、問題の<b>タイプ</b>を見分けることです。特に、<b>同じ単語の形違い</b>が4つ並んでいたら、それは「品詞問題」。全体の約3分の1を占めます。そしてこの品詞問題は、<b>文の意味を読まなくても解けます</b>。' },
              { t: 'html', html: '<table class="tbl"><tr><th>Part 5 のタイプ</th><th>解き方</th></tr><tr><td><b>品詞問題</b>（約1/3）</td><td>空欄の位置だけで解く。意味は読まない</td></tr><tr><td>動詞の形</td><td>時の目印・主語・する側／される側</td></tr><tr><td>前置詞か接続詞か</td><td>後ろが名詞か、主語＋動詞か</td></tr><tr><td>語彙</td><td>意味と相性 → 単語カードで対策</td></tr></table>' },
              { t: 'q', q: { q: '選択肢が「construction / constructive / constructed / construct」。この問題のタイプは？', c: ['品詞問題（位置で解ける）', '語彙問題', '前置詞の問題', '時制の問題'], a: 0, why: ['', '同じ単語の形違いが並んでいるので、意味の違いを問う語彙問題ではありません。', '前置詞が並んでいません。', '動詞の時制違いだけではありません。'], e: '同じ単語の形違い → 品詞問題 → 空欄の位置で決める。' } },
            ],
          },
          {
            title: '語尾で見分け、位置で決める', min: 14, steps: [
              { t: 'talk', html: '品詞問題の解き方は2ステップ。<b>①語尾で選択肢の品詞を見分ける ②空欄の位置で入る品詞を決める</b>。' },
              { t: 'html', html: D.grid(['動詞', '名詞', '形容詞', '副詞'], ['construct', 'decide', 'succeed'], [[['construct', 'fr'], ['construction', 'fa'], ['constructive', 'fw'], ['constructively', 'fg']], [['decide', 'fr'], ['decision', 'fa'], ['decisive', 'fw'], ['decisively', 'fg']], [['succeed', 'fr'], ['success', 'fa'], ['successful', 'fw'], ['successfully', 'fg']]], { cw: 130, ch: 48, cap: '語尾で品詞が分かる：-tion/-sion は名詞、-ive/-ful は形容詞、-ly は副詞' }) },
              { t: 'html', html: '<table class="tbl"><tr><th>品詞</th><th>よくある語尾</th><th>例</th></tr><tr><td>名詞</td><td>-tion, -ment, -ness, -ity, -ance, -er</td><td>construction, development</td></tr><tr><td>形容詞</td><td>-ive, -able, -al, -ful, -ous, -ic</td><td>effective, available</td></tr><tr><td>副詞</td><td>-ly</td><td>carefully, significantly</td></tr><tr><td>動詞</td><td>-ize, -ify, -en</td><td>optimize, verify</td></tr></table>' },
              { t: 'html', html: '<table class="tbl"><tr><th>空欄の位置</th><th>入る品詞</th></tr><tr><td>the / a / 所有格 ＋ ＿ ＋ (of / 動詞)</td><td>名詞</td></tr><tr><td>the / a ＋ ＿ ＋ 名詞</td><td>形容詞</td></tr><tr><td>be 動詞 ＋ ＿</td><td>形容詞（または分詞）</td></tr><tr><td>動詞の前後・形容詞の前・文の最初</td><td>副詞</td></tr></table>' },
              { t: 'key', front: '品詞問題の解き方は？', back: '① 語尾で選択肢の品詞を見分ける ② 空欄の位置で入る品詞を決める（意味は読まない）' },
              { t: 'q', q: { q: 'The company announced the ___ of a new plant in Vietnam.', c: ['construction', 'constructive', 'constructed', 'construct'], a: 0, why: ['', '-ive は形容詞です。the の後に形容詞だけでは名詞がありません。', '動詞の過去形・過去分詞です。', '動詞の原形です。'], e: 'the ＿ of → 名詞 → -tion。' } },
              { t: 'q', q: { q: 'Please read the instructions ___ before using the device.', c: ['carefully', 'careful', 'care', 'carefulness'], a: 0, why: ['', '形容詞は動詞を説明できません。', '名詞・動詞です。', '名詞です。'], e: '動詞 read ... を説明 → 副詞 -ly。' } },
              { t: 'trap', html: '名詞の前でも、<b>所有格の後ろ</b>（its target、our department）を間違えやすいです。it\'s は it is の短い形で、所有格ではありません。' },
              { t: 'talk', html: 'Part 6 は長文の穴埋めで、Part 5 と違って<b>前後の文を読まないと決まらない</b>問題が混ざります。時制とつなぎ言葉、そして文を入れる問題です。これは「Part 6/7 実戦」のユニットでしっかり練習しますよ。' },
            ],
          },
        ],
        qs: [
          { id: 'b1', lv: 1, q: 'The company announced the ___ of a new plant.', c: ['construction', 'constructive', 'constructed', 'construct'], a: 0, why: ['', '形容詞です。', '動詞です。', '動詞です。'], e: 'the ＿ of → 名詞。' },
          { id: 'b2', lv: 1, q: 'Please read the instructions ___ before using the device.', c: ['carefully', 'careful', 'care', 'carefulness'], a: 0, why: ['', '形容詞は動詞を説明できません。', '名詞・動詞です。', '名詞です。'], e: '動詞を説明 → 副詞。' },
          { id: 'b3', lv: 1, q: 'We need an ___ engineer to lead the project.', c: ['experienced', 'experience', 'experiencing', 'experiences'], a: 0, why: ['', '名詞は名詞を説明しにくいです（an experience engineer は不自然）。', '「経験している技術者」で意味が合いません。', '複数形・動詞です。'], e: 'an ＿ engineer → 名詞を説明する形容詞。experienced（経験豊富な）。' },
          { id: 'b4', lv: 1, q: 'All products must be inspected ___ before shipment.', c: ['thoroughly', 'thorough', 'thoroughness', 'more thorough'], a: 0, why: ['', '形容詞は動詞を説明できません。', '名詞です。', '比較級の形容詞です。'], e: '動詞 inspected を説明 → 副詞。' },
          { id: 's1', lv: 2, q: '___ the bad weather, the outdoor event was held as scheduled.', c: ['Despite', 'Although', 'Because', 'Even'], a: 0, why: ['', '後ろが名詞です。', '後ろが名詞で、意味も合いません。', 'Even だけではつながりません。'], e: '後ろが名詞 → 前置詞 Despite。' },
          { id: 's2', lv: 2, q: 'All new employees are required to ___ the safety training.', c: ['attend', 'participate', 'join in', 'present'], a: 0, why: ['', 'participate は in が必要です。', '後ろに the training を直接とるなら join です。', '「発表する」で意味が合いません。'], e: 'attend ＋ 目的語（〜に出席する）。' },
          { id: 's3', lv: 2, q: 'The new software is ___ faster than the previous version.', c: ['significantly', 'significant', 'significance', 'signify'], a: 0, why: ['', '形容詞は比較級を強められません。', '名詞です。', '動詞です。'], e: '比較級 faster を強める → 副詞。' },
          { id: 's4', lv: 2, q: 'Our sales team exceeded ___ target for the quarter.', c: ['its', 'it', "it's", 'itself'], a: 0, why: ['', '名詞の前には所有格が必要です。', 'it is の短い形です。', '「それ自身」で意味が合いません。'], e: '名詞の前 → 所有格 its。' },
          { id: 's5', lv: 2, q: 'The deadline for the proposal has been ___ to next Friday.', c: ['extended', 'extensive', 'extension', 'extending'], a: 0, why: ['', '形容詞です。', '名詞です。', 'has been extending は「延ばし続けている」で、締め切りが主語では不自然です。'], e: 'has been ＋ 過去分詞（受け身）。' },
          { id: 'a1', lv: 3, q: 'Ms. Tanaka, ___ team won the innovation award, will give a speech.', c: ['whose', 'who', 'which', 'whom'], a: 0, why: ['', '後ろが team won ... と主語がそろっています。', '人です。', '後ろに目的語の欠けがありません。'], e: '「彼女のチーム」→ whose。' },
          { id: 'a2', lv: 3, q: 'The seminar is open to all employees, ___ of their position.', c: ['regardless', 'despite', 'although', 'instead'], a: 0, why: ['', 'despite に of は付きません。', '後ろに主語＋動詞が必要です。', 'instead of は「〜の代わりに」で意味が合いません。'], e: 'regardless of 〜（〜に関係なく）。' },
          { id: 'a3', lv: 3, q: 'The new policy will take ___ on April 1.', c: ['effect', 'affect', 'effective', 'effectively'], a: 0, why: ['', 'affect は動詞です。', '形容詞です。', '副詞です。'], e: 'take effect（効力を持つ・始まる）。' },
          { id: 'a4', lv: 3, q: 'Applicants must submit their résumés ___ May 31.', c: ['by', 'until', 'since', 'during'], a: 0, why: ['', '「ずっと提出し続ける」になります。', '起点です。', '期間の出来事の名前の前です。'], e: '提出の締め切り → by。' },
        ],
        missions: [
          {
            title: '品詞問題を「意味を読まずに」解く20秒トレーニング', time: '1日15分 × 5日',
            why: '品詞問題を一瞬で解けるようになると、Part 7 に使える時間が増えます。',
            steps: ['TOEIC の問題集の Part 5 から、品詞問題だけを選ぶ（同じ単語の形違いが並んでいるもの）', '1問20秒を計って、空欄の位置だけで解く', '外れたら、空欄の位置のルールのどれを見落としたか書く', '5日間で、1問あたりの時間と正答率の変化を記録する'],
            deliverable: '5日分の時間と正答率の記録',
            criteria: ['1問20秒以内で解けるようになった', '見落としやすい位置のルールが分かった', '正答率の変化を記録した'],
          },
        ],
      },
      {
        id: 'en-reading', stage: 1, tags: ['toeic', 'biz', 'paper'], pre: ['en-clause'],
        title: '速読と精読：Part 7 と英文読解',
        sum: '目的で読み方を変える。ざっと見る（スキミング）、探す（スキャニング）、じっくり読む（精読）。正解は言い換えで来る。',
        goals: ['スキミングとスキャニングを使い分けられる', 'Part 7 を設問から解く手順を使える', '言い換え（パラフレーズ）を見抜ける', '速く読む力を伸ばす練習法が分かる'],
        lessons: [
          {
            title: '読み方は「目的」で変える', min: 13, steps: [
              { t: 'talk', html: '英文を全部、最初から最後まで同じ速さで読んでいませんか？ プロは<b>目的によって読み方を変えます</b>。新聞を読むとき、見出しだけ見る日もあれば、気になる記事をじっくり読む日もありますよね。' },
              { t: 'html', html: D.compare({ title: 'スキミング', icon: '🦅', lines: ['空から全体を見渡す', '要点・流れをつかむ', 'タイトル・各段落の最初'], color: 'fa' }, { title: 'スキャニング', icon: '🔎', lines: ['探し物だけを探す', '数字・名前・日付', 'それ以外は読み飛ばす'], color: 'fg' }, { vs: 'vs', cap: '目的に合わせて読み方を切り替える' }) },
              { t: 'html', html: '<table class="tbl"><tr><th>読み方</th><th>目的</th><th>やり方</th></tr><tr><td><b>スキミング</b></td><td>全体の要点をつかむ</td><td>タイトル・各段落の最初の文・最後の文を読む</td></tr><tr><td><b>スキャニング</b></td><td>日付・数字・名前を探す</td><td>探すものを決めてから、目を走らせる</td></tr><tr><td><b>精読</b></td><td>正確に理解する（契約・仕様・論文の方法）</td><td>主語と動詞を確かめながら1文ずつ</td></tr></table>' },
              { t: 'key', front: 'スキミングとスキャニングの違いは？', back: 'スキミング＝要点をつかむ（最初と最後を読む）、スキャニング＝特定の情報を探す（日付・数字・名前）' },
              { t: 'talk', html: 'Part 7 の解き方は3ステップです。<br>① 文書の種類（メール・広告・記事）と、誰から誰へかを確認<br>② <b>設問を先に読む</b>（目的を聞かれたら最初、お願いなら後ろの Please を探す）<br>③ 本文で<b>根拠を見つけてから</b>選ぶ（記憶で選ばない）' },
              { t: 'trap', html: '正解の選択肢は、本文と<b>同じ単語を使わない</b>ことが多いです。本文と同じ単語が入った選択肢は、むしろワナのことも。<br>本文 postponed → 正解 delayed ／ 本文 free of charge → 正解 at no cost' },
              { t: 'key', front: 'Part 7 の正解の特徴は？', back: '本文の言い換え（パラフレーズ）。同じ単語の選択肢はワナのことも' },
              { t: 'q', q: { passage: P_MAIL, q: 'What is the main purpose of the e-mail?', c: ['To inform a customer of a shipping delay', 'To advertise a new product', 'To request payment for an order', 'To cancel a meeting'], a: 0, why: ['', '新製品の宣伝はしていません。', '支払いの話ではありません。', '会議の話ではありません。'], e: '件名と第1段落（the shipment will be delayed）→ 発送の遅れのお知らせ。目的はたいてい最初にあります。' } },
            ],
          },
          {
            title: '速く読む力を育てる', min: 11, steps: [
              { t: 'talk', html: '速く読むには、<b>やさしめの英文をたくさん</b>読むのが一番です。知らない単語が100語に2語以下くらいの英文を、止まらずに読む。難しい英文を辞書を引きながら少し読むより、ずっと速さが育ちます。' },
              { t: 'html', html: D.icons([['📚', '多読', 'やさしい英文をたくさん'], ['🗣️', '音読', '読んだ英文を声に出す'], ['⏱️', '速さを測る', '1分あたりの語数']], { cap: '速く読む力は、この3つで育つ' }) },
              { t: 'html', html: '<ol class="steps-ol"><li>やさしめの英文をたくさん読む（多読）</li><li>一度読んだ英文を音読して、前から理解するくせをつける</li><li>時間を計って、1分あたりの語数（WPM）を記録する。TOEIC 800超えには <b>150 WPM 以上</b>が目安</li></ol>' },
              { t: 'key', front: '速く読む力の育て方は？', back: 'やさしめの英文をたくさん読む＋音読＋1分あたりの語数を記録（目安150語以上）' },
              { t: 'q', q: { passage: P_MAIL, q: 'The phrase "without any charge" is closest in meaning to:', c: ['at no cost', 'without notice', 'with permission', 'in advance'], a: 0, why: ['', '「知らせなしに」です。', '「許可を得て」です。', '「前もって」です。'], e: 'without any charge（料金なしで）＝ at no cost。典型的な言い換えです。' } },
              { t: 'trap', html: 'わからない単語で止まって辞書を引くと、話の流れを見失います。まず<b>前後から推測</b>して読み進め、最後にまとめて確かめましょう。' },
            ],
          },
        ],
        qs: [
          { id: 'b1', lv: 1, passage: P_MAIL, q: 'What is the main purpose of the e-mail?', c: ['To inform a customer of a shipping delay', 'To advertise a new product', 'To request payment for an order', 'To cancel a meeting'], a: 0, why: ['', '違います。', '違います。', '違います。'], e: '発送の遅れのお知らせ。' },
          { id: 'b2', lv: 1, passage: P_MAIL, q: 'When will the full order now be shipped?', c: ['On June 18', 'On June 4', 'On May 30', 'In two months'], a: 0, why: ['', 'June 4 は元の予定です。', 'May 30 は返信の期限です。', '出てきません。'], e: 'on June 18 instead of June 4。' },
          { id: 'b3', lv: 1, q: '日付・数字・名前など、特定の情報だけを探す読み方は？', c: ['スキャニング', 'スキミング', '精読', 'シャドーイング'], a: 0, why: ['', '要点をつかむ読み方です。', 'じっくり読む方法です。', '音の練習です。'], e: 'scan ＝ さっと見渡して探す。' },
          { id: 's1', lv: 2, passage: P_MAIL, q: 'What is one option offered to Mr. Sato?', c: ['Receiving part of the order immediately', 'Getting a 10% discount', 'Choosing a different model', 'Picking up the items at the warehouse'], a: 0, why: ['', '割引の話はありません。', '別の機種の話はありません。', '倉庫での受け取りの話はありません。'], e: 'we can send six units immediately → 一部をすぐ受け取れる。言い換えに注目。' },
          { id: 's2', lv: 2, passage: P_MAIL, q: 'The phrase "without any charge" is closest in meaning to:', c: ['at no cost', 'without notice', 'with permission', 'in advance'], a: 0, why: ['', '違います。', '違います。', '違います。'], e: '料金なしで ＝ at no cost。' },
          { id: 's3', lv: 2, passage: P_MAIL, q: 'What is Mr. Sato asked to do?', c: ['Reply with his preferred option by May 30', 'Call the customer service center', 'Pay an additional shipping fee', 'Visit the supplier'], a: 0, why: ['', '電話ではなくメールでの返信です。', '追加料金の話はありません。', '訪問の話はありません。'], e: 'お願いは最後：Please let us know ... by May 30。' },
          { id: 's4', lv: 2, passage: P_NOTICE, q: 'What is the purpose of the notice?', c: ['To announce a temporary closure of the cafeteria', 'To introduce a new menu', 'To invite staff to a party', 'To announce a new reception desk'], a: 0, why: ['', 'メニューの話はありません。', 'パーティーの話はありません。', '受付は券を受け取る場所として出てくるだけです。'], e: 'The cafeteria will be closed ... for renovation。' },
          { id: 'a1', lv: 3, passage: P_NOTICE, q: 'Where can employees eat during the renovation?', c: ['In Conference Room A', 'On the third floor', 'At the reception desk', 'In the parking lot'], a: 0, why: ['', '3階の食堂が閉まります。', '受付は券を受け取る場所です。', '出てきません。'], e: 'a temporary dining area ... in Conference Room A。' },
          { id: 'a2', lv: 3, passage: P_NOTICE, q: 'When can vouchers be picked up?', c: ['Starting July 5', 'Starting July 8', 'After July 19', 'Only on July 19'], a: 0, why: ['', 'July 8 は閉鎖の始まりです。', 'July 19 は閉鎖の終わりです。', '同上です。'], e: 'starting July 5。' },
          { id: 'a3', lv: 3, passage: P_NOTICE, q: 'The word "temporary" is closest in meaning to:', c: ['short-term', 'permanent', 'expensive', 'crowded'], a: 0, why: ['', '反対の意味です。', '関係ありません。', '関係ありません。'], e: 'temporary（一時的な）＝ short-term。' },
          { id: 'a4', lv: 3, passage: P_NOTICE, q: 'Who most likely wrote the notice?', c: ['The department responsible for the building', 'A cafe owner', 'A new employee', 'A customer'], a: 0, why: ['', 'カフェは券を使える場所として出てくるだけです。', '根拠がありません。', '社員向けのお知らせです。'], e: '署名 Facilities Management（施設管理部門）。' },
        ],
        missions: [
          {
            title: '1分あたりの語数（WPM）を2週間記録する', time: '1日10分 × 14日',
            why: '速さは測ると伸びます。数字が上がっていくのを見るのは、とても励みになります。',
            steps: ['やさしめの英文（知らない単語が少ないもの）を毎日1つ選ぶ', '時間を計って、止まらずに1回読む', '語数 ÷ 分 で WPM を計算して記録する', '内容を日本語で3行にまとめ、理解できたか確かめる', '2週間の WPM の変化をグラフにする'],
            deliverable: '14日分の WPM の記録とグラフ',
            criteria: ['14日間続けた', '毎回、内容を3行でまとめた', 'WPM の変化を確かめた'],
          },
        ],
      },
      {
        id: 'en-listen', stage: 1, tags: ['toeic', 'biz', 'travel'], pre: ['en-sound'],
        title: 'リスニング Part 1〜2 攻略',
        sum: 'Part 2 は「最初の1語」がすべて。疑問詞を逃さず、似た音のワナを避け、間接的な答えを見抜く。',
        goals: ['TOEIC Listening の全体像を説明できる', 'Part 2 で疑問詞を聞き取り、合う答えを選べる', '間接的な応答が正解になるパターンを知る', '似た音・Yes/No のワナを見抜ける'],
        lessons: [
          {
            title: 'Part 2 は「最初の1語」がすべて', min: 14, steps: [
              { t: 'talk', html: 'TOEIC の Listening は約45分・100問。Part 1（写真）6問、<b>Part 2（応答）25問</b>、Part 3（会話）39問、Part 4（説明文）30問です。Part 2 は1問が短く数が多いので、ここで確実に点を取るのが作戦の基本です。' },
              { t: 'talk', html: 'Part 2 のコツは1つ。<b>最初の1〜2語に全集中</b>。Where なら場所、When なら時、Who なら人。最初を聞き逃すと、もう取り返せません。' },
              { t: 'html', html: D.grid(['聞くべき答え', '正解の例'], ['Where', 'When', 'Who', 'Why', "Why don't we"], [[['場所', 'fa'], ['In room B.', 'f1']], [['時', 'fa'], ['At 3 p.m.', 'f1']], [['人', 'fa'], ['Mr. Sato did.', 'f1']], [['理由', 'fa'], ['Because ...', 'f1']], [['提案への返事', 'fw'], ['Sounds good.', 'f1']]], { cw: 160, ch: 44, cap: '最初の1〜2語で、答えの種類が決まる' }) },
              { t: 'html', html: '<table class="tbl"><tr><th>質問</th><th>正解の例</th></tr><tr><td><span class="say">Where is the meeting?</span></td><td><span class="say">In conference room B.</span></td></tr><tr><td><span class="say">Why don\'t we take a break?</span>（提案）</td><td><span class="say">Sounds good.</span></td></tr><tr><td><span class="say">Would you like me to print it?</span>（申し出）</td><td><span class="say">That would be helpful, thanks.</span></td></tr></table>' },
              { t: 'key', front: 'Part 2 で一番大事なことは？', back: '最初の1〜2語（疑問詞）に全集中する' },
              { t: 'trap', html: '<b>Why don\'t we ～?</b> は「なぜ？」ではなく「〜しませんか？」という<b>提案</b>です。Because で始まる答えはワナです。' },
              { t: 'q', q: { q: '音声の質問に最も合う答えは？', audio: "Why don't we take a short break?", c: ['Sounds good.', 'Because it broke down.', 'It was very short.'], a: 0, why: ['', '理由を聞いているのではありません。broke と break の似た音のワナでもあります。', 'short を繰り返しただけのワナです。'], e: '提案には、賛成か反対で答えます。' } },
            ],
          },
          {
            title: '間接的な答えと、ワナの見抜き方', min: 12, steps: [
              { t: 'talk', html: '実際の会話では、質問にまっすぐ答えないこともありますよね。「いつ届く？」に「追跡番号を確認しますね」。TOEIC も同じで、<b>間接的な答えが正解</b>になることがよくあります。' },
              { t: 'html', html: '<div class="box ex">Q: <span class="say">When will the shipment arrive?</span><br>A: <span class="say">Let me check the tracking number.</span>（確認しますね）← 正解になる<br>A: <span class="say">They\'re still reviewing it.</span>（まだ検討中です）← 「承認された？」への答えとして正解になる</div>' },
              { t: 'key', front: 'Part 2 で正解になりやすい「間接的な答え」は？', back: '「確認します」「まだ検討中です」「〜に聞いてください」など、自然な会話の返し' },
              { t: 'html', html: '<table class="tbl"><tr><th>よくあるワナ</th><th>例</th></tr><tr><td>同じ音・似た音</td><td>copy と coffee、project と projector</td></tr><tr><td>疑問詞の質問に Yes/No</td><td>Where ...? に Yes, it is.</td></tr><tr><td>時制のずれ</td><td>未来の質問に過去の答え</td></tr><tr><td>A or B に Yes/No</td><td>Should I send it now or later? に Yes.</td></tr></table>' },
              { t: 'html', html: D.compare({ title: 'ワナ：同じ音・似た音', icon: '🪤', lines: ['Q: Did you make a copy?', '× I like coffee.（copy と似た音）', '× The copy machine is new.'], color: 'fr' }, { title: '正解：間接的な答え', icon: '🎯', lines: ['Q: When will it arrive?', '○ Let me check.', '○ I will ask the manager.'], color: 'fg' }, { vs: 'vs', cap: '質問と同じ音が聞こえたら、まず疑う' }) },
              { t: 'trap', html: '質問の単語と<b>同じ単語・似た音</b>が入った選択肢は、むしろワナのことが多いです。音につられず、意味で選びましょう。' },
              { t: 'q', q: { q: '音声の質問に最も合う答えは？', audio: 'Who is in charge of the new project?', c: ['Ms. Lee is.', 'It starts in April.', 'Yes, I can charge it.'], a: 0, why: ['', 'When の答えです。', 'charge という同じ単語を使ったワナで、Who に Yes で答えています。'], e: 'Who → 人で答えます。' } },
              { t: 'talk', html: '<b>Part 1（写真）</b>のコツも1つだけ。人が写っていれば<b>動作</b>、物だけなら<b>状態</b>。物だけの写真で「is being 〜ed（今まさに〜されている）」が出たら、人がいないのでほぼワナです。' },
            ],
          },
        ],
        qs: [
          { id: 'b1', lv: 1, q: '音声の質問に最も合う答えは？', audio: 'Where is the meeting going to be held?', c: ['In conference room B.', "At three o'clock.", 'Yes, it was held yesterday.'], a: 0, why: ['', 'When の答えです。', 'Where に Yes で答えていて、時制もずれています。'], e: 'Where → 場所。' },
          { id: 'b2', lv: 1, q: '音声の質問に最も合う答えは？', audio: 'When will the shipment arrive?', c: ['By the end of the week.', 'From our warehouse in Osaka.', 'Twelve boxes.'], a: 0, why: ['', 'Where の答えです。', 'How many の答えです。'], e: 'When → 時。' },
          { id: 'b3', lv: 1, q: '音声の質問に最も合う答えは？', audio: 'How long does it take to get to the airport?', c: ['About forty minutes by taxi.', 'Twice a week.', 'It is quite long.'], a: 0, why: ['', 'How often の答えです。', 'long を繰り返したワナです。'], e: 'How long → かかる時間。' },
          { id: 'b4', lv: 1, q: '音声の質問に最も合う答えは？', audio: 'Where can I find the user manual?', c: ["It's on the shared drive.", "At three o'clock.", 'He is a new user.'], a: 0, why: ['', 'When の答えです。', 'user を繰り返したワナです。'], e: 'shared drive（共有ドライブ）も場所です。' },
          { id: 's1', lv: 2, q: '音声の質問に最も合う答えは？', audio: 'Who is in charge of the new project?', c: ['Ms. Lee is.', 'It starts in April.', 'Yes, I can charge it.'], a: 0, why: ['', 'When の答えです。', '同じ単語のワナです。'], e: 'Who → 人。' },
          { id: 's2', lv: 2, q: '音声の質問に最も合う答えは？', audio: "Why don't we take a short break?", c: ['Sounds good.', 'Because it broke down.', 'It was very short.'], a: 0, why: ['', '理由ではなく提案です。', 'short のワナです。'], e: '提案には賛成・反対で答えます。' },
          { id: 's3', lv: 2, q: '音声の質問に最も合う答えは？', audio: 'Would you like me to print the report for you?', c: ['That would be helpful, thanks.', 'Yes, I printed it.', 'The printer is new.'], a: 0, why: ['', '申し出への返事として、過去形はずれています。', 'print と似た語のワナです。'], e: '申し出 → お礼で受ける。' },
          { id: 's4', lv: 2, q: '音声の質問に最も合う答えは？', audio: 'Could you help me set up the projector?', c: ['Sure, give me a minute.', 'It was set up last year.', 'The project is new.'], a: 0, why: ['', '時制と内容がずれています。', 'project と projector の似た音のワナです。'], e: '依頼 → 引き受ける。' },
          { id: 'a1', lv: 3, q: '音声の質問に最も合う答えは？', audio: 'Has the client approved the new design?', c: ["They're still reviewing it.", 'Yes, the designer.', 'A new client.'], a: 0, why: ['', 'design と似た語のワナで、答えになっていません。', 'client を繰り返したワナです。'], e: '間接的な答え「まだ検討中」が正解。' },
          { id: 'a2', lv: 3, q: '音声の質問に最も合う答えは？', audio: 'Should I send the invoice now or wait until Monday?', c: ['Please send it now.', 'Yes, I should.', 'The invoice was paid.'], a: 0, why: ['', 'A or B の質問に Yes で答えています。', '質問に答えていません。'], e: 'A or B には、どちらかで答えます。' },
          { id: 'a3', lv: 3, q: '音声の質問に最も合う答えは？', audio: "Isn't the meeting scheduled for Tuesday?", c: ['No, it was moved to Wednesday.', 'The meeting room is large.', 'Yes, I scheduled a doctor.'], a: 0, why: ['', 'meeting を繰り返しただけです。', 'scheduled のワナで、内容が合いません。'], e: '否定の疑問文は「〜じゃないの？」という確認。内容で答えます。' },
          { id: 'a4', lv: 3, q: '音声の質問に最も合う答えは？', audio: 'Why was the shipment delayed?', c: ['There was a problem at customs.', 'Next Monday.', 'By truck.'], a: 0, why: ['', 'When の答えです。', 'How の答えです。'], e: 'Why → 理由。' },
          { id: 'a5', lv: 3, q: '音声の質問に最も合う答えは？', audio: 'Which supplier did you choose?', c: ['The one in Osaka.', 'Yes, I did.', 'It was a difficult choice for him.'], a: 0, why: ['', 'Which に Yes では答えられません。', 'choose と choice の似た語のワナです。'], e: 'the one ＝ その supplier。' },
        ],
        missions: [
          {
            title: '疑問詞だけを聞き取る 100本ノック', time: '1日10分 × 5日',
            why: 'Part 2 は反射神経のゲームです。最初の1語を聞き取る練習だけを集中してやると、正答率が目に見えて上がります。',
            steps: ['TOEIC の問題集の Part 2 の音声を用意する', '質問の最初の1〜2語（疑問詞）だけを聞き取って書く（答えは選ばなくていい）', '1日20問、5日で100問', 'スクリプトで確かめ、聞き逃した疑問詞を記録する', '最後に、普通に Part 2 を解いて正答率を比べる'],
            deliverable: '疑問詞の聞き取り記録100問と、正答率の比較',
            criteria: ['100問やった', '聞き逃しやすい疑問詞が分かった', '正答率を練習前と比べた'],
          },
        ],
      },
      /* ================= STAGE 3 ================= */
      {
        id: 'en-biz', stage: 2, tags: ['biz'], pre: ['en-modal', 'en-sound'],
        title: 'ビジネス英語：メール・会議・電話',
        sum: 'ビジネス英語は「型」の世界。メールは目的が先、会議は確認が命。そのまま使えるフレーズを体に入れる。',
        goals: ['目的 → 詳しく → お願いと期限 → 結び の型でメールを書ける', '会議で意見・賛成・ていねいな反対・確認ができる', '聞き取れないときに、ていねいに聞き返せる', '数字を正しく読み、復唱して確認できる'],
        lessons: [
          {
            title: 'メールは「目的が先」', min: 13, steps: [
              { t: 'talk', html: 'ビジネスメールで一番大事なルール。<b>最初の1文で、何のメールかを言う</b>。日本語のメールのような前置きは、英語ではいりません。' },
              { t: 'html', html: D.stack([['件名', '一目で用件（Request for Quotation）'], ['宛名', 'Dear Mr. Brown,'], ['目的（最初の1文）', 'I am writing to ...'], ['詳しく', '数字・条件・背景'], ['お願いと締め切り', 'by Friday, May 10'], ['結び', 'Best regards,']], { colors: ['f1', 'f1', 'fr', 'fa', 'fw', 'f1'], cap: '最初の1文で目的を言い切る' }) },
              { t: 'html', html: '<table class="tbl"><tr><th>部分</th><th>表現</th></tr><tr><td>件名</td><td>一目で用件が分かる（Request for Quotation: LED Lights）</td></tr><tr><td>目的（最初の1文）</td><td><span class="say">I\'m writing to follow up on our meeting last week.</span></td></tr><tr><td>添付</td><td><span class="say">Please find attached the updated specification.</span></td></tr><tr><td>お願い</td><td><span class="say">I would appreciate it if you could reply by Friday.</span></td></tr><tr><td>確認</td><td><span class="say">Could you please confirm the delivery date?</span></td></tr><tr><td>おわび</td><td><span class="say">I apologize for the delay in getting back to you.</span></td></tr><tr><td>結び</td><td><span class="say">Please let me know if you have any questions.</span></td></tr></table>' },
              { t: 'key', front: '英語のビジネスメールの一番のルールは？', back: '最初の1文で目的を言う（I\'m writing to ...）。前置きはいらない' },
              { t: 'q', q: { q: '前回の打ち合わせのフォローアップメールの書き出しとして最も自然なのは？', c: ["I'm writing to follow up on our meeting last week.", 'I write you because meeting.', 'Hello, this is follow.', 'Please find attached the meeting.'], a: 0, why: ['', '文法が正しくありません。', '意味が通じません。', '会議は添付できません。'], e: "I'm writing to 〜 で目的を最初に。" } },
              { t: 'trap', html: '締め切りは<b>具体的に</b>。「soon」「ASAP」では、相手によって解釈が違います。<b>by 5 p.m. (JST) on May 10</b> のように、日付・時刻・時差まで書きましょう。' },
            ],
          },
          {
            title: '会議は「確認」が命', min: 14, steps: [
              { t: 'html', html: '<table class="tbl"><tr><th>はたらき</th><th>表現</th></tr><tr><td>意見</td><td><span class="say">In my opinion, we should test it on the actual line first.</span></td></tr><tr><td>賛成</td><td><span class="say">I agree with you on that point.</span></td></tr><tr><td>ていねいな反対</td><td><span class="say">I see your point, but I\'m concerned about the cost.</span></td></tr><tr><td>詳しく聞く</td><td><span class="say">Could you elaborate on that?</span></td></tr><tr><td>確認</td><td><span class="say">Just to clarify, do you mean the cycle time or the takt time?</span></td></tr><tr><td>まとめ</td><td><span class="say">To sum up, we will finalize the lighting by next Monday.</span></td></tr></table>' },
              { t: 'talk', html: '反対するときの型は、<b>いったん受け止めてから、心配を言う</b>。I see your point, but... です。いきなり No と言うより、ずっと話が前に進みます。' },
              { t: 'key', front: 'ていねいに反対する型は？', back: 'いったん受け止めてから心配を言う：I see your point, but I\'m concerned about ...' },
              { t: 'talk', html: 'そして、エンジニアにとって一番の武器は<b>確認</b>です。聞き取れなかったら、分かったふりをしない。<span class="say">Sorry, could you say that again?</span> <span class="say">Let me make sure I understand correctly.</span> 特に<b>数字・単位・日付は必ず復唱</b>して確かめます。これだけで、事故の多くは防げます。' },
              { t: 'html', html: D.flow([['聞く', '', '👂'], ['言い直して確認', 'So you mean ...?', '🔁'], ['数字は繰り返す', '0.8 seconds, right?', '🔢'], ['メールで残す', 'Just to confirm ...', '📧']], { cap: '分かったふりをしない。確認はエンジニアの武器' }) },
              { t: 'html', html: '<div class="box tip"><b>数字の読み方</b>0.8 seconds ＝ zero point eight seconds ／ 1,500 ＝ one thousand five hundred ／ 2.5 mm ＝ two point five millimeters ／ ±0.1 ＝ plus or minus zero point one</div>' },
              { t: 'key', front: 'エンジニアの英会話で一番大事なことは？', back: '分かったふりをせず確認する。数字・単位・日付は必ず復唱する' },
              { t: 'q', q: { t: 'dict', q: '聞こえた通りに書き取ろう', audio: 'The cycle time is zero point eight seconds per part.', e: '数字は「zero point eight」。数字の聞き取りは、ビジネスで一番大事です。' } },
            ],
          },
        ],
        qs: [
          { id: 'b1', lv: 1, q: 'Please find ___ the updated drawing.', c: ['attached', 'attach', 'attaching', 'attachment'], a: 0, why: ['', '原形は来ません。', 'この形は使いません。', '名詞は来ません。'], e: 'Please find attached 〜（〜を添付します）は決まり文句。' },
          { id: 'b2', lv: 1, q: '「その点を詳しく説明していただけますか」に最も近いのは？', c: ['Could you elaborate on that?', 'Could you say goodbye?', 'Could you finish it?', 'Could you be quiet?'], a: 0, why: ['', '「さようならを言って」です。', '「終わらせて」です。', '「静かにして」です。'], e: 'elaborate on 〜 ＝ 〜について詳しく述べる。' },
          { id: 'b3', lv: 1, q: "<span class=\"en\">Let me get back to you on that.</span> の意味は？", c: ['その件は確認して改めてご連絡します', 'その件は取り消します', 'それを返してください', '電話を返してください'], a: 0, why: ['', '取り消しではありません。', 'get back は「戻る・連絡し直す」です。', '電話に限りません。'], e: 'その場で答えられないときの便利な表現。' },
          { id: 's1', lv: 2, q: '前回の打ち合わせのフォローアップメールの書き出しは？', c: ["I'm writing to follow up on our meeting last week.", 'I write you because meeting.', 'Hello, this is follow.', 'Please find attached the meeting.'], a: 0, why: ['', '文法が違います。', '通じません。', '会議は添付できません。'], e: '目的を最初に。' },
          { id: 's2', lv: 2, q: '相手の意見にていねいに反対する表現は？', c: ["I see your point, but I'm concerned about the cost.", "You're wrong.", 'No, that is bad idea.', 'I disagree you.'], a: 0, why: ['', '強すぎます。', '強すぎ、文法も足りません。', 'disagree with you が正しい形です。'], e: '受け止めてから心配を言う。' },
          { id: 's3', lv: 2, t: 'order', q: '「金曜日までにご返信いただけるとありがたいです」', tokens: ['I', 'would', 'appreciate', 'it', 'if', 'you', 'could', 'reply', 'by', 'Friday'], e: 'I would appreciate it if you could 〜 は、ていねいなお願いの定番。' },
          { id: 's4', lv: 2, t: 'dict', q: '聞こえた通りに書き取ろう', audio: 'The cycle time is zero point eight seconds per part.', e: '数字の聞き取り。' },
          { id: 'a1', lv: 3, q: '締め切りの伝え方として最も明確なのは？', c: ['Please reply by 5 p.m. (JST) on May 10.', 'Please reply soon.', 'Please reply when you can.', 'Please reply ASAP maybe.'], a: 0, why: ['', '人によって解釈が違います。', '締め切りがありません。', 'あいまいです。'], e: '日付・時刻・時差まで書きます。' },
          { id: 'a2', lv: 3, q: "<span class=\"en\">I'm afraid I can't make it to the meeting.</span> の意味は？", c: ['残念ながら会議に出席できません', '会議を作るのが怖いです', '会議の準備ができません', '会議を中止します'], a: 0, why: ['', 'make it は「都合をつけて行く・間に合う」です。', '準備の話ではありません。', '中止の話ではありません。'], e: "I'm afraid でていねいに断っています。" },
          { id: 'a3', lv: 3, t: 'speak', q: '声に出して言ってみよう', text: 'Just to clarify, do you mean the cycle time or the takt time?', ja: '確認ですが、サイクルタイムのことですか、タクトタイムですか？', e: 'Just to clarify（確認ですが）で切り出すと、自然に確認できます。' },
          { id: 'a4', lv: 3, t: 'speak', q: '声に出して言ってみよう', text: 'Let me summarize what we have agreed on.', ja: '合意した内容をまとめさせてください。', e: '会議の最後に必ず使いたい表現です。' },
        ],
        missions: [
          {
            title: '実際の仕事のメールを英語で1通書く', time: '45分',
            why: '型は、自分の仕事で使って初めて自分のものになります。',
            steps: ['最近の仕事のメールを1つ選ぶ（日本語で OK）', '英語で、目的 → 詳しく（箇条書き）→ お願いと期限 → 結び の型で書き直す', '締め切りを日付・時刻まで具体的に書く', '声に出して読み、言いにくい所を直す', '可能なら、AIや同僚に見てもらい、直された理由を確認する'],
            deliverable: '英語のメール1通（直した理由のメモつき）',
            criteria: ['最初の1文で目的を書いた', '締め切りを具体的に書いた', '型どおりの構成になっている'],
          },
        ],
      },
      {
        id: 'en-global', stage: 2, tags: ['travel', 'biz'], pre: ['en-modal', 'en-sound'],
        title: '海外コミュニケーション：出張・現地対応・雑談',
        sum: '海外では「5つの万能の型」で大体乗り切れる。トラブルは「状況 → お願い」、雑談は「答え＋ひと言＋質問返し」。',
        goals: ['移動・宿泊・食事で困らない5つの型を使える', 'トラブルを伝えて解決をお願いできる', '客先の現場で状況や作業を説明できる', '雑談を続けられる'],
        lessons: [
          {
            title: '5つの万能の型', min: 12, steps: [
              { t: 'talk', html: '海外出張、英語が不安でも大丈夫。実は<b>5つの型</b>だけで、移動・ホテル・食事のほとんどを乗り切れます。' },
              { t: 'html', html: D.icons([['🙋', "I'd like ～", 'したいです'], ['🙏', 'Could I ～?', 'してもいいですか'], ['❓', 'Is there ～?', 'ありますか'], ['🤔', 'Do you have ～?', '置いていますか'], ['📍', 'Where is ～?', 'どこですか']], { w: 110, cap: '5つの型だけで、移動・ホテル・食事はほぼ乗り切れる' }) },
              { t: 'html', html: '<table class="tbl"><tr><th>型</th><th>例</th></tr><tr><td>I\'d like ～（〜したいです）</td><td><span class="say">I\'d like to check in, please.</span></td></tr><tr><td>Could I ～?（〜してもいいですか）</td><td><span class="say">Could I have a window seat?</span></td></tr><tr><td>Is there ～?（〜はありますか：場所）</td><td><span class="say">Is there a pharmacy near here?</span></td></tr><tr><td>Do you have ～?（〜はありますか：お店）</td><td><span class="say">Do you have this in a smaller size?</span></td></tr><tr><td>How do I ～?（どうやって〜するの）</td><td><span class="say">How do I get to the train station?</span></td></tr></table>' },
              { t: 'key', front: '海外で使える5つの万能の型は？', back: "I'd like ～ / Could I ～? / Is there ～? / Do you have ～? / How do I ～?" },
              { t: 'talk', html: 'トラブルのときは、<b>状況 → お願い</b>の順で言います。「荷物が届きません。助けてもらえますか？」。状況が分かれば、相手は助けやすくなります。' },
              { t: 'html', html: '<ul><li><span class="say">My luggage didn\'t arrive. Could you help me?</span></li><li><span class="say">There\'s a problem with my room. The air conditioner isn\'t working.</span></li><li><span class="say">I think there\'s a mistake on the bill.</span></li></ul>' },
              { t: 'key', front: 'トラブルを伝える型は？', back: '状況 → お願い（My luggage didn\'t arrive. Could you help me?）' },
              { t: 'q', q: { q: '空港で荷物が出てこなかった。最初に言う表現は？', c: ["My luggage didn't arrive. Could you help me?", 'Where is my luggages?', 'I lost.', 'Give me luggage.'], a: 0, why: ['', 'luggage は数えない名詞なので -s は付きません。', '「私は負けた」になってしまいます。', '命令で、ていねいではありません。'], e: '状況 → お願い の順。' } },
            ],
          },
          {
            title: '客先の現場と、雑談の続け方', min: 12, steps: [
              { t: 'talk', html: 'エンジニアの海外出張で一番大事なのは、<b>客先の現場</b>での会話です。状況・作業・許可・原因・見通しの5つが言えれば、立派に仕事ができます。' },
              { t: 'html', html: '<table class="tbl"><tr><th>場面</th><th>表現</th></tr><tr><td>状況</td><td><span class="say">The camera is not receiving the trigger signal.</span></td></tr><tr><td>作業</td><td><span class="say">Let me check the wiring first.</span></td></tr><tr><td>許可</td><td><span class="say">Is it okay to stop the line for ten minutes?</span></td></tr><tr><td>原因</td><td><span class="say">It seems that the cable was loose.</span></td></tr><tr><td>見通し</td><td><span class="say">It should be fixed within an hour.</span></td></tr></table>' },
              { t: 'key', front: '客先の現場で言えるようにしたい5つは？', back: '状況・作業（Let me ...）・許可（Is it okay to ...?）・原因（It seems that ...）・見通し（It should be ...）' },
              { t: 'talk', html: '最後に<b>雑談</b>。雑談が続かない一番の原因は、答えて終わってしまうこと。コツは<b>「答える ＋ ひと言 ＋ 質問を返す」</b>です。' },
              { t: 'html', html: D.flow([['答える', 'It was long,', '💬'], ['ひと言足す', 'but I slept well.', '➕'], ['質問を返す', 'Have you been to Japan?', '↩️']], { loop: '会話が続く', cap: '雑談は「答えて終わり」にしない' }) },
              { t: 'html', html: '<div class="box ex">A: <span class="say">How was your flight?</span><br>B: <span class="say">It was long, but I slept well. Have you ever been to Japan?</span></div>' },
              { t: 'key', front: '雑談を続けるコツは？', back: '答える ＋ ひと言足す ＋ 質問を返す' },
              { t: 'q', q: { q: '<span class="en">"How was your flight?"</span> への最も自然な返しは？', c: ['It was long, but I slept well. How about you?', 'Yes.', 'Flight is airplane.', 'I am flight.'], a: 0, why: ['', 'How の質問に Yes では答えになりません。', '意味が通じません。', '意味が通じません。'], e: '答え ＋ ひと言 ＋ 質問返し。' } },
              { t: 'trap', html: '英語圏では「結論を先に」「Yes / No をはっきり」が基本。でも頼みごとや反対は<b>ていねいに</b>（Could you ... / I\'m afraid ...）。はっきりとていねいは、両立できます。' },
            ],
          },
        ],
        qs: [
          { id: 'b1', lv: 1, q: 'ホテルで「チェックインしたいのですが」は？', c: ["I'd like to check in, please.", 'I want check.', 'Check me.', 'Can I checking in?'], a: 0, why: ['', '文法が足りません。', '意味が通じません。', 'Can I の後ろは原形です。'], e: "I'd like to 〜。" },
          { id: 'b2', lv: 1, q: 'レストランで「お会計をお願いします」は？', c: ['Could I have the check, please?', 'Give me money.', 'How much is your price?', 'I want to pay money now.'], a: 0, why: ['', '失礼です。', '不自然です。', '不自然です。'], e: '米国は check、英国は bill。' },
          { id: 'b3', lv: 1, q: '<span class="en">What do you do?</span> の意味は？', c: ['お仕事は何ですか', '今何をしていますか', '何がしたいですか', 'どうしましたか'], a: 0, why: ['', 'それは What are you doing? です。', 'それは What do you want to do? です。', 'それは What happened? などです。'], e: "職業を聞く定番。I'm an engineer. のように答えます。" },
          { id: 's1', lv: 2, q: '空港で荷物が出てこなかった。最初に言う表現は？', c: ["My luggage didn't arrive. Could you help me?", 'Where is my luggages?', 'I lost.', 'Give me luggage.'], a: 0, why: ['', 'luggage に -s は付きません。', '意味が違います。', '命令です。'], e: '状況 → お願い。' },
          { id: 's2', lv: 2, q: '客先で「まず配線を確認させてください」は？', c: ['Let me check the wiring first.', 'I check wire first.', 'Please wiring check.', 'You must check the wiring.'], a: 0, why: ['', '文法が足りません。', '文法が違います。', '相手に命令しています。'], e: 'Let me 〜（〜させてください）。' },
          { id: 's3', lv: 2, q: '「ラインを10分止めても大丈夫ですか？」は？', c: ['Is it okay to stop the line for ten minutes?', 'I stop the line.', 'Line stop ten minutes okay?', 'You stop the line.'], a: 0, why: ['', '許可を取っていません。', '文法が足りません。', '命令です。'], e: 'Is it okay to 〜?' },
          { id: 's4', lv: 2, q: "<span class=\"en\">Sorry, I didn't catch your name.</span> の意味は？", c: ['すみません、お名前を聞き取れませんでした', '名前を捕まえられません', '名前を忘れました', '名前を書いてください'], a: 0, why: ['', '捕まえる、ではありません。', '忘れた、ではありません。', '書いて、ではありません。'], e: 'catch ＝ 聞き取る。' },
          { id: 'a1', lv: 3, t: 'speak', q: '声に出して言ってみよう', text: 'The camera is not receiving the trigger signal.', ja: 'カメラがトリガ信号を受け取っていません。', e: '現場で一番よく使う種類の文です。' },
          { id: 'a2', lv: 3, t: 'dict', q: '聞こえた通りに書き取ろう', audio: 'It should be fixed within an hour.', e: 'should は「〜のはず」。within an hour ＝ 1時間以内に。' },
          { id: 'a3', lv: 3, t: 'dict', q: '聞こえた通りに書き取ろう', audio: 'Is there a convenience store near here?', e: 'Is there a は「イズゼアラ」とつながります。' },
          { id: 'a4', lv: 3, t: 'speak', q: '声に出して言ってみよう', text: 'The Wi-Fi in my room is not working.', ja: '部屋の Wi-Fi がつながりません。', e: 'is not working は、故障を伝える万能の表現です。' },
          { id: 'a5', lv: 3, t: 'order', q: '「駅へはどうやって行けばいいですか？」', tokens: ['How', 'do', 'I', 'get', 'to', 'the', 'station'], e: 'How do I get to 〜?' },
        ],
        missions: [
          {
            title: '海外出張の「ひとり予行演習」', time: '30分',
            why: '頭の中で一度言ったことは、本番で口から出てきます。',
            steps: ['空港 → ホテル → 客先 → 食事 の場面を順に想像する', '各場面で言う英語を、5つの型と現場の5つの表現から選んで書く', 'トラブルを1つずつ想定して（荷物・部屋・装置）、状況 → お願い で言う文を作る', '全部を声に出して、録音して聞き直す'],
            deliverable: '場面ごとの英語のセリフと録音',
            criteria: ['4つの場面すべてのセリフを作った', 'トラブルを状況 → お願いで言えた', '録音して聞き直した'],
          },
        ],
      },
      {
        id: 'en-paper', stage: 2, tags: ['paper'], pre: ['en-clause', 'en-reading'],
        title: '技術論文を読む',
        sum: '論文はどれも同じ「型」でできている。Abstract を5つの動きに分け、ヘッジ表現で著者の自信を読む。',
        goals: ['論文の構成（IMRaD）と、効率のいい読む順番を説明できる', 'Abstract を5つの動きに分けて読める', '論文によく出る語（propose・outperform・ablation など）が分かる', 'ヘッジ表現から著者の自信の強さを読める'],
        lessons: [
          {
            title: '論文は「同じ型」でできている', min: 14, steps: [
              { t: 'talk', html: '英語の論文、最初から最後まで読もうとして、途中で挫折した経験はありませんか？ 実は論文は、ほとんどが<b>同じ型</b>でできています。型を知れば、必要な所だけを素早く読めます。' },
              { t: 'html', html: '<table class="tbl"><tr><th>部分</th><th>書いてあること</th></tr><tr><td>Abstract</td><td>全体の要約</td></tr><tr><td>Introduction</td><td>背景・問題・この論文の貢献</td></tr><tr><td>Method</td><td>提案する方法</td></tr><tr><td>Results</td><td>実験・比べた結果</td></tr><tr><td>Conclusion</td><td>結論・限界・これからの課題</td></tr></table>' },
              { t: 'html', html: D.flow([['Abstract', '全体の要約', '📄'], ['図表', '結果を目で見る', '📊'], ['Conclusion', '結論と限界', '🏁'], ['本文', '必要な所だけ', '🔍']], { cap: '論文は頭から読まない。この順で、必要な所だけ' }) },
              { t: 'key', front: '論文の効率のいい読む順番は？', back: 'Abstract → 図表 → Conclusion →（必要なら）Introduction → Method → Results' },
              { t: 'talk', html: 'まず Abstract と図表で「何をして、どのくらい良くなったか」をつかむ。自分に必要な論文だと分かってから、Method をじっくり読む。<b>全部を同じ深さで読まない</b>のが、研究者の読み方です。' },
              { t: 'talk', html: 'そして Abstract も型でできています。<b>5つの動き</b>です。' },
              { t: 'html', html: D.flow([['① 背景', 'X is widely used'], ['② 問題', 'However, ...'], ['③ 提案', 'We propose ...'], ['④ 結果', 'improves by 12%'], ['⑤ 意義', 'can be applied to']], { cap: 'Abstract の5つの動き。型を知れば、どこに何があるか分かる' }) },
              { t: 'html', html: '<table class="tbl"><tr><th>動き</th><th>よく出る表現</th></tr><tr><td>① 背景</td><td>X is widely used in ...</td></tr><tr><td>② 問題</td><td>However, X suffers from ... / remains challenging</td></tr><tr><td>③ 提案</td><td>In this paper, we propose ...</td></tr><tr><td>④ 結果</td><td>Experiments show that ... outperforming ...</td></tr><tr><td>⑤ 意味</td><td>These results suggest that ... may be ...</td></tr></table>' },
              { t: 'q', q: { passage: P_ABS, q: 'What problem does the paper address?', c: ['A lack of defective samples for training', 'The high cost of cameras', 'The slow speed of production lines', 'A lack of normal images'], a: 0, why: ['', 'カメラの値段の話ではありません。', 'ラインの速さの話ではありません。', '逆です。正常な画像は使えます。'], e: '② 問題の動き：suffers from a lack of defective samples for training。' } },
            ],
          },
          {
            title: '著者の「自信」を読む', min: 12, steps: [
              { t: 'html', html: '<table class="tbl"><tr><th>語</th><th>意味</th></tr><tr><td>propose</td><td>提案する（自分たちの新しい方法）</td></tr><tr><td>outperform</td><td>〜より性能が上</td></tr><tr><td>state-of-the-art</td><td>最先端の（今までで最高の性能）</td></tr><tr><td>benchmark</td><td>性能を比べるための標準のデータ</td></tr><tr><td>ablation study</td><td>部品を1つずつ外して、それぞれの効果を調べる実験</td></tr><tr><td>baseline</td><td>比べる基準になる方法</td></tr></table>' },
              { t: 'key', front: 'ablation study とは？', back: '提案した方法の部品を1つずつ外して、どの部品が効いているかを調べる実験' },
              { t: 'talk', html: '論文は、断定を避ける表現（<b>ヘッジ</b>）をよく使います。どれだけ確かなのかを読み取るのが大事です。' },
              { t: 'html', html: D.scale([['demonstrate', '示した'], ['indicate', '示している'], ['suggest', '示唆する'], ['may / might', 'かもしれない']], { left: '強い（言い切る）', right: '弱い（控えめ）', cap: '動詞1つで、著者の自信の強さが分かる' }) },
              { t: 'html', html: '<div class="formula">demonstrate / show（示した：強い）＞ indicate（示している）＞ suggest（示唆する：弱め）＞ may / might（かもしれない）</div>' },
              { t: 'key', front: '論文のヘッジ表現の強さの順は？', back: 'demonstrate/show ＞ indicate ＞ suggest ＞ may/might' },
              { t: 'q', q: { passage: P_ABS, q: 'How confident are the authors that the method is suitable for production lines?', c: ['They suggest it may be suitable, but do not claim it definitely', 'They prove it is always suitable', 'They say it is not suitable', 'They do not mention it'], a: 0, why: ['', 'prove とは書いていません。', '否定はしていません。', '最後の文で触れています。'], e: 'suggest と may の二重のヘッジ。「使えるかもしれない」という控えめな主張です。' } },
              { t: 'trap', html: 'ヘッジを読み飛ばすと、「この方法は現場で使える」と言い切っていると誤解します。<b>may suggest</b> は「可能性を示しているだけ」。自分の装置に使うなら、自分で確かめる必要があります。' },
            ],
          },
        ],
        qs: [
          { id: 'b1', lv: 1, q: '<span class="en">outperform</span> の意味は？', c: ['〜より性能が上回る', '〜を実行する', '〜を上演する', '〜より遅い'], a: 0, why: ['', 'perform と混ざっています。', '同上です。', '逆の意味です。'], e: 'out（〜を超えて）＋ perform（性能を出す）。' },
          { id: 'b2', lv: 1, q: '論文を効率よく読む順番は？', c: ['Abstract → 図表 → Conclusion → 必要なら Method', 'Introduction から順に全部じっくり', 'References から', 'Method だけ'], a: 0, why: ['', '時間がかかり、要らない論文まで深く読むことになります。', '参考文献から読んでも内容は分かりません。', '目的や結果が分からないまま読むことになります。'], e: '全体をつかんでから詳しく。' },
          { id: 'b3', lv: 1, q: '<span class="en">We hypothesize that ...</span> の意味は？', c: ['〜という仮説を立てる', '〜を証明した', '〜を否定する', '〜を測った'], a: 0, why: ['', 'まだ証明していません。', '否定ではありません。', '測ったのではありません。'], e: 'hypothesize（仮説を立てる）、名詞は hypothesis。' },
          { id: 's1', lv: 2, passage: P_ABS, q: 'What problem does the paper address?', c: ['A lack of defective samples for training', 'The high cost of cameras', 'The slow speed of production lines', 'A lack of normal images'], a: 0, why: ['', '違います。', '違います。', '逆です。'], e: '不良のサンプルが足りない問題。' },
          { id: 's2', lv: 2, passage: P_ABS, q: 'What does the proposed method learn from?', c: ['Only normal images', 'Only defective images', 'Both equally', 'Text descriptions'], a: 0, why: ['', '逆です。', '正常な画像だけです。', '文章は使いません。'], e: 'learns only from normal images（異常検知の典型）。' },
          { id: 's3', lv: 2, q: '<span class="en">ablation study</span> とは？', c: ['部品を外して、それぞれの効果を調べる実験', 'データを増やす実験', '他の論文を調べること', '実機での長期試験'], a: 0, why: ['', 'データ拡張です。', '文献調査です。', '耐久試験です。'], e: 'ablation ＝ 取り除くこと。' },
          { id: 's4', lv: 2, q: '<span class="en">comparable</span> の意味は？', c: ['同じくらいの・匹敵する', '比べられない', '快適な', '互換性のない'], a: 0, why: ['', 'incomparable と混ざっています。', 'comfortable と混ざっています。', 'incompatible と混ざっています。'], e: 'achieves comparable accuracy ＝ 同じくらいの精度を出す。' },
          { id: 'a1', lv: 3, passage: P_ABS, q: 'What did the ablation study indicate?', c: ['Multi-scale features contributed most to the improvement', 'The method was too slow', 'The memory bank was unnecessary', 'The benchmark was not public'], a: 0, why: ['', '45 frames per second で速いです。', 'そのような結果は書いていません。', 'public benchmark と書いてあります。'], e: 'multi-scale features contribute most to the improvement。' },
          { id: 'a2', lv: 3, passage: P_ABS, q: 'How confident are the authors about using it on production lines?', c: ['They suggest it may be suitable, but do not claim it definitely', 'They prove it is always suitable', 'They say it is not suitable', 'They do not mention it'], a: 0, why: ['', '証明はしていません。', '否定はしていません。', '触れています。'], e: 'suggest ＋ may の二重のヘッジ。' },
          { id: 'a3', lv: 3, q: '最も確信度が<b>弱い</b>表現は？', c: ['may suggest', 'demonstrate', 'show', 'prove'], a: 0, why: ['', '強い表現です。', '強い表現です。', '最も強い表現です。'], e: 'may ＋ suggest は二重のヘッジ。' },
          { id: 'a4', lv: 3, q: '<span class="en">Despite its simplicity, the method achieves competitive results.</span> の意味は？', c: ['単純なのに、他に負けない結果を出す', '単純なので結果が悪い', '競争に負けた', '複雑で強い'], a: 0, why: ['', 'Despite（〜にもかかわらず）を読み落としています。', 'competitive は「負けない」です。', 'simplicity は「単純さ」です。'], e: 'competitive ＝ 引けを取らない（論文で頻出）。' },
        ],
        missions: [
          {
            title: '毎日1本、Abstract を「5つの動き」に分ける', time: '1日15分 × 10日',
            why: '10本の Abstract を分解すると、英語の論文が「怖いもの」から「読めるもの」に変わります。',
            steps: ['自分の興味のある分野（anomaly detection・YOLO・machine vision など）の論文の Abstract を1日1本選ぶ', '背景・問題・提案・結果・意味の5つに線を引いて分ける', 'それぞれを日本語で1行にまとめる', 'ヘッジ表現（may・suggest など）に印をつけ、著者の自信の強さを書く', '読む価値があるか（Method まで読むか）を判断する'],
            deliverable: '10本分の「5つの動き」のメモ',
            criteria: ['10本続けた', '5つの動きに分けられた', 'ヘッジから著者の自信を読み取れた'],
          },
        ],
      },
      /* ================= 追加ユニット ================= */
      {
        id: 'en-vocab', stage: 0, core: true, tags: ['toeic', 'biz', 'travel', 'paper'], pre: ['en-structure'],
        title: '語彙を効率よく増やす：語根・接辞・コロケーション',
        sum: '単語は「部品の組み立て」。部品を覚えれば何十語も推測できる。単語の「相性」も一緒に覚える。',
        goals: ['接頭辞・語根・接尾辞から単語の意味を推測できる', 'make / take / meet などのコロケーションを使える', 'borrow/lend・affect/effect など混同しやすい語を区別できる', '記憶に残る単語の覚え方を実践できる'],
        lessons: [
          {
            title: '単語は「部品の組み立て」', min: 13, steps: [
              { t: 'talk', html: 'TOEIC 800 以上には、数千〜1万語レベルの語彙が必要と言われます。1語ずつ丸暗記…と考えると気が遠くなりますよね。でも英単語の多くは、<b>部品を組み立てて</b>できています。' },
              { t: 'html', html: '<div class="box ex"><b>inspection（検査）</b> ＝ in-（中を）＋ spect（見る）＋ -ion（名詞にする）<br>spect（見る）の仲間：respect（振り返って見る → 尊敬）、expect（外を見る → 期待）、spectrum、perspective（見通す → 視点）</div>' },
              { t: 'html', html: D.chunks([['in-', '中を', 'fw'], ['spect', '見る', 'fr'], ['-ion', '名詞にする', 'fa']], { slash: true, cap: 'inspection ＝ 中を見ること ＝ 検査。部品を知れば、初めての単語も推測できる' }) },
              { t: 'key', front: '単語を効率よく増やすコツは？', back: '部品（接頭辞・語根・接尾辞）で覚える。1つの部品で何十語も推測できる' },
              { t: 'html', html: '<table class="tbl"><tr><th>部品</th><th>意味</th><th>例</th></tr><tr><td>re-</td><td>再び・元へ</td><td>replace, recover, review</td></tr><tr><td>pre-</td><td>前に</td><td>preview, predict, prevent</td></tr><tr><td>un- / in- / dis-</td><td>否定</td><td>unavailable, inaccurate, disconnect</td></tr><tr><td>trans-</td><td>越えて・向こうへ</td><td>transfer, transmit, transparent</td></tr><tr><td>port</td><td>運ぶ</td><td>export, transport, portable</td></tr><tr><td>mit / miss</td><td>送る</td><td>transmit, submit, emission</td></tr><tr><td>duc / duct</td><td>導く</td><td>produce, reduce, conduct</td></tr><tr><td>ject</td><td>投げる</td><td>project, reject, inject</td></tr></table>' },
              { t: 'q', q: { q: '<span class="en">transmit</span> の意味を部品から推測すると？（trans ＝ 向こうへ、mit ＝ 送る）', c: ['送信する', '翻訳する', '変形する', '取り消す'], a: 0, why: ['', 'translate（言葉を向こうへ運ぶ）と混ざっています。', 'transform（形を越える）です。', '部品の意味と合いません。'], e: '向こうへ送る → 送信する・伝える。' } },
              { t: 'trap', html: '部品はあくまで<b>推測の手がかり</b>です。最後は必ず文の中で意味を確かめましょう。部品の意味からかけ離れた単語もあります。' },
            ],
          },
          {
            title: '単語の「相性」と、忘れない覚え方', min: 12, steps: [
              { t: 'talk', html: '意味を知っていても、組み合わせを間違えると不自然になります。単語には<b>相性（コロケーション）</b>があるんです。「決定をする」は do a decision ではなく <b>make</b> a decision。' },
              { t: 'html', html: D.grid(['相性のいい名詞', '日本語では'], ['make', 'take', 'meet'], [[['a decision / a mistake', 'fa'], ['決める・間違える', 'f1']], [['a break / action', 'fa'], ['休む・行動する', 'f1']], [['a deadline / needs', 'fa'], ['締め切りに間に合う', 'f1']]], { cw: 210, ch: 48, cap: '単語は「相方」とセットで覚える（コロケーション）' }) },
              { t: 'html', html: '<table class="tbl"><tr><th>動詞</th><th>相性のいい名詞</th></tr><tr><td>make</td><td>a decision, a mistake, progress, a reservation</td></tr><tr><td>take</td><td>a break, action, responsibility, notes</td></tr><tr><td>meet</td><td>a deadline, requirements, expectations</td></tr><tr><td>conduct / carry out</td><td>an inspection, a survey, a test</td></tr><tr><td>raise</td><td>a question, a concern, prices</td></tr></table>' },
              { t: 'key', front: '「締め切りに間に合わせる」を英語で？', back: 'meet a deadline（相性：meet ＋ deadline / requirements）' },
              { t: 'html', html: '<table class="tbl"><tr><th>混同しやすいペア</th><th>違い</th></tr><tr><td>borrow / lend</td><td>借りる / 貸す</td></tr><tr><td>say / tell</td><td>say ＋ 内容、tell ＋ 人 ＋ 内容（tell me the reason）</td></tr><tr><td>affect / effect</td><td>affect ＝ 影響を与える（動詞）、effect ＝ 効果・影響（名詞）</td></tr><tr><td>rise / raise</td><td>rise ＝ 上がる（目的語なし）、raise ＝ 上げる（目的語あり）</td></tr></table>' },
              { t: 'q', q: { q: 'Prices ___ sharply last month.', c: ['rose', 'raised', 'rised', 'were risen'], a: 0, why: ['', 'raise は「〜を上げる」で、目的語が必要です。', 'rise の過去形は rose です。', 'rise は受け身にできません。'], e: 'rise（上がる）の過去形 rose。' } },
              { t: 'talk', html: '最後に、忘れない覚え方。① 単語だけでなく<b>例文ごと・音ごと</b>（🔊を使う）② 見て覚えるより<b>思い出す</b>練習（カードをめくる前に言ってみる）③ <b>間を空けて</b>繰り返す（このアプリの復習）④ 本物の英文で<b>再会</b>する。この4つで、記憶の残り方が全く変わります。' },
              { t: 'key', front: '忘れない単語の覚え方の4つは？', back: '例文・音ごと／思い出す練習／間を空けて復習／本物の英文で再会' },
            ],
          },
        ],
        qs: [
          { id: 'b1', lv: 1, q: '<span class="en">unavailable</span> の意味は？', c: ['利用できない', '利用できる', '高価な', '有名な'], a: 0, why: ['', 'un- は否定です。', '部品の意味と合いません。', '部品の意味と合いません。'], e: 'un（否定）＋ available（利用できる）。' },
          { id: 'b2', lv: 1, q: 'We need to ___ a decision by Friday.', c: ['make', 'do', 'take place', 'raise'], a: 0, why: ['', 'do a decision とは言いません。', '「行われる」で意味が合いません。', 'raise は質問や値段などです。'], e: 'make a decision。' },
          { id: 'b3', lv: 1, q: 'Our team worked hard to ___ the deadline.', c: ['meet', 'keep up', 'arrive', 'reach to'], a: 0, why: ['', 'keep up with（ついていく）とは違います。', 'arrive は自動詞で目的語をとりません。', 'reach は to なしで使います。'], e: 'meet a deadline。' },
          { id: 's1', lv: 2, q: '<span class="en">transmit</span> の意味を部品から推測すると？', c: ['送信する', '翻訳する', '変形する', '取り消す'], a: 0, why: ['', 'translate と混ざっています。', 'transform です。', '合いません。'], e: '向こうへ送る。' },
          { id: 's2', lv: 2, q: 'The new rule will ___ all employees.', c: ['affect', 'effect', 'effective', 'affection'], a: 0, why: ['', 'effect は名詞が基本です。', '形容詞です。', '「愛情」で意味が違います。'], e: '動詞「影響を与える」→ affect。' },
          { id: 's3', lv: 2, q: 'Could you ___ me the reason?', c: ['tell', 'say', 'speak', 'talk'], a: 0, why: ['', 'say は人を直接目的語にとりません（say to me）。', 'speak は言語や話す行為です。', 'talk は「話をする」です。'], e: 'tell ＋ 人 ＋ 内容。' },
          { id: 's4', lv: 2, q: 'Prices ___ sharply last month.', c: ['rose', 'raised', 'rised', 'were risen'], a: 0, why: ['', '目的語が必要です。', 'rise の過去形は rose。', '受け身にできません。'], e: 'rise（上がる）の過去形。' },
          { id: 'a1', lv: 3, q: '<span class="en">predict</span> の pre と dict の組み合わせは？', c: ['前に ＋ 言う → 予測する', '再び ＋ 見る → 見直す', '共に ＋ 運ぶ → 支える', '越えて ＋ 送る → 送信する'], a: 0, why: ['', 'review です。', 'support に近い組み合わせです。', 'transmit です。'], e: '前もって言う → 予測する。' },
          { id: 'a2', lv: 3, q: 'We ___ an inspection of all units before shipment.', c: ['conduct', 'make up', 'raise', 'take place'], a: 0, why: ['', '「作り上げる・埋め合わせる」です。', '質問や値段の相性です。', '「行われる」で目的語をとりません。'], e: 'conduct / carry out an inspection（検査を行う）。' },
          { id: 'a3', lv: 3, q: '<span class="en">reject</span> の部品の意味は？（re ＝ 戻して、ject ＝ 投げる）', c: ['投げ返す → 不合格にする・はじく', '前に投げる → 計画する', '中に投げる → 注入する', '一緒に投げる → 合わせる'], a: 0, why: ['', 'project です。', 'inject です。', '部品の意味と合いません。'], e: '検査で NG 品を「はじく」のも reject。' },
        ],
        missions: [
          {
            title: '仕事の単語を「部品」で分解する', time: '30分',
            why: '自分の仕事の単語を分解すると、部品が記憶にしっかり残ります。',
            steps: ['仕事で使う英単語を10個集める（inspection・transmission・illumination・calibration など）', 'それぞれを部品に分け、部品の意味を調べる', '同じ部品を持つ別の単語を1つずつ探す', '相性のいい動詞を1つずつ付けて、短いフレーズにする（例：conduct an inspection）'],
            deliverable: '単語10個の分解表とフレーズ',
            criteria: ['10個を部品に分けた', '同じ部品の仲間を見つけた', '相性のいい動詞を付けた'],
          },
        ],
      },
      {
        id: 'en-ifcomp', stage: 0, tags: ['toeic', 'biz', 'paper'], pre: ['en-modal', 'en-clause'],
        title: '比較と仮定法：差を語り、ていねいに頼む',
        sum: '比較は「物差し」。仮定法は「時制を1つ過去にずらして、現実から距離をとる」。だからていねいな頼み方にもなる。',
        goals: ['比較級・最上級・as ... as・倍数を正しく使える', '仮定法過去と仮定法過去完了の形と意味を説明できる', '仮定法を使ったていねいな頼み方ができる', 'Should you have any questions のような倒置を理解できる'],
        lessons: [
          {
            title: '比較は「物差し」', min: 12, steps: [
              { t: 'talk', html: '仕様や結果を比べるとき、比較の表現は欠かせません。比較は、2つを並べる<b>物差し</b>です。' },
              { t: 'html', html: D.bars([['old camera', 30], ['new camera', 60], ['latest model', 90, true]], { unit: 'fps', title: '速さを比べる', cap: 'The new camera is faster than the old one. / The latest model is the fastest.' }) },
              { t: 'html', html: '<table class="tbl"><tr><th>形</th><th>例</th></tr><tr><td>比較級 -er / more</td><td><span class="say">The new camera is faster than the old one.</span></td></tr><tr><td>最上級 the -est / the most</td><td><span class="say">This is the most accurate method we have tested.</span></td></tr><tr><td>同じくらい as ... as</td><td><span class="say">The new model is as accurate as the old one.</span></td></tr><tr><td>倍数 X times as ... as</td><td><span class="say">It is three times as fast as the previous version.</span></td></tr><tr><td>強調 much / far ＋ 比較級</td><td><span class="say">The error is much smaller.</span></td></tr><tr><td>〜すればするほど</td><td><span class="say">The shorter the exposure, the darker the image.</span></td></tr></table>' },
              { t: 'trap', html: '× very smaller → ○ <b>much</b> smaller（比較級を強めるのは much / far）<br>× more faster → ○ faster（比較級を重ねない）' },
              { t: 'key', front: '比較級を強める語は？', back: 'much / far / significantly（very は使えない）' },
              { t: 'q', q: { q: 'The new model is ___ than the old one.', c: ['much faster', 'very faster', 'more faster', 'most fast'], a: 0, why: ['', 'very は比較級を強められません。', '比較級を重ねています。', '最上級の形が間違っています。'], e: '比較級の強調は much / far。' } },
            ],
          },
          {
            title: '仮定法は「現実から距離をとる」', min: 14, steps: [
              { t: 'talk', html: '仮定法は「もし〜なら」。でも普通の if と違って、<b>現実とは違う話</b>をするときに使います。仕組みは1つ。<b>時制を1つ過去にずらす</b>んです。過去形にすることで、「今の現実」から<b>距離をとる</b>わけですね。' },
              { t: 'html', html: D.flow([['現実', 'I have no time.', '📍'], ['1つ過去へずらす', 'If I had time,', '⏪'], ['現実から離れた話', 'I would help you.', '☁️']], { cap: '仮定法は、時制を1つ過去にずらして「本当は違う」と示す' }) },
              { t: 'html', html: '<table class="tbl"><tr><th>種類</th><th>形</th><th>例</th></tr><tr><td>今の現実と違う</td><td>If ＋ 過去形, would ＋ 原形</td><td><span class="say">If I had more time, I would study harder.</span>（実際は時間がない）</td></tr><tr><td>過去の現実と違う</td><td>If ＋ had 過去分詞, would have 過去分詞</td><td><span class="say">If we had tested it earlier, we would have found the problem.</span></td></tr><tr><td>願い</td><td>I wish ＋ 過去形</td><td><span class="say">I wish I could speak English fluently.</span></td></tr></table>' },
              { t: 'key', front: '仮定法の仕組みは？', back: '時制を1つ過去にずらして、現実から距離をとる（今と違う→過去形、過去と違う→過去完了）' },
              { t: 'q', q: { q: 'If we had tested it earlier, we ___ the problem.', c: ['would have found', 'would find', 'will find', 'found'], a: 0, why: ['', 'had tested（過去と違う話）とそろえて would have ＋ 過去分詞です。', '未来の話になります。', '仮定法の形になりません。'], e: '過去の現実と違う話 → would have ＋ 過去分詞。' } },
              { t: 'talk', html: 'ここからがビジネスで役立つ話です。「現実から距離をとる」形は、そのまま<b>ていねいさ</b>になります。「もし可能なら…」と、相手に断る余地を残すからです。' },
              { t: 'html', html: '<ul><li><span class="say">It would be great if you could send us a sample.</span>（サンプルを送っていただけるとありがたいです）</li><li><span class="say">Would it be possible to extend the deadline?</span>（締め切りを延ばしていただくことは可能でしょうか）</li><li><span class="say">Should you have any questions, please feel free to contact me.</span>（ご質問があれば、お気軽にご連絡ください）</li></ul>' },
              { t: 'trap', html: '最後の <b>Should you have any questions</b> は、If you should have ... の If が消えて、順番が入れ替わった形（倒置）です。メールで本当によく見ます。文頭の <b>Should / Had / Were</b> は、If が消えた仮定法の目印です。' },
              { t: 'key', front: '文頭の Should you have any questions の正体は？', back: 'If you should have any questions の If を省いた倒置（メールの定番）' },
            ],
          },
        ],
        qs: [
          { id: 'b1', lv: 1, q: 'The new model is ___ than the old one.', c: ['much faster', 'very faster', 'more faster', 'most fast'], a: 0, why: ['', 'very は比較級を強められません。', '比較級を重ねています。', '形が間違っています。'], e: '比較級の強調は much / far。' },
          { id: 'b2', lv: 1, q: 'This is ___ method we have ever tested.', c: ['the most accurate', 'more accurate', 'the accuratest', 'most accurately'], a: 0, why: ['', '比べる相手（than）がありません。', 'accurate は most を使います。', '副詞の形です。'], e: 'ever（今までで）→ 最上級。' },
          { id: 'b3', lv: 1, q: 'If I ___ more time, I would study harder.', c: ['had', 'have', 'will have', 'have had'], a: 0, why: ['', '後ろが would なので、仮定法の過去形です。', '未来の形は if の中では使いません。', '形が合いません。'], e: '今の現実と違う → If ＋ 過去形。' },
          { id: 's1', lv: 2, q: 'The new process is three times as ___ as the old one.', c: ['efficient', 'more efficient', 'efficiently', 'efficiency'], a: 0, why: ['', 'as ... as の間は元の形です。', '副詞です。', '名詞です。'], e: 'X times as ＋ 元の形 ＋ as。' },
          { id: 's2', lv: 2, q: 'If we had tested it earlier, we ___ the problem.', c: ['would have found', 'would find', 'will find', 'found'], a: 0, why: ['', '過去の話とそろいません。', '未来の話になります。', '仮定法の形になりません。'], e: 'would have ＋ 過去分詞。' },
          { id: 's3', lv: 2, q: '___ you have any questions, please feel free to contact me.', c: ['Should', 'If not', 'Unless', 'Would'], a: 0, why: ['', '意味が逆になります。', '「〜でない限り」で合いません。', 'この形では使いません。'], e: 'If が省かれた倒置。' },
          { id: 's4', lv: 2, q: '「サンプルを送っていただけるとありがたいです」に最も近い表現は？', c: ['It would be great if you could send us a sample.', 'Send us a sample.', 'You must send a sample.', 'We want sample.'], a: 0, why: ['', '命令です。', '強制です。', '文法も丁寧さも足りません。'], e: 'would / could で距離をとったていねいな頼み方。' },
          { id: 'a1', lv: 3, t: 'order', q: '「露光が短いほど、画像は暗くなる」', tokens: ['The', 'shorter', 'the', 'exposure', 'the', 'darker', 'the', 'image'], e: 'the 比較級 ..., the 比較級 ...（〜すればするほど…）。' },
          { id: 'a2', lv: 3, q: 'I wish I ___ speak English fluently.', c: ['could', 'can', 'will', 'am able'], a: 0, why: ['', 'I wish の後ろは過去形にずらします。', '未来の形は使いません。', 'am able to なら形が足りません。'], e: '願い（現実と違う）→ 過去形 could。' },
          { id: 'a3', lv: 3, q: 'The price of model A is higher than ___ of model B.', c: ['that', 'it', 'one', 'those'], a: 0, why: ['', 'it では比べる相手がはっきりしません。', 'price は数えない扱いなので one は不自然です。', '単数の price を受けるので those ではありません。'], e: '比べる相手をそろえる：the price of A と that（＝the price）of B。' },
          { id: 'a4', lv: 3, q: 'Would it be possible ___ the deadline by one week?', c: ['to extend', 'extending', 'extend', 'extended'], a: 0, why: ['', 'possible の後ろは to 不定詞です。', '原形は来ません。', '過去分詞は来ません。'], e: 'Would it be possible to 〜?（〜していただくことは可能でしょうか）。' },
        ],
        missions: [
          {
            title: '仮定法のていねいなメールを3通書く', time: '30分',
            why: '仮定法のていねい表現は、書いて使ってこそ身につきます。',
            steps: ['仕事でありそうな依頼の場面を3つ考える（サンプルの依頼・納期の延長・資料の確認）', 'それぞれ、It would be great if / Would it be possible to / Should you have any questions を使って短いメールを書く', '比較の表現（faster / as ... as / X times）を1つ以上入れる', '音読して、言いにくい所を直す'],
            deliverable: '短いメール3通',
            criteria: ['仮定法のていねい表現を3種類使った', '比較の表現を正しく使った', '声に出して読める'],
          },
        ],
      },
      {
        id: 'en-part34', stage: 1, tags: ['toeic', 'biz', 'travel'], pre: ['en-listen'],
        title: 'リスニング Part 3/4：会話・説明文を聞き取る',
        sum: '設問を「先読み」して、何を聞くかを決めてから聞く。設問の順番 ＝ ヒントが出る順番。',
        goals: ['Part 3/4 の設問のタイプを知っている', '設問を先読みして、聞き取るものを決められる', '30秒ほどの英語から要点と数字を聞き取れる', '言い換え（パラフレーズ）に気づける'],
        lessons: [
          {
            title: '「先読み」で、聞く前に勝負が決まる', min: 14, steps: [
              { t: 'talk', html: 'Part 3（会話）と Part 4（説明文）は、30秒ほどの英語を聞いて3問に答えます。ここで最強の武器が<b>先読み</b>です。音声が流れる前に3つの設問を読み、<b>何を聞き取ればいいか</b>を決めておく。' },
              { t: 'talk', html: '宝探しで、地図を見てから探すのと、何も見ずに探すのとでは、まったく違いますよね。設問は、宝の場所を教えてくれる地図なんです。' },
              { t: 'html', html: D.flow([['設問を読む', '音声の前に', '📖'], ['聞く所を決める', '人・場所・数字', '🎯'], ['聞きながら選ぶ', '', '✍️'], ['次を先読み', '', '⏩']], { loop: '3問ごとにくり返す', cap: '先読み：聞く前に「何を探すか」を知る' }) },
              { t: 'html', html: '<table class="tbl"><tr><th>設問のタイプ</th><th>例</th><th>ヒントが出る所</th></tr><tr><td>目的・話題</td><td>Why is the speaker calling?</td><td>最初</td></tr><tr><td>場所・話し手</td><td>Where is the announcement being made?</td><td>全体の言葉（passengers, gate → 空港）</td></tr><tr><td>詳しい内容</td><td>When will the order be delivered?</td><td>真ん中（数字・曜日）</td></tr><tr><td>次の行動・お願い</td><td>What is the listener asked to do?</td><td><b>最後</b>（Please... / I\'ll...）</td></tr></table>' },
              { t: 'key', front: 'Part 3/4 の最大のコツは？', back: '先読み：音声の前に設問を読み、何を聞き取るか決める。設問の順番＝ヒントの順番' },
              { t: 'trap', html: '正解の選択肢は、音声と<b>違う言葉で言い換え</b>られていることが多いです。out of stock（在庫切れ）→ unavailable、two days late → delayed。同じ単語を探すのではなく、<b>意味</b>で選びます。' },
              { t: 'q', q: { audio: A_VM, q: 'Why is the speaker calling?', c: ['To report a delivery delay', 'To place a new order', 'To ask for payment', 'To cancel an order'], a: 0, why: ['', '注文するのは聞き手側です。', '支払いの話はありません。', 'キャンセルの話はありません。'], e: 'the delivery will be two days late → 配達の遅れの連絡。最初の部分にヒントがあります。' } },
            ],
          },
          {
            title: '場面ごとの「型」を知る', min: 12, steps: [
              { t: 'talk', html: 'Part 3/4 の英語は、場面ごとに<b>話の流れの型</b>が決まっています。型を知っていれば、どこにヒントが出るか予想できます。' },
              { t: 'html', html: D.flow([['名乗る', "Hi, this is ...", '🙋'], ['用件', "I'm calling about ...", '📞'], ['詳しく', '日時・数字', '📋'], ['お願い', 'Please call me back', '🔁']], { cap: '留守番電話の型。型を知れば、次に何が来るか分かる' }) },
              { t: 'html', html: '<table class="tbl"><tr><th>場面</th><th>話の流れ</th></tr><tr><td>留守番電話</td><td>名乗る → 用件 → 詳しく → 折り返しのお願い</td></tr><tr><td>アナウンス（空港・店・社内）</td><td>注意を引く → 状況 → 案内 → おわび</td></tr><tr><td>会議・紹介</td><td>目的 → 人や計画の紹介 → これからの予定</td></tr><tr><td>同僚の会話</td><td>問題 → 原因 → 解決策 → 次にやること</td></tr></table>' },
              { t: 'key', front: '留守番電話の話の流れは？', back: '名乗る → 用件 → 詳しく → 折り返しのお願い（お願いは最後）' },
              { t: 'q', q: { audio: A_AIR, q: 'What can passengers receive?', c: ['A meal voucher', 'A free ticket', 'A hotel room', 'A refund'], a: 0, why: ['', '無料の航空券の話はありません。', 'ホテルの話はありません。', '返金の話はありません。'], e: 'Passengers may collect a meal voucher... アナウンスの「案内」の部分です。' } },
              { t: 'trap', html: '1問聞き逃しても、<b>引きずらない</b>こと。次の設問に気持ちを切り替えます。1問にこだわると、次の2問も落とします。' },
              { t: 'talk', html: '練習のしかた：① 設問を読んでから聞いて解く ② 解説の「音声」の英文を読み、分からなかった所を確かめる ③ 英文を見ながら音読・重ね読み ④ 何も見ずにもう一度聞いて、全部分かるか確かめる。会話の音声は1人の声で読み上げます（「...」が話し手の交代）。' },
            ],
          },
        ],
        qs: [
          { id: 'b1', lv: 1, audio: A_VM, q: 'Why is the speaker calling?', c: ['To report a delivery delay', 'To place a new order', 'To ask for payment', 'To cancel an order'], a: 0, why: ['', '違います。', '違います。', '違います。'], e: '配達の遅れの連絡。' },
          { id: 'b2', lv: 1, audio: A_VM, q: 'When will the order now be delivered?', c: ['On Thursday', 'On Tuesday', 'Today', 'Next week'], a: 0, why: ['', 'Tuesday は元の予定です。', 'today は折り返しの期限の話です。', '出てきません。'], e: 'on Thursday instead of Tuesday。' },
          { id: 'b3', lv: 1, audio: A_AIR, q: 'Where is the announcement most likely being made?', c: ['At an airport', 'In a factory', 'At a train station', 'In a hotel lobby'], a: 0, why: ['', '工場の言葉は出てきません。', 'flight・gate は空港の言葉です。', 'ホテルの言葉は出てきません。'], e: 'passengers・flight・gate → 空港。' },
          { id: 's1', lv: 2, audio: A_VM, q: 'What is the listener asked to do if there is a problem?', c: ["Call back before five o'clock", 'Send an e-mail', 'Visit the warehouse', 'Order a different part'], a: 0, why: ['', 'メールの話はありません。', '倉庫の話はありません。', '違う部品の注文の話はありません。'], e: 'お願いは最後：please call me back ... before five。' },
          { id: 's2', lv: 2, audio: A_AIR, q: 'What is the cause of the problem?', c: ['Bad weather', 'A technical problem', 'A missing crew member', 'Heavy traffic'], a: 0, why: ['', '機械の故障の話はありません。', '乗員の話はありません。', '道路の話はありません。'], e: 'delayed due to bad weather。' },
          { id: 's3', lv: 2, audio: A_AIR, q: 'What can passengers receive?', c: ['A meal voucher', 'A free ticket', 'A hotel room', 'A refund'], a: 0, why: ['', '違います。', '違います。', '違います。'], e: 'meal voucher（食事券）。' },
          { id: 's4', lv: 2, audio: A_CONV, q: 'What is the woman working on?', c: ['An inspection report', 'A sales presentation', 'A job application', 'A travel plan'], a: 0, why: ['', '営業の話はありません。', '応募の話はありません。', '旅行の話はありません。'], e: 'have you finished the inspection report? — Almost.' },
          { id: 'a1', lv: 3, audio: A_CONV, q: 'What is the woman waiting for?', c: ['Test results from the second line', 'Approval from her manager', 'A new technician', 'A payment from the client'], a: 0, why: ['', '上司の承認の話はありません。', '技術者は結果を用意する人です。', '支払いの話はありません。'], e: 'I just need the test results from the second line.' },
          { id: 'a2', lv: 3, audio: A_CONV, q: 'When will the report be sent to the client?', c: ['Tomorrow morning', 'This afternoon', 'Next week', 'It has already been sent'], a: 0, why: ['', 'this afternoon は結果ができる時間です。', '出てきません。', 'まだ送っていません。'], e: 'Then I can send the report to the client tomorrow morning.' },
          { id: 'a3', lv: 3, audio: A_MTG, q: 'What is the main purpose of the talk?', c: ['To introduce a new colleague', 'To announce a factory closure', 'To explain a new camera', 'To report sales results'], a: 0, why: ['', '工場の閉鎖の話はありません。', 'カメラは仕事の内容として出てくるだけです。', '売上の話はありません。'], e: 'I would like to welcome our new engineer, Daniel.' },
          { id: 'a4', lv: 3, audio: A_MTG, q: 'What will Daniel be responsible for?', c: ['Leading a camera system upgrade', 'Managing the Berlin office', 'Training new sales staff', 'Hiring engineers'], a: 0, why: ['', 'Berlin は前にいた場所です。', '営業の話はありません。', '採用の話はありません。'], e: 'leading the camera system upgrade on Line 3。' },
          { id: 'a5', lv: 3, audio: A_MTG, q: 'What will Daniel do over the next two weeks?', c: ['Meet with each team', 'Return to Berlin', 'Install new cameras', 'Take a vacation'], a: 0, why: ['', '戻る話はありません。', '導入はこれからのリーダーの仕事で、2週間の予定ではありません。', '休暇の話はありません。'], e: 'he will be meeting with each team。' },
        ],
        missions: [
          {
            title: '先読みのタイムアタック', time: '1日15分 × 5日',
            why: '先読みは、本番の速さでできて初めて武器になります。',
            steps: ['TOEIC の問題集の Part 3/4 を用意する', '音声が流れる前の短い時間で、3つの設問を読んで「聞き取るもの」に印をつける', '音声を聞いて解く', '外れた問題は、ヒントが音声のどこにあったか（最初・真ん中・最後）を記録する', '5日間で、先読みが間に合う割合と正答率の変化を記録する'],
            deliverable: '5日分の正答率と、ヒントの位置の記録',
            criteria: ['毎回、音声の前に設問を読めた', 'ヒントの位置の傾向が分かった', '正答率の変化を記録した'],
          },
        ],
      },
      {
        id: 'en-reading2', stage: 1, tags: ['toeic', 'biz'], pre: ['en-reading', 'en-toeic5'],
        title: 'Part 6/7 実戦：文の流れと複数文書',
        sum: 'Part 6 は「前後の文」が答えを教える。複数文書は「2つの情報を合体」させて解く。',
        goals: ['文脈からつなぎ言葉と時制を選べる', '文を入れる問題で、指す言葉を手がかりに位置を決められる', '2つの文書の情報を組み合わせて答えられる'],
        lessons: [
          {
            title: 'Part 6 は「前後の文」が答えを教える', min: 12, steps: [
              { t: 'talk', html: 'Part 6 は長文の穴埋めです。Part 5 と違って、<b>その1文だけでは決まらない</b>問題が混ざっています。答えは、<b>前後の文</b>が教えてくれます。' },
              { t: 'html', html: D.svg(`
<rect x="40" y="10" width="420" height="34" rx="6" class="l f1"/><text x="56" y="32" class="s">前の文：The copier is out of order.</text>
<rect x="40" y="56" width="420" height="34" rx="6" class="l fW" style="fill-opacity:.25"/><text x="250" y="78" class="tm b">（　空欄　）</text>
<rect x="40" y="102" width="420" height="34" rx="6" class="l f1"/><text x="56" y="124" class="s">後ろの文：Until then, please use ...</text>
<path d="M470 27 Q520 50 470 70" class="la" marker-end="url(#ara)"/><path d="M470 119 Q520 96 470 76" class="la" marker-end="url(#ara)"/>
<text x="530" y="60" class="ta b">手がかり</text><text x="530" y="80" class="s">時制・this・</text><text x="530" y="98" class="s">つなぎ言葉</text>`, 620, 146, 'Part 6 は空欄の「前と後ろ」が答えを教えてくれる') },
              { t: 'html', html: '<table class="tbl"><tr><th>タイプ</th><th>手がかり</th></tr><tr><td>時制</td><td>文書の日付と、前後の文の時制</td></tr><tr><td>つなぎ言葉</td><td>前の文と後ろの文の関係（逆・結果・追加）</td></tr><tr><td>代名詞</td><td>何を指しているか（it / they / this）</td></tr><tr><td><b>文を入れる</b></td><td>選択肢の this / these / also / then が、前の何を受けているか</td></tr></table>' },
              { t: 'key', front: '文を入れる問題の手がかりは？', back: '選択肢や前後の文の this・these・also・then・until then などの「指す言葉」' },
              { t: 'q', q: { q: 'The copier on the second floor is out of order. ___ Until then, please use the one on the third floor.', c: ['A technician will repair it on Friday.', 'The third floor has a cafeteria.', 'We bought it five years ago.', 'Please submit your report.'], a: 0, why: ['', '食堂の話は流れに合いません。', '「それまで」が何を指すか決まりません。', '話題が変わってしまいます。'], e: '後ろの Until then（それまで）が、「金曜に修理する」を受けています。' } },
              { t: 'trap', html: 'Part 6 で、空欄の文だけを読んで答えると、時制やつなぎ言葉を間違えます。<b>空欄の前後1文ずつ</b>は必ず読みましょう。' },
            ],
          },
          {
            title: '複数文書は「2つの情報を合体」', min: 13, steps: [
              { t: 'talk', html: 'Part 7 には、メール＋料金表のように<b>2〜3つの文書</b>を組み合わせる問題があります。そして必ず、<b>片方だけでは答えが出ない</b>問題が入っています。' },
              { t: 'html', html: '<ol class="steps-ol"><li>まず各文書の種類と関係（誰が誰に、何のために）をつかむ</li><li>設問の固有名詞・数字が<b>どちらの文書にあるか</b>を探す</li><li>条件（人数・日付・割引の条件）を表に当てはめて計算する</li></ol>' },
              { t: 'html', html: `<div class="passage">${P_RATES}</div>` },
              { t: 'html', html: D.svg(`
<rect x="20" y="20" width="170" height="110" rx="8" class="l fa"/><text x="105" y="44" class="tm b">文書1：料金表</text><text x="105" y="70" class="tm s">Room B：50人まで</text><text x="105" y="90" class="tm s">5日以上で 10% 引き</text>
<rect x="410" y="20" width="170" height="110" rx="8" class="l fw"/><text x="495" y="44" class="tm b">文書2：メール</text><text x="495" y="70" class="tm s">参加者 約40人</text><text x="495" y="90" class="tm s">5日間 使いたい</text>
<path d="M190 75 L255 120 M410 75 L345 120" class="la" marker-end="url(#ara)"/>
<rect x="230" y="120" width="140" height="50" rx="10" class="l fg"/><text x="300" y="142" class="tm b">答え</text><text x="300" y="160" class="tm s">2つを合体して決まる</text>`, 600, 180, '複数文書の問題は、片方だけでは答えが出ないように作られている') },
              { t: 'html', html: '<div class="box ex"><b>考え方</b>「Mori さんはいくら払う？」→ 参加者 約40人（文書2）→ Room B $550（文書1）＋ プロジェクタ $50 ＝ $600 → 予約は4月2日、開催は5月15日で30日以上前（文書1の割引の条件）→ 10%引きで <b>$540</b></div>' },
              { t: 'key', front: '複数文書の問題の解き方は？', back: '設問の情報がどの文書にあるか探し、2つの情報（条件・数字）を組み合わせて計算する' },
              { t: 'q', q: { passage: P_RATES, q: 'Why is Ms. Mori eligible for a discount?', c: ['She is booking more than 30 days in advance', 'She is renting a projector', 'Her group has more than 20 people', 'She is a hotel member'], a: 0, why: ['', 'プロジェクタは割引の条件ではありません。', '人数は部屋選びの条件です。', '会員の話はありません。'], e: '予約日（文書2）と割引の条件（文書1）を組み合わせます。' } },
              { t: 'talk', html: '1問にかけられる時間は約1分。複数文書は、<b>設問を先に読んで、何の情報が必要かを決めてから</b>文書を読むと速くなります。' },
            ],
          },
        ],
        qs: [
          { id: 'b1', lv: 1, passage: P_RATES, q: 'Which room will Ms. Mori most likely reserve?', c: ['Room B', 'Room A', 'Room C', 'None of the rooms'], a: 0, why: ['', '20人までなので入りません。', '入りますが、大きすぎて高くなります。', '入る部屋があります。'], e: '約40人 → 50人まで入る Room B。' },
          { id: 'b2', lv: 1, passage: P_RATES, q: 'What does Ms. Mori ask about?', c: ['Whether lunch can be provided', 'The hotel location', 'The room size in square meters', 'Parking fees'], a: 0, why: ['', '場所は聞いていません。', '広さは聞いていません。', '駐車場は聞いていません。'], e: 'whether lunch can be provided。' },
          { id: 'b3', lv: 1, q: 'Our new software helps companies manage their inventory. ___ also reduces the time needed for monthly reports.', c: ['It', 'They', 'This companies', 'Them'], a: 0, why: ['', 'software は単数です。', '形が間違っています。', '主語の位置には来ません。'], e: '主語で、software（単数）を指す → It。' },
          { id: 's1', lv: 2, passage: P_RATES, q: 'How much will Ms. Mori most likely pay in total?', c: ['$540', '$600', '$550', '$495'], a: 0, why: ['', '割引を忘れています。', 'プロジェクタと割引を忘れています。', 'プロジェクタ代を足していません。'], e: '$550 ＋ $50 ＝ $600 → 30日以上前なので10%引き → $540。' },
          { id: 's2', lv: 2, passage: P_RATES, q: 'Why is Ms. Mori eligible for a discount?', c: ['She is booking more than 30 days in advance', 'She is renting a projector', 'Her group has more than 20 people', 'She is a hotel member'], a: 0, why: ['', '割引の条件ではありません。', '部屋選びの条件です。', '出てきません。'], e: '2つの文書を組み合わせます。' },
          { id: 's3', lv: 2, q: 'We are pleased to announce that our new branch will open next month. ___, we are looking for ten new staff members.', c: ['Accordingly', 'Nevertheless', 'Otherwise', 'Instead'], a: 0, why: ['', '「それにもかかわらず」で、話が合いません。', '「さもなければ」で合いません。', '「代わりに」で合いません。'], e: '支店ができる → それに伴って採用 → Accordingly。' },
          { id: 'a1', lv: 3, q: 'The copier on the second floor is out of order. ___ Until then, please use the one on the third floor.', c: ['A technician will repair it on Friday.', 'The third floor has a cafeteria.', 'We bought it five years ago.', 'Please submit your report.'], a: 0, why: ['', '流れに合いません。', '「それまで」が決まりません。', '話題が変わります。'], e: 'Until then が「修理の日」を受けます。' },
          { id: 'a2', lv: 3, q: "Thank you for attending last week's workshop. We ___ your feedback on the survey we sent yesterday.", c: ['would appreciate', 'appreciated', 'had appreciated', 'were appreciating'], a: 0, why: ['', '回答はまだこれからです。', '形も意味も合いません。', '意味が合いません。'], e: '昨日送ったアンケートへの回答はこれから → お願いの would appreciate。' },
          { id: 'a3', lv: 3, q: 'The new line will start operation in May. ___, all operators must complete the training by April 30.', c: ['Therefore', 'However', 'For example', 'Otherwise'], a: 0, why: ['', '逆の関係ではありません。', '例を挙げていません。', '「さもなければ」で合いません。'], e: '5月に始まる → だから4月末までに研修 → Therefore。' },
        ],
        missions: [
          {
            title: '複数文書の問題を「情報の地図」で解く', time: '45分',
            why: '2つの情報をつなぐ力は、仕事で資料を読み合わせる力そのものです。',
            steps: ['TOEIC の問題集から、複数文書の問題を2セット選ぶ', '設問ごとに、必要な情報が「文書1・文書2・両方」のどれにあるかを先に書く', '「両方」の問題は、組み合わせた条件と計算を書いてから答える', '間違えた問題は、どの情報を見落としたかを書く'],
            deliverable: '設問ごとの「情報の地図」と、見落としの記録',
            criteria: ['設問ごとに情報の場所を書いた', '「両方」の問題で組み合わせを書いた', '見落としの傾向が分かった'],
          },
        ],
      },
      {
        id: 'en-writing', stage: 2, tags: ['biz', 'paper'], pre: ['en-biz', 'en-ifcomp'],
        title: '書く力：伝わるメール・技術文書と日本人の典型ミス',
        sum: '伝わる英文の5原則と、技術報告の型。そして日本人が必ずやってしまうミスと和製英語を先回りでつぶす。',
        goals: ['結論が先・1文1メッセージで簡潔に書ける', '技術報告を「目的・方法・結果・次の対応」の型で書ける', '日本人の典型的なミスを避けられる', '和製英語を正しい英語に直せる'],
        lessons: [
          {
            title: '伝わる英文の5原則', min: 13, steps: [
              { t: 'talk', html: '英文を書くとき、難しい単語や長い文を使う必要はありません。大事なのは<b>伝わること</b>。そのための原則は5つです。' },
              { t: 'html', html: D.compare({ title: '伝わりにくい', icon: '😵', lines: ['As a result of various tests,', 'it was found that there is', 'a possibility of improvement.'], color: 'fr' }, { title: '伝わる', icon: '🎯', lines: ['The new lighting reduced', 'false rejects from 2% to 0.5%.', '結論が先・具体的な数字'], color: 'fg' }, { vs: '→', cap: '短く・結論から・数字で' }) },
              { t: 'html', html: '<ol class="steps-ol"><li><b>結論を先に</b>：最初の1〜2文で用件・結論</li><li><b>1文1メッセージ</b>：長い文は2つに分ける。目安は1文20語以内</li><li><b>具体的に</b>：数字・単位・日付・型番（× soon → ○ by May 10）</li><li><b>主語をはっきり</b>：誰がやるのか（We will check... / Could you check...?）</li><li><b>箇条書き</b>：条件・手順・質問が複数あるとき</li></ol>' },
              { t: 'key', front: '伝わる英文の5原則は？', back: '結論が先・1文1メッセージ・具体的に（数字・日付）・主語をはっきり・箇条書き' },
              { t: 'html', html: '<table class="tbl"><tr><th>技術報告の見出し</th><th>書くこと</th><th>例</th></tr><tr><td>Purpose</td><td>何のための報告か</td><td><span class="say">This report summarizes the results of the lighting test.</span></td></tr><tr><td>Method</td><td>何をどう試したか</td><td><span class="say">We tested three types of lighting with 50 sample parts.</span></td></tr><tr><td>Results</td><td>数字で結果</td><td><span class="say">The dome light detected 49 of the 50 defects.</span></td></tr><tr><td>Next steps</td><td>次に誰が何をするか</td><td><span class="say">We will finalize the design by June 5.</span></td></tr></table>' },
              { t: 'q', q: { q: '技術報告の「結果」の書き方として最も良いのは？', c: ['The dome light detected 49 of the 50 defects.', 'The dome light was very good.', 'The result was not bad.', 'We think it is OK.'], a: 0, why: ['', '「とても良い」では、どれくらい良いか分かりません。', 'あいまいです。', '根拠がありません。'], e: '数字で具体的に書きます。' } },
            ],
          },
          {
            title: '日本人がやってしまうミスを先回りでつぶす', min: 13, steps: [
              { t: 'talk', html: '日本人の英語には、<b>みんな同じ所で間違える</b>パターンがあります。逆に言えば、それを知っておけば一気に自然な英語になります。' },
              { t: 'html', html: D.compare({ title: '日本人がよくやる', icon: '❌', lines: ['discuss about the issue', 'contact to the client', 'explain me the result'], color: 'fr' }, { title: '正しい形', icon: '⭕', lines: ['discuss the issue', 'contact the client', 'explain the result to me'], color: 'fg' }, { vs: '→', cap: '日本語の「〜について」「〜に」につられて、余計な語を足してしまう' }) },
              { t: 'html', html: '<table class="tbl"><tr><th>×</th><th>○</th><th>ポイント</th></tr><tr><td>discuss about the issue</td><td>discuss the issue</td><td>discuss の後ろに about はいらない</td></tr><tr><td>look forward to hear from you</td><td>look forward to hearing from you</td><td>この to は前置詞</td></tr><tr><td>Please teach me the procedure.</td><td>Could you explain the procedure?</td><td>teach は「教育する」。手順なら explain / show</td></tr><tr><td>informations / equipments</td><td>information / equipment</td><td>数えない名詞</td></tr><tr><td>I am agree.</td><td>I agree.</td><td>agree は動詞</td></tr><tr><td>consider about it</td><td>consider it</td><td>consider の後ろに about はいらない</td></tr></table>' },
              { t: 'key', front: 'discuss と consider の後ろに付けてはいけない語は？', back: 'about（discuss the issue / consider it）' },
              { t: 'html', html: '<table class="tbl"><tr><th>和製英語</th><th>英語</th></tr><tr><td>クレーム（苦情）</td><td>complaint（claim は「主張・請求」）</td></tr><tr><td>コンセント</td><td>outlet / socket</td></tr><tr><td>スキルアップ</td><td>improve one\'s skills</td></tr><tr><td>タッチパネル</td><td>touchscreen</td></tr><tr><td>ノートパソコン</td><td>laptop</td></tr></table>' },
              { t: 'trap', html: '「クレーム」をそのまま claim と書くと、「（権利を）主張する・請求する」という意味になり、話がかみ合いません。お客様の苦情は <b>complaint</b> です。' },
              { t: 'q', q: { q: '正しい英文はどれ？', c: ['We need to discuss the issue.', 'We need to discuss about the issue.', 'We need to discussion the issue.', 'We need discuss about the issue.'], a: 0, why: ['', 'about はいりません。', 'discussion は名詞です。', 'to も足りず、about も余計です。'], e: 'discuss の後ろには直接、話題が来ます。' } },
              { t: 'talk', html: '上達のコツは、書いた英文を<b>声に出して読む</b>こと。引っかかる所が、直すべき所です。よく使う文は自分用の「定型文集」にためていきましょう。AIに直してもらうときは、<b>なぜ直されたか</b>を必ず確かめると、力になります。' },
            ],
          },
        ],
        qs: [
          { id: 'b1', lv: 1, q: '正しい英文は？', c: ['We need to discuss the issue.', 'We need to discuss about the issue.', 'We need to discussion the issue.', 'We need discuss about the issue.'], a: 0, why: ['', 'about はいりません。', '名詞です。', '形が違います。'], e: 'discuss ＋ 話題。' },
          { id: 'b2', lv: 1, q: 'お客様の苦情を表す語は？', c: ['complaint', 'claim', 'clear', 'comment'], a: 0, why: ['', '「主張・請求」です。', '「はっきりした」です。', '「意見」です。'], e: '和製英語の「クレーム」は complaint。' },
          { id: 'b3', lv: 1, q: '正しい英文は？', c: ['I agree with you.', 'I am agree with you.', 'I agreeing with you.', 'I am agreed you.'], a: 0, why: ['', 'be 動詞はいりません。', '形が違います。', '形が違います。'], e: 'agree は動詞です。' },
          { id: 'b4', lv: 1, t: 'input', q: '「ノートパソコン」を英語で（1語）', answer: ['laptop', 'a laptop'], e: 'note PC は通じにくいです。' },
          { id: 's1', lv: 2, q: '「その手順を教えていただけますか」として最も自然なのは？', c: ['Could you explain the procedure?', 'Please teach me the procedure.', 'Teach procedure, please.', 'Could you study the procedure?'], a: 0, why: ['', 'teach は体系的に教育するときです。', '文法も足りません。', '「調べて」になります。'], e: '手順の説明なら explain / show。' },
          { id: 's2', lv: 2, q: '技術報告の「結果」の書き方として最も良いのは？', c: ['The dome light detected 49 of the 50 defects.', 'The dome light was very good.', 'The result was not bad.', 'We think it is OK.'], a: 0, why: ['', 'あいまいです。', 'あいまいです。', '根拠がありません。'], e: '数字で具体的に。' },
          { id: 's3', lv: 2, q: '締め切りの伝え方として最も明確なのは？', c: ['Please reply by 5 p.m. (JST) on May 10.', 'Please reply soon.', 'Please reply when you can.', 'Please reply ASAP maybe.'], a: 0, why: ['', '人によって違います。', '締め切りがありません。', 'あいまいです。'], e: '日付・時刻・時差まで。' },
          { id: 'a1', lv: 3, t: 'order', q: '「この報告書は照明テストの結果をまとめたものです」', tokens: ['This', 'report', 'summarizes', 'the', 'results', 'of', 'the', 'lighting', 'test'], e: '技術報告の書き出し（Purpose）の型。' },
          { id: 'a2', lv: 3, q: '次のうち、和製英語を正しく直したものは？', c: ['スキルアップ → improve my skills', 'スキルアップ → skill up', 'タッチパネル → touch panel only', 'コンセント → consent'], a: 0, why: ['', 'skill up は英語として通じにくいです。', '画面の操作部なら touchscreen が一般的です。', 'consent は「同意」です。'], e: 'コンセントは outlet / socket です。' },
          { id: 'a3', lv: 3, q: '次の英文の直し方として最も良いのは？「We will consider about your proposal and reply you soon.」', c: ['We will consider your proposal and reply to you by Friday.', 'We will consider about your proposal and reply you soon.', 'We consider about proposal.', 'We will considering your proposal.'], a: 0, why: ['', '元のままです。', '文法が足りません。', '形が違います。'], e: 'consider の about を消す、reply to you、締め切りを具体的に。' },
        ],
        missions: [
          {
            title: '自分の「英文定型文集」を作る', time: '1時間',
            why: '仕事でよく使う文を、正しい形でためておくと、毎回ゼロから書かなくて済みます。',
            steps: ['このユニットと「ビジネス英語」から、自分がよく使いそうな文を15個選ぶ', '自分の仕事に合わせて書き換える', '日本人の典型ミス（discuss about など）が入っていないか確かめる', '技術報告の型（Purpose・Method・Results・Next steps）の書き出しを1セット入れる', 'ファイルにまとめ、いつでもコピーできるようにする'],
            deliverable: '自分用の英文定型文集（15文以上）',
            criteria: ['15文以上ある', '典型ミスがない', '技術報告の型が入っている'],
          },
        ],
      },
      {
        id: 'en-present', stage: 2, tags: ['biz'], pre: ['en-biz', 'en-ifcomp'],
        title: 'プレゼン・技術説明・質疑応答',
        sum: 'プレゼンは「道しるべ」を立てながら話す。グラフは「動きの言葉」で、質問は「確認してから」答える。',
        goals: ['導入・本論・結論の型でプレゼンを組み立てられる', 'グラフの動き（増える・減る・横ばい）を英語で言える', 'システムの構成を英語で説明できる', '答えられない質問にも落ち着いて対応できる'],
        lessons: [
          {
            title: 'プレゼンは「道しるべ」を立てる', min: 12, steps: [
              { t: 'talk', html: '英語のプレゼンで一番大事なのは、流ちょうさではありません。<b>聞いている人が、今どこにいるか迷わない</b>ことです。そのために、話の途中で<b>道しるべ</b>を立てます。' },
              { t: 'html', html: D.flow([['目的', "Today, I'd like to ...", '🎯'], ['流れの予告', 'First, ... Then, ...', '🗺️'], ['本題', 'Let me move on to ...', '📊'], ['まとめ', 'To sum up, ...', '🏁']], { cap: '道しるべを立てると、聞き手は迷わない' }) },
              { t: 'html', html: '<table class="tbl"><tr><th>場面</th><th>道しるべの表現</th></tr><tr><td>目的</td><td><span class="say">Today, I would like to explain our new inspection system.</span></td></tr><tr><td>流れの予告</td><td><span class="say">I will cover three points: the background, the design, and the results.</span></td></tr><tr><td>次へ</td><td><span class="say">Let\'s move on to the test results.</span></td></tr><tr><td>スライドの説明</td><td><span class="say">This slide shows the overall system configuration.</span></td></tr><tr><td>まとめ</td><td><span class="say">To sum up, the new system reduces inspection time by 40 percent.</span></td></tr></table>' },
              { t: 'key', front: 'プレゼンの最初に必ずすることは？', back: '目的と流れを予告する（I will cover three points: ...）' },
              { t: 'html', html: D.svg(`
<path d="M40 170 L40 20 M40 170 L580 170" class="l"/>
<polyline points="40,150 150,140 200,60 330,60 450,110 570,130" class="la" style="fill:none;stroke-width:3"/>
<text x="150" y="95" class="tm b ta">increase sharply</text><text x="265" y="48" class="tm b">level off</text><text x="510" y="100" class="tm b tr">decrease gradually</text>
<text x="95" y="135" class="tm s">rise slightly</text>`, 600, 180, 'グラフの動きは「動詞＋副詞」で言う') },
              { t: 'html', html: '<table class="tbl"><tr><th>グラフの動き</th><th>英語</th></tr><tr><td>急に増える／徐々に増える</td><td>increase sharply / gradually</td></tr><tr><td>減る</td><td>decrease / drop / fall</td></tr><tr><td>横ばい</td><td>remain stable / level off</td></tr><tr><td>一番高くなる</td><td>peak / reach a peak</td></tr></table>' },
              { t: 'q', q: { q: 'グラフで「その値は横ばいだった」に最も近いのは？', c: ['The value remained stable.', 'The value increased sharply.', 'The value dropped.', 'The value peaked suddenly.'], a: 0, why: ['', '急に増えた、です。', '下がった、です。', '急に頂点に達した、です。'], e: 'remain stable / level off ＝ 横ばい。' } },
            ],
          },
          {
            title: 'システムの説明と、質問への答え方', min: 12, steps: [
              { t: 'talk', html: 'エンジニアのプレゼンでは、<b>システムの構成</b>を説明する場面が必ずあります。使う型は3つです。' },
              { t: 'html', html: D.svg(`
<rect x="20" y="20" width="110" height="44" rx="8" class="l fa"/><text x="75" y="47" class="tm b">camera 1</text>
<rect x="20" y="90" width="110" height="44" rx="8" class="l fa"/><text x="75" y="117" class="tm b">camera 2</text>
<rect x="20" y="160" width="110" height="44" rx="8" class="l fw"/><text x="75" y="187" class="tm b">dome light</text>
<path d="M130 42 L240 100 M130 112 L240 112 M130 182 L240 124" class="l"/>
<rect x="240" y="80" width="140" height="60" rx="8" class="l fg"/><text x="310" y="106" class="tm b">industrial PC</text><text x="310" y="125" class="tm s">judges OK / NG</text>
<path d="M380 110 L470 110" class="l" marker-end="url(#ar)"/><text x="425" y="100" class="tm s">sends results to</text>
<rect x="470" y="85" width="100" height="50" rx="8" class="l f1"/><text x="520" y="115" class="tm b">PLC</text>`, 600, 214, 'The system consists of two cameras, a dome light, and an industrial PC.') },
              { t: 'html', html: '<ul><li><span class="say">The system consists of two cameras, a dome light, and an industrial PC.</span>（〜で構成される）</li><li><span class="say">The camera is triggered by a photoelectric sensor.</span>（〜によってトリガされる）</li><li><span class="say">The PC sends the result to the PLC within 200 milliseconds.</span></li></ul>' },
              { t: 'trap', html: '× The system <b>is consist of</b> ... → ○ The system <b>consists of</b> ...<br>consist of は「〜でできている」という動詞なので、受け身にしません。' },
              { t: 'key', front: '「〜で構成される」を英語で？', back: 'consist of（The system consists of ...）。is consist of は誤り' },
              { t: 'talk', html: '質疑応答が一番怖いですよね。でも、型を持っていれば大丈夫。ポイントは<b>すぐに答えなくていい</b>ということです。' },
              { t: 'html', html: '<table class="tbl"><tr><th>場面</th><th>表現</th></tr><tr><td>考える時間をもらう</td><td><span class="say">That\'s a good question.</span></td></tr><tr><td>質問を確かめる</td><td><span class="say">If I understand your question correctly, you are asking about the cycle time.</span></td></tr><tr><td>聞き返す</td><td><span class="say">Could you repeat the question, please?</span></td></tr><tr><td>その場で答えられない</td><td><span class="say">I don\'t have the exact number now. Let me check and get back to you.</span></td></tr></table>' },
              { t: 'key', front: 'その場で答えられない質問への対応は？', back: '確認して後で答えると約束する：Let me check and get back to you.' },
              { t: 'q', q: { q: 'その場で正確な数値が答えられない質問への、最も良い対応は？', c: ['Let me check and get back to you.', "I don't know.", 'That is not important.', 'Next question, please.'], a: 0, why: ['', 'それだけでは、相手は困ってしまいます。', '失礼です。', '質問から逃げています。'], e: '確認して後で答えると約束すれば、信頼されます。' } },
              { t: 'talk', html: '完璧な英語より、<b>ゆっくり・はっきり・数字を正確に</b>。そして、想定される質問を5つ考えて答えを準備しておく。これだけで、英語のプレゼンは怖くなくなりますよ。' },
            ],
          },
        ],
        qs: [
          { id: 'b1', lv: 1, q: 'プレゼンの最初に「流れを予告する」表現は？', c: ['I will cover three points: the background, the design, and the results.', 'Thank you for listening.', 'Any questions?', 'That is all.'], a: 0, why: ['', '最後に言う言葉です。', '最後に言う言葉です。', '最後に言う言葉です。'], e: '最初に全体を見せると、聞く人が迷いません。' },
          { id: 'b2', lv: 1, q: 'グラフで「急に増えた」を表すのは？', c: ['increased sharply', 'decreased gradually', 'remained stable', 'leveled off'], a: 0, why: ['', '徐々に減った、です。', '横ばい、です。', '横ばいになった、です。'], e: 'sharply ＝ 急に。' },
          { id: 'b3', lv: 1, q: '「その値は横ばいだった」は？', c: ['The value remained stable.', 'The value increased sharply.', 'The value dropped.', 'The value peaked suddenly.'], a: 0, why: ['', '急に増えた、です。', '下がった、です。', '急に頂点、です。'], e: 'remain stable ＝ 横ばい。' },
          { id: 's1', lv: 2, q: '「このシステムは2台のカメラと産業用PCで構成される」として正しいのは？', c: ['The system consists of two cameras and an industrial PC.', 'The system consists two cameras and an industrial PC.', 'The system is consist of two cameras.', 'The system consisting of two cameras.'], a: 0, why: ['', 'of が抜けています。', '受け身にはしません。', '動詞がなく、文になりません。'], e: 'consist of。' },
          { id: 's2', lv: 2, q: 'その場で正確な数値が答えられない質問への対応は？', c: ['Let me check and get back to you.', "I don't know.", 'That is not important.', 'Next question, please.'], a: 0, why: ['', '相手が困ります。', '失礼です。', '逃げています。'], e: '確認して後で答える。' },
          { id: 's3', lv: 2, t: 'order', q: '「カメラは光電センサによってトリガされる」', tokens: ['The', 'camera', 'is', 'triggered', 'by', 'a', 'photoelectric', 'sensor'], e: '受け身 be ＋ 過去分詞 ＋ by。' },
          { id: 'a1', lv: 3, t: 'speak', q: '声に出して言ってみよう', text: 'This slide shows the overall system configuration.', ja: 'このスライドはシステム全体の構成を示しています。', e: 'スライドの説明の定番の書き出し。' },
          { id: 'a2', lv: 3, t: 'dict', q: '聞こえた通りに書き取ろう', audio: 'The defect rate dropped from two percent to zero point five percent.', e: '数字の聞き取り。zero point five ＝ 0.5。' },
          { id: 'a3', lv: 3, q: '質問の意味に自信がないとき、最も良い対応は？', c: ['If I understand your question correctly, you are asking about the cycle time.', 'Yes, yes.', 'I think so.', '分かったふりをして答える'], a: 0, why: ['', '相づちだけでは答えになりません。', 'あいまいです。', '質問とずれた答えになる危険があります。'], e: '質問を言い直して確かめてから答えます。' },
          { id: 'a4', lv: 3, t: 'speak', q: '声に出して言ってみよう', text: 'To sum up, the new system reduces inspection time by forty percent.', ja: 'まとめると、新しいシステムは検査時間を40パーセント短くします。', e: 'まとめは数字で締めると印象に残ります。' },
        ],
        missions: [
          {
            title: '自分の仕事を3分で英語プレゼンする', time: '1〜2時間',
            why: '一度でも英語でプレゼンをやり切ると、次からの自信がまるで違います。',
            steps: ['自分の仕事（装置・システム）を説明するスライドを3〜5枚作る', 'スライドごとに、道しるべの表現を使って言うことを英語で書く', 'システムの構成を consist of / is triggered by で説明する文を入れる', '想定される質問を3つ考え、答え方を準備する（答えられないものは Let me check...）', '録音・録画して聞き直し、ゆっくり・はっきり・数字が正確か確かめる'],
            deliverable: 'スライドと原稿、録音（または録画）',
            criteria: ['目的と流れの予告で始めた', 'システムの構成を英語で説明できた', '質問への答え方を準備した', '録音して聞き直した'],
          },
        ],
      },
    ],
    decks: [
      {
        id: 'toeic', title: 'TOEIC頻出 必修語', say: true, desc: 'TOEIC 600〜850 で繰り返し出る重要語。例文ごと音で覚えよう。',
        cards: [
          ['submit', '提出する', 'Please submit the report by Friday.'],
          ['postpone', '延期する', 'The meeting was postponed until next week.'],
          ['available', '利用できる・手が空いている', 'Are you available this afternoon?'],
          ['expand', '拡大する', 'The company plans to expand its operations in Asia.'],
          ['negotiate', '交渉する', 'We need to negotiate the price with the supplier.'],
          ['estimate', '見積もり／見積もる', 'Could you send us a cost estimate?'],
          ['inventory', '在庫', 'We need to check the inventory before ordering.'],
          ['invoice', '請求書', 'The invoice is attached to this e-mail.'],
          ['reimburse', '払い戻す・経費精算する', 'Travel expenses will be reimbursed.'],
          ['revenue', '収益', 'Revenue increased by 12% this year.'],
          ['quarter', '四半期', 'Sales were strong in the third quarter.'],
          ['merger', '合併', 'The merger was announced yesterday.'],
          ['deadline', '締め切り', 'The deadline has been extended.'],
          ['agenda', '議題・議事日程', "Let's move on to the next item on the agenda."],
          ['attend', '出席する', 'All staff must attend the safety training.'],
          ['hire', '雇う', 'We are hiring two new engineers.'],
          ['applicant', '応募者', 'Applicants must submit a résumé.'],
          ['qualified', '資格のある・適任の', 'She is highly qualified for the position.'],
          ['promote', '昇進させる・販売促進する', 'He was promoted to manager.'],
          ['resign', '辞職する', 'The director resigned last month.'],
          ['brochure', 'パンフレット', 'Please take a brochure at the entrance.'],
          ['warranty', '保証', 'The product comes with a two-year warranty.'],
          ['defective', '欠陥のある', 'We will replace any defective items.'],
          ['refund', '返金', 'You can request a full refund within 30 days.'],
          ['shipment', '発送・積み荷', 'The shipment will arrive on Monday.'],
          ['delay', '遅れ／遅らせる', 'We apologize for the delay.'],
          ['confirm', '確認する', 'Could you confirm your reservation?'],
          ['reservation', '予約', 'I would like to make a reservation for two.'],
          ['venue', '会場', 'The venue for the conference has changed.'],
          ['renovation', '改装', 'The lobby is closed for renovation.'],
          ['facility', '施設', 'The new facility will open in May.'],
          ['maintenance', '保守・メンテナンス', 'The system will be down for maintenance.'],
          ['malfunction', '故障・不具合', 'The printer malfunctioned again.'],
          ['implement', '実行する・導入する', 'We will implement the new policy next month.'],
          ['efficient', '効率的な', 'The new process is more efficient.'],
          ['comprehensive', '包括的な', 'We offer a comprehensive training program.'],
          ['mandatory', '義務的な', 'Attendance is mandatory.'],
          ['eligible', '資格がある', 'Employees are eligible for the bonus.'],
          ['approximately', 'およそ', 'The trip takes approximately three hours.'],
          ['previously', '以前に', 'As previously mentioned, the price will change.'],
          ['subsequently', 'その後', 'The plan was subsequently approved.'],
          ['accommodate', '収容する・対応する', 'The hall can accommodate 300 people.'],
          ['allocate', '割り当てる', 'We allocated more budget to research.'],
          ['anticipate', '予期する', 'We anticipate strong demand.'],
          ['commute', '通勤（する）', 'My commute takes one hour.'],
          ['patron', '常連客・利用者', 'Library patrons must show their card.'],
          ['proceed', '進む・続行する', 'Please proceed to gate 12.'],
          ['regarding', '〜に関して', 'I have a question regarding the contract.'],
          ['tentative', '仮の', 'This is a tentative schedule.'],
          ['outstanding', '未払いの・傑出した', 'Please pay the outstanding balance.'],
          ['acquire', '獲得する・買収する', 'The company acquired a small startup.'],
          ['adjacent', '隣接した', 'The parking lot is adjacent to the building.'],
          ['amend', '修正する', 'We need to amend the contract.'],
          ['appliance', '家電製品', 'The store sells kitchen appliances.'],
          ['assess', '評価する', 'We will assess the risks first.'],
          ['attire', '服装', 'Business attire is required.'],
          ['audit', '監査', 'The annual audit starts next week.'],
          ['beverage', '飲み物', 'Food and beverages are not allowed.'],
          ['bulk', '大量（の）', 'We offer discounts on bulk orders.'],
          ['candidate', '候補者', 'We interviewed three candidates.'],
          ['clarify', '明確にする', 'Could you clarify your question?'],
          ['complimentary', '無料の', 'Complimentary breakfast is included.'],
          ['consecutive', '連続した', 'Sales grew for three consecutive years.'],
          ['contractor', '請負業者', 'The contractor will finish the work in May.'],
          ['delegate', '任せる', 'Managers should delegate tasks.'],
          ['dispatch', '発送する', 'Your order was dispatched today.'],
          ['enclose', '同封する', 'Please find the form enclosed.'],
          ['endorse', '支持する・推薦する', 'The plan was endorsed by the board.'],
          ['expedite', '早める', 'Can you expedite the shipment?'],
          ['fluctuate', '変動する', 'Prices fluctuate every month.'],
          ['incentive', '奨励金・動機', 'Employees receive a sales incentive.'],
          ['itinerary', '旅程表', 'I will send you the itinerary.'],
          ['launch', '発売する・開始する', 'We will launch the product in June.'],
          ['liability', '責任・負債', 'The company has limited liability.'],
          ['lucrative', '儲かる', 'It is a lucrative market.'],
          ['obtain', '得る', 'You must obtain permission first.'],
          ['overdue', '期限切れの', 'The payment is overdue.'],
          ['personnel', '人員・人事部', 'Only authorized personnel may enter.'],
          ['postage', '郵送料', 'Postage is included in the price.'],
          ['premises', '敷地・構内', 'Smoking is not allowed on the premises.'],
          ['prospective', '見込みのある', 'We met with prospective clients.'],
          ['quota', '割り当て・ノルマ', 'She met her sales quota.'],
          ['receipt', '領収書・受領', 'Please keep your receipt.'],
          ['relocate', '移転する', 'The office will relocate to Osaka.'],
          ['retail', '小売り', 'He works in retail.'],
          ['revise', '改訂する', 'We revised the schedule.'],
          ['stationery', '文房具', 'Order stationery from the supplier.'],
          ['streamline', '合理化する', 'We streamlined the process.'],
          ['subsidiary', '子会社', 'It is a subsidiary of a German company.'],
          ['substantial', '相当な', 'There was a substantial increase.'],
          ['supervisor', '上司・監督者', 'Please ask your supervisor.'],
          ['surplus', '余剰', 'We have a budget surplus.'],
          ['transaction', '取引', 'The transaction was completed.'],
          ['undergo', '受ける・経験する', 'The building will undergo renovation.'],
          ['utility', '公共料金・実用性', 'Utilities are included in the rent.'],
          ['vacancy', '空き・欠員', 'We have a vacancy in sales.'],
          ['vendor', '販売業者', 'We compared several vendors.'],
          ['verify', '確認する', 'Please verify your address.'],
          ['waive', '免除する', 'The fee will be waived.'],
          ['withdraw', '引き出す・撤回する', 'He withdrew his application.'],
        ],
      },
      {
        id: 'biz', title: 'ビジネス定番フレーズ', say: true, desc: 'メール・会議・電話でそのまま使える表現。',
        cards: [
          ["I'm writing to follow up on...", '〜の件でご連絡しています（フォローアップ）', "I'm writing to follow up on our call yesterday."],
          ['Please find attached...', '〜を添付いたします', 'Please find attached the quotation.'],
          ['I would appreciate it if you could...', '〜していただけるとありがたいです', 'I would appreciate it if you could reply by Monday.'],
          ['Could you please confirm...?', '〜をご確認いただけますか', 'Could you please confirm the delivery date?'],
          ['Let me get back to you on that.', 'その件は確認して改めてご連絡します', ''],
          ['Just to clarify,...', '確認ですが、', 'Just to clarify, is the budget fixed?'],
          ['Could you elaborate on that?', 'その点を詳しく説明いただけますか', ''],
          ['I see your point, but...', 'おっしゃることはわかりますが、', "I see your point, but the schedule is tight."],
          ["I'm afraid...", '残念ながら／恐縮ですが', "I'm afraid we can't meet that deadline."],
          ['To sum up,...', 'まとめると、', 'To sum up, we will start testing next week.'],
          ["Let's move on to...", '次は〜に移りましょう', "Let's move on to the next topic."],
          ['as soon as possible', 'できるだけ早く', 'Please send it as soon as possible.'],
          ['I apologize for the inconvenience.', 'ご不便をおかけして申し訳ありません', ''],
          ['Thank you for your prompt reply.', '迅速なご返信ありがとうございます', ''],
          ['Please let me know if you have any questions.', 'ご質問があればお知らせください', ''],
          ["I'll keep you posted.", '進捗を随時お知らせします', ''],
          ['on schedule / behind schedule', '予定通り／予定より遅れて', 'The project is on schedule.'],
          ['Could you walk me through...?', '〜を順を追って説明していただけますか', 'Could you walk me through the process?'],
          ['in charge of', '〜の担当で', 'I am in charge of the vision system.'],
          ['Let me share my screen.', '画面を共有します', ''],
        ],
      },
      {
        id: 'tech', title: '技術・論文英単語', say: true, desc: 'AI・画像検査・論文で頻出の語彙。',
        cards: [
          ['accuracy', '精度・正確さ', 'The model achieved 95% accuracy.'],
          ['precision', '適合率・精密さ', 'Precision is more important than recall here.'],
          ['throughput', 'スループット（処理量）', 'The system has a throughput of 120 parts per minute.'],
          ['latency', '遅延時間', 'Inference latency is under 10 milliseconds.'],
          ['resolution', '解像度・分解能', 'We need a higher resolution camera.'],
          ['illumination', '照明', 'Uniform illumination is essential.'],
          ['exposure', '露光', 'Reduce the exposure time to avoid motion blur.'],
          ['defect', '欠陥', 'The system detects surface defects.'],
          ['anomaly', '異常', 'Anomaly detection uses only normal images.'],
          ['annotation', '注釈付け・ラベル付け', 'Annotation quality affects the model.'],
          ['dataset', 'データセット', 'The dataset contains 10,000 images.'],
          ['inference', '推論', 'Inference runs on an edge device.'],
          ['deploy', '展開する・実装する', 'We deployed the model on the production line.'],
          ['optimize', '最適化する', 'We optimized the model with TensorRT.'],
          ['quantization', '量子化', 'INT8 quantization reduced the model size.'],
          ['robust', '頑健な', 'The method is robust to lighting changes.'],
          ['feasible', '実現可能な', 'Is it feasible to inspect at this speed?'],
          ['specification', '仕様', 'Please check the camera specification.'],
          ['tolerance', '公差・許容差', 'The tolerance is plus or minus 0.05 mm.'],
          ['calibration', '校正・キャリブレーション', 'Camera calibration is required.'],
          ['interface', 'インタフェース', 'The camera uses a GigE Vision interface.'],
          ['bandwidth', '帯域幅', 'The bandwidth is not sufficient.'],
          ['trigger', 'トリガ（撮像の合図）', 'The sensor sends a trigger to the camera.'],
          ['propose', '提案する', 'We propose a novel method.'],
          ['outperform', '〜を上回る', 'Our method outperforms the baseline.'],
          ['state-of-the-art', '最先端の', 'It achieves state-of-the-art results.'],
          ['evaluate', '評価する', 'We evaluate the model on three datasets.'],
          ['demonstrate', '実証する', 'The experiments demonstrate its effectiveness.'],
          ['limitation', '限界・制約', 'One limitation of this study is the small dataset.'],
          ['trade-off', 'トレードオフ', 'There is a trade-off between speed and accuracy.'],
          ['empirical', '実験に基づく', 'We provide empirical evidence.'],
          ['novel', '新規の', 'This is a novel approach.'],
          ['significantly', '大幅に・有意に', 'The error was significantly reduced.'],
          ['respectively', 'それぞれ', 'The scores were 90% and 85%, respectively.'],
          ['hypothesis', '仮説', 'The results support our hypothesis.'],
        ],
      },
      {
        id: 'phrasal', title: '句動詞（仕事で使う）', say: true, desc: 'ネイティブが多用する「動詞＋前置詞・副詞」。会話とメールで頻出。',
        cards: [
          ['set up', '設置する・準備する', 'We set up the camera yesterday.'],
          ['figure out', '解明する・理解する', 'We need to figure out the cause.'],
          ['carry out', '実施する', 'We carried out a test on Line 2.'],
          ['come up with', '（案を）思いつく', 'She came up with a better idea.'],
          ['run into', '（問題に）直面する', 'We ran into a problem with the software.'],
          ['look into', '調査する', 'I will look into the issue.'],
          ['deal with', '対処する', 'How should we deal with this error?'],
          ['put off', '延期する', 'The meeting was put off until Friday.'],
          ['call off', '中止する', 'They called off the event.'],
          ['follow up', 'フォローアップする', 'I will follow up with the client.'],
          ['point out', '指摘する', 'He pointed out a mistake in the drawing.'],
          ['find out', '（調べて）知る', 'Let me find out the price.'],
          ['go over', '見直す・確認する', 'Let\'s go over the schedule.'],
          ['fill out', '（用紙に）記入する', 'Please fill out this form.'],
          ['turn down', '断る', 'They turned down our offer.'],
          ['take over', '引き継ぐ', 'Ken will take over the project.'],
          ['back up', 'バックアップする・支持する', 'Please back up the data.'],
          ['shut down', '停止する', 'Shut down the PC before moving it.'],
          ['break down', '故障する', 'The conveyor broke down this morning.'],
          ['catch up', '追いつく', 'I need to catch up on my e-mails.'],
          ['get back to', '改めて連絡する', 'I will get back to you tomorrow.'],
          ['hand in', '提出する', 'Please hand in the report by noon.'],
          ['sort out', '解決する・整理する', 'We sorted out the problem.'],
          ['phase out', '段階的に廃止する', 'The old model will be phased out.'],
          ['scale up', '規模を拡大する', 'We plan to scale up production.'],
        ],
      },
      {
        id: 'roots', title: '語根・接頭辞で覚える', say: true, desc: '部品の意味から単語を推測する力をつける。',
        cards: [
          ['inspect', '検査する（in 中を + spect 見る）', 'We inspect every part.'],
          ['perspective', '視点（per 通して + spect 見る）', 'From a cost perspective, it is better.'],
          ['transport', '輸送する（trans 越えて + port 運ぶ）', 'The parts are transported by truck.'],
          ['portable', '持ち運べる（port 運ぶ + able できる）', 'This is a portable device.'],
          ['submit', '提出する（sub 下に + mit 送る）', 'Submit the form online.'],
          ['transmit', '送信する（trans 向こうへ + mit 送る）', 'The camera transmits images to the PC.'],
          ['emission', '排出（e 外へ + miss 送る）', 'We must reduce emissions.'],
          ['predict', '予測する（pre 前に + dict 言う）', 'It is hard to predict demand.'],
          ['contradict', '矛盾する（contra 反対に + dict 言う）', 'The results contradict the theory.'],
          ['construct', '建設する（con 共に + struct 建てる）', 'They will construct a new plant.'],
          ['instruction', '指示（in 中に + struct 建てる）', 'Follow the instructions carefully.'],
          ['reduce', '減らす（re 元へ + duce 導く）', 'We reduced the cycle time.'],
          ['conduct', '実施する（con 共に + duct 導く）', 'We conducted a survey.'],
          ['reject', '不合格にする（re 戻して + ject 投げる）', 'The system rejects defective parts.'],
          ['project', '計画・投影する（pro 前に + ject 投げる）', 'The light projects a pattern.'],
          ['transform', '変換する（trans 越えて + form 形）', 'The data is transformed into a graph.'],
          ['interval', '間隔（inter 間 + val）', 'Images are captured at 10 ms intervals.'],
          ['interface', '接点（inter 間 + face 面）', 'The camera has a GigE interface.'],
          ['prevent', '防ぐ（pre 前に + vent 来る）', 'This prevents errors.'],
          ['revise', '改訂する（re 再び + vise 見る）', 'Please revise the document.'],
          ['disconnect', '切断する（dis 否定 + connect）', 'Disconnect the power first.'],
          ['overestimate', '過大評価する（over 過度に + estimate）', 'We overestimated the demand.'],
          ['cooperate', '協力する（co 共に + operate 働く）', 'Thank you for cooperating.'],
          ['subsystem', '下位システム（sub 下 + system）', 'The lighting subsystem is ready.'],
        ],
      },
    ],
    exams: [
      {
        id: 'toeic-mini', title: 'TOEIC形式 ミニ模試', minutes: 25, score: 'toeic',
        sections: [
          { title: 'Listening（応答・会話・書き取り）', part: 'L', units: ['en-listen', 'en-part34', 'en-sound', 'en-biz', 'en-global'], types: ['mc', 'dict'], count: 12 },
          { title: 'Reading Part 5（文法・語彙）', part: 'R', units: ['en-toeic5', 'en-tense', 'en-noun', 'en-modal', 'en-verbal', 'en-clause', 'en-vocab', 'en-ifcomp'], types: ['mc'], count: 18 },
          { title: 'Reading Part 6/7（読解）', part: 'R', units: ['en-reading', 'en-reading2', 'en-paper'], types: ['mc'], count: 6 },
        ],
      },
      {
        id: 'toeic-half', title: 'TOEIC形式 ハーフ模試', minutes: 50, score: 'toeic',
        sections: [
          { title: 'Listening Part 2（応答）', part: 'L', units: ['en-listen'], types: ['mc'], count: 12 },
          { title: 'Listening Part 3/4（会話・説明文）', part: 'L', units: ['en-part34'], types: ['mc'], count: 12 },
          { title: 'Listening（書き取り）', part: 'L', units: ['en-sound', 'en-biz', 'en-global', 'en-present'], types: ['dict'], count: 4 },
          { title: 'Reading Part 5（文法・語彙）', part: 'R', units: ['en-toeic5', 'en-tense', 'en-noun', 'en-modal', 'en-verbal', 'en-clause', 'en-vocab', 'en-ifcomp', 'en-writing'], types: ['mc'], count: 30 },
          { title: 'Reading Part 6/7（読解）', part: 'R', units: ['en-reading', 'en-reading2', 'en-paper'], types: ['mc'], count: 16 },
        ],
      },
    ],
  });
})();
