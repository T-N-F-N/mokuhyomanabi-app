/* =========================================================
 * 日本史コースの道具箱（LearnApp.H）と「日本史ナビ」（#/jhist）
 * - H.manga / H.chain / H.map / H.tl / H.people / H.scene：レッスンで使う漫画・図・アニメーション
 * - EV：できごとと「原因 → 結果」のつながりデータ。ナビの流れアニメ・つながりマップ・テーマの線・並べ替えで使う
 * 教材（courses/jhist-*.js）より先に読み込む。
 * ========================================================= */
(function () {
  'use strict';
  const App = window.LearnApp, K = App.kit;
  const { $, $$, esc, shuffle } = K;
  const view = () => K.view();
  const H = (App.H = {});

  /* ---------- 時代とできごと ---------- */
  // [id, 名前, 始まりの年, 色, ユニット]
  const ERAS = [
    ['jomon', '縄文〜古墳', -14000, '#e2c29f', 'jh-ancient'], ['asuka', '飛鳥', 592, '#b4dfc3', 'jh-asuka'], ['nara', '奈良', 710, '#f6cdb2', 'jh-nara'],
    ['heian', '平安', 794, '#f3bfcc', 'jh-heian'], ['kamakura', '鎌倉', 1185, '#bccdee', 'jh-kamakura'], ['muromachi', '室町', 1333, '#d0bfe8', 'jh-muromachi'],
    ['azuchi', '安土桃山', 1573, '#f5dc8a', 'jh-sengoku'], ['edo', '江戸', 1603, '#a9dad8', 'jh-edo1'], ['meiji', '明治', 1868, '#eeb0a8', 'jh-meiji'],
    ['taisho', '大正・昭和戦前', 1912, '#c3cbd4', 'jh-taisho'], ['sengo', '戦後', 1946, '#b5d99c', 'jh-postwar'],
  ];
  const eraOf = (y) => { let e = ERAS[0]; ERAS.forEach((x) => { if (y >= x[2]) e = x; }); return e; };
  H.ERAS = ERAS;
  H.eraOf = eraOf;
  // テーマ
  const THEMES = { seiji: ['👑', '政治の担い手', '天皇・豪族 → 貴族 → 上皇 → 武士 → 政党 → 軍部 → 国民。「誰が国を動かしたか」の線'], tochi: ['🌾', '土地と税', '公地公民 → 荘園 → 守護・地頭 → 太閤検地 → 地租改正 → 農地改革。「誰が土地を持ち、誰が税を取るか」の線'], gaiko: ['🌏', '外交と戦争', '中国の権威 → 遣隋使・遣唐使 → 元寇 → 鎖国 → 開国 → 条約改正 → 戦争と平和'], keizai: ['💰', '経済と社会', '稲作 → 貨幣経済 → 一揆 → 商業 → 産業革命 → 恐慌 → 高度成長'], bunka: ['🎨', '文化', '外国の影響を受ける時期と、日本風に消化する時期が交互にくる'] };
  H.THEMES = THEMES;

  // できごと：id, 年(数), 年の表示, 名前, 絵文字, ユニット, つながる先[], テーマ[], ひとこと
  const RAW = [
    ['jomon', -14000, '約1万6000年前〜', '縄文時代：土器と定住', '🏺', 'jh-ancient', ['rice'], ['bunka', 'keizai'], '狩り・漁・採集のくらし。土器で煮炊きし、竪穴住居に住んで定住が始まる'],
    ['rice', -400, '紀元前4世紀ごろ（さらに古いとする説も）', '稲作が広まる（弥生時代）', '🌾', 'jh-ancient', ['kuni'], ['keizai', 'tochi'], '米をたくわえられる → 貧富と身分の差 → ムラどうしの争い → クニへ'],
    ['kuni', 57, '57年', '奴国王が後漢から金印を受ける', '🥇', 'jh-ancient', ['himiko'], ['gaiko'], '小さなクニの王が、中国皇帝の権威を借りて地位を固める'],
    ['himiko', 239, '239年', '卑弥呼が魏に使いを送る', '👸', 'jh-ancient', ['kofun'], ['gaiko', 'seiji'], '邪馬台国の女王。「親魏倭王」の称号と銅鏡を受け、クニグニをまとめる'],
    ['kofun', 300, '3世紀後半〜', '前方後円墳とヤマト政権', '⛰️', 'jh-ancient', ['shotoku'], ['seiji', 'bunka'], '巨大な古墳は大王（おおきみ）の力の証。近畿の豪族連合が各地に広がる'],
    ['toraijin', 450, '4〜6世紀', '渡来人と仏教の伝来', '⛵', 'jh-ancient', ['shotoku'], ['gaiko', 'bunka'], '漢字・須恵器・機織りが伝わる。仏教は6世紀半ば（538年説・552年説）に百済から'],
    ['shotoku', 593, '593年', '厩戸王（聖徳太子）が政治に参加', '📜', 'jh-asuka', ['kenzui'], ['seiji'], '推古天皇のもと蘇我馬子と協力。冠位十二階・憲法十七条で天皇中心の国をめざす'],
    ['kenzui', 607, '607年', '遣隋使（小野妹子）', '⛵', 'jh-asuka', ['isshi'], ['gaiko'], '中国と対等の立場をめざす国書。制度と仏教文化を学ぶ'],
    ['isshi', 645, '645年', '乙巳の変 → 大化の改新', '🗡️', 'jh-asuka', ['hakuson', 'taiho'], ['seiji', 'tochi'], '中大兄皇子と中臣鎌足が蘇我氏を倒す。土地と人を国のものにする方針へ'],
    ['hakuson', 663, '663年', '白村江の戦いで唐・新羅に大敗', '⚓', 'jh-asuka', ['jinshin', 'taiho'], ['gaiko'], '攻められる恐怖 → 水城・山城で国防、国内の体制づくりを急ぐ'],
    ['jinshin', 672, '672年', '壬申の乱 → 天武天皇', '⚔️', 'jh-asuka', ['taiho'], ['seiji'], '勝った天武天皇が強い権力で中央集権を進める'],
    ['taiho', 701, '701年', '大宝律令', '⚖️', 'jh-asuka', ['heijo', 'handen'], ['seiji', 'tochi'], '律（刑法）と令（行政のきまり）がそろい、律令国家が完成'],
    ['heijo', 710, '710年', '平城京に都を移す', '🏯', 'jh-nara', ['tenpyo'], ['seiji', 'bunka'], '唐の都・長安にならった都。奈良時代の始まり'],
    ['handen', 715, '8世紀', '班田収授と租・庸・調', '🧺', 'jh-nara', ['sanze'], ['tochi'], '6歳以上に口分田を与えて税を取る。人口が増えると田が足りなくなる'],
    ['sanze', 723, '723年', '三世一身法', '🧑‍🌾', 'jh-nara', ['konden'], ['tochi'], '開墾をすすめるため、新しく開いた田は3代まで私有を認める'],
    ['konden', 743, '743年', '墾田永年私財法', '🏞️', 'jh-nara', ['shoen', 'bushi'], ['tochi'], '開墾地の永久私有を認める → 公地公民がくずれ、荘園が生まれる'],
    ['daibutsu', 745, '743年 詔・752年 開眼', '大仏造立（聖武天皇）', '🙏', 'jh-nara', ['tenpyo', 'heian'], ['bunka', 'seiji'], '疫病や反乱が続き、仏教の力で国を守ろうとした（鎮護国家）'],
    ['tenpyo', 752, '8世紀中ごろ', '天平文化（正倉院・万葉集）', '🎼', 'jh-nara', ['kokufu'], ['bunka'], '唐の影響が強い、国際色ゆたかな文化'],
    ['heian', 794, '794年', '平安京に都を移す（桓武天皇）', '🏯', 'jh-heian', ['sekkan'], ['seiji'], '寺院の力が強い奈良を離れ、政治を立て直す'],
    ['kento', 894, '894年', '遣唐使の停止（菅原道真の提案）', '🚫', 'jh-heian', ['kokufu'], ['gaiko', 'bunka'], '唐の衰え。以後、日本風の文化が育つ'],
    ['bushi', 939, '935〜941年', '平将門・藤原純友の乱（武士の成長）', '🏇', 'jh-heian', ['heishi'], ['seiji'], '土地を守る武装集団が力をつけ、朝廷も武士の力を頼るように'],
    ['shoen', 1000, '10〜11世紀', '寄進地系荘園が広がる', '🗺️', 'jh-heian', ['enkyu', 'genpei'], ['tochi'], '有力者に寄進して税を逃れる。不輸・不入の権で国の支配が届かない土地に'],
    ['kokufu', 1005, '10〜11世紀', '国風文化（かな文字・源氏物語）', '📖', 'jh-heian', ['kamabunka'], ['bunka'], 'かな文字で日本人の感情を表す文学が花開く'],
    ['sekkan', 1016, '10〜11世紀（頂点は道長・頼通）', '摂関政治（藤原道長）', '🏮', 'jh-heian', ['insei'], ['seiji'], '娘を天皇のきさきにし、外戚（母方の親戚）として摂政・関白になる'],
    ['enkyu', 1069, '1069年', '延久の荘園整理令（後三条天皇）', '📏', 'jh-heian', ['insei'], ['tochi', 'seiji'], '摂関家の荘園も整理 → 摂関家と関係の薄い天皇が力を取り戻す'],
    ['insei', 1086, '1086年', '白河上皇の院政', '🧓', 'jh-heian', ['heishi'], ['seiji'], '位をゆずった上皇が実権をにぎる。武士（北面の武士）を使う'],
    ['heishi', 1167, '1156〜1167年', '保元・平治の乱 → 平清盛が太政大臣', '🔥', 'jh-heian', ['genpei'], ['seiji'], '朝廷の争いを武士が決着 → 武士が政治の中心へ'],
    ['genpei', 1185, '1185年', '平氏滅亡（壇ノ浦）・守護と地頭', '🏹', 'jh-kamakura', ['kamakura'], ['seiji', 'tochi'], '源頼朝が全国に守護・地頭を置く → 武士が土地を支配する仕組み'],
    ['kamakura', 1192, '1192年', '源頼朝が征夷大将軍に', '🏯', 'jh-kamakura', ['jokyu'], ['seiji'], '将軍と御家人は「御恩と奉公」で結ばれる'],
    ['kamabunka', 1203, '13世紀', '鎌倉文化と新しい仏教', '🗿', 'jh-kamakura', ['kitayama'], ['bunka'], '武士と民衆にわかりやすい仏教、力強い彫刻（東大寺南大門の金剛力士像）'],
    ['jokyu', 1221, '1221年', '承久の乱', '⚡', 'jh-kamakura', ['goseibai'], ['seiji'], '後鳥羽上皇が敗れる → 六波羅探題を置き、幕府の力が西国にも'],
    ['goseibai', 1232, '1232年', '御成敗式目（北条泰時）', '📘', 'jh-kamakura', ['buke'], ['seiji'], '武士の慣習をもとにした初めての武家法。執権政治が安定'],
    ['kokusho', 1268, '1268年', 'フビライの国書を幕府が無視（北条時宗）', '📨', 'jh-kamakura', ['genko'], ['gaiko'], 'モンゴル帝国（元）が日本に服属を求める国書を送るが、幕府は返事をせず防備を固める'],
    ['genko', 1274, '1274年・1281年', '元寇（文永の役・弘安の役）', '🌊', 'jh-kamakura', ['tokusei'], ['gaiko'], '守り切っても新しい土地は得られない → 御家人に恩賞を出せない'],
    ['tokusei', 1297, '1297年', '永仁の徳政令', '📜', 'jh-kamakura', ['kemmu'], ['keizai', 'seiji'], '御家人の借金を帳消しにするが、かえって混乱 → 幕府への不満'],
    ['kemmu', 1334, '1334年', '建武の新政（後醍醐天皇）', '👑', 'jh-muromachi', ['nanboku'], ['seiji'], '鎌倉幕府を倒すが、公家中心の政治に武士が不満'],
    ['nanboku', 1336, '1336年', '南北朝の対立が始まる', '⚔️', 'jh-muromachi', ['yoshimitsu'], ['seiji'], '足利尊氏が北朝を立て、後醍醐天皇は吉野へ（南朝）'],
    ['yoshimitsu', 1392, '1392年', '南北朝の合一（足利義満）', '🏯', 'jh-muromachi', ['kango', 'kitayama'], ['seiji'], '義満の時代に室町幕府は全盛期'],
    ['kitayama', 1397, '14世紀末', '北山文化（金閣・能）', '✨', 'jh-muromachi', ['higashiyama'], ['bunka'], '公家文化と武家文化の融合。観阿弥・世阿弥が能を大成'],
    ['kango', 1404, '1404年', '日明貿易（勘合貿易）', '🚢', 'jh-muromachi', ['ikki'], ['gaiko', 'keizai'], '勘合で倭寇と区別。明銭が大量に入り、貨幣経済が進む'],
    ['ikki', 1428, '1428年', '正長の土一揆', '🔨', 'jh-muromachi', ['ounin'], ['keizai', 'seiji'], '惣村で団結した農民が、借金の帳消し（徳政）を求めて立ち上がる'],
    ['ounin', 1467, '1467〜1477年', '応仁の乱', '🔥', 'jh-muromachi', ['gekokujo', 'higashiyama'], ['seiji'], '将軍のあとつぎ争い＋有力守護の対立 → 京都が焼け、幕府の権威が失墜'],
    ['gekokujo', 1488, '15世紀末〜', '下剋上と戦国大名（加賀の一向一揆など）', '🐉', 'jh-sengoku', ['teppo', 'nobunaga'], ['seiji'], '実力のある者が上の者を倒す時代。戦国大名は分国法で領国を治める'],
    ['higashiyama', 1489, '15世紀後半', '東山文化（銀閣・書院造）', '🍵', 'jh-muromachi', ['momoyama'], ['bunka'], '足利義政の時代。わび・さびの美、今の和室のもと'],
    ['teppo', 1543, '1543年', '鉄砲伝来（種子島）', '🔫', 'jh-sengoku', ['nagashino'], ['gaiko'], 'ポルトガル人が伝える → 戦い方が変わり、統一が早まる'],
    ['xavier', 1549, '1549年', 'ザビエルがキリスト教を伝える', '✝️', 'jh-sengoku', ['bateren'], ['gaiko', 'bunka'], '南蛮貿易と一体で布教。九州の大名にも信者が出る'],
    ['nobunaga', 1573, '1573年', '織田信長が室町幕府を滅ぼす', '🔥', 'jh-sengoku', ['nagashino', 'momoyama'], ['seiji'], '将軍足利義昭を追放。楽市・楽座で商工業を活発に'],
    ['nagashino', 1575, '1575年', '長篠の戦い', '💥', 'jh-sengoku', ['honnoji'], ['seiji'], '鉄砲を大量に使い、武田軍に勝つ'],
    ['momoyama', 1576, '16世紀後半', '桃山文化（城・茶の湯）', '🏯', 'jh-sengoku', ['genroku'], ['bunka'], '天守のある城、狩野永徳の障壁画、千利休の茶の湯'],
    ['honnoji', 1582, '1582年', '本能寺の変 → 秀吉が後継者に', '🔥', 'jh-sengoku', ['taiko'], ['seiji'], '信長が明智光秀に倒され、羽柴（豊臣）秀吉が天下統一を進める'],
    ['taiko', 1583, '1582年〜', '太閤検地', '📐', 'jh-sengoku', ['katana', 'chiso'], ['tochi'], '全国の田畑を同じ基準で測り、石高で表す → 荘園のしくみが完全に消える'],
    ['bateren', 1587, '1587年', 'バテレン追放令', '🚫', 'jh-sengoku', ['sakoku', 'shimabara'], ['gaiko'], '宣教師を国外追放（ただし貿易は続けたので不徹底）'],
    ['katana', 1588, '1588年', '刀狩令', '🗡️', 'jh-sengoku', ['edobakufu'], ['seiji', 'tochi'], '農民から武器を取り上げる → 兵農分離、身分がはっきり分かれる'],
    ['chosen', 1592, '1592年・1597年', '朝鮮出兵（文禄・慶長の役）', '⚓', 'jh-sengoku', ['sekigahara'], ['gaiko'], '大名の負担が大きく、豊臣政権が弱まる'],
    ['sekigahara', 1600, '1600年', '関ヶ原の戦い', '⚔️', 'jh-edo1', ['edobakufu'], ['seiji'], '徳川家康が石田三成らに勝利'],
    ['edobakufu', 1603, '1603年', '徳川家康が江戸幕府を開く', '🏯', 'jh-edo1', ['buke'], ['seiji'], '幕府と藩が土地と人を治める幕藩体制'],
    ['buke', 1615, '1615年', '武家諸法度・一国一城令', '📘', 'jh-edo1', ['sankin'], ['seiji'], '大坂の陣で豊臣氏が滅び、大名を法で統制する'],
    ['sankin', 1635, '1635年', '参勤交代の制度化（徳川家光）', '🚶', 'jh-edo1', ['kyoho'], ['seiji', 'keizai'], '大名は江戸と領地を1年おきに往復。出費は大きいが、街道と江戸が発展'],
    ['shimabara', 1637, '1637年', '島原の乱（島原・天草一揆）', '✝️', 'jh-edo1', ['sakoku'], ['seiji', 'gaiko'], 'キリスト教徒と重税に苦しむ農民の反乱 → 禁教を強める'],
    ['sakoku', 1641, '1641年', '「鎖国」の完成（オランダ商館を出島へ）', '🏝️', 'jh-edo1', ['rangaku', 'perry'], ['gaiko'], '長崎でオランダ・中国と貿易。対馬・薩摩・松前と合わせて「四つの口」'],
    ['bunchi', 1685, '17世紀後半〜18世紀初め', '文治政治（徳川綱吉・新井白石）', '📚', 'jh-edo1', ['kyoho'], ['seiji'], '武力より学問・儀礼で治める。生類憐みの令、貨幣の改鋳'],
    ['genroku', 1690, '17世紀末〜18世紀初め', '元禄文化', '🎭', 'jh-edo1', ['kasei'], ['bunka'], '上方（京・大坂）の町人文化。井原西鶴・近松門左衛門・松尾芭蕉'],
    ['kyoho', 1716, '1716年〜', '享保の改革（徳川吉宗）', '🌾', 'jh-edo2', ['tanuma'], ['seiji', 'keizai'], '年貢の増収で財政を立て直す。目安箱・公事方御定書・上げ米'],
    ['tanuma', 1772, '1772年〜', '田沼意次の政治', '💰', 'jh-edo2', ['kansei'], ['keizai'], '商業の力を利用し株仲間を奨励。わいろ批判と天明の飢饉で失脚'],
    ['rangaku', 1774, '1774年', '『解体新書』（蘭学）', '🔬', 'jh-edo2', ['bansha'], ['bunka'], '杉田玄白・前野良沢らがオランダ語の解剖書を翻訳'],
    ['kansei', 1787, '1787年〜', '寛政の改革（松平定信）', '📏', 'jh-edo2', ['tenpo'], ['seiji'], '倹約と農村の立て直し。囲米・棄捐令・寛政異学の禁'],
    ['kasei', 1810, '19世紀前半', '化政文化（浮世絵・国学）', '🗻', 'jh-edo2', ['bunmei'], ['bunka'], '江戸の町人文化。葛飾北斎・歌川広重、本居宣長の国学'],
    ['gaikokusen', 1825, '1825年', '異国船打払令', '💣', 'jh-edo2', ['bansha'], ['gaiko'], 'ロシア・イギリス船の接近に対し、外国船を撃退する方針'],
    ['oshio', 1837, '1837年', '大塩平八郎の乱', '🔥', 'jh-edo2', ['tenpo'], ['seiji'], '天保の飢饉で苦しむ人々を救おうと、元幕府役人が大坂で反乱'],
    ['bansha', 1839, '1839年', '蛮社の獄', '⛓️', 'jh-edo2', ['tenpo'], ['seiji'], 'モリソン号事件への幕府の対応を批判した渡辺崋山・高野長英を処罰'],
    ['ahen', 1840, '1840〜1842年', 'アヘン戦争（清がイギリスに敗れる）', '⚓', 'jh-edo2', ['tenpo', 'perry'], ['gaiko'], '清の敗北に衝撃 → 1842年、外国船に燃料・水を与える方針へ'],
    ['tenpo', 1841, '1841年〜', '天保の改革（水野忠邦）', '📉', 'jh-edo2', ['perry'], ['seiji', 'keizai'], '株仲間解散・上知令が失敗し、幕府の力の衰えが明らかに'],
    ['perry', 1853, '1853年', 'ペリー来航', '⚓', 'jh-bakumatsu', ['washin'], ['gaiko'], '黒船4隻が浦賀に来て開国を要求'],
    ['washin', 1854, '1854年', '日米和親条約', '🤝', 'jh-bakumatsu', ['tsusho'], ['gaiko'], '下田・箱館を開く。200年以上続いた「鎖国」が終わる'],
    ['tsusho', 1858, '1858年', '日米修好通商条約', '📜', 'jh-bakumatsu', ['joi', 'joyaku'], ['gaiko', 'keizai'], '領事裁判権を認め、関税自主権がない不平等条約。天皇の許しなく調印'],
    ['joi', 1860, '1858〜1864年', '安政の大獄・桜田門外の変・尊王攘夷', '🗡️', 'jh-bakumatsu', ['satcho'], ['seiji'], '幕府への反発が高まり、「天皇を尊び外国を打ち払え」の運動に'],
    ['satcho', 1866, '1866年', '薩長同盟', '🤝', 'jh-bakumatsu', ['taisei'], ['seiji'], '攘夷は無理と知った薩摩・長州が倒幕で手を結ぶ（坂本龍馬らが仲介）'],
    ['taisei', 1867, '1867年', '大政奉還・王政復古の大号令', '🏛️', 'jh-bakumatsu', ['boshin'], ['seiji'], '徳川慶喜が政権を朝廷に返し、天皇中心の新政府ができる'],
    ['boshin', 1868, '1868年', '戊辰戦争・五箇条の誓文', '⚔️', 'jh-bakumatsu', ['haihan'], ['seiji'], '旧幕府軍を破り、新政府の方針を示す（翌年まで戦いが続く）'],
    ['haihan', 1871, '1871年', '廃藩置県', '🗾', 'jh-bakumatsu', ['chiso'], ['seiji'], '藩を廃止して府県を置き、政府が直接治める中央集権国家に'],
    ['bunmei', 1872, '1872年〜', '文明開化（学制・鉄道）', '🚂', 'jh-bakumatsu', ['taishodemo'], ['bunka'], '学制が公布され、新橋〜横浜に鉄道。西洋の制度と生活が広がる'],
    ['chiso', 1873, '1873年', '地租改正・徴兵令', '💴', 'jh-bakumatsu', ['seinan', 'minken'], ['tochi', 'seiji'], '地価の3%を現金で納めさせ財政が安定。満20歳の男子に兵役'],
    ['minken', 1874, '1874年', '民撰議院設立建白書（自由民権運動）', '📣', 'jh-meiji', ['kokkai'], ['seiji'], '板垣退助らが、選挙で選ぶ議会を開けと要求'],
    ['seinan', 1877, '1877年', '西南戦争', '⚔️', 'jh-bakumatsu', ['kokkai'], ['seiji'], '西郷隆盛ら士族の最後の反乱 → 以後、政府への批判は言論（自由民権運動）が中心に'],
    ['kokkai', 1881, '1881年', '国会開設の勅諭', '📢', 'jh-meiji', ['kenpo'], ['seiji'], '1890年の国会開設を約束 → 自由党・立憲改進党ができる'],
    ['kenpo', 1889, '1889年', '大日本帝国憲法の発布', '📕', 'jh-meiji', ['gikai'], ['seiji'], '天皇が定めた憲法（欽定憲法）。伊藤博文がドイツの憲法を参考に'],
    ['gikai', 1890, '1890年', '第1回帝国議会', '🏛️', 'jh-meiji', ['futsu'], ['seiji'], '選挙権は直接国税15円以上を納める25歳以上の男子だけ'],
    ['joyaku', 1894, '1894年', '領事裁判権の撤廃（陸奥宗光）', '⚖️', 'jh-meiji', ['kanzei'], ['gaiko'], '日英通商航海条約。日清戦争の直前に結ばれる'],
    ['nisshin', 1895, '1894〜1895年', '日清戦争 → 下関条約', '⚔️', 'jh-meiji', ['sankan', 'sangyo'], ['gaiko'], '朝鮮をめぐる対立。台湾・遼東半島・賠償金を得る'],
    ['sankan', 1896, '1895年', '三国干渉', '😤', 'jh-meiji', ['nichiro', 'nichiei'], ['gaiko'], 'ロシア・ドイツ・フランスが遼東半島の返還を要求 → ロシアへの反感'],
    ['sangyo', 1901, '1901年', '八幡製鉄所が操業（産業革命）', '🏭', 'jh-meiji', ['wwi'], ['keizai'], '日清戦争の賠償金も使って重工業へ。軽工業の中心は紡績・製糸'],
    ['nichiei', 1902, '1902年', '日英同盟', '🤝', 'jh-meiji', ['nichiro', 'wwi'], ['gaiko'], 'ロシアの南下をおさえたいイギリスと手を結ぶ'],
    ['nichiro', 1904, '1904〜1905年', '日露戦争 → ポーツマス条約', '⚓', 'jh-meiji', ['hibiya', 'heigo'], ['gaiko'], '南樺太などを得るが、賠償金はなし'],
    ['hibiya', 1905, '1905年', '日比谷焼打ち事件', '🔥', 'jh-meiji', ['taishodemo'], ['seiji'], '賠償金なしに民衆が怒る → 民衆が政治を動かす時代の始まり'],
    ['heigo', 1910, '1910年', '韓国併合', '🗺️', 'jh-meiji', ['wwi'], ['gaiko'], '朝鮮を植民地とし、朝鮮総督府を置く'],
    ['kanzei', 1911, '1911年', '関税自主権の回復（小村寿太郎）', '🎉', 'jh-meiji', ['wwi'], ['gaiko'], '条約改正が完成し、欧米と対等に'],
    ['taishodemo', 1913, '1910年代〜1920年代', '大正デモクラシー', '🗳️', 'jh-taisho', ['futsu'], ['seiji', 'bunka'], '護憲運動、吉野作造の民本主義。政党政治を求める声'],
    ['wwi', 1914, '1914年', '第一次世界大戦に参戦', '🌍', 'jh-taisho', ['nijuikkajo', 'komesodo', 'kyoko'], ['gaiko', 'keizai'], '日英同盟を理由に参戦。大戦景気で好景気に'],
    ['nijuikkajo', 1915, '1915年', '二十一か条の要求', '📜', 'jh-taisho', ['manshu'], ['gaiko'], '中国に権益の拡大を求める → 中国で反日感情が高まる'],
    ['komesodo', 1918, '1918年', '米騒動 → 原敬の政党内閣', '🍚', 'jh-taisho', ['futsu'], ['seiji', 'keizai'], '物価上昇とシベリア出兵を見越した米の買い占め → 全国で暴動'],
    ['futsu', 1925, '1925年', '普通選挙法と治安維持法', '📮', 'jh-taisho', ['goichigo'], ['seiji'], '25歳以上の男子すべてに選挙権。同時に社会主義などを取り締まる法'],
    ['kyoko', 1930, '1927〜1930年', '金融恐慌・昭和恐慌', '📉', 'jh-taisho', ['manshu', 'niniroku'], ['keizai'], '世界恐慌も重なり農村が困窮 → 政党への失望と軍部への期待'],
    ['manshu', 1931, '1931年', '満州事変', '💥', 'jh-taisho', ['goichigo', 'renmei'], ['gaiko'], '関東軍が柳条湖で鉄道を爆破し、満州を占領 → 翌年「満州国」'],
    ['goichigo', 1932, '1932年', '五・一五事件', '🔫', 'jh-taisho', ['nichu'], ['seiji'], '犬養毅首相が海軍の青年将校らに暗殺され、政党内閣が終わる'],
    ['renmei', 1933, '1933年', '国際連盟を脱退', '🚪', 'jh-taisho', ['nichu'], ['gaiko'], '満州国が認められず、国際的に孤立'],
    ['niniroku', 1936, '1936年', '二・二六事件', '❄️', 'jh-taisho', ['nichu'], ['seiji'], '陸軍の青年将校によるクーデター（失敗）→ 軍部の発言力がさらに強まる'],
    ['nichu', 1937, '1937年', '日中戦争', '⚔️', 'jh-taisho', ['sodoin', 'taiheiyo'], ['gaiko'], '盧溝橋事件から全面戦争へ。長期化する'],
    ['sodoin', 1938, '1938年', '国家総動員法', '🏭', 'jh-taisho', ['taiheiyo'], ['seiji', 'keizai'], '議会の承認なしに、人や物資を戦争に動員できるようになる'],
    ['taiheiyo', 1941, '1941年', '太平洋戦争', '✈️', 'jh-taisho', ['haisen'], ['gaiko'], 'アメリカの石油輸出禁止などで対立 → 真珠湾攻撃・マレー半島上陸'],
    ['haisen', 1945, '1945年', 'ポツダム宣言を受諾（敗戦）', '🕊️', 'jh-taisho', ['minshuka'], ['gaiko', 'seiji'], '広島・長崎への原爆投下、ソ連の参戦を経て降伏'],
    ['minshuka', 1946, '1945〜1950年', 'GHQの民主化（財閥解体・農地改革）', '🗽', 'jh-postwar', ['kenpo47'], ['seiji', 'tochi', 'keizai'], '軍国主義を支えた仕組みを解体。女性参政権も実現'],
    ['kenpo47', 1947, '1946年公布・1947年施行', '日本国憲法の施行', '📗', 'jh-postwar', ['sanfran'], ['seiji'], '国民主権・基本的人権の尊重・平和主義'],
    ['chosensenso', 1950, '1950年', '朝鮮戦争と特需', '💹', 'jh-postwar', ['sanfran', 'kodo'], ['gaiko', 'keizai'], '冷戦の中で占領方針が転換。警察予備隊ができ、特需で景気回復'],
    ['sanfran', 1951, '1951年', 'サンフランシスコ平和条約・日米安保条約', '✍️', 'jh-postwar', ['gojugo', 'nisso'], ['gaiko'], '翌年に独立を回復。沖縄などはアメリカの統治下に残る'],
    ['gojugo', 1955, '1955年', '55年体制', '🏛️', 'jh-postwar', ['anpo', 'heisei'], ['seiji'], '自由民主党と日本社会党が向き合う形。自民党の長期政権'],
    ['nisso', 1956, '1956年', '日ソ共同宣言 → 国際連合に加盟', '🌐', 'jh-postwar', ['kodo'], ['gaiko'], 'ソ連の反対がなくなり、国連加盟が実現'],
    ['anpo', 1960, '1960年', '安保改定・所得倍増計画', '📈', 'jh-postwar', ['kodo'], ['seiji', 'keizai'], '激しい安保闘争のあと、池田内閣が経済中心の政治へ'],
    ['kodo', 1964, '1955〜1973年ごろ', '高度経済成長（東京オリンピック）', '🚄', 'jh-postwar', ['okinawa', 'sekiyu'], ['keizai'], '年10%前後の成長が続く。公害などのひずみも'],
    ['okinawa', 1972, '1972年', '沖縄返還・日中国交正常化', '🌺', 'jh-postwar', ['sekiyu'], ['gaiko'], '佐藤内閣で沖縄返還、田中内閣で日中共同声明'],
    ['sekiyu', 1973, '1973年', '石油危機', '🛢️', 'jh-postwar', ['bubble'], ['keizai'], '高度成長が終わり、安定成長へ'],
    ['bubble', 1986, '1980年代後半〜1991年', 'バブル経済とその崩壊', '🎈', 'jh-postwar', ['heisei'], ['keizai'], 'プラザ合意（1985年）後の低金利で地価・株価が高騰。崩壊後は長い不況'],
    ['heisei', 1993, '1993年', '55年体制の終わり（細川内閣）', '🔄', 'jh-postwar', [], ['seiji'], '冷戦終結後、自民党を除く連立内閣が成立'],
  ];
  const EV = RAW.map(([id, y, ys, t, e, u, to, th, n]) => ({ id, y, ys, t, e, u, to, th, n }));
  const EVM = {};
  EV.forEach((x) => (EVM[x.id] = x));
  EV.sort((a, b) => a.y - b.y);
  const causesOf = (id) => EV.filter((x) => x.to.includes(id));
  H.EV = EV; H.EVM = EVM; H.causesOf = causesOf;

  /* ---------- レッスン用の部品（すべて HTML 文字列を返す） ---------- */
  const wrap = (inner, o = {}) => `<div class="hx-anim">${o.title ? `<div class="hx-title">${o.title}</div>` : ''}<button class="hx-replay" type="button">↻ もう一度</button>${inner}${o.cap ? `<p class="hx-cap">${o.cap}</p>` : ''}</div>`;
  // 「↻ もう一度」：中身を作り直してアニメーションを最初から
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('.hx-replay');
    if (!b) return;
    const box = b.parentElement, html = box.innerHTML;
    box.innerHTML = '';
    void box.offsetWidth;
    box.innerHTML = html;
  });

  // 漫画：panels = [{ nar, tone:'a|w|g|r', fx:'burst|shake|dark', props:'🌾🏠', wide, ch:[[絵文字, 名前, セリフ, 'r'|'shout'|'think'...], ...] }]
  H.manga = (panels, o = {}) => wrap(`<div class="hx-manga">${panels.map((p, i) => {
    const cls = ['hx-p', p.tone ? 'tn-' + p.tone : '', p.wide ? 'wide' : '', ...(p.fx || '').split(' ').filter(Boolean).map((f) => 'fx-' + f)].join(' ');
    const chars = (p.ch || []).map(([em, nm, say, mod = '']) => {
      const ms = mod.split(' ').filter(Boolean);
      return `<div class="hx-ch ${ms.includes('r') ? 'r' : ''}"><div class="hx-av">${em}<small>${nm}</small></div>${say ? `<div class="hx-sb ${ms.filter((m) => m !== 'r').join(' ')}">${say}</div>` : ''}</div>`;
    }).join('');
    return `<div class="${cls}" style="--d:${i}">${p.nar ? `<span class="hx-nar">${p.nar}</span>` : ''}${chars}${p.props ? `<div class="hx-props">${p.props}</div>` : ''}</div>`;
  }).join('')}</div>`, o);

  // 因果のくさり：items = [[絵文字, 見出し, 説明, 年, '矢印の言葉', 色 'w|g|r'], ...] または できごとの id
  H.chain = (items, o = {}) => {
    const list = items.map((x) => (typeof x === 'string' ? [EVM[x].e, EVM[x].t, EVM[x].n, EVM[x].ys] : x));
    const n = list.length;
    let s = '';
    list.forEach(([e, t, note, y, lk, c], i) => {
      s += `<div class="hx-node ${c ? 'c-' + c : ''} ${o.goal && i === n - 1 ? 'goal' : ''}" style="--d:${i}"><div class="e">${e}</div><div>${y ? `<div class="y">${y}</div>` : ''}<div class="t">${t}</div>${note ? `<div class="n">${note}</div>` : ''}</div></div>`;
      // 矢印の言葉：指定がなければ、データ上で原因 → 結果なら「だから」、そうでなければ「その後」
      const a = items[i], b = items[i + 1], auto = typeof a === 'string' && typeof b === 'string' ? (EVM[a].to.includes(b) ? 'だから' : 'その後') : 'だから';
      if (i < n - 1) s += `<div class="hx-link" style="--d:${i}"><span>${lk || (o.links && o.links[i]) || auto}</span></div>`;
    });
    // 長いくさりは、最後まで現れるのに時間がかかりすぎないよう間隔を詰める
    const k = n > 10 ? Math.max(0.15, 8 / n) : 0.75;
    return wrap(`<div class="hx-chain" style="--k:${k.toFixed(2)}s">${s}</div>`, o);
  };

  // 日本地図（略図）：o.pts = [[名前, 経度, 緯度, 絵文字?, 'l'(ラベル左)]]、o.routes = [{ p:[[経度,緯度],...], c:'b|g|w', label, at:[経度,緯度] }]
  const LAND = {
    honshu: [[130.9, 34], [131.5, 34.6], [132.5, 35.4], [133.5, 35.5], [134.5, 35.6], [135.5, 35.6], [136, 36], [136.7, 36.9], [137.3, 37.5], [137, 36.8], [138.5, 37.4], [139.3, 38.2], [139.9, 39], [140, 40], [139.9, 40.6], [140.3, 41.2], [141.4, 41.4], [141.5, 40.5], [142, 39.5], [141.6, 38.4], [141, 38], [140.9, 37], [140.6, 36.2], [140.8, 35.7], [140, 35], [139.8, 35.3], [139.6, 35.2], [139.2, 35.2], [138.8, 34.6], [138.2, 34.6], [137, 34.6], [136.8, 34.3], [136.2, 33.8], [135.8, 33.5], [135.1, 33.9], [135.2, 34.6], [134.5, 34.7], [133.5, 34.4], [132.5, 34.2], [131.5, 33.9]],
    kyushu: [[130.9, 33.9], [131.8, 33.4], [131.9, 32.5], [131.4, 31.4], [130.7, 31], [130.2, 31.4], [130.3, 32.2], [129.8, 32.7], [129.6, 33.3], [130.3, 33.6]],
    shikoku: [[132.6, 33.9], [133.5, 34.3], [134.6, 34.2], [134.7, 33.8], [134.2, 33.3], [133, 32.8], [132.5, 33.2]],
    hokkaido: [[140, 41.5], [140.4, 42.6], [141.3, 43.4], [141.7, 44.4], [141.9, 45.4], [143, 44.5], [144.5, 44], [145.3, 43.6], [145.6, 43.3], [144, 43], [143.3, 42], [141.8, 42.6], [141, 42.3], [140.7, 41.8]],
    korea: [[124.6, 40], [125.1, 39.5], [125.4, 38.7], [126.1, 37.7], [126.5, 36.9], [126.3, 36], [126.5, 35], [126.3, 34.4], [127.5, 34.6], [128.5, 34.9], [129.3, 35.3], [129.5, 36], [129.4, 37], [128.6, 38.2], [127.9, 39], [128.3, 39.9], [129.7, 40.8], [130, 42], [126, 42], [124.4, 40.3]],
  };
  const PX = (lon) => (lon - 124) * 0.82 * 22 + 6, PY = (lat) => (46 - lat) * 22 + 6;
  const poly = (pts) => pts.map(([a, b]) => `${PX(a).toFixed(1)},${PY(b).toFixed(1)}`).join(' ');
  H.place = { 奈良: [135.8, 34.68], 京都: [135.77, 35.01], 大坂: [135.5, 34.69], 鎌倉: [139.55, 35.32], 江戸: [139.7, 35.69], 大宰府: [130.53, 33.52], 博多: [130.4, 33.6], 平泉: [141.1, 38.99], 長崎: [129.87, 32.75], 種子島: [130.98, 30.6], 下関: [130.92, 33.96], 壇ノ浦: [130.95, 33.96], 屋島: [134.1, 34.36], 一の谷: [135.08, 34.65], 関ヶ原: [136.47, 35.36], 長篠: [137.57, 34.92], 桶狭間: [136.97, 35.06], 堺: [135.48, 34.57], 浦賀: [139.72, 35.24], 下田: [138.94, 34.68], 箱館: [140.73, 41.77], 多賀城: [141, 38.3], 吉野: [135.86, 34.37], 島原: [130.37, 32.79], 対馬: [129.3, 34.4], 薩摩: [130.55, 31.6], 長州: [131.47, 34.18], 松前: [140.1, 41.43], 会津: [139.93, 37.49], 安土: [136.14, 35.15], 大宰府付近: [130.53, 33.52], 吉野ヶ里: [130.38, 33.33], 三内丸山: [140.7, 40.81], 出雲: [132.69, 35.4], 広島: [132.46, 34.4], 横浜: [139.64, 35.44], 新潟: [139.04, 37.92], 函館: [140.73, 41.77], 鹿児島: [130.55, 31.6], 那覇: [127.68, 26.21], 加賀: [136.65, 36.56], 山城: [135.77, 34.9], 小田原: [139.15, 35.25], 大坂城: [135.53, 34.69], 姫路: [134.69, 34.83], 名古屋: [136.9, 35.18], 漢城: [127, 37.56], 釜山: [129.04, 35.1] };
  H.map = (o = {}) => {
    const W = Math.ceil(PX(146.2)) + 6, Hh = Math.ceil(PY(29.5)) + 6;
    let s = `<rect x="0" y="0" width="${W}" height="${Hh}" rx="12" class="sea"/>`;
    s += `<polygon points="${poly(LAND.korea)}" class="land2"/>` + ['honshu', 'kyushu', 'shikoku', 'hokkaido'].map((k) => `<polygon points="${poly(LAND[k])}" class="land"/>`).join('');
    s += `<text x="${PX(125.6)}" y="${PY(41.3)}" style="font-size:12px">朝鮮半島</text>`;
    (o.routes || []).forEach((r, i) => {
      const pts = r.p.map((q) => (typeof q === 'string' ? H.place[q] : q));
      const d = pts.map(([a, b], k) => `${k ? 'L' : 'M'}${PX(a).toFixed(1)} ${PY(b).toFixed(1)}`).join(' ');
      const dl = (o.delay0 || 0.4) + i * 1.2;
      s += `<path d="${d}" pathLength="1" class="route ${r.c || ''}" style="animation-delay:${dl}s" marker-end="url(#ar)"/>`;
      if (r.label) { const at = r.at || pts[Math.floor(pts.length / 2)]; s += `<text x="${PX(at[0]).toFixed(1)}" y="${PY(at[1]).toFixed(1)}" class="rl" style="animation-delay:${dl + 1.2}s">${esc(r.label)}</text>`; }
    });
    (o.pts || []).forEach(([nm, lon, lat, em, side], i) => {
      if (lon == null) [lon, lat] = H.place[nm];
      const x = PX(lon), y = PY(lat), left = side === 'l';
      s += `<g class="pt" style="animation-delay:${(o.ptDelay || 0) + i * 0.35}s"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5"/>${em ? `<text class="em" x="${(x + (left ? -30 : 8)).toFixed(1)}" y="${(y - 6).toFixed(1)}">${em}</text>` : ''}<text x="${(x + (left ? -8 : 9)).toFixed(1)}" y="${(y + 15).toFixed(1)}" style="${left ? 'text-anchor:end' : ''}">${esc(nm)}</text></g>`;
    });
    return wrap(`<div class="hx-map"><svg viewBox="0 0 ${W} ${Hh}" width="${W}">${s}</svg></div>`, o);
  };

  // 年表：items = できごとの id か [年, 見出し, 絵文字]
  H.tl = (items, o = {}) => {
    const list = items.map((x) => (typeof x === 'string' ? [EVM[x].ys, EVM[x].t, EVM[x].e] : x)), step = o.step || 0.7, T = list.length * step + 0.6;
    return wrap(`<div class="hx-tl"><div class="hx-tl-in" style="--S:${step}s;--T:${T}s"><div class="hx-tl-run"></div>${list.map(([y, t, e], i) => `<div class="hx-ti" style="--d:${i}"><div class="dot"></div><div class="e">${e || '•'}</div><div class="y">${y}</div><div class="t">${t}</div></div>`).join('')}</div></div>`, o);
  };

  // 人物カード：[{ e, name, life, role, did:[...] }]
  H.people = (list, o = {}) => wrap(`<div class="hx-people">${list.map((p, i) => `<div class="hx-person" style="--d:${i}"><div class="hx-face">${p.e}</div><div><div class="nm">${p.name}</div><div class="lf">${p.life || ''}${p.role ? '｜' + p.role : ''}</div><ul>${(p.did || []).map((d) => `<li>${d}</li>`).join('')}</ul></div></div>`).join('')}</div>`, o);

  // イラストの場面：items = [[絵文字, x%, y%, 大きさpx, ラベル]]、o.bg = 'night' | 'town'
  H.scene = (items, o = {}) => wrap(`<div class="hx-scene ${o.bg || ''}" style="--h:${o.h || 230}px">${items.map(([e, x, y, sz, lb], i) => `<div class="hx-it" style="left:${x}%;top:${y}%;--d:${i}"><div class="e" style="font-size:${sz || 36}px">${e}</div>${lb ? `<span class="lb">${lb}</span>` : ''}</div>`).join('')}</div>`, o);

  // テーマの線（できごとから自動で作る）
  H.themeChain = (th, from = -99999, to = 99999, o = {}) => H.chain(EV.filter((x) => x.th.includes(th) && x.y >= from && x.y <= to).map((x) => x.id), o);

  /* ---------- 日本史ナビ（#/jhist） ---------- */
  const ST = () => { const S = K.S; S.jhist = S.jhist || { sortPlay: 0, sortWin: 0, seen: {} }; return S.jhist; };
  const RANGES = [['all', '全時代', -99999, 99999], ['kodai', '古代', -99999, 1184], ['chusei', '中世', 1185, 1572], ['kinsei', '近世', 1573, 1867], ['kindai', '近代', 1868, 1945], ['gendai', '現代', 1946, 99999]];
  const inRange = (r) => { const R = RANGES.find((x) => x[0] === r) || RANGES[0]; return EV.filter((x) => x.y >= R[2] && x.y <= R[3]); };
  const SHORT = { jomon: '原始', azuchi: '桃山', taisho: '戦前' };
  const band = (cur) => `<div class="hx-band">${ERAS.map((e) => `<a href="#/c/jhist/u/${e[4]}" style="background:${e[3]}" class="${cur && cur[0] === e[0] ? 'on' : ''}" title="${e[1]}">${SHORT[e[0]] || e[1]}</a>`).join('')}</div>`;
  const unitLink = (x) => `<a href="#/c/jhist/u/${x.u}">📖 この時代のユニットへ</a>`;
  let timer = null;
  const stop = () => { clearInterval(timer); timer = null; };

  function hub() {
    stop();
    const st = ST();
    view().innerHTML = `${K.crumbs([['日本史ナビ']])}
      <section class="card"><h1>🏯 日本史ナビ</h1><p class="muted">日本史は「点（できごと）」の暗記ではなく、<b>原因 → 結果の「線」</b>。ここでは ${EV.length} のできごとが、すべて矢印でつながっています。</p>
      ${band(null)}<p class="small muted">↑ 時代をタップすると、その時代のユニット（授業）へ</p></section>
      <div class="sp-grid">
        <a class="card sp-card" href="#/jhist/flow/all"><span class="sp-ic">🎬</span><div><b>流れアニメ</b><br><span class="small muted">年表の上を自動で進みながら、「なぜ起きた → 何につながった」を1つずつ見せます。まずはここから。</span></div></a>
        <a class="card sp-card" href="#/jhist/map/konden"><span class="sp-ic">🕸️</span><div><b>つながりマップ</b><br><span class="small muted">1つのできごとを真ん中に、左に「原因」、右に「結果」。タップして時代を旅します。</span></div></a>
        <a class="card sp-card" href="#/jhist/theme/tochi"><span class="sp-ic">🧵</span><div><b>テーマの線</b><br><span class="small muted">土地・政治・外交・経済・文化。1本のテーマで、全時代を縦に貫きます。</span></div></a>
        <a class="card sp-card" href="#/jhist/sort/all"><span class="sp-ic">🔢</span><div><b>並べ替えチャレンジ</b><br><span class="small muted">4つのできごとを古い順に。難関大で必ず出る「配列問題」の練習。成績：${st.sortWin}/${st.sortPlay}</span></div></a>
      </div>
      <div class="card"><h3>おすすめの使い方</h3><ol class="small"><li>授業（日本史コース）で1つの時代を学ぶ</li><li>流れアニメで、その時代の前後を見る</li><li>つながりマップで「なぜ？」を1つ自分で説明してみる</li><li>並べ替えチャレンジで確認</li></ol><a class="btn primary" href="#/c/jhist">📚 日本史コースへ</a></div>`;
  }

  function flow(range = 'all', start) {
    stop();
    const list = inRange(range);
    let i = Math.max(0, list.findIndex((x) => x.id === start)), playing = !start, speed = 5000;
    const render = () => {
      const x = list[i], era = eraOf(x.y), ca = causesOf(x.id), ef = x.to.map((id) => EVM[id]).filter(Boolean);
      ST().seen[x.id] = 1;
      view().innerHTML = `${K.crumbs([['日本史ナビ', '#/jhist'], ['流れアニメ']])}
        <div class="card"><div class="hx-chips">${RANGES.map((r) => `<a class="hx-chip ${r[0] === range ? 'on' : ''}" href="#/jhist/flow/${r[0]}">${r[1]}</a>`).join('')}</div>
        ${band(era)}<div class="hx-prog"><i style="width:${((i + 1) / list.length) * 100}%"></i></div>
        <div class="hx-stage" style="background:linear-gradient(${era[3]}55, transparent);border-radius:14px">
          <div class="small muted">${era[1]}時代　${i + 1} / ${list.length}</div>
          <div class="big">${x.e}</div><div class="yr">${x.ys}</div><div class="ttl">${x.t}</div><p>${x.n}</p>
          ${ca.length ? `<div class="why"><b>なぜ起きた？</b> ← ${ca.map((c) => `${c.e} ${c.t}`).join('／')}</div>` : ''}
          ${ef.length ? `<div class="why" style="margin-left:6px"><b>何につながった？</b> → ${ef.map((c) => `${c.e} ${c.t}`).join('／')}</div>` : ''}
          <p class="small">${unitLink(x)}　<a href="#/jhist/map/${x.id}">🕸️ つながりマップで見る</a></p></div>
        <div class="actions center"><button class="btn" id="pv">◀ 前</button><button class="btn primary" id="pp">${playing ? '⏸ 一時停止' : '▶ 再生'}</button><button class="btn" id="nx">次 ▶</button>
        <select id="spd" class="btn"><option value="8000">ゆっくり</option><option value="5000">ふつう</option><option value="3000">はやい</option></select></div></div>`;
      $('#spd').value = String(speed);
      $('#pv').onclick = () => { i = Math.max(0, i - 1); render(); };
      $('#nx').onclick = () => { i = Math.min(list.length - 1, i + 1); render(); };
      $('#pp').onclick = () => { playing = !playing; arm(); render(); };
      $('#spd').onchange = (e) => { speed = +e.target.value; arm(); };
    };
    const arm = () => { stop(); if (playing) timer = setInterval(() => { if (i >= list.length - 1) { playing = false; stop(); render(); return; } i++; render(); }, speed); };
    render(); arm(); K.save();
  }

  function cmap(id) {
    stop();
    const x = EVM[id] || EVM.konden, ca = causesOf(x.id), ef = x.to.map((k) => EVM[k]).filter(Boolean), era = eraOf(x.y);
    const btn = (e) => `<button class="hx-ev" data-id="${e.id}"><span class="e">${e.e}</span><span><span class="y">${e.ys}</span><br><b>${e.t}</b></span></button>`;
    view().innerHTML = `${K.crumbs([['日本史ナビ', '#/jhist'], ['つながりマップ']])}
      <div class="card"><h2>🕸️ つながりマップ</h2><p class="small muted">左が「原因」、右が「結果」。カードをタップすると、そのできごとが真ん中に来ます。</p>${band(era)}
      <div class="hx-cmap"><div class="hx-col"><h4>⬅ 原因（なぜ起きた？）</h4>${ca.length ? ca.map(btn).join('') : '<p class="small muted center">このアプリでは、ここが出発点です</p>'}</div>
        <div><div class="hx-center"><div class="e">${x.e}</div><div class="small muted">${x.ys}</div><h3 style="margin:.2em 0">${x.t}</h3><p class="small">${x.n}</p><p class="small">${unitLink(x)}</p></div></div>
        <div class="hx-col"><h4>結果（何につながった？）➡</h4>${ef.length ? ef.map(btn).join('') : '<p class="small muted center">ここから先は、今の時代へ</p>'}</div></div>
      <div class="box tip"><b>やってみよう</b>真ん中のできごとについて「<b>${ca[0] ? ca[0].t : '前の時代'}</b> だったから、<b>${x.t}</b> が起きて、その結果 <b>${ef[0] ? ef[0].t : '次の時代'}</b> になった」と、声に出して説明してみる。説明できたら、それは「線」になっています。</div>
      <p class="small">テーマ：${x.th.map((t) => `<a class="hx-chip" href="#/jhist/theme/${t}">${THEMES[t][0]} ${THEMES[t][1]}</a>`).join(' ')}</p></div>`;
    $$('.hx-ev').forEach((b) => (b.onclick = () => K.go('#/jhist/map/' + b.dataset.id)));
  }

  function theme(th) {
    stop();
    const t = THEMES[th] ? th : 'tochi';
    view().innerHTML = `${K.crumbs([['日本史ナビ', '#/jhist'], ['テーマの線']])}
      <div class="card"><h2>🧵 テーマの線</h2><div class="hx-chips">${Object.entries(THEMES).map(([k, v]) => `<a class="hx-chip ${k === t ? 'on' : ''}" href="#/jhist/theme/${k}">${v[0]} ${v[1]}</a>`).join('')}</div>
      <p class="muted">${THEMES[t][2]}</p>${H.themeChain(t, -99999, 99999, { links: [] })}</div>`;
  }

  function sortGame(range = 'all') {
    stop();
    // 「10〜11世紀」のように時期に幅があるものは、順番が1つに決まらないので出さない
    const pool = inRange(range).filter((x) => !/世紀|ごろ|年代|通じて/.test(x.ys)), pick = [];
    shuffle(pool).forEach((x) => { if (pick.length < 4 && !pick.some((p) => Math.abs(p.y - x.y) < 1 || p.ys === x.ys)) pick.push(x); });
    const order = [];
    const render = () => {
      view().innerHTML = `${K.crumbs([['日本史ナビ', '#/jhist'], ['並べ替えチャレンジ']])}
        <div class="card"><h2>🔢 並べ替えチャレンジ</h2><div class="hx-chips">${RANGES.map((r) => `<a class="hx-chip ${r[0] === range ? 'on' : ''}" href="#/jhist/sort/${r[0]}">${r[1]}</a>`).join('')}</div>
        <p>古い順にタップしてください（${order.length}/4）。<span class="small muted">年号を覚えていなくても、「何が原因で何が起きたか」を考えれば並べられます。</span></p>
        <div class="hx-sort">${pick.map((x) => { const k = order.indexOf(x.id); return `<button class="btn ${k >= 0 ? 'picked' : ''}" data-id="${x.id}">${k >= 0 ? `<b>${k + 1}.</b> ` : ''}${x.e} ${x.t}</button>`; }).join('')}</div>
        <div id="res"></div></div>`;
      $$('.hx-sort button').forEach((b) => (b.onclick = () => {
        if (order.length >= 4 || order.includes(b.dataset.id)) return;
        order.push(b.dataset.id);
        if (order.length < 4) return render();
        render(); judge();
      }));
    };
    const judge = () => {
      const right = pick.slice().sort((a, b) => a.y - b.y), ok = right.every((x, k) => x.id === order[k]), st = ST();
      st.sortPlay++; if (ok) { st.sortWin++; K.addXP(15); K.toast('🎯 正解！ +15 XP', 'good'); K.confetti(40); }
      K.save();
      $('#res').innerHTML = `<h3 style="margin-top:14px">${ok ? '⭕ 正解！' : '❌ 正しい順番はこちら'}</h3><div class="hx-ans">${right.map((x, k) => `<div class="${x.id === order[k] ? 'ok' : 'ng'}"><b>${k + 1}. ${x.e} ${x.t}</b>（${x.ys}）<br><span class="small">${x.n}</span></div>`).join('')}</div>
        <div class="actions center" style="margin-top:12px"><button class="btn primary" id="again">次の問題 →</button><a class="btn" href="#/jhist/map/${right[0].id}">🕸️ つながりを見る</a></div>`;
      $('#again').onclick = () => sortGame(range);
    };
    render();
  }

  App.routes.jhist = function (p) {
    K.onLeave(stop);
    const [k, a] = p;
    if (!k) return hub();
    if (k === 'flow') return flow(a || 'all', p[2]);
    if (k === 'map') return cmap(a);
    if (k === 'theme') return theme(a);
    if (k === 'sort') return sortGame(a || 'all');
    hub();
  };
})();
