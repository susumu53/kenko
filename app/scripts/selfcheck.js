/**
 * 実現健康長寿アプリ — Self Check Module
 * 健幸五輪モデルに基づくセルフチェック・スコアリングエンジン
 *
 * 理論的根拠:
 * - 第1輪（生命基盤）: J-CHS基準 + イレブンチェック
 * - 第2輪（生活習慣）: Power 9 日本適応版
 * - 第3輪（社会的つながり）: JAGES社会参加指標
 * - 第4輪（地域・場）: 地域環境自己評価
 * - 第5輪（政策連動）: 健康日本21目標との乖離
 */

const SelfCheck = (() => {

  // ============================================================
  // Question Definitions — 理論に基づく質問群
  // ============================================================
  const questions = [
    // --- 第1輪: 生命基盤 (Bio-Foundation) ---
    {
      id: 'bio_weight_loss',
      ring: 1,
      ringLabel: '生命基盤',
      text: '過去6ヶ月で、意図せず2〜3kg以上体重が減りましたか？',
      detail: 'フレイル評価（J-CHS基準）の主要項目です',
      type: 'select',
      options: [
        { value: 0, label: 'はい（減った）' },
        { value: 10, label: 'いいえ' },
      ],
      source: 'J-CHS基準',
    },
    {
      id: 'bio_fatigue',
      ring: 1,
      ringLabel: '生命基盤',
      text: '理由もなく疲れた感じがしますか？',
      detail: 'ここ2週間で感じた疲労感について',
      type: 'select',
      options: [
        { value: 0, label: 'はい（週の半分以上）' },
        { value: 5, label: 'ときどき' },
        { value: 10, label: 'ほとんどない' },
      ],
      source: 'J-CHS基準',
    },
    {
      id: 'bio_walking',
      ring: 1,
      ringLabel: '生命基盤',
      text: '歩く速さが以前より遅くなったと感じますか？',
      type: 'select',
      options: [
        { value: 0, label: 'はい（明らかに遅くなった）' },
        { value: 5, label: '少し遅くなった' },
        { value: 10, label: '変わらない' },
      ],
      source: 'J-CHS基準',
    },
    {
      id: 'bio_oral',
      ring: 1,
      ringLabel: '生命基盤',
      text: '硬い食べ物（たくあん・せんべい等）が噛みにくくなりましたか？',
      detail: 'オーラルフレイルの評価項目です',
      type: 'select',
      options: [
        { value: 0, label: 'はい' },
        { value: 5, label: '少し感じる' },
        { value: 10, label: 'いいえ' },
      ],
      source: 'オーラルフレイルチェック',
    },

    // --- 第2輪: 生活習慣 (Lifestyle Practice / Power 9) ---
    {
      id: 'life_exercise',
      ring: 2,
      ringLabel: '生活習慣',
      text: '1週間のうち、30分以上の運動や散歩をする日は何日ありますか？',
      detail: 'Power 9「自然に動く」+ 健康日本21の運動習慣指標',
      type: 'slider',
      min: 0,
      max: 7,
      step: 1,
      unit: '日/週',
      scoring: (v) => Math.min(v / 5 * 10, 10), // 5日以上で満点
      source: 'Power 9: Move Naturally',
    },
    {
      id: 'life_steps',
      ring: 2,
      ringLabel: '生活習慣',
      text: '1日の平均歩数はおよそどのくらいですか？',
      type: 'select',
      options: [
        { value: 2, label: '3,000歩未満' },
        { value: 4, label: '3,000〜5,000歩' },
        { value: 6, label: '5,000〜7,000歩' },
        { value: 8, label: '7,000〜9,000歩' },
        { value: 10, label: '9,000歩以上' },
      ],
      source: '健康日本21（第三次）',
    },
    {
      id: 'life_vegetables',
      ring: 2,
      ringLabel: '生活習慣',
      text: '毎日の食事で野菜・豆類をどのくらい食べていますか？',
      detail: 'Power 9「植物中心」+ 健康日本21の野菜摂取目標350g',
      type: 'select',
      options: [
        { value: 2, label: 'ほとんど食べない' },
        { value: 4, label: '1日1品程度' },
        { value: 6, label: '1日2〜3品' },
        { value: 8, label: '毎食1品以上' },
        { value: 10, label: '毎食2品以上（豆類も含む）' },
      ],
      source: 'Power 9: Plant Slant',
    },
    {
      id: 'life_sleep',
      ring: 2,
      ringLabel: '生活習慣',
      text: '平均的な睡眠時間はどのくらいですか？',
      detail: '健康日本21目標: 20〜59歳は6〜9時間、60歳以上は6〜8時間',
      type: 'select',
      options: [
        { value: 3, label: '5時間未満' },
        { value: 6, label: '5〜6時間' },
        { value: 10, label: '6〜8時間' },
        { value: 7, label: '8〜9時間' },
        { value: 4, label: '9時間以上' },
      ],
      source: '健康日本21（第三次）',
    },
    {
      id: 'life_eating_moderation',
      ring: 2,
      ringLabel: '生活習慣',
      text: '食事は腹八分目を心がけていますか？',
      detail: 'Power 9「80%ルール」— カロリー制限は細胞老化を遅らせる',
      type: 'select',
      options: [
        { value: 2, label: '毎回満腹まで食べる' },
        { value: 5, label: '意識はしているが難しい' },
        { value: 8, label: 'だいたい心がけている' },
        { value: 10, label: '常に心がけている' },
      ],
      source: 'Power 9: 80% Rule',
    },
    {
      id: 'life_stress',
      ring: 2,
      ringLabel: '生活習慣',
      text: '日常的にストレスを解消する習慣はありますか？',
      detail: 'Power 9「ダウンシフト」— 散歩、瞑想、趣味、昼寝など',
      type: 'select',
      options: [
        { value: 2, label: 'ない' },
        { value: 5, label: 'たまに行う' },
        { value: 8, label: '週に数回は行う' },
        { value: 10, label: '毎日の習慣がある' },
      ],
      source: 'Power 9: Down Shift',
    },

    // --- 第3輪: 社会的つながり (Social Connection) ---
    {
      id: 'social_purpose',
      ring: 3,
      ringLabel: '社会的つながり',
      text: '「自分にはやりたいことや生きがいがある」と感じますか？',
      detail: 'Power 9「目的を持つ」— 沖縄の「生きがい」。健康寿命を約7年延長する効果',
      type: 'select',
      options: [
        { value: 2, label: '全く感じない' },
        { value: 4, label: 'あまり感じない' },
        { value: 6, label: 'どちらともいえない' },
        { value: 8, label: 'ある程度感じる' },
        { value: 10, label: '強く感じる' },
      ],
      source: 'Power 9: Purpose / HELO: Motivations',
    },
    {
      id: 'social_community',
      ring: 3,
      ringLabel: '社会的つながり',
      text: '趣味・ボランティア・サークル等のグループに参加していますか？',
      detail: 'Power 9「信仰・帰属」— 定期的なコミュニティ参加が寿命を4〜14年延ばす',
      type: 'select',
      options: [
        { value: 2, label: '参加していない' },
        { value: 5, label: '月1〜2回参加' },
        { value: 8, label: '週1回程度参加' },
        { value: 10, label: '週2回以上参加' },
      ],
      source: 'Power 9: Belong / JAGES',
    },
    {
      id: 'social_friends',
      ring: 3,
      ringLabel: '社会的つながり',
      text: '困ったときに相談できる友人・知人は何人いますか？',
      detail: 'Power 9「正しい仲間」— 健康行動を支援するネットワーク',
      type: 'select',
      options: [
        { value: 2, label: 'いない' },
        { value: 5, label: '1〜2人' },
        { value: 8, label: '3〜5人' },
        { value: 10, label: '6人以上' },
      ],
      source: 'Power 9: Right Tribe',
    },
    {
      id: 'social_family',
      ring: 3,
      ringLabel: '社会的つながり',
      text: '家族や親しい人と毎日会話をしていますか？',
      detail: 'Power 9「家族優先」— 電話やオンラインでの会話も含む',
      type: 'select',
      options: [
        { value: 2, label: 'ほとんどしない' },
        { value: 5, label: '週に数回' },
        { value: 8, label: 'ほぼ毎日' },
        { value: 10, label: '毎日複数回' },
      ],
      source: 'Power 9: Loved Ones First',
    },
    {
      id: 'social_meals',
      ring: 3,
      ringLabel: '社会的つながり',
      text: '1週間のうち、誰かと一緒に食事をする回数は？',
      detail: '独食はフレイルのリスク因子。共食は栄養改善にもつながる',
      type: 'select',
      options: [
        { value: 2, label: 'ほぼ毎食一人' },
        { value: 5, label: '週に数回は誰かと' },
        { value: 8, label: '1日1回以上は誰かと' },
        { value: 10, label: 'ほぼ毎食誰かと' },
      ],
      source: 'JAGES/国立長寿医療研究センター',
    },
    {
      id: 'social_contribution',
      ring: 3,
      ringLabel: '社会的つながり',
      text: '「誰かの役に立っている」と感じますか？',
      detail: '貢献寿命の延伸 — 社会的役割意識はウェルビーイングの核心',
      type: 'select',
      options: [
        { value: 2, label: '全く感じない' },
        { value: 4, label: 'あまり感じない' },
        { value: 6, label: 'どちらともいえない' },
        { value: 8, label: 'ある程度感じる' },
        { value: 10, label: '強く感じる' },
      ],
      source: '貢献寿命の概念（2025年動向）',
    },

    // --- 第4輪: 地域・場 (Place Design) ---
    {
      id: 'place_walkability',
      ring: 4,
      ringLabel: '地域・場',
      text: 'お住まいの地域は、歩いて出かけやすい環境ですか？',
      detail: '歩道、公園、商店街など',
      type: 'select',
      options: [
        { value: 2, label: '歩きにくい（坂が多い、歩道がない等）' },
        { value: 5, label: '普通' },
        { value: 8, label: '歩きやすい' },
        { value: 10, label: 'とても歩きやすい（公園や遊歩道が充実）' },
      ],
      source: 'HLD: Place',
    },
    {
      id: 'place_community_access',
      ring: 4,
      ringLabel: '地域・場',
      text: '地域に「通いの場」（体操教室、サロン、サークル等）はありますか？',
      type: 'select',
      options: [
        { value: 2, label: '知らない' },
        { value: 4, label: 'あるが遠い' },
        { value: 7, label: 'あり、たまに利用' },
        { value: 10, label: 'あり、定期的に利用している' },
      ],
      source: '厚労省/JAGES',
    },
    {
      id: 'place_medical',
      ring: 4,
      ringLabel: '地域・場',
      text: 'かかりつけ医はいますか？',
      type: 'select',
      options: [
        { value: 3, label: 'いない' },
        { value: 7, label: 'いるが定期受診はしていない' },
        { value: 10, label: 'いて、定期的に受診している' },
      ],
      source: '地域医療連携',
    },

    // --- 第5輪: 政策連動 (Policy Ecosystem) ---
    {
      id: 'policy_health_checkup',
      ring: 5,
      ringLabel: '政策連動',
      text: '年に1回以上、健康診断（特定健診等）を受けていますか？',
      type: 'select',
      options: [
        { value: 3, label: '受けていない' },
        { value: 7, label: '不定期' },
        { value: 10, label: '毎年受けている' },
      ],
      source: '健康日本21（第三次）',
    },
    {
      id: 'policy_health_awareness',
      ring: 5,
      ringLabel: '政策連動',
      text: '「健康寿命」と「平均寿命」の違いを知っていますか？',
      detail: 'HELO: Awareness — 健康リテラシーの基本指標',
      type: 'select',
      options: [
        { value: 3, label: '知らない' },
        { value: 6, label: '聞いたことはある' },
        { value: 10, label: '違いを説明できる' },
      ],
      source: 'HELO Framework: Awareness',
    },
  ];

  // ============================================================
  // Scoring Engine
  // ============================================================

  /**
   * Weight configuration for the Kenko Index
   * Based on JAGES evidence: social connection has the highest predictive power for frailty prevention
   */
  const RING_WEIGHTS = {
    1: 0.20,  // 生命基盤
    2: 0.25,  // 生活習慣
    3: 0.30,  // 社会的つながり（最大の重み）
    4: 0.15,  // 地域・場
    5: 0.10,  // 政策連動
  };

  const RING_NAMES = {
    1: '生命基盤',
    2: '生活習慣',
    3: '社会的つながり',
    4: '地域・場',
    5: '政策連動',
  };

  const RING_ICONS = {
    1: '🧬',
    2: '🏃',
    3: '🤝',
    4: '🏘️',
    5: '🏛️',
  };

  /**
   * Calculate ring scores from answers
   * @param {object} answers - { questionId: selectedValue }
   * @returns {object} Full result object
   */
  function calculate(answers, userAge) {
    // Group questions by ring
    const ringQuestions = {};
    for (const q of questions) {
      if (!ringQuestions[q.ring]) ringQuestions[q.ring] = [];
      ringQuestions[q.ring].push(q);
    }

    // Calculate per-ring scores (0-100)
    const ringScores = {};
    for (const [ring, qs] of Object.entries(ringQuestions)) {
      let totalScore = 0;
      let maxScore = 0;
      for (const q of qs) {
        const answer = answers[q.id];
        if (answer !== undefined && answer !== null) {
          if (q.type === 'slider' && q.scoring) {
            totalScore += q.scoring(answer);
            maxScore += 10;
          } else {
            totalScore += Number(answer);
            maxScore += 10;
          }
        }
      }
      ringScores[ring] = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    }

    // Calculate weighted Kenko Index (0-100)
    let kenkoIndex = 0;
    for (const [ring, weight] of Object.entries(RING_WEIGHTS)) {
      kenkoIndex += (ringScores[ring] || 0) * weight;
    }
    kenkoIndex = Math.round(kenkoIndex);

    // Estimate biological age
    const bioAge = estimateBioAge(kenkoIndex, userAge || 50);

    // Determine frailty status based on Ring 1 score
    const frailtyStatus = determineFrailty(ringScores[1] || 0);

    // Determine priority areas for improvement
    const priorities = determinePriorities(ringScores);

    // Grade
    const grade = determineGrade(kenkoIndex);

    return {
      date: new Date().toISOString(),
      kenkoIndex,
      ringScores,
      bioAge,
      frailtyStatus,
      priorities,
      grade,
      answers,
    };
  }

  /**
   * Estimate biological age based on Kenko Index
   * Theoretical basis: Epigenetic age ~60% determined by lifestyle (Horvath, 2013)
   * This is a simplified estimation model for educational purposes
   */
  function estimateBioAge(kenkoIndex, chronologicalAge) {
    // kenkoIndex 100 -> bioAge = chronologicalAge - 10 (10 years younger)
    // kenkoIndex 50  -> bioAge = chronologicalAge (same)
    // kenkoIndex 0   -> bioAge = chronologicalAge + 15 (15 years older)
    const deviation = ((kenkoIndex - 50) / 50) * 12;
    const estimatedBioAge = Math.round(chronologicalAge - deviation);
    return {
      estimated: Math.max(18, estimatedBioAge),
      chronological: chronologicalAge,
      difference: Math.round(chronologicalAge - estimatedBioAge),
      interpretation: deviation > 0
        ? `実年齢より約${Math.abs(Math.round(deviation))}歳若い状態です`
        : deviation < 0
          ? `実年齢より約${Math.abs(Math.round(deviation))}歳老化が進んでいる可能性があります`
          : '実年齢相応の状態です',
    };
  }

  /**
   * Determine frailty status based on Bio-Foundation score
   */
  function determineFrailty(ring1Score) {
    if (ring1Score >= 75) return { status: 'robust', label: 'ロバスト（健常）', color: 'success', description: '身体機能は良好に維持されています' };
    if (ring1Score >= 45) return { status: 'prefrail', label: 'プレフレイル（前虚弱）', color: 'warning', description: 'フレイルの予備軍です。今が予防の好機です' };
    return { status: 'frail', label: 'フレイル（虚弱）', color: 'danger', description: '専門家への相談をお勧めします。適切な介入で改善可能です' };
  }

  /**
   * Determine improvement priorities
   */
  function determinePriorities(ringScores) {
    return Object.entries(ringScores)
      .map(([ring, score]) => ({
        ring: Number(ring),
        name: RING_NAMES[ring],
        icon: RING_ICONS[ring],
        score,
        weight: RING_WEIGHTS[ring],
        impact: Math.round((100 - score) * RING_WEIGHTS[ring]),
      }))
      .sort((a, b) => b.impact - a.impact)
      .slice(0, 3);
  }

  /**
   * Determine grade from Kenko Index
   */
  function determineGrade(index) {
    if (index >= 85) return { grade: 'S', label: '素晴らしい！', color: '#2DA06A', message: 'ブルーゾーンの住民に匹敵する健康長寿度です' };
    if (index >= 70) return { grade: 'A', label: '良好', color: '#3B82A0', message: '健康長寿に向けた良い習慣が身についています' };
    if (index >= 55) return { grade: 'B', label: '概ね良好', color: '#C17B2E', message: 'いくつかの分野で改善の余地があります' };
    if (index >= 40) return { grade: 'C', label: '要改善', color: '#D4708F', message: '重点的な改善が健康寿命の延伸につながります' };
    return { grade: 'D', label: '要注意', color: '#D4505A', message: '生活習慣の見直しと専門家への相談をお勧めします' };
  }

  /**
   * Generate improvement advice based on results
   */
  function getAdvice(result) {
    const advice = [];

    if (result.ringScores[3] < 60) {
      advice.push({
        ring: 3,
        icon: '🤝',
        title: '社会参加を増やしましょう',
        text: 'JAGESの研究では「通いの場」への参加でフレイル発症リスクが半減します。趣味のサークルやボランティアに参加してみませんか？',
        action: 'community',
      });
    }

    if (result.ringScores[2] < 60) {
      advice.push({
        ring: 2,
        icon: '🏃',
        title: '今より10分多く体を動かしましょう',
        text: '激しい運動は不要です。「今より10分多く」を心がけてください。散歩、家事、階段の利用など、日常の中で自然に動くことが大切です。',
        action: 'dashboard',
      });
    }

    if (result.ringScores[1] < 60) {
      advice.push({
        ring: 1,
        icon: '🧬',
        title: '栄養バランスに注目しましょう',
        text: 'タンパク質（肉、魚、卵、大豆）を意識的に摂取し、口腔ケアも忘れずに。フレイル予防の「ちょい足し」習慣を始めましょう。',
        action: 'education',
      });
    }

    if (result.ringScores[4] < 60) {
      advice.push({
        ring: 4,
        icon: '🏘️',
        title: '地域の資源を活用しましょう',
        text: 'お住まいの地域には様々な「通いの場」や支援サービスがあります。地域包括支援センターに問い合わせてみましょう。',
        action: 'community',
      });
    }

    if (result.ringScores[5] < 60) {
      advice.push({
        ring: 5,
        icon: '🏛️',
        title: '健康リテラシーを高めましょう',
        text: '健康寿命の概念や予防医学の最新知識を学ぶことで、より効果的な健康行動につながります。',
        action: 'education',
      });
    }

    return advice;
  }

  // ============================================================
  // UI Rendering
  // ============================================================

  let currentStep = 0;
  let answers = {};

  function renderIntro(container) {
    container.innerHTML = `
      <div class="selfcheck-intro animate-fade">
        <div class="text-center mb-8">
          <div style="font-size: 4rem; margin-bottom: var(--space-4);">🌿</div>
          <h2 style="font-size: var(--text-3xl); font-weight: 900; margin-bottom: var(--space-3);">
            健幸五輪チェック
          </h2>
          <p class="text-muted" style="font-size: var(--text-lg); max-width: 480px; margin: 0 auto; line-height: var(--leading-relaxed);">
            5つの視点からあなたの健康長寿度を総合的に診断します。<br>
            所要時間：約5〜8分
          </p>
        </div>

        <div class="card mb-6" style="background: var(--color-primary-surface);">
          <h3 style="font-weight: 600; margin-bottom: var(--space-3);">五輪の5つの視点</h3>
          <div class="stagger">
            ${Object.entries(RING_NAMES).map(([ring, name]) => `
              <div style="display: flex; align-items: center; gap: var(--space-3); padding: var(--space-2) 0;">
                <span style="font-size: var(--text-xl);">${RING_ICONS[ring]}</span>
                <span style="font-weight: 500;">${name}</span>
                <span class="text-muted text-sm">(重み ${Math.round(RING_WEIGHTS[ring] * 100)}%)</span>
              </div>
            `).join('')}
          </div>
        </div>

        <button class="btn btn--primary btn--lg btn--full" id="selfcheck-start">
          チェックを始める →
        </button>
      </div>
    `;

    document.getElementById('selfcheck-start').addEventListener('click', () => {
      currentStep = 0;
      answers = {};
      renderQuestion(container);
    });
  }

  function renderQuestion(container) {
    const q = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;
    const currentRing = q.ring;

    container.innerHTML = `
      <div class="selfcheck-question animate-fade" style="max-width: 600px; margin: 0 auto;">
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <span class="badge badge--info">${q.ringLabel}</span>
            <span class="text-sm text-muted">${currentStep + 1} / ${questions.length}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-bar__fill" style="width: ${progress}%;"></div>
          </div>
        </div>

        <h3 style="font-size: var(--text-xl); font-weight: 700; margin-bottom: var(--space-2); line-height: var(--leading-relaxed);">
          ${q.text}
        </h3>
        ${q.detail ? `<p class="text-sm text-muted mb-6">${q.detail}</p>` : '<div class="mb-6"></div>'}

        <div id="selfcheck-options"></div>

        <div class="flex justify-between mt-8" style="gap: var(--space-3);">
          <button class="btn btn--ghost" id="selfcheck-back" ${currentStep === 0 ? 'disabled style="opacity:0.3"' : ''}>
            ← 戻る
          </button>
          <button class="btn btn--primary" id="selfcheck-next" disabled>
            ${currentStep === questions.length - 1 ? '結果を見る' : '次へ →'}
          </button>
        </div>

        <p class="text-xs text-muted text-center mt-4">
          出典: ${q.source}
        </p>
      </div>
    `;

    const optionsContainer = document.getElementById('selfcheck-options');

    if (q.type === 'select') {
      optionsContainer.innerHTML = `
        <div class="option-group">
          ${q.options.map(opt => `
            <div class="option-card ${answers[q.id] === opt.value ? 'selected' : ''}" data-value="${opt.value}">
              <div class="option-card__radio"></div>
              <div class="option-card__text">${opt.label}</div>
            </div>
          `).join('')}
        </div>
      `;

      optionsContainer.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', () => {
          optionsContainer.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          answers[q.id] = Number(card.dataset.value);
          document.getElementById('selfcheck-next').disabled = false;
        });
      });
    } else if (q.type === 'slider') {
      const currentVal = answers[q.id] !== undefined ? answers[q.id] : Math.round((q.max - q.min) / 2);
      optionsContainer.innerHTML = `
        <div class="slider-group">
          <div class="text-center mb-4">
            <span style="font-size: var(--text-3xl); font-weight: 700; color: var(--color-primary);" id="slider-display">${currentVal}</span>
            <span class="text-muted">${q.unit || ''}</span>
          </div>
          <input type="range" class="slider-input" min="${q.min}" max="${q.max}" step="${q.step}" value="${currentVal}" id="slider-input">
          <div class="slider-labels">
            <span>${q.min}</span>
            <span>${q.max}</span>
          </div>
        </div>
      `;

      const slider = document.getElementById('slider-input');
      const display = document.getElementById('slider-display');
      slider.addEventListener('input', () => {
        display.textContent = slider.value;
        answers[q.id] = Number(slider.value);
        document.getElementById('selfcheck-next').disabled = false;
      });
      // Enable next if already answered
      if (answers[q.id] !== undefined) {
        document.getElementById('selfcheck-next').disabled = false;
      }
    }

    // Enable next if already answered
    if (answers[q.id] !== undefined) {
      document.getElementById('selfcheck-next').disabled = false;
    }

    // Back button
    document.getElementById('selfcheck-back').addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        renderQuestion(container);
      }
    });

    // Next button
    document.getElementById('selfcheck-next').addEventListener('click', () => {
      if (currentStep < questions.length - 1) {
        currentStep++;
        renderQuestion(container);
      } else {
        // Calculate and show results
        const userAge = Store.get('profile.age') || 50;
        const result = calculate(answers, userAge);
        Store.set('selfCheck.latestResult', result);

        // Add to history
        const history = Store.get('selfCheck.history') || [];
        history.push(result);
        if (history.length > 50) history.shift();
        Store.set('selfCheck.history', history);

        renderResult(container, result);
      }
    });
  }

  function renderResult(container, result) {
    const circumference = 2 * Math.PI * 85;
    const dashOffset = circumference - (result.kenkoIndex / 100) * circumference;

    container.innerHTML = `
      <div class="selfcheck-result animate-fade" style="max-width: 600px; margin: 0 auto;">
        <div class="text-center mb-8">
          <h2 style="font-size: var(--text-2xl); font-weight: 700; margin-bottom: var(--space-6);">あなたの健幸指数</h2>

          <div class="score-ring" style="width: 220px; height: 220px;">
            <svg class="score-ring__svg" viewBox="0 0 200 200">
              <circle class="score-ring__bg" cx="100" cy="100" r="85"></circle>
              <circle class="score-ring__progress" cx="100" cy="100" r="85"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${dashOffset}"
                style="stroke: ${result.grade.color};">
              </circle>
            </svg>
            <div class="score-ring__value">
              <div class="score-ring__number" style="color: ${result.grade.color};">${result.kenkoIndex}</div>
              <div class="score-ring__label">/ 100</div>
            </div>
          </div>

          <div class="mt-4">
            <span class="badge" style="background: ${result.grade.color}20; color: ${result.grade.color}; font-size: var(--text-base); padding: var(--space-2) var(--space-4);">
              ランク ${result.grade.grade} — ${result.grade.label}
            </span>
          </div>
          <p class="text-muted mt-2">${result.grade.message}</p>
        </div>

        <!-- Five Rings Radar -->
        <div class="card mb-6">
          <h3 class="card__title mb-4">五輪レーダー</h3>
          <div id="radar-chart-container" style="width: 100%; max-width: 320px; margin: 0 auto;">
            <canvas id="radar-canvas" width="320" height="320"></canvas>
          </div>
          <div class="stat-grid mt-4">
            ${Object.entries(result.ringScores).map(([ring, score]) => `
              <div class="stat-card">
                <div class="stat-card__icon">${RING_ICONS[ring]}</div>
                <div class="stat-card__value">${score}</div>
                <div class="stat-card__label">${RING_NAMES[ring]}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Bio Age Estimation -->
        <div class="card mb-6" style="background: var(--color-accent-water-surface);">
          <h3 class="card__title mb-2">🧬 推定生物学的年齢</h3>
          <p class="text-sm text-muted mb-4">
            ※ 生活習慣からの簡易推定です。正確な測定には専門検査が必要です。
          </p>
          <div class="flex items-center justify-between">
            <div>
              <div style="font-size: var(--text-xs); color: var(--color-text-tertiary);">実年齢</div>
              <div style="font-size: var(--text-2xl); font-weight: 700;">${result.bioAge.chronological}歳</div>
            </div>
            <div style="font-size: var(--text-2xl);">→</div>
            <div>
              <div style="font-size: var(--text-xs); color: var(--color-text-tertiary);">推定体内年齢</div>
              <div style="font-size: var(--text-2xl); font-weight: 700; color: ${result.bioAge.difference > 0 ? 'var(--color-success)' : result.bioAge.difference < 0 ? 'var(--color-danger)' : 'var(--color-text-primary)'};">
                ${result.bioAge.estimated}歳
              </div>
            </div>
          </div>
          <p class="text-sm mt-3" style="color: var(--color-accent-water);">
            ${result.bioAge.interpretation}
          </p>
        </div>

        <!-- Frailty Status -->
        <div class="card mb-6">
          <h3 class="card__title mb-2">フレイル判定</h3>
          <div class="flex items-center gap-3 mt-2">
            <span class="badge badge--${result.frailtyStatus.color}" style="font-size: var(--text-sm); padding: var(--space-2) var(--space-4);">
              ${result.frailtyStatus.label}
            </span>
          </div>
          <p class="text-sm text-muted mt-2">${result.frailtyStatus.description}</p>
        </div>

        <!-- Priority Improvements -->
        <div class="card mb-6">
          <h3 class="card__title mb-4">📋 改善優先領域</h3>
          <div class="stagger">
            ${getAdvice(result).map(a => `
              <div class="lesson-card" data-action="${a.action}">
                <div class="lesson-card__number" style="background: var(--color-primary-surface); color: var(--color-primary);">
                  ${a.icon}
                </div>
                <div class="lesson-card__content">
                  <div class="lesson-card__title">${a.title}</div>
                  <div class="lesson-card__desc" style="white-space: normal;">${a.text}</div>
                </div>
                <div class="lesson-card__arrow">→</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="flex gap-3">
          <button class="btn btn--secondary" id="selfcheck-retry" style="flex:1;">もう一度チェック</button>
          <button class="btn btn--primary" id="selfcheck-to-home" style="flex:1;">ホームに戻る</button>
        </div>
      </div>
    `;

    // Draw radar chart
    setTimeout(() => drawRadar(result.ringScores), 100);

    // Navigation
    document.getElementById('selfcheck-retry').addEventListener('click', () => {
      currentStep = 0;
      answers = {};
      renderIntro(container);
    });

    document.getElementById('selfcheck-to-home').addEventListener('click', () => {
      Router.navigate('home');
    });

    // Advice action links
    container.querySelectorAll('[data-action]').forEach(el => {
      el.addEventListener('click', () => {
        Router.navigate(el.dataset.action);
      });
    });
  }

  /**
   * Draw a simple radar chart on canvas
   */
  function drawRadar(ringScores) {
    const canvas = document.getElementById('radar-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 320;
    const center = size / 2;
    const maxR = 120;
    const rings = [1, 2, 3, 4, 5];
    const n = rings.length;
    const angleStep = (2 * Math.PI) / n;

    // DPI scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, size, size);

    // Draw grid
    for (let level = 1; level <= 4; level++) {
      const r = (maxR / 4) * level;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const angle = angleStep * i - Math.PI / 2;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(0,0,0,0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw axes
    for (let i = 0; i < n; i++) {
      const angle = angleStep * i - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(center + maxR * Math.cos(angle), center + maxR * Math.sin(angle));
      ctx.strokeStyle = 'rgba(0,0,0,0.06)';
      ctx.stroke();
    }

    // Draw data polygon
    ctx.beginPath();
    const ringColors = ['#E74C3C', '#F39C12', '#2ECC71', '#3498DB', '#9B59B6'];
    for (let i = 0; i <= n; i++) {
      const idx = i % n;
      const ring = rings[idx];
      const score = (ringScores[ring] || 0) / 100;
      const r = score * maxR;
      const angle = angleStep * idx - Math.PI / 2;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.fillStyle = 'rgba(27, 122, 78, 0.15)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(27, 122, 78, 0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw points and labels
    for (let i = 0; i < n; i++) {
      const ring = rings[i];
      const score = (ringScores[ring] || 0) / 100;
      const r = score * maxR;
      const angle = angleStep * i - Math.PI / 2;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);

      // Point
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = ringColors[i];
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      const labelR = maxR + 24;
      const lx = center + labelR * Math.cos(angle);
      const ly = center + labelR * Math.sin(angle);
      ctx.font = '12px "Noto Sans JP", sans-serif';
      ctx.fillStyle = '#5C5C58';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${RING_ICONS[ring]} ${RING_NAMES[ring]}`, lx, ly);
    }
  }

  /**
   * Get all questions
   */
  function getQuestions() {
    return questions;
  }

  return {
    questions,
    calculate,
    getAdvice,
    getQuestions,
    renderIntro,
    renderQuestion,
    renderResult,
    RING_NAMES,
    RING_ICONS,
    RING_WEIGHTS,
  };
})();
