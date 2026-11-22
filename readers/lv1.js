/* 多読ライブラリ Lv1（中学1〜2年の語彙・〜200語）
 * gloss: [本文の形, 見出し語, 意味] または [語, 意味] / phrases: [本文の形, 意味] */
LearnApp.addReadings([
  {
    id: 'cat-train', lv: 1, emoji: '🐈', genre: '物語', title: 'The Cat on the 7:15 Train', ja: '7時15分の電車に乗るネコ',
    sum: '毎朝同じ電車に乗ってくるネコ。乗客たちは理由がわからない。ある日ネコの後をつけると、ネコは駅の近くの病院へ。入院中の飼い主（おばあさん）に毎日会いに行っていたのだった。',
    text: [
      'Every morning, Yuki takes the 7:15 train to work. One Monday, she noticed something strange. A small gray cat was sitting on the seat next to her. It did not look scared. It looked out of the window like a normal passenger.',
      'At the third station, the cat jumped down and walked out of the train. Yuki was surprised. "Where is it going?" she thought.',
      'The next day, the cat was there again. And the next day, too. Soon, other people on the train started to say hello to the cat. They called it "Mr. Gray." Nobody knew where it came from, or why it got off at the third station.',
      'On Friday, Yuki decided to follow the cat. She got off the train and walked behind it. The cat went down a quiet street and stopped in front of a hospital. A nurse opened the door and smiled. "Good morning, Mr. Gray," she said. "Your grandma is waiting for you."',
      'It turned out that the cat\'s owner, an old woman, was in the hospital. Every day, the cat took the train to visit her. Yuki smiled. "Now it makes sense," she said.',
    ],
    gloss: [['noticed', 'notice', '気づく'], ['strange', '奇妙な・変な'], ['seat', '座席'], ['scared', '怖がった'], ['passenger', '乗客'], ['surprised', '驚いた'], ['decided', 'decide', '決める'], ['follow', 'ついて行く'], ['owner', '飼い主・持ち主'], ['visit', '訪ねる']],
    phrases: [['next to', '〜の隣に'], ['got off', '（乗り物を）降りる（get off）'], ['It turned out that', '〜だとわかった（it turns out that）'], ['makes sense', 'なるほど・筋が通る（make sense）']],
    qs: [
      { q: 'ネコは毎日どこへ行っていましたか？', c: ['入院している飼い主に会いに病院へ', '駅の近くの魚屋へ', 'ユキの会社へ', '公園で遊びに'], a: 0, e: 'A nurse ... "Your grandma is waiting for you." → 飼い主が入院していた。' },
      { q: '"It turned out that ..." の意味に近いのは？', c: ['〜だとわかった', '〜に変わった', '〜を消した', '〜を回した'], a: 0, e: 'turn out ＝（結果として）〜だとわかる。物語・ニュースで超頻出。' },
    ],
  },
  {
    id: 'sky-blue', lv: 1, emoji: '🌤', genre: '科学', title: 'Why Is the Sky Blue?', ja: '空はなぜ青い？',
    sum: '太陽の光にはすべての色が混ざっている。空気にぶつかると、青い光は他の色より大きく散らばる（散乱）ので、どこを見ても青が目に入る。夕方は光が長い距離を通るため青が散ってしまい、赤やオレンジが残る。',
    text: [
      'Have you ever wondered why the sky is blue? The answer is in sunlight.',
      'Sunlight looks white, but actually it has all the colors of the rainbow in it: red, orange, yellow, green, blue, and purple. When sunlight comes into the air, it hits very small parts of the air. Then the light bounces in many directions. This is called "scattering."',
      'Blue light scatters much more than red light. So blue light goes everywhere in the sky. When you look up, blue light comes to your eyes from every direction. That is why the sky looks blue.',
      'But why is the sky red or orange in the evening? In the evening, the sun is low. Its light travels a much longer way through the air. On the way, most of the blue light scatters away. Only red and orange light reach your eyes.',
      'So the next time you see a beautiful sunset, remember: you are seeing the light that survived a long trip.',
    ],
    gloss: [['wondered', 'wonder', '不思議に思う'], ['actually', '実は'], ['rainbow', '虹'], ['bounces', 'bounce', '跳ね返る'], ['directions', 'direction', '方向'], ['scattering', '散乱（scatter 散らばる）'], ['travels', 'travel', '進む・移動する'], ['reach', '届く・到達する'], ['sunset', '夕日'], ['survived', 'survive', '生き残る']],
    phrases: [['Have you ever', '今までに〜したことがありますか'], ['That is why', 'そういうわけで'], ['On the way', '途中で'], ['the next time', '今度〜するとき']],
    qs: [
      { q: '空が青く見える理由は？', c: ['青い光は他の色より散らばりやすいから', '空気が青い色をしているから', '海の色が映るから', '太陽の光が青いから'], a: 0, e: 'Blue light scatters much more than red light.' },
      { q: '夕焼けが赤いのはなぜ？', c: ['光が長い距離を通る間に青い光が散ってしまうから', '夕方は太陽が赤くなるから', '雲が赤いから', '気温が下がるから'], a: 0, e: 'Its light travels a much longer way ... most of the blue light scatters away.' },
    ],
  },
  {
    id: 'octopus', lv: 1, emoji: '🐙', genre: '動物', title: 'Three Hearts and Blue Blood', ja: '心臓が3つ、血は青い',
    sum: 'タコには心臓が3つあり、血は青い。腕にも多くの神経細胞があり、腕が独自に動ける。ビンのふたを開けたり、色や模様を一瞬で変えて隠れたりする、とても賢い動物。',
    text: [
      'The octopus is one of the strangest animals in the sea. First, it has three hearts. Two hearts send blood to its gills, and one heart sends blood to the rest of its body.',
      'Second, its blood is blue, not red. Our blood uses iron to carry oxygen, but octopus blood uses copper. That is why it looks blue.',
      'Third, an octopus is very smart. Many of its brain cells are in its eight arms, not in its head. So each arm can touch, taste, and move almost on its own. In some aquariums, octopuses learned to open jars to get food inside. Some even escaped from their tanks at night!',
      'An octopus can also change its color and pattern in less than a second. It does this to hide from enemies. It can look like a rock, sand, or a plant.',
      'Scientists still study octopuses to learn how such a different brain works. Maybe one day, they will teach us something new about intelligence.',
    ],
    gloss: [['gills', 'gill', 'えら'], ['iron', '鉄'], ['oxygen', '酸素'], ['copper', '銅'], ['cells', 'cell', '細胞'], ['taste', '味わう'], ['jars', 'jar', 'ビン'], ['escaped', 'escape', '逃げる'], ['pattern', '模様・パターン'], ['enemies', 'enemy', '敵'], ['intelligence', '知能']],
    phrases: [['one of the', '〜のうちの1つ'], ['on its own', 'ひとりでに・自力で'], ['less than', '〜未満'], ['the rest of', '残りの〜']],
    qs: [
      { q: 'タコの血が青いのはなぜ？', c: ['酸素を運ぶのに銅を使うから', '海の水を飲むから', '心臓が3つあるから', '体が冷たいから'], a: 0, e: 'octopus blood uses copper. That is why it looks blue.' },
      { q: 'タコの腕が「ほぼ自力で」動ける理由は？', c: ['脳の細胞の多くが腕にあるから', '腕にも心臓があるから', '腕が8本あるから', '腕が青いから'], a: 0, e: 'Many of its brain cells are in its eight arms.' },
    ],
  },
  {
    id: 'honey', lv: 1, emoji: '🍯', genre: '科学', title: 'The Food That Does Not Go Bad', ja: '腐らない食べ物',
    sum: 'はちみつは正しく保存すれば、ほぼ腐らない。水分がとても少なく、酸性で、ハチが加える物質の働きもあり、細菌が生きられないから。ただし1歳未満の赤ちゃんには与えてはいけない。',
    text: [
      'Most food goes bad in a few days or weeks. Milk goes sour. Bread gets old and hard. But there is one food that can last for a very, very long time: honey.',
      'Scientists have found pots of honey in very old tombs in Egypt. The honey was thousands of years old. Some people say it was still safe to eat!',
      'Why does honey last so long? There are three reasons. First, honey has very little water. Bacteria need water to live, so they cannot grow in honey. Second, honey is acidic. Many bacteria do not like acid. Third, bees add a special substance to the honey. It helps to kill bacteria.',
      'But keep in mind one thing. If you leave the jar open, honey takes water from the air. Then it can go bad. So always close the lid.',
      'Also, never give honey to babies under one year old. It can make them very sick. For everyone else, honey is a sweet and amazing gift from bees.',
    ],
    gloss: [['sour', '酸っぱい'], ['last', '長持ちする・続く'], ['tombs', 'tomb', '墓'], ['safe', '安全な'], ['reasons', 'reason', '理由'], ['bacteria', '細菌'], ['acidic', '酸性の'], ['substance', '物質'], ['lid', 'ふた'], ['amazing', '驚くべき・すばらしい']],
    phrases: [['goes bad', '腐る（go bad）'], ['thousands of', '何千もの'], ['keep in mind', '覚えておく'], ['under one year old', '1歳未満の']],
    qs: [
      { q: 'はちみつで細菌が増えにくい理由に含まれないものは？', c: ['とても冷たいから', '水分が少ないから', '酸性だから', 'ハチが加える物質の働き'], a: 0, e: '本文の3つの理由は「水が少ない・酸性・ハチが加える物質」。' },
      { q: 'はちみつが腐ってしまうのはどんなとき？', c: ['ふたを開けたままにして空気中の水分を吸ったとき', '冷蔵庫に入れたとき', 'ビンに入れたとき', '暗い場所に置いたとき'], a: 0, e: 'If you leave the jar open, honey takes water from the air.' },
    ],
  },
  {
    id: 'wrong-number', lv: 1, emoji: '📞', genre: '物語', title: 'The Wrong Number', ja: 'まちがい電話',
    sum: '大学生のケンに、知らないおじいさんから間違い電話。おじいさんは孫に誕生日のお祝いを言いたかった。ケンは話を聞き、それから毎週日曜に電話で話すように。1年後、ケンは本当の孫のような存在になっていた。',
    text: [
      'One Sunday evening, Ken\'s phone rang. It was a number he did not know. "Hello?" he said.',
      '"Hello, Tom! Happy birthday!" said an old man. His voice was warm and happy.',
      '"I\'m sorry," said Ken. "I think you have the wrong number. My name is Ken."',
      'There was a long silence. Then the man said, "Oh. I\'m sorry. My grandson Tom changed his number, and I don\'t have the new one. I just wanted to say happy birthday." His voice sounded very sad.',
      'Ken did not hang up. "Tell me about Tom," he said. The old man\'s name was Mr. Sato. He talked about Tom, his garden, and his late wife. They talked for almost an hour.',
      'The next Sunday, Ken called Mr. Sato. And the next Sunday, too. It became a habit. Ken learned how to grow tomatoes, and Mr. Sato learned how to send photos on his phone.',
      'A year later, Mr. Sato sent Ken a message: "Happy birthday, Ken. Thank you for calling the wrong number back."',
    ],
    gloss: [['rang', 'ring', '鳴る'], ['voice', '声'], ['silence', '沈黙'], ['grandson', '孫（男）'], ['sounded', 'sound', '〜に聞こえる'], ['late', '亡くなった（名詞の前で）'], ['habit', '習慣'], ['grow', '育てる']],
    phrases: [['the wrong number', 'まちがい電話（の番号）'], ['hang up', '電話を切る'], ['for almost an hour', '1時間近く'], ['A year later', '1年後']],
    qs: [
      { q: 'おじいさんはなぜ電話をかけてきた？', c: ['孫に誕生日のお祝いを言いたかったから', 'ケンに用事があったから', 'トマトの育て方を聞きたかったから', '番号を変えたと伝えたかったから'], a: 0, e: '"I just wanted to say happy birthday."' },
      { q: '"his late wife" の意味は？', c: ['亡くなった妻', '遅刻した妻', '若い妻', '最近の妻'], a: 0, e: '名詞の前の late は「亡くなった・故〜」の意味になることがある。' },
    ],
  },
  {
    id: 'honest-robot', lv: 1, emoji: '🤖', genre: '物語', title: 'My Robot Is Too Honest', ja: '正直すぎるロボット',
    sum: '新しい家事ロボット「ボブ」は何でも正直に言う。料理の味、髪型、テストの点まで。家族は困るが、おばあちゃんの「正直さと優しさは一緒に使うもの」という言葉でボブは学ぶ。最後には言い方を工夫できるようになる。',
    text: [
      'Last month, my family bought a new home robot. We named it Bob. Bob can cook, clean, and talk. But Bob has one big problem: Bob is too honest.',
      'On the first day, my father cooked dinner. "How is it, Bob?" he asked. Bob said, "The soup has too much salt. It is 40 percent saltier than a normal soup." My father stopped smiling.',
      'The next morning, my sister got a new haircut. "Do you like it?" she asked. "Your old hair was better," said Bob. My sister ran to her room.',
      'Then I showed Bob my math test. I got 62 points. "Your score is below the class average," said Bob. "You should study more and play fewer video games." He was right, but I did not want to hear it.',
      'That evening, my grandmother talked to Bob. "Bob, being honest is good," she said. "But honesty and kindness should work together."',
      'Bob was quiet for a while. The next day, my father cooked again. "How is it?" he asked. Bob said, "I can tell you worked hard. Next time, maybe use a little less salt." My father laughed. In the end, Bob was still honest, but now he was kind, too.',
    ],
    gloss: [['honest', '正直な'], ['salt', '塩'], ['percent', 'パーセント'], ['haircut', '髪型・散髪'], ['score', '点数'], ['average', '平均'], ['honesty', '正直さ'], ['kindness', '優しさ']],
    phrases: [['below the class average', 'クラス平均より下'], ['for a while', 'しばらくの間'], ['I can tell', '（見て）わかる'], ['In the end', '最後には']],
    qs: [
      { q: 'おばあちゃんがボブに伝えたことは？', c: ['正直さと優しさは一緒に使うべき', 'うそをつきなさい', 'もっと料理を練習しなさい', '何も言わないほうがいい'], a: 0, e: '"honesty and kindness should work together."' },
      { q: '"I can tell you worked hard." の tell の意味は？', c: ['わかる・見分ける', '話す', '命令する', '数える'], a: 0, e: 'can tell ＝ 見て・聞いてわかる。会話で頻出。' },
    ],
  },
]);
