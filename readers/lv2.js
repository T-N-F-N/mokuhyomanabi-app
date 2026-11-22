/* 多読ライブラリ Lv2（中学〜高1・200〜300語） */
LearnApp.addReadings([
  {
    id: 'eiffel-sale', lv: 2, emoji: '🗼', genre: '実話', title: 'The Man Who Sold the Eiffel Tower', ja: 'エッフェル塔を売った男',
    sum: '1925年、詐欺師ヴィクトール・ルスティグは政府の役人になりすまし、「エッフェル塔は維持費が高いので鉄くずとして売る」と業者を集めた。業者ポワソンは大金を払ったが、恥ずかしくて警察に言えなかった。ルスティグはなんと同じ手口をもう一度試みた。',
    text: [
      'In 1925, a man named Victor Lustig read a short article in a Paris newspaper. It said that the Eiffel Tower was in poor condition and very expensive to repair. Lustig was a con man, and he had an idea.',
      'He made fake government papers and invited five businessmen to a fancy hotel. He told them that he worked for the government. "The city has decided to sell the Eiffel Tower for scrap metal," he said. "This is a secret. If people find out, they will be angry." The businessmen believed him. Back then, many people thought the tower was ugly, and it was built to stand for only twenty years.',
      'One of the men, André Poisson, wanted the deal very much. He wanted to become famous in the business world. Lustig noticed that Poisson was eager, so he chose him. He even asked Poisson for a bribe. Strangely, this made Poisson trust him more. "A real government official would ask for a bribe," he thought.',
      'Poisson paid a huge amount of money. Lustig took the money and left for Austria right away. Poisson was so embarrassed that he never told the police.',
      'A month later, Lustig came back to Paris and tried the same trick again with a new group of businessmen! This time, one of them went to the police, and Lustig ran away. He was finally caught in the United States years later. Today, he is remembered as "the man who sold the Eiffel Tower" — twice.',
    ],
    gloss: [['article', '記事'], ['condition', '状態'], ['repair', '修理する'], ['con man', '詐欺師'], ['fake', '偽の'], ['scrap metal', '鉄くず'], ['ugly', '醜い'], ['deal', '取引'], ['eager', '熱心な・〜したがって'], ['bribe', 'わいろ'], ['official', '役人・公式の'], ['embarrassed', '恥ずかしい'], ['trick', '手口・いたずら']],
    phrases: [['find out', '（調べて・偶然）知る'], ['Back then', '当時は'], ['a huge amount of', '莫大な量の'], ['right away', 'すぐに'], ['ran away', '逃げた（run away）']],
    qs: [
      { q: 'ポワソンが警察に言わなかった理由は？', c: ['だまされたことが恥ずかしかったから', 'お金を取り戻せたから', 'ルスティグと友だちだったから', '警察も信じてくれなかったから'], a: 0, e: 'Poisson was so embarrassed that he never told the police.' },
      { q: 'わいろを求められて、ポワソンがますます信じたのはなぜ？', c: ['本物の役人ならわいろを求めると思ったから', 'わいろが安かったから', '新聞に書いてあったから', 'ほかの業者もそう言ったから'], a: 0, e: '"A real government official would ask for a bribe," he thought.' },
    ],
  },
  {
    id: 'post-it', lv: 2, emoji: '🟨', genre: '発明', title: 'The Glue That Failed', ja: '失敗した接着剤',
    sum: '1968年、3M社のスペンサー・シルバーは強力な接着剤を作ろうとして、弱くて何度もはがせる不思議なのりを作った。何年も使い道がなかったが、同僚のアート・フライが「聖歌集のしおりが落ちる」悩みから活用を思いつき、1980年に「ポスト・イット」として発売された。',
    text: [
      'In 1968, a scientist named Spencer Silver was working at a company called 3M in the United States. His goal was to make a very strong glue for airplanes. But his experiment failed. The glue he made was weak. It could stick to paper, but you could easily pull the paper off. Strangely, you could use it again and again.',
      'Most people would throw away a failed glue. But Silver thought it was interesting. For years, he showed it to his colleagues and asked, "What can we use this for?" Nobody had a good idea.',
      'Then, in 1974, one of his colleagues, Art Fry, had a small problem. He sang in a church choir. He used small pieces of paper as bookmarks in his song book, but they always fell out. One day, he remembered Silver\'s weak glue. "What if I put that glue on my bookmarks?" he thought.',
      'It worked perfectly. The bookmarks stayed in place, and they did not damage the pages. Soon Fry realized that the sticky paper could be used for many other things, like writing short notes to his boss.',
      'In 1980, the company started selling the product as "Post-it Notes." Today, they are used in offices and schools all over the world. A failed experiment became one of the most popular office products ever. Sometimes, a mistake is just an idea waiting for the right problem.',
    ],
    gloss: [['glue', 'のり・接着剤'], ['experiment', '実験'], ['failed', 'fail', '失敗する'], ['stick', 'くっつく'], ['colleagues', 'colleague', '同僚'], ['choir', '聖歌隊・合唱団'], ['bookmarks', 'bookmark', 'しおり'], ['damage', '傷つける'], ['realized', 'realize', '気づく・悟る'], ['sticky', 'ねばねばする']],
    phrases: [['pull ... off', '〜をはがす'], ['again and again', '何度も'], ['throw away', '捨てる'], ['What if', 'もし〜したらどうだろう'], ['in place', '所定の位置に'], ['all over the world', '世界中で']],
    qs: [
      { q: 'シルバーがもともと作ろうとしていたのは？', c: ['飛行機用の強い接着剤', '付せん', 'しおり', '紙'], a: 0, e: 'His goal was to make a very strong glue for airplanes.' },
      { q: 'フライが使い道を思いついたきっかけは？', c: ['聖歌集のしおりがいつも落ちること', '上司へのメモ', '会社の会議', '新聞記事'], a: 0, e: 'small pieces of paper as bookmarks ... always fell out.' },
    ],
  },
  {
    id: 'forgetting', lv: 2, emoji: '🧠', genre: '心理・学習', title: 'Why We Forget So Fast', ja: 'なぜすぐ忘れるのか',
    sum: '1880年代、ドイツの心理学者エビングハウスは意味のない音節を覚えて、どれくらい忘れるかを自分で記録した。覚えた直後に急速に忘れ、その後ゆっくりになる（忘却曲線）。しかし忘れかけた頃に復習すると、忘れるスピードはどんどん遅くなる。これが間隔反復の原理。',
    text: [
      'Have you ever studied hard for a test and then forgotten almost everything a week later? Don\'t worry. You are not alone. In fact, a scientist studied this more than 100 years ago.',
      'In the 1880s, a German psychologist named Hermann Ebbinghaus did an unusual experiment on himself. He made lists of nonsense syllables, like "DAX," "BOK," and "YAT." They had no meaning, so he could not connect them to things he already knew. He memorized the lists and then tested himself again and again over the following days.',
      'The results were surprising. He forgot a lot very quickly. Within a day, much of what he had learned was gone. After that, he forgot more slowly. When he drew this on a graph, it made a curve that went down fast and then became flat. Today, we call it the "forgetting curve."',
      'But Ebbinghaus also found good news. Each time he reviewed the list, he forgot it more slowly. After a few reviews, the memory became strong and lasted a long time.',
      'This is why "spaced repetition" works. Instead of studying ten times in one night, it is better to review a little on day 1, day 3, day 7, and so on. The best time to review is just before you forget. This app uses the same idea. So when the app asks you to review an old word, it is not being annoying. It is fighting the forgetting curve for you.',
    ],
    gloss: [['psychologist', '心理学者'], ['unusual', '珍しい・ふつうでない'], ['nonsense', '意味のない'], ['syllables', 'syllable', '音節'], ['connect', '結びつける'], ['memorized', 'memorize', '暗記する'], ['curve', '曲線'], ['flat', '平らな'], ['reviewed', 'review', '復習する'], ['repetition', '繰り返し'], ['annoying', 'うっとうしい']],
    phrases: [['You are not alone', 'あなただけではない'], ['In fact', '実は・実際'], ['the following days', 'その後の数日'], ['Within a day', '1日以内に'], ['Instead of', '〜の代わりに'], ['and so on', '〜など']],
    qs: [
      { q: 'エビングハウスが意味のない音節を使った理由は？', c: ['すでに知っていることと結びつけられないようにするため', '覚えやすいから', '短いから', 'ドイツ語だから'], a: 0, e: 'They had no meaning, so he could not connect them to things he already knew.' },
      { q: '本文によると、復習のベストタイミングは？', c: ['忘れる直前', '覚えた直後に10回', 'テストの前の晩', '1年後'], a: 0, e: 'The best time to review is just before you forget.' },
    ],
  },
  {
    id: 'sleep-brain', lv: 2, emoji: '😴', genre: '科学', title: 'What Your Brain Does at Night', ja: '夜、脳がしていること',
    sum: '眠っている間、脳は休んでいるわけではない。その日の記憶を整理し、大事なものを長期記憶へ移す。ネズミの実験では、昼に通った迷路の道順を眠りながら「再生」していた。睡眠中は脳の老廃物の掃除も進む。勉強の後によく眠ることは、勉強の一部。',
    text: [
      'When you go to sleep, your body rests. But your brain does not. In fact, it is very busy all night.',
      'One of its most important jobs is to sort your memories. During the day, you see and hear thousands of things. Your brain cannot keep all of them. So while you sleep, it decides which memories are important and moves them into long-term memory. Less important memories fade away.',
      'Scientists found an interesting example in rats. During the day, the rats ran through a maze. Special sensors recorded the activity of cells in their brains. That night, while the rats were sleeping, the same cells became active again in the same order. It was as if the rats were running through the maze again in their dreams. Their brains were "replaying" the day to practice it.',
      'Sleep also seems to help clean the brain. Studies in mice suggest that, during sleep, fluid flows through the brain more easily and washes away waste. Some scientists think this is one reason we feel clear-headed after a good night\'s sleep.',
      'So what does this mean for learners? If you study hard but sleep only four hours, your brain does not have enough time to save what you learned. Many students cut sleep to study more, but this is often a bad trade. Sleeping well after studying is not lazy. It is part of studying.',
    ],
    gloss: [['rests', 'rest', '休む'], ['sort', '整理する・分類する'], ['long-term', '長期の'], ['fade', '薄れる・消えていく'], ['maze', '迷路'], ['sensors', 'sensor', 'センサー'], ['activity', '活動'], ['replaying', 'replay', '再生する'], ['fluid', '液体'], ['waste', '老廃物・ごみ'], ['clear-headed', '頭がすっきりした'], ['trade', '交換・取引'], ['lazy', '怠けた']],
    phrases: [['go to sleep', '眠りにつく'], ['all night', '一晩中'], ['as if', 'まるで〜のように'], ['a good night\'s sleep', 'ぐっすり眠ること'], ['washes away', '洗い流す（wash away）']],
    qs: [
      { q: 'ネズミの実験でわかったことは？', c: ['眠っている間に昼の迷路の道順を脳が再生していた', 'ネズミは夢を見ない', '迷路を走ると眠くなる', '睡眠中は脳の活動が止まる'], a: 0, e: 'the same cells became active again in the same order.' },
      { q: '筆者の主張に最も近いのは？', c: ['勉強の後によく眠ることも勉強の一部', '睡眠を削って勉強すべき', '寝る前に勉強してはいけない', '睡眠は体だけのためのもの'], a: 0, e: 'Sleeping well after studying is not lazy. It is part of studying.' },
    ],
  },
  {
    id: 'time-letter', lv: 2, emoji: '✉️', genre: '物語', title: 'A Letter from Ten-Year-Old Me', ja: '10歳の私からの手紙',
    sum: '25歳のハナは実家の片付けで、10歳の自分が書いた「未来の私へ」の手紙を見つける。夢だった宇宙飛行士にはなっていない今の自分にがっかりするが、手紙の最後の一文を読んで考えが変わる。',
    text: [
      'Hana was cleaning her parents\' house when she found an old box under her bed. Inside was a letter. On the envelope, in big, messy letters, it said: "To Hana at 25. Do not open until then!"',
      'Hana laughed. She was twenty-five now. She opened the letter carefully.',
      '"Dear Future Me," it began. "Are you an astronaut now? I hope you went to the moon. Do you have a dog? I want a big white dog named Cloud. Are you still friends with Mei? Please say yes."',
      'Hana stopped reading for a moment. She was not an astronaut. She worked in an office in Osaka, and she checked spreadsheets all day. She did not have a dog. And she had not talked to Mei for almost five years. She felt a little disappointed in herself.',
      'Then she read the last part. "If you are not an astronaut, that is OK. But I hope you are still curious about everything. I hope you still look at the stars. And if you forgot to call Mei, call her today. Love, Hana (10)."',
      'Hana sat on the floor for a long time. Then she picked up her phone and found Mei\'s name. Her heart was beating fast. "Hello?" said a familiar voice. "Mei? It\'s Hana. I know it\'s been a long time, but…"',
      'They talked for two hours. That night, Hana went outside and looked at the stars. Ten-year-old Hana was right. It was not too late.',
    ],
    gloss: [['envelope', '封筒'], ['messy', '散らかった・汚い（字が）'], ['astronaut', '宇宙飛行士'], ['spreadsheets', 'spreadsheet', '表計算シート'], ['disappointed', 'がっかりした'], ['curious', '好奇心のある'], ['beating', 'beat', '（心臓が）打つ'], ['familiar', '聞き覚えのある・よく知っている']],
    phrases: [['for a moment', '少しの間'], ['all day', '一日中'], ['picked up', '手に取った（pick up）'], ['it\'s been a long time', '久しぶり'], ['too late', '遅すぎる']],
    qs: [
      { q: 'ハナががっかりしたのはなぜ？', c: ['10歳の頃の夢や願いがかなっていなかったから', '手紙が読めなかったから', '母に怒られたから', '犬がいなくなったから'], a: 0, e: 'She was not an astronaut ... She felt a little disappointed in herself.' },
      { q: '手紙を読んだ後、ハナがしたことは？', c: ['メイに電話して、星を見た', '宇宙飛行士の試験を受けた', '犬を飼った', '手紙を捨てた'], a: 0, e: 'She picked up her phone ... That night, Hana went outside and looked at the stars.' },
    ],
  },
  {
    id: 'camera-blink', lv: 2, emoji: '📷', genre: '仕事の物語', title: 'The Camera That Never Blinks', ja: 'まばたきしないカメラ',
    sum: '部品工場に検査カメラが入った。ベテランのミカは最初反発するが、カメラは人が見逃す小さな傷を見つける。ところが、ある日から良品まで不良と判定し始める。原因は午後の窓からの日差しの反射。ミカの観察で問題が解決し、人とカメラはチームになる。',
    text: [
      'For twenty years, Mika checked metal parts with her own eyes at a small factory. She was very good at it. She could find a scratch thinner than a hair. So when the company installed a new inspection camera on her line, she was not happy. "A machine cannot do my job," she said.',
      'At first, the camera was impressive. It checked 120 parts every minute, and it never got tired. It never blinked. In the first week, it found three tiny scratches that the human team had missed.',
      'But in the second week, something strange happened. Every afternoon, at around three o\'clock, the camera started to reject good parts. It said they had defects, but Mika looked at them carefully and saw nothing wrong. The engineers checked the software, but they could not find the cause.',
      'Mika watched the line for two afternoons. Then she noticed something. At three o\'clock, the sun came through the window behind the machine. The sunlight hit the shiny metal and made a bright spot. The camera thought the bright spot was a defect.',
      '"It\'s the sunlight," she told the engineers. They put a black cover around the camera to block the outside light. The next afternoon, the false alarms stopped.',
      'The engineers were impressed. "You found the cause faster than we did," one of them said. Mika smiled. "The camera has good eyes," she said. "But it doesn\'t know when something is strange. That\'s my job." From then on, the camera checked every part, and Mika checked the camera.',
    ],
    gloss: [['scratch', '傷・引っかき傷'], ['installed', 'install', '設置する'], ['inspection', '検査'], ['impressive', '印象的な・すごい'], ['blinked', 'blink', 'まばたきする'], ['tiny', 'とても小さい'], ['reject', '不合格にする・はじく'], ['defects', 'defect', '欠陥'], ['cause', '原因'], ['shiny', 'ぴかぴかの'], ['block', '遮る'], ['false alarms', 'false alarm', '誤報・誤検出']],
    phrases: [['good at', '〜が得意な（be good at）'], ['At first', '最初は'], ['at around three o\'clock', '3時ごろに'], ['From then on', 'それ以来']],
    qs: [
      { q: '午後3時ごろに良品が不良と判定された原因は？', c: ['窓からの日差しが金属に反射して明るい点ができたから', 'ソフトのバグ', 'カメラが疲れたから', '部品が熱くなったから'], a: 0, e: 'The sunlight hit the shiny metal and made a bright spot.' },
      { q: '最後の一文 "Mika checked the camera." が表すことは？', c: ['人はカメラの異常に気づく役割を担うようになった', 'ミカがカメラを買った', 'ミカがカメラを壊した', 'ミカは仕事を辞めた'], a: 0, e: '"it doesn\'t know when something is strange. That\'s my job."' },
    ],
  },
]);
