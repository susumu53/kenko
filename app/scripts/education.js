/**
 * 実現健康長寿アプリ — Education Module
 * インタラクティブ学習コンテンツ（理論文書の6レッスン構造）
 */

const Education = (() => {

  const lessons = [
    {
      id: 'bluezones',
      number: 1,
      title: 'ブルーゾーンの秘密',
      subtitle: '世界5大長寿地域に共通する9つのルール',
      icon: '🌍',
      color: 'var(--ring-3)',
      bgColor: 'var(--color-primary-surface)',
      duration: '8分',
      content: [
        {
          type: 'intro',
          text: '世界には、100歳以上の人々が異常に多く暮らす地域が5ヶ所あります。それらは「ブルーゾーン」と呼ばれ、ダン・ビュイトナー氏らの研究チームが疫学的に詳細な調査を行いました。',
        },
        {
          type: 'fact',
          title: '寿命を決めるのは遺伝か環境か？',
          text: '研究結果は明確です。遺伝的要因は寿命の20〜30%しか決定しません。残りの70〜80%は環境やライフスタイル（後天的要因）に依存しています。',
          highlight: '70〜80%は変えられる',
        },
        {
          type: 'list',
          title: '5つのブルーゾーン',
          items: [
            { emoji: '🇯🇵', text: '日本・沖縄 — 「生きがい」と「模合」の文化' },
            { emoji: '🇮🇹', text: 'イタリア・サルデーニャ島 — 羊飼いの自然な身体活動' },
            { emoji: '🇺🇸', text: 'アメリカ・ロマリンダ — 聖書に基づく菜食主義' },
            { emoji: '🇨🇷', text: 'コスタリカ・ニコヤ半島 — 「プラン・デ・ビーダ」の目的意識' },
            { emoji: '🇬🇷', text: 'ギリシャ・イカリア島 — 昼寝の習慣と地中海食' },
          ],
        },
        {
          type: 'table',
          title: 'Power 9（9つのルール）',
          rows: [
            ['🚶 自然に動く', 'ジムではなく日常で動く。サルデーニャの羊飼いは毎日8km歩く'],
            ['🎯 目的を持つ', '沖縄の「生きがい」。毎朝起きる理由を持つことで健康寿命+7年'],
            ['🧘 ダウンシフト', 'ストレスを管理する習慣。祈り、昼寝、ハッピーアワー'],
            ['🍽️ 腹八分目', '80%で食事を終える。カロリー制限が細胞老化を遅らせる'],
            ['🥬 植物中心', '豆類・野菜中心の食事。肉は月数回の特別な日だけ'],
            ['🍷 適度な飲酒', '1日1〜2杯を友人と。サルデーニャのワインは抗酸化物質が豊富'],
            ['🙏 帰属意識', '信仰やコミュニティへの帰属が寿命を4〜14年延長'],
            ['👨‍👩‍👧 家族優先', '親をケアし、パートナーと子どもに時間を注ぐ'],
            ['👥 正しい仲間', '健康行動を促す友人の輪。沖縄の「模合」が典型'],
          ],
        },
        {
          type: 'quiz',
          question: 'ブルーゾーンの研究によると、寿命を決定する遺伝的要因はどのくらい？',
          options: ['約50%', '約70〜80%', '約20〜30%', '約90%'],
          correct: 2,
          explanation: '遺伝的要因は約20〜30%。残りの70〜80%は生活習慣や環境で決まるため、誰でも健康長寿への道を歩めます。',
        },
      ],
    },
    {
      id: 'bioage',
      number: 2,
      title: 'あなたの体は何歳？',
      subtitle: 'エピジェネティック・クロックと生物学的年齢の科学',
      icon: '🧬',
      color: 'var(--ring-1)',
      bgColor: 'var(--color-accent-water-surface)',
      duration: '7分',
      content: [
        {
          type: 'intro',
          text: '「ゲロサイエンス（加齢科学）」は、がん・心疾患・認知症など個別の疾患を治療するのではなく、それらすべての根底にある「老化そのもの」を標的とする革新的な学問分野です。',
        },
        {
          type: 'fact',
          title: 'エピジェネティック・クロックとは？',
          text: '2013年にスティーブ・ホーヴァス博士が開発。DNAのメチル化パターンをAIで解析し「体内年齢（生物学的年齢）」を推定する技術です。実年齢より生物学的年齢が高い人は、1歳差あたり死亡リスクが約10%上昇します。',
          highlight: '老化速度の60%は生活習慣で決まる',
        },
        {
          type: 'fact',
          title: 'TAME試験 — 老化を「治療」する時代へ',
          text: 'メトホルミン（安価な糖尿病治療薬）が、人間の加齢関連疾患の発症を遅らせ、健康寿命を延伸できるかを検証する大規模臨床試験。成功すれば「老化自体が治療対象」となる新時代が幕を開けます。',
          highlight: '3,000人以上が参加する世界初の抗老化臨床試験',
        },
        {
          type: 'action',
          title: '今日からできること',
          items: [
            '適度な運動（週3日以上、30分以上の散歩や体操）',
            '質の高い睡眠（6〜8時間）',
            '抗炎症食品の摂取（野菜、果物、魚、全粒穀物）',
            'ストレス管理（瞑想、趣味、自然の中での時間）',
          ],
        },
        {
          type: 'quiz',
          question: 'エピジェネティック年齢の何%が後天的な生活習慣で決まる？',
          options: ['約20%', '約40%', '約60%', '約90%'],
          correct: 2,
          explanation: '約60%が生活習慣で決定・可逆されます。つまり、適切な運動、睡眠、食事によって老化のスピードを遅らせることが可能です。',
        },
      ],
    },
    {
      id: 'frailty',
      number: 3,
      title: 'フレイルを知る・防ぐ',
      subtitle: '予防の三位一体モデル：栄養・運動・社会参加',
      icon: '🛡️',
      color: 'var(--ring-2)',
      bgColor: 'var(--color-secondary-surface)',
      duration: '6分',
      content: [
        {
          type: 'intro',
          text: 'フレイル（虚弱）は、健康な状態と要介護状態の間に位置する段階です。最大の特性は「可逆性」——適切な介入で再び健康な状態に戻ることが可能です。',
        },
        {
          type: 'list',
          title: 'フレイルのサイン（J-CHS基準）',
          items: [
            { emoji: '⚖️', text: '意図しない体重減少（6ヶ月で2〜3kg以上）' },
            { emoji: '😩', text: '理由のない疲労感' },
            { emoji: '🐢', text: '歩行速度の低下' },
            { emoji: '💪', text: '握力の低下' },
            { emoji: '🏠', text: '運動習慣の欠如' },
          ],
        },
        {
          type: 'fact',
          title: '予防の三位一体',
          text: '① 栄養（タンパク質のちょい足し、口腔ケア）② 運動（今より10分多く動く）③ 社会参加（最も重要！フレイルの入り口は社会的孤立）',
          highlight: '社会参加が最も重要なフレイル予防',
        },
        {
          type: 'quiz',
          question: 'フレイル予防の三位一体で「最も重要」とされるのは？',
          options: ['栄養管理', '運動習慣', '社会参加', '医薬品投与'],
          correct: 2,
          explanation: '社会参加が「フレイルの入り口」と位置づけられています。人と会う目的が外出（運動）を促し、共食（栄養）の機会を増やすポジティブ・スパイラルを生み出します。',
        },
      ],
    },
    {
      id: 'social_prescription',
      number: 4,
      title: '社会的つながりの処方箋',
      subtitle: '社会的処方とリンクワーカーの革新',
      icon: '💊',
      color: 'var(--ring-4)',
      bgColor: 'var(--color-accent-sakura-surface)',
      duration: '7分',
      content: [
        {
          type: 'intro',
          text: '薬ではなく「地域とのつながり」を処方する——これが社会的処方（Social Prescribing）です。イギリスのNHSで制度化され、日本でも導入が進んでいます。',
        },
        {
          type: 'fact',
          title: '佐世保の奇跡',
          text: '荒れた学校への赴任を契機にアルコール依存症とうつ病を患い、引きこもりとなった50代の元教師。リンクワーカーとの対話で「教師としての情熱」を引き出し、29年ぶりに子どもたちの前で授業を行ったことで、劇的に回復しました。',
          highlight: '社会的処方がうつ病からの回復を実現',
        },
        {
          type: 'fact',
          title: '上野モデル「ミュージアム処方」',
          text: '東京都台東区・上野エリアでは、医療機関から患者に美術館や博物館への訪問を処方する「ミュージアム処方」を試行。文化的資源で心理的ウェルビーイングを向上させる先進モデルです。',
          highlight: 'アートや歴史で孤立を解消',
        },
        {
          type: 'quiz',
          question: '社会的処方において中核的な役割を担う専門職の名称は？',
          options: ['ケアマネジャー', 'リンクワーカー', 'ソーシャルワーカー', 'ヘルスプロモーター'],
          correct: 1,
          explanation: 'リンクワーカーは、患者と地域資源を「つなぐ」専門職です。対話を通じて患者の潜在的な強みや関心を引き出し、最適なコミュニティ活動へと接続します。',
        },
      ],
    },
    {
      id: 'japan_cases',
      number: 5,
      title: '日本の先進事例',
      subtitle: '長野県、武豊町、市原市、神石高原町の挑戦',
      icon: '🗾',
      color: 'var(--color-secondary)',
      bgColor: 'var(--color-secondary-surface)',
      duration: '8分',
      content: [
        {
          type: 'intro',
          text: '理論を現場で実証し、世界が注目する成果を上げた日本の自治体の取り組みを紹介します。',
        },
        {
          type: 'fact',
          title: '🏔️ 長野県「塩分Gメン」の草の根革命',
          text: '1960年代、脳卒中死亡率ワースト1位だった長野県。保健補導員（延べ25万人）が「減塩テープ」を持って各家庭を訪問し、「みそ汁は1日1杯具だくさん」運動を全県展開。現在は男女ともトップクラスの長寿県に変貌しました。',
          highlight: '住民ボランティア25万人が県を変えた',
        },
        {
          type: 'fact',
          title: '🏘️ 愛知県武豊町「通いの場」',
          text: 'JAGESと連携し、歩いて通える範囲に「憩いのサロン」を設置。参加群はフレイル発症リスクが半減、11年間の累積介護給付費が1人当たり30〜50万円低下。',
          highlight: 'フレイル発症リスク半減の実証',
        },
        {
          type: 'fact',
          title: '⚡ 広島県神石高原町「デジタル×通いの場」',
          text: 'ウェアラブルデバイスとゲーミフィケーションで、男性の参加を牽引。1日の平均歩数が3,800歩増加、年間1人当たり約35,000円の医療費削減効果。',
          highlight: '平均歩数3,800歩増・医療費35,000円削減',
        },
        {
          type: 'quiz',
          question: '長野県の減塩運動で使われた、みそ汁の塩分を測定する道具は？',
          options: ['塩分テープ', '塩分メーター', '減塩テープ', '味覚テスト'],
          correct: 2,
          explanation: '減塩テープはみそ汁の塩分濃度が一目でわかるツールで、保健補導員がこれを使って各家庭の味付けを調査しました。メディアでは「塩分Gメン」と称されました。',
        },
      ],
    },
    {
      id: 'ikigai',
      number: 6,
      title: '私の「生きがい」を見つける',
      subtitle: 'Purpose — 健康寿命を7年延ばす魔法の力',
      icon: '✨',
      color: 'var(--color-accent-sakura)',
      bgColor: 'var(--color-accent-sakura-surface)',
      duration: '6分',
      content: [
        {
          type: 'intro',
          text: 'ブルーゾーンの研究で最も力強いメッセージの一つ——「毎朝起きる理由を持つこと」は、健康寿命を約7年延長する効果があります。沖縄では「生きがい」、コスタリカでは「プラン・デ・ビーダ」と呼ばれるこの概念を、自分自身の人生に落とし込んでみましょう。',
        },
        {
          type: 'fact',
          title: '生きがいの4つの要素',
          text: '日本語の「生きがい」は、①好きなこと ②得意なこと ③世界が必要としていること ④報酬を得られること——この4つが重なる領域に存在すると言われています。',
          highlight: '4つの円が重なるところに生きがいがある',
        },
        {
          type: 'worksheet',
          title: '🔍 自分の「生きがい」を探すワークシート',
          prompts: [
            '子どもの頃、夢中になっていたことは何ですか？',
            '人から「ありがとう」と言われることが多い場面は？',
            '時間を忘れて没頭できる活動は何ですか？',
            '「これは自分にしかできない」と感じることは？',
            '地域や社会のために、自分ができそうなことは？',
          ],
        },
        {
          type: 'quiz',
          question: 'ブルーゾーン研究によると、「生きがい」を持つことで健康寿命はどのくらい延びる？',
          options: ['約2年', '約5年', '約7年', '約12年'],
          correct: 2,
          explanation: '毎朝起きる理由——「生きがい」を持つことは、困難な状況下での回復力（レジリエンス）を高め、健康寿命を約7年延長する効果があるとされています。',
        },
      ],
    },
  ];

  let currentLesson = null;
  let currentContentIndex = 0;

  function renderList(container) {
    const completed = Store.get('education.completedLessons') || [];

    container.innerHTML = `
      <div class="education-list animate-fade">
        <h2 style="font-size: var(--text-2xl); font-weight: 700; margin-bottom: var(--space-2);">
          📚 学びの道
        </h2>
        <p class="text-muted mb-6">健康長寿の理論を楽しく学びましょう</p>

        <div class="progress-bar mb-6">
          <div class="progress-bar__fill" style="width: ${(completed.length / lessons.length) * 100}%;"></div>
        </div>
        <p class="text-sm text-muted mb-6">${completed.length} / ${lessons.length} レッスン完了</p>

        <div class="lesson-list stagger">
          ${lessons.map(l => {
            const done = completed.includes(l.id);
            return `
              <div class="lesson-card" data-lesson="${l.id}">
                <div class="lesson-card__number" style="background: ${l.bgColor}; color: ${l.color};">
                  ${done ? '✓' : l.number}
                </div>
                <div class="lesson-card__content">
                  <div class="lesson-card__title">${l.icon} ${l.title}</div>
                  <div class="lesson-card__desc">${l.subtitle}</div>
                  <div class="text-xs text-muted mt-1">⏱️ ${l.duration}</div>
                </div>
                <div class="lesson-card__arrow">→</div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Official Certifications Section -->
        <div class="mt-8" style="margin-top: 2rem;">
          <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.75rem;">
            🎓 公式認定資格・修了試験
          </h3>
          <p class="text-sm text-muted mb-4">学んだ知識を定着させ、公式な認定証（PDF）を即時発行できます。</p>

          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <!-- Kenko Advisor Exam -->
            <a href="certificate/index.html" class="card" style="display: flex; align-items: center; justify-content: space-between; text-decoration: none; padding: 1rem 1.25rem; border: 1px solid var(--color-border); border-left: 4px solid #1B7A4E; background: var(--color-surface); transition: transform 0.15s ease;">
              <div>
                <div style="font-weight: 700; color: #1B7A4E; font-size: 0.95rem;">🌿 健康長寿アドバイザー 修了試験</div>
                <div class="text-xs text-muted" style="margin-top: 0.25rem;">初級・中級・上級対応 / 合格後PDF公式修了証を即時発行</div>
              </div>
              <span style="font-weight: 700; color: #1B7A4E;">受検 ↗</span>
            </a>

            <!-- Inochi Learning Exam -->
            <a href="inochi-certificate/index.html" class="card" style="display: flex; align-items: center; justify-content: space-between; text-decoration: none; padding: 1rem 1.25rem; border: 1px solid var(--color-border); border-left: 4px solid #1E3A5F; background: var(--color-surface); transition: transform 0.15s ease;">
              <div>
                <div style="font-weight: 700; color: #1E3A5F; font-size: 0.95rem;">🕊️ いのちを学ぶ基礎講座 修了試験</div>
                <div class="text-xs text-muted" style="margin-top: 0.25rem;">ゲートキーパー × グリーフケア 基礎認定 / 完全無料・全25問</div>
              </div>
              <span style="font-weight: 700; color: #1E3A5F;">受検 ↗</span>
            </a>
          </div>
        </div>
      </div>
    `;

    container.querySelectorAll('.lesson-card').forEach(el => {
      el.addEventListener('click', () => {
        const lessonId = el.dataset.lesson;
        currentLesson = lessons.find(l => l.id === lessonId);
        currentContentIndex = 0;
        renderLessonContent(container);
      });
    });
  }

  function renderLessonContent(container) {
    if (!currentLesson) return;
    const item = currentLesson.content[currentContentIndex];
    const progress = ((currentContentIndex + 1) / currentLesson.content.length) * 100;

    let contentHtml = '';

    switch (item.type) {
      case 'intro':
        contentHtml = `
          <div class="card" style="background: ${currentLesson.bgColor}; border: none;">
            <p style="font-size: var(--text-lg); line-height: var(--leading-relaxed);">${item.text}</p>
          </div>
        `;
        break;

      case 'fact':
        contentHtml = `
          <div class="card">
            <h3 style="font-size: var(--text-xl); font-weight: 700; margin-bottom: var(--space-3);">${item.title}</h3>
            <p style="line-height: var(--leading-relaxed); margin-bottom: var(--space-4);">${item.text}</p>
            ${item.highlight ? `
              <div style="padding: var(--space-3) var(--space-4); background: var(--color-primary-surface); border-left: 4px solid var(--color-primary); border-radius: 0 var(--radius-md) var(--radius-md) 0;">
                <strong style="color: var(--color-primary);">💡 ${item.highlight}</strong>
              </div>
            ` : ''}
          </div>
        `;
        break;

      case 'list':
        contentHtml = `
          <div class="card">
            <h3 style="font-size: var(--text-xl); font-weight: 700; margin-bottom: var(--space-4);">${item.title}</h3>
            <div class="stagger">
              ${item.items.map(i => `
                <div style="display: flex; align-items: flex-start; gap: var(--space-3); padding: var(--space-2) 0;">
                  <span style="font-size: var(--text-xl); flex-shrink: 0;">${i.emoji}</span>
                  <span style="line-height: var(--leading-relaxed);">${i.text}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;
        break;

      case 'table':
        contentHtml = `
          <div class="card">
            <h3 style="font-size: var(--text-xl); font-weight: 700; margin-bottom: var(--space-4);">${item.title}</h3>
            <div style="display: flex; flex-direction: column; gap: var(--space-3);">
              ${item.rows.map(([title, desc]) => `
                <div style="padding: var(--space-3); background: var(--color-bg-alt); border-radius: var(--radius-md);">
                  <div style="font-weight: 600; margin-bottom: var(--space-1);">${title}</div>
                  <div class="text-sm text-muted">${desc}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
        break;

      case 'quiz':
        contentHtml = `
          <div class="card">
            <h3 style="font-size: var(--text-xl); font-weight: 700; margin-bottom: var(--space-4);">🧩 クイズ</h3>
            <p style="font-size: var(--text-lg); margin-bottom: var(--space-4); line-height: var(--leading-relaxed);">${item.question}</p>
            <div class="option-group" id="quiz-options">
              ${item.options.map((opt, i) => `
                <div class="option-card" data-index="${i}">
                  <div class="option-card__radio"></div>
                  <div class="option-card__text">${opt}</div>
                </div>
              `).join('')}
            </div>
            <div id="quiz-result" class="mt-4 hidden"></div>
          </div>
        `;
        break;

      case 'action':
        contentHtml = `
          <div class="card" style="background: var(--color-primary-surface); border: none;">
            <h3 style="font-size: var(--text-xl); font-weight: 700; margin-bottom: var(--space-4);">🎯 ${item.title}</h3>
            <div class="stagger">
              ${item.items.map(i => `
                <div style="display: flex; align-items: flex-start; gap: var(--space-3); padding: var(--space-2) 0;">
                  <span style="color: var(--color-primary); font-weight: 700;">✓</span>
                  <span style="line-height: var(--leading-relaxed);">${i}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;
        break;

      case 'worksheet':
        contentHtml = `
          <div class="card">
            <h3 style="font-size: var(--text-xl); font-weight: 700; margin-bottom: var(--space-4);">${item.title}</h3>
            <div style="display: flex; flex-direction: column; gap: var(--space-4);">
              ${item.prompts.map((p, i) => `
                <div>
                  <label class="form-label">${i + 1}. ${p}</label>
                  <textarea class="form-input" rows="2" placeholder="自由に書いてみましょう..." style="resize: vertical;"></textarea>
                </div>
              `).join('')}
            </div>
          </div>
        `;
        break;
    }

    container.innerHTML = `
      <div class="lesson-view animate-fade" style="max-width: 640px; margin: 0 auto;">
        <div class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <button class="btn btn--ghost btn--sm" id="lesson-back-to-list">← 一覧に戻る</button>
            <span class="text-sm text-muted">${currentContentIndex + 1} / ${currentLesson.content.length}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-bar__fill" style="width: ${progress}%;"></div>
          </div>
        </div>

        <div class="mb-2">
          <span class="badge" style="background: ${currentLesson.bgColor}; color: ${currentLesson.color};">
            Lesson ${currentLesson.number}
          </span>
        </div>
        <h2 style="font-size: var(--text-2xl); font-weight: 700; margin-bottom: var(--space-6);">
          ${currentLesson.icon} ${currentLesson.title}
        </h2>

        ${contentHtml}

        <div class="flex justify-between mt-6" style="gap: var(--space-3);">
          <button class="btn btn--ghost" id="lesson-prev" ${currentContentIndex === 0 ? 'disabled style="opacity:0.3"' : ''}>
            ← 前へ
          </button>
          <button class="btn btn--primary" id="lesson-next">
            ${currentContentIndex === currentLesson.content.length - 1 ? '完了 ✓' : '次へ →'}
          </button>
        </div>
      </div>
    `;

    // Quiz interaction
    if (item.type === 'quiz') {
      const quizOptions = document.getElementById('quiz-options');
      const quizResult = document.getElementById('quiz-result');
      quizOptions?.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', () => {
          const idx = Number(card.dataset.index);
          const correct = idx === item.correct;
          quizOptions.querySelectorAll('.option-card').forEach(c => {
            c.classList.remove('selected');
            c.style.opacity = '0.5';
          });
          card.classList.add('selected');
          card.style.opacity = '1';
          card.style.borderColor = correct ? 'var(--color-success)' : 'var(--color-danger)';

          // Show correct answer
          const correctCard = quizOptions.querySelectorAll('.option-card')[item.correct];
          correctCard.style.opacity = '1';
          correctCard.style.borderColor = 'var(--color-success)';
          correctCard.style.background = 'var(--color-primary-surface)';

          quizResult.classList.remove('hidden');
          quizResult.innerHTML = `
            <div style="padding: var(--space-3) var(--space-4); border-radius: var(--radius-md); background: ${correct ? 'var(--color-primary-surface)' : 'var(--color-accent-sakura-surface)'};">
              <strong>${correct ? '✅ 正解です！' : '❌ 不正解'}</strong>
              <p class="text-sm mt-2">${item.explanation}</p>
            </div>
          `;

          // Store quiz result
          const scores = Store.get('education.quizScores') || {};
          scores[currentLesson.id] = correct;
          Store.set('education.quizScores', scores);
        });
      });
    }

    // Navigation
    document.getElementById('lesson-back-to-list')?.addEventListener('click', () => {
      currentLesson = null;
      renderList(container);
    });

    document.getElementById('lesson-prev')?.addEventListener('click', () => {
      if (currentContentIndex > 0) {
        currentContentIndex--;
        renderLessonContent(container);
      }
    });

    document.getElementById('lesson-next')?.addEventListener('click', () => {
      if (currentContentIndex < currentLesson.content.length - 1) {
        currentContentIndex++;
        renderLessonContent(container);
      } else {
        // Mark lesson as completed
        const completed = Store.get('education.completedLessons') || [];
        if (!completed.includes(currentLesson.id)) {
          completed.push(currentLesson.id);
          Store.set('education.completedLessons', completed);
        }
        currentLesson = null;
        renderList(container);
      }
    });
  }

  function render(container) {
    if (currentLesson) {
      renderLessonContent(container);
    } else {
      renderList(container);
    }
  }

  return { render, renderList, lessons };
})();
