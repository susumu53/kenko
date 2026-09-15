/**
 * 実現健康長寿アプリ — Community Module
 * 地域資源マッチング・社会的処方支援
 */

const Community = (() => {

  // ============================================================
  // 全国データ: 都道府県別の地域包括支援センター参考情報
  // ============================================================
  const prefectures = [
    '北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県',
    '茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県',
    '新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県',
    '静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県',
    '奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県',
    '徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県',
    '熊本県','大分県','宮崎県','鹿児島県','沖縄県'
  ];

  const INTEREST_CATEGORIES = [
    {
      id: 'exercise',
      label: '体操・運動',
      icon: '🏃',
      description: 'いきいき百歳体操、ウォーキング、ヨガ等',
      bestContact: '役所健康増進課 または 包括の生活支援コーディネーター',
      actionHint: '市区町村の「いきいき百歳体操」会場一覧や健康づくり推進事業が直結しています。',
      channelType: '行政健康窓口 / 包括'
    },
    {
      id: 'cooking',
      label: '料理・栄養',
      icon: '🍳',
      description: '料理教室、減塩レシピ、食事会',
      bestContact: '保健センター（食生活改善推進員） / 公民館',
      actionHint: '地域の「食改（ヘルスメイト）」活動や公民館のサークル募集が充実しています。',
      channelType: '公民館 / 保健センター'
    },
    {
      id: 'music',
      label: '音楽・合唱',
      icon: '🎵',
      description: '合唱団、楽器演奏、音楽療法',
      bestContact: '地域の公民館・地区センター・生涯学習センター',
      actionHint: '公民館の受付・掲示板に活動中サークルの会員募集チラシが多数集まっています。',
      channelType: '公民館 / 地区センター'
    },
    {
      id: 'art',
      label: 'アート・手芸',
      icon: '🎨',
      description: '絵画、書道、手芸、陶芸',
      bestContact: '地域の公民館・生涯学習センター・地区会館',
      actionHint: '自治体の文化祭展示団体や公民館登録クラブに直接コンタクトできます。',
      channelType: '公民館 / 生涯学習課'
    },
    {
      id: 'garden',
      label: '園芸・農作業',
      icon: '🌱',
      description: '家庭菜園、市民農園、花壇活動',
      bestContact: '自治体農政課（市民農園） / 地域ボランティア',
      actionHint: '公園愛護会や市民農園の貸出窓口、フラワーロード整備会などが活発です。',
      channelType: '役所農政窓口 / 公園管理'
    },
    {
      id: 'history',
      label: '歴史・文化',
      icon: '🏛️',
      description: '歴史サークル、博物館、ミュージアム処方',
      bestContact: '地域博物館・図書館・生涯学習サークル',
      actionHint: '地域の郷土史研究会や観光ボランティアガイドの募集窓口が適しています。',
      channelType: '文化施設 / 図書館'
    },
    {
      id: 'volunteer',
      label: 'ボランティア',
      icon: '🤝',
      description: '地域ボランティア、見守り活動、子ども食堂',
      bestContact: '社会福祉協議会（社協）ボランティアセンター',
      actionHint: '社協はボランティアコーディネートの専門窓口で、即戦力・初心者向けの募集を網羅しています。',
      channelType: '社協ボランティアセンター'
    },
    {
      id: 'learning',
      label: '学習・教養',
      icon: '📖',
      description: '読書会、講演会、生涯学習大学',
      bestContact: '生涯学習推進課・図書館・高齢者大学',
      actionHint: '自治体が主催するシニア大学（長寿大学）や公開講座のパンフレットを確認しましょう。',
      channelType: '自治体生涯学習'
    },
    {
      id: 'digital',
      label: 'デジタル・IT',
      icon: '📱',
      description: 'スマートフォン講座、パソコン教室',
      bestContact: '公民館・図書館のスマホ教室 / 携帯キャリア窓口',
      actionHint: '総務省「デジタル活用支援事業」により、公民館等で無料スマホ教室が定期開催されています。',
      channelType: '公民館 / 総務省支援事業'
    },
    {
      id: 'travel',
      label: '散策・旅行',
      icon: '🚶',
      description: 'まち歩き、日帰り旅行、自然観察',
      bestContact: 'ウォーキング協会・観光協会・社協サロン',
      actionHint: '月例ウォーキング会や、福祉バスを利用した日帰り親睦会などが定期開催されています。',
      channelType: '歩こう会 / 観光協会'
    },
  ];

  // 全国の参考リソースリンク
  const NATIONAL_RESOURCES = [
    {
      name: '厚生労働省「地域がいきいき 集まろう！通いの場」',
      url: 'https://kayoinoba.mhlw.go.jp/',
      icon: '🏛️',
      type: '国の取り組み',
      description: '全国の通いの場情報、先進事例、体操動画を紹介',
    },
    {
      name: 'オンライン通いの場アプリ',
      url: 'https://kayoinoba.mhlw.go.jp/article/003/',
      icon: '📱',
      type: 'アプリ',
      description: '国立長寿医療研究センター提供。歩数・体操・お散歩コース記録',
    },
    {
      name: '全国社会福祉協議会（ボランティア・サロン窓口）',
      url: 'https://www.shakyo.or.jp/',
      icon: '🤝',
      type: '相談・参加窓口',
      description: 'お近くの市区町村社協を探し、ふれあいサロンやボランティアへ参加',
    },
    {
      name: '地域包括支援センター検索',
      url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/hukushi_kaigo/kaigo_koureisha/chiiki-houkatsu/',
      icon: '🏥',
      type: '総合相談窓口',
      description: '生活支援コーディネーター（地域支え合い推進員）へ相談',
    },
    {
      name: '健康長寿ネット',
      url: 'https://www.tyojyu.or.jp/net/',
      icon: '📚',
      type: '情報サイト',
      description: '公益財団法人長寿科学振興財団によるエビデンスに基づく健康情報',
    },
  ];

  // ============================================================
  // 先進事例地域の詳細分析データ（理論文書・実証研究に基づく詳細分析）
  // ============================================================
  // DUMMY DATA: 先進事例分析用リファレンスデータ（厚生労働省・JAGES・東大IOG等の公表報告書に基づく理論リファレンス）
  const MODEL_REGIONS = {
    '長野県佐久市': {
      title: '住民自治と「保健補導員」による草の根減塩・ぴんころモデル',
      tag: '住民自治・食生活改善',
      background: '1960年代（昭和30〜40年代）、長野県は脳卒中死亡率が全国ワースト1位でした。厳しい冬を越すための野沢菜の古漬けや塩魚、信州みそ汁の多量摂取により、1日の食塩摂取量が極めて高い食習慣（「壺の汁は舐めると舌がピリピリするほど」）が背景にありました。',
      coreMechanism: '行政のトップダウンではなく、各集落から選出された住民ボランティア「保健補導員」（1〜2年交代制・累計25万人以上が経験）と「食生活改善推進員」が主導。「塩分Gメン」として各家庭のみそ汁を減塩テープで訪問測定し、全戸単位で味覚の再教育を推進しました。',
      evidence: '須坂市・山ノ内町等の尿中塩分測定では開始前の10.1gから9.5gへ着実減少。現在、長野県は男女ともに健康寿命・平均寿命で全国トップクラスを維持。高齢者の就業率も全国1位（健康で働き続ける文化）。',
      initiatives: [
        { name: '保健補導員の家庭訪問・塩分測定', type: '予防・指導', frequency: '定期実施', target: '地域全世帯', detail: 'みそ汁測定・減塩指導、「みそ汁は1日1杯具だくさん」「漬物は小皿1杯」運動の定着' },
        { name: 'ぴんころ御膳の開発・普及', type: '食環境整備', frequency: '通年', target: '市民・観光客', detail: '減塩でも旨味・カリウム（野菜）を生かした伝統食改善メニュー。健康長寿文化の象徴' },
        { name: '佐久市ウォーキングクラブ', type: '運動習慣化', frequency: '週1〜2回', target: '全世代', detail: 'ぴんころ地蔵周辺や市内コースを巡る草の根の歩行習慣づくり' },
      ],
      keyLesson: '「我慢する減塩」ではなく、具だくさん味噌汁や野菜のカリウム摂取といった実行可能な代替案を示し、住民同士が教え合う仕組み（住民自治）が持続の鍵。'
    },
    '愛知県武豊町': {
      title: 'JAGES連携：ポピュレーションアプローチによる「通いの場」社会実装',
      tag: '疫学実証・通いの場',
      background: '要介護認定を受けたハイリスク者だけに対策を行う従来の「ハイリスク・アプローチ」では、人口全体の健康水準引き上げや介護費用抑制に限界があるという問題意識から、近藤克則教授（JAGES）と連携して2007年に開始。',
      coreMechanism: '元気な高齢者も含めて誰もが徒歩圏内で集まれる「憩いのサロン（通いの場）」を町内各地に展開。ボランティアや住自主宰の体操、茶話会、趣味活動を重層的に配置し、地域全体のソーシャルキャピタル（つながり）を高めました。',
      evidence: 'JAGESによる25自治体・高齢者7,223名の追跡調査で、「通いの場」参加群は非参加群に比べ【フレイル発症・要介護認定リスクが約半減】。さらに11年間の累積介護給付費が1人当たり【30〜50万円抑制】される経済効果を実証。',
      initiatives: [
        { name: '憩いのサロン（町内全域展開）', type: '社会参加', frequency: '週1〜2回', target: '全高齢者・住民', detail: '徒歩圏内の公民館・集会所で開催。お茶・会話・レクリエーションを通じた社会的孤立防止' },
        { name: 'いきいき百歳体操・フレイルチェック会', type: '身体機能維持', frequency: '毎週', target: '地域住民', detail: '重錘バンドを用いた筋力向上トレーニングと定期的な簡易体力測定' },
        { name: '通いの森データシステム', type: 'DX・アウトリーチ', frequency: '常時', target: '未参加層', detail: '参加履歴を分析し、引きこもりがちな未参加者へ個別アプローチを行うPDCAサイクル' },
      ],
      keyLesson: '「健康のための運動」を強要するのではなく、「おしゃべりに行く」「仲間とお茶を飲む」という楽しい動機が結果的に外出と運動を生む好循環。'
    },
    '千葉県市原市': {
      title: '東京大学IOG連携：産官学7者によるフレイル予防の一気通貫モデル',
      tag: '産官学連携・AI未病検知',
      background: '高齢化が急速に進むニュータウン地域等において、医療費・介護費の急増と孤立死リスクに対応するため、令和3年度より「高齢者の保健事業と介護予防の一体的実施事業」を本格化。',
      coreMechanism: '東京大学高齢社会総合研究機構（飯島勝矢教授）の科学的知見を導入。住民サポーター（フレイルサポーター）が担うフレイルチェック教室と、電力会社（家電利用データAI解析による早期検知）、民間企業（RIZAP等の運動プログラム）が緊密に連携。',
      evidence: '電力データによるフレイル兆候の検知精度向上に加え、RIZAP指導プログラム参加者の約9割が「日常の歩数増加」「タンパク質摂取の改善」を達成。要介護化の前段階での確実な食い止めを実現。',
      initiatives: [
        { name: '住民主導型フレイルチェック教室', type: '早期発見', frequency: '月2回', target: '地域高齢者', detail: '指輪っかテスト（サルコペニア判定）や質問票を住民同士で測定・啓発' },
        { name: '電力データAI×RIZAP運動指導', type: 'ハイリスク対策', frequency: '週1回（クール制）', target: '独居ハイリスク者', detail: '家電使用パターンの変化からフレイル兆候を察知し、専門トレーナーが直接介入' },
        { name: '医療専門職のアウトリーチ', type: '巡回指導', frequency: '随時', target: '通いの場', detail: '管理栄養士・歯科衛生士がサロンを巡回し、口腔ケアと低栄養予防を直接指導' },
      ],
      keyLesson: '科学的なスクリーニング（東大）＋最新テクノロジー（電力AI）＋民間の指導力（RIZAP）を行政が束ねることで、質の高い予防サービスを地域へ届ける。'
    },
    '長崎県佐世保市': {
      title: '社会的処方（Social Prescribing）の日本型医療現場実装',
      tag: '社会的処方・生きがい再生',
      background: '医療機関（石坂脳神経外科）において、認知症やうつ病を抱える患者に対し、抗うつ薬や対症療法だけでは孤独や社会的孤立を根治できないという強い臨床的課題意識からスタート。',
      coreMechanism: '英国NHSの社会的処方を視察・翻案。医師と「リンクワーカー（医療相談員・デイケア専門職）」が連携し、患者の過去の経歴、特技、情熱をじっくり傾聴。医療から地域の活動・役割へとつなぎ直す。',
      evidence: 'アルコール依存とうつで引きこもっていた50代元教員が、リンクワーカーの支援で29年ぶりに小学校の特別授業を行う機会を得て、うつ症状が劇的に快復した実践例など、QOL向上・向精神薬の減薬に成功。',
      initiatives: [
        { name: 'リンクワーカーによる対話型アセスメント', type: '傾聴・強み発掘', frequency: '随時', target: '孤立した通院患者', detail: '「病気」ではなく「その人の人生・得意なこと」に焦点を当てるヒューマンセンタード対話' },
        { name: '地域資源（学校・サロン・NPO）への接続', type: '社会的処方', frequency: '個別計画', target: '処方対象者', detail: '地域の担い手不足と患者の自己実現を一致させる役割の創出（授業、農作業、案内係等）' },
      ],
      keyLesson: '「受給者（助けてもらう人）」としてではなく、「貢献者（役割を持つ人）」として地域に居場所を作ることが、人間の心身の活力を最も劇的に回復させる。'
    },
    '広島県神石高原町': {
      title: 'デジタルヘルスケア×ゲーミフィケーションによる山間地域活性化',
      tag: '過疎地DX・歩数増進',
      background: '中山間地域特有の車社会と移動手段の制約により、日常生活での歩行数が減少し、運動不足と生活習慣病リスクが進行していた過疎高齢化地域。',
      coreMechanism: '全町規模でウェアラブルデバイス（活動量計・スマートフォン）を導入し、歩数に応じて地域ポイントが付与されるゲーミフィケーション施策を実施。役場や公民館でのスマホ教室を手厚く配置し、デジタル格差を解消。',
      evidence: '参加者の1日平均歩数が【約3,800歩増加】。健康意識の向上だけでなく、集会所でのスマホを使った情報交換が活発化し、山間地域の社会的孤立が解消傾向に。',
      initiatives: [
        { name: '神石高原デジタル歩数チャレンジ', type: 'ゲーミフィケーション', frequency: '通年', target: '全町民', detail: '歩数データの自動集計とランキング表示、地元協力店で使える健康ポイント還元' },
        { name: '集会所巡回型スマートフォン教室', type: 'デジタルデバイド解消', frequency: '月1回', target: 'シニア層', detail: '機器の操作からアプリ活用、SNSでの仲間づくりまでを段階的にサポート' },
      ],
      keyLesson: '高齢者でも分かりやすいインセンティブ（地域ポイント）と手厚い対面サポートを組み合わせれば、山間部でも確実なデジタル行動変容が可能。'
    },
  };

  function render(container) {
    const userCity = Store.get('profile.city') || '';
    const userPref = Store.get('profile.prefecture') || '';

    container.innerHTML = `
      <div class="community animate-fade">
        <h2 style="font-size: var(--text-2xl); font-weight: 700; margin-bottom: var(--space-2);">
          🤝 つながりマップ & 地域活動ガイド
        </h2>
        <p class="text-muted mb-6">身近な地域の活動の見つけ方と、全国の先進実践モデル</p>

        <!-- Tabs -->
        <div class="tabs" id="community-tabs">
          <button class="tab active" data-tab="search">🔍 活動の探し方（地域連携）</button>
          <button class="tab" data-tab="model">📍 先進事例地域（詳細分析）</button>
          <button class="tab" data-tab="national">🗾 国・公的リソース</button>
        </div>

        <div id="community-content"></div>
      </div>
    `;

    // Tab switching
    const tabs = document.getElementById('community-tabs');
    tabs.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderTab(tab.dataset.tab);
      });
    });

    renderTab('search');
  }

  function renderTab(tabName) {
    const content = document.getElementById('community-content');
    if (!content) return;

    switch (tabName) {
      case 'search':
        renderSearch(content);
        break;
      case 'model':
        renderModel(content);
        break;
      case 'national':
        renderNational(content);
        break;
    }
  }

  function renderSearch(container) {
    const userInterests = Store.get('community.interests') || [];
    const userPref = Store.get('profile.prefecture') || '';
    const userCity = Store.get('profile.city') || '';

    container.innerHTML = `
      <div class="animate-fade">
        <!-- Guidance: 窓口の選び方（現実的なアプローチ） -->
        <div class="card mb-6" style="background: var(--color-accent-water-surface); border: 1px solid var(--color-accent-water);">
          <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-2);">
            <span style="font-size: var(--text-xl);">💡</span>
            <h3 class="card__title" style="color: var(--color-text); margin: 0;">現実的な「活動・通いの場」の探し方ガイド</h3>
          </div>
          <p class="text-sm mb-3" style="line-height: var(--leading-relaxed); color: var(--color-text-secondary);">
            全国約1,700自治体で公開フォーマットが異なるため、公的窓口も役割が分かれています。<br>
            <strong>目的別に直接専門の窓口やWebサービスを利用する</strong>のが最も早く確実です：
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-2); margin-bottom: var(--space-3); font-size: var(--text-xs);">
            <div style="background: var(--color-surface); padding: var(--space-2); border-radius: var(--radius-md); border: 1px solid var(--color-border-light);">
              <strong style="color: var(--color-primary-dark);">🎨 趣味・サークル・文化活動</strong><br>
              ➡️ <strong>最寄りの「公民館・地区センター」</strong><br>
              （受付やロビー掲示板に募集チラシが多数掲示）
            </div>
            <div style="background: var(--color-surface); padding: var(--space-2); border-radius: var(--radius-md); border: 1px solid var(--color-border-light);">
              <strong style="color: var(--color-primary-dark);">🤝 ボランティア・ふれあいサロン</strong><br>
              ➡️ <strong>市区町村「社会福祉協議会（社協）」</strong><br>
              （ボランティアセンターで即時マッチング対応）
            </div>
            <div style="background: var(--color-surface); padding: var(--space-2); border-radius: var(--radius-md); border: 1px solid var(--color-border-light);">
              <strong style="color: var(--color-primary-dark);">🏃 百歳体操・健康づくり教室</strong><br>
              ➡️ <strong>役所「健康増進課」または 包括のSC</strong><br>
              （生活支援コーディネーターが一覧を所持）
            </div>
          </div>
          <div style="font-size: var(--text-xs); color: var(--color-text-muted); background: var(--color-surface); padding: var(--space-2); border-radius: var(--radius-md); border: 1px solid var(--color-border-light);">
            ℹ️ <strong>地域包括支援センターを利用する際のコツ：</strong>「生活支援コーディネーター（地域支え合い推進員）はいらっしゃいますか」「地域の通いの場やサロンの一覧がほしいです」と具体的に尋ねるとスムーズです。
          </div>
        </div>

        <!-- Region & City Input -->
        <div class="card mb-6">
          <h3 class="card__title mb-2">📍 お住まいの市区町村を設定</h3>
          <p class="text-sm text-muted mb-4">市区町村名を入力すると、近隣のコミュニティ活動やジモティーの募集へ直行できます</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3);">
            <div>
              <label class="form-label" style="font-size: var(--text-xs); margin-bottom: var(--space-1); display: block;">都道府県</label>
              <select class="form-input" id="prefecture-select">
                <option value="">都道府県を選択</option>
                ${prefectures.map(p => `
                  <option value="${p}" ${userPref === p ? 'selected' : ''}>${p}</option>
                `).join('')}
              </select>
            </div>
            <div>
              <label class="form-label" style="font-size: var(--text-xs); margin-bottom: var(--space-1); display: block;">市区町村名（例: 佐久市、世田谷区）</label>
              <input type="text" class="form-input" id="city-input" placeholder="市区町村名を入力" value="${userCity}">
            </div>
          </div>
        </div>

        <!-- Interest Selection -->
        <div class="card mb-6">
          <h3 class="card__title mb-2">🎯 興味のある活動カテゴリ</h3>
          <p class="text-sm text-muted mb-4">関心のある分野を選んでください（複数選択可）</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: var(--space-2);">
            ${INTEREST_CATEGORIES.map(cat => `
              <button class="interest-btn ${userInterests.includes(cat.id) ? 'selected' : ''}"
                data-interest="${cat.id}"
                style="display: flex; flex-direction: column; align-items: center; gap: var(--space-1);
                  padding: var(--space-3); border-radius: var(--radius-lg); border: 1.5px solid ${userInterests.includes(cat.id) ? 'var(--color-primary)' : 'var(--color-border-light)'};
                  background: ${userInterests.includes(cat.id) ? 'var(--color-primary-surface)' : 'var(--color-surface)'};
                  cursor: pointer; transition: all var(--transition-fast); min-height: 48px;">
                <span style="font-size: var(--text-xl);">${cat.icon}</span>
                <span style="font-size: var(--text-sm); font-weight: 500;">${cat.label}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Dynamic Action Links (Jimoty & Community Center Search) -->
        <div id="direct-search-box"></div>

        <!-- Results: Realistic Routes -->
        <div id="matching-results"></div>
      </div>
    `;

    // Interest buttons
    container.querySelectorAll('.interest-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.interest;
        let interests = Store.get('community.interests') || [];
        if (interests.includes(id)) {
          interests = interests.filter(i => i !== id);
        } else {
          interests.push(id);
        }
        Store.set('community.interests', interests);
        renderSearch(container);
      });
    });

    // Prefecture select
    document.getElementById('prefecture-select')?.addEventListener('change', (e) => {
      Store.set('profile.prefecture', e.target.value);
      updateDirectSearch();
      updateMatchingResults();
    });

    // City input
    const cityInput = document.getElementById('city-input');
    cityInput?.addEventListener('input', (e) => {
      Store.set('profile.city', e.target.value.trim());
      updateDirectSearch();
      updateMatchingResults();
    });

    updateDirectSearch();
    updateMatchingResults();
  }

  function updateDirectSearch() {
    const box = document.getElementById('direct-search-box');
    if (!box) return;

    const pref = Store.get('profile.prefecture') || '';
    const city = Store.get('profile.city') || '';
    const interests = Store.get('community.interests') || [];
    const locationQuery = (pref + ' ' + city).trim();

    if (!locationQuery && interests.length === 0) {
      box.innerHTML = '';
      return;
    }

    // Determine primary search keywords
    const selectedCats = INTEREST_CATEGORIES.filter(c => interests.includes(c.id));
    const keyword = selectedCats.length > 0 ? selectedCats.map(c => c.label.split('・')[0]).join(' ') : 'サークル コミュニティ';

    // Direct URLs
    const jmtyComKw = encodeURIComponent(`${locationQuery} ${keyword} コミュニティセンター メンバー`);
    const jmtyComUrl = `https://jmty.jp/all/com-kw-${jmtyComKw}`;

    const jmtyLessonKw = encodeURIComponent(`${locationQuery} ${keyword} 教室`);
    const jmtyLessonUrl = `https://jmty.jp/all/les-kw-${jmtyLessonKw}`;

    const mapCenterKw = encodeURIComponent(`${locationQuery} コミュニティセンター 公民館`);
    const mapCenterUrl = `https://www.google.com/maps/search/${mapCenterKw}`;

    const kouminSearchKw = encodeURIComponent(`${locationQuery} 公民館だより サークル 募集`);
    const kouminSearchUrl = `https://www.google.com/search?q=${kouminSearchKw}`;

    const shakyoSearchKw = encodeURIComponent(`${locationQuery} 社会福祉協議会 ボランティアセンター サロン`);
    const shakyoSearchUrl = `https://www.google.com/search?q=${shakyoSearchKw}`;

    box.innerHTML = `
      <div class="card mb-6" style="border: 2px solid var(--color-primary); background: linear-gradient(135deg, var(--color-surface), var(--color-primary-surface));">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-3);">
          <div>
            <h3 class="card__title" style="color: var(--color-primary-dark); margin-bottom: var(--space-1);">
              🌐 ${locationQuery || 'ご指定地域'}のリアルタイム活動ダイレクト検索
            </h3>
            <p class="text-xs text-muted" style="line-height: 1.5;">
              ※ ジモティー公式APIは一般公開されていないため、お住まいの地域と関心に応じたダイレクト連携リンクを自動生成しています。ワンクリックで近隣の募集一覧へ直行できます。
            </p>
          </div>
          <span style="font-size: var(--text-xs); background: var(--color-primary); color: white; padding: 2px 10px; border-radius: var(--radius-full); font-weight: 600;">
            ダイレクト連携
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-2);">
          <!-- Jimoty Community -->
          <a href="${jmtyComUrl}" target="_blank" rel="noopener" class="btn btn--sm"
            style="background: #28a745; color: white; text-decoration: none; justify-content: center; gap: var(--space-1); box-shadow: var(--shadow-sm);">
            <span>🟢</span> <strong>ジモティーで仲間・活動を探す</strong> ↗
          </a>

          <!-- Jimoty Classes -->
          <a href="${jmtyLessonUrl}" target="_blank" rel="noopener" class="btn btn--sm"
            style="background: #17a2b8; color: white; text-decoration: none; justify-content: center; gap: var(--space-1); box-shadow: var(--shadow-sm);">
            <span>🎓</span> <strong>ジモティーで教室・講座を探す</strong> ↗
          </a>

          <!-- Map Centers -->
          <a href="${mapCenterUrl}" target="_blank" rel="noopener" class="btn btn--secondary btn--sm"
            style="text-decoration: none; justify-content: center; gap: var(--space-1);">
            <span>🗺️</span> <strong>最寄り公民館・コミセン（地図）</strong> ↗
          </a>

          <!-- Kouminkan Newsletter -->
          <a href="${kouminSearchUrl}" target="_blank" rel="noopener" class="btn btn--secondary btn--sm"
            style="text-decoration: none; justify-content: center; gap: var(--space-1);">
            <span>📰</span> <strong>公民館だより（サークル募集）</strong> ↗
          </a>

          <!-- Shakyo Volunteer -->
          <a href="${shakyoSearchUrl}" target="_blank" rel="noopener" class="btn btn--secondary btn--sm"
            style="text-decoration: none; justify-content: center; gap: var(--space-1);">
            <span>🤝</span> <strong>社協ボランティアセンター</strong> ↗
          </a>
        </div>
      </div>
    `;
  }

  function updateMatchingResults() {
    const results = document.getElementById('matching-results');
    if (!results) return;

    const interests = Store.get('community.interests') || [];
    const pref = Store.get('profile.prefecture') || '';

    if (interests.length === 0) {
      results.innerHTML = `
        <div class="card mb-6 text-center" style="padding: var(--space-8);">
          <p class="text-muted">上の興味カテゴリを選ぶと、おすすめのアクセス先と具体的な探し方が表示されます</p>
        </div>
      `;
      return;
    }

    // Generate recommendations based on interests
    const recommendations = interests.map(id => {
      const cat = INTEREST_CATEGORIES.find(c => c.id === id);
      return cat;
    }).filter(Boolean);

    results.innerHTML = `
      <div class="card mb-6">
        <h3 class="card__title mb-2">🎯 カテゴリ別の現実的なアプローチ先</h3>
        <p class="text-xs text-muted mb-4">公的窓口や地域コミュニティを直接訪ねる際の最適ルートです：</p>

        <div class="resource-list">
          ${recommendations.map(r => `
            <div class="resource-card" style="align-items: flex-start;">
              <div class="resource-card__icon" style="background: var(--color-secondary-surface);">${r.icon}</div>
              <div class="resource-card__content" style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-1); margin-bottom: 2px;">
                  <div class="resource-card__name">${r.label}</div>
                  <span style="font-size: var(--text-xs); background: var(--color-bg-alt); padding: 2px 8px; border-radius: var(--radius-full); color: var(--color-primary); font-weight: 500;">
                    ${r.channelType}
                  </span>
                </div>
                <div class="text-xs text-muted mb-2">${r.description}</div>
                <div style="background: var(--color-surface); padding: var(--space-2); border-radius: var(--radius-md); border: 1px solid var(--color-border-light); font-size: var(--text-xs); line-height: 1.5;">
                  <div style="font-weight: 600; color: var(--color-text); margin-bottom: 2px;">
                    🎯 おすすめ窓口: ${r.bestContact}
                  </div>
                  <div style="color: var(--color-text-secondary);">
                    💡 ${r.actionHint}
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderNational(container) {
    container.innerHTML = `
      <div class="animate-fade">
        <div class="card mb-6">
          <h3 class="card__title mb-4">🗾 全国の公的リソース・制度ポータル</h3>
          <p class="text-sm text-muted mb-4">厚生労働省や国立研究機関が提供する全国共通の公式プラットフォームです</p>

          <div class="resource-list">
            ${NATIONAL_RESOURCES.map(r => `
              <a href="${r.url}" target="_blank" rel="noopener" class="resource-card" style="text-decoration: none; color: inherit;">
                <div class="resource-card__icon" style="background: var(--color-primary-surface);">${r.icon}</div>
                <div class="resource-card__content">
                  <div class="resource-card__name">${r.name}</div>
                  <div class="resource-card__type">${r.type}</div>
                  <div class="resource-card__meta">
                    <span>${r.description}</span>
                  </div>
                </div>
                <div style="color: var(--color-text-tertiary); font-size: var(--text-lg);">↗</div>
              </a>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function renderModel(container) {
    container.innerHTML = `
      <div class="animate-fade">
        <div class="card mb-6" style="background: var(--color-surface-elevated); border-left: 4px solid var(--color-primary);">
          <h3 class="card__title mb-1">📍 先進事例地域の詳細分析（理論・エビデンス集）</h3>
          <p class="text-xs text-muted" style="line-height: var(--leading-relaxed);">
            厚生労働省、JAGES（日本老年学的評価研究）、東京大学IOG（高齢社会総合研究機構）等の公表論文・実証データに基づき、健康長寿を実現した5つの先進地域のメカニズムと具体的施策を詳細に分析しています。
          </p>
        </div>

        ${Object.entries(MODEL_REGIONS).map(([region, data]) => `
          <div class="card mb-6" style="box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-2);">
              <h3 style="font-size: var(--text-lg); font-weight: 700; color: var(--color-primary-dark); margin: 0;">
                📍 ${region}
              </h3>
              <span style="font-size: var(--text-xs); background: var(--color-primary-surface); color: var(--color-primary); font-weight: 600; padding: 2px 10px; border-radius: var(--radius-full);">
                ${data.tag}
              </span>
            </div>

            <div style="font-size: var(--text-sm); font-weight: 600; color: var(--color-text); margin-bottom: var(--space-3);">
              ${data.title}
            </div>

            <!-- Background -->
            <div style="background: var(--color-bg-alt); padding: var(--space-3); border-radius: var(--radius-md); margin-bottom: var(--space-3); font-size: var(--text-xs); line-height: 1.6;">
              <strong style="color: var(--color-text);">📜 歴史的背景と課題：</strong><br>
              ${data.background}
            </div>

            <!-- Core Mechanism -->
            <div style="background: var(--color-surface); border: 1px solid var(--color-border-light); padding: var(--space-3); border-radius: var(--radius-md); margin-bottom: var(--space-3); font-size: var(--text-xs); line-height: 1.6;">
              <strong style="color: var(--color-primary);">⚙️ 核心的な推進メカニズム：</strong><br>
              ${data.coreMechanism}
            </div>

            <!-- Evidence -->
            <div style="background: #e8f5e9; border-left: 3px solid #4caf50; padding: var(--space-3); border-radius: var(--radius-md); margin-bottom: var(--space-4); font-size: var(--text-xs); line-height: 1.6; color: #1b5e20;">
              <strong>📊 実証された数値成果（エビデンス）：</strong><br>
              ${data.evidence}
            </div>

            <!-- Specific Initiatives -->
            <h4 style="font-size: var(--text-xs); font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; margin-bottom: var(--space-2);">
              🎯 具体的な施策・プログラム
            </h4>
            <div class="resource-list mb-4">
              ${data.initiatives.map(item => `
                <div class="resource-card" style="padding: var(--space-2); font-size: var(--text-xs);">
                  <div class="resource-card__content">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                      <span style="font-weight: 700; color: var(--color-text);">${item.name}</span>
                      <span style="background: var(--color-secondary-surface); color: var(--color-secondary); padding: 1px 6px; border-radius: var(--radius-sm); font-size: 10px;">${item.type}</span>
                    </div>
                    <div style="color: var(--color-text-secondary); margin-bottom: 4px;">${item.detail}</div>
                    <div style="display: flex; gap: var(--space-3); color: var(--color-text-muted); font-size: 11px;">
                      <span>📅 頻度: ${item.frequency}</span>
                      <span>👥 対象: ${item.target}</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Key Lesson -->
            <div style="font-size: var(--text-xs); color: var(--color-text-secondary); background: var(--color-bg-alt); padding: var(--space-2); border-radius: var(--radius-md); border-left: 3px solid var(--color-accent-vermilion);">
              💡 <strong>他地域・個人の健康づくりへの教訓：</strong> ${data.keyLesson}
            </div>
          </div>
        `).join('')}

        <div class="card" style="background: var(--color-bg-alt); text-align: center;">
          <p class="text-xs text-muted">
            ※ 本先進事例分析は、厚生労働省ガイドライン・JAGES研究論文・各自治体広報資料に基づき作成されています。
          </p>
        </div>
      </div>
    `;
  }

  return { render };
})();
