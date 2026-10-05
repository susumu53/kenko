/* ============================================================
   健康長寿アドバイザー 修了試験 ＆ 公式修了証発行システム
   
   機能:
   1. 4ステップ統合ウィザード
      Step 1: 受験者登録（氏名・メールアドレス・コース）
      Step 2: オンライン修了試験（全15問・自動進捗トラッキング）
      Step 3: 自動採点・合否判定（70%以上合格）・全問解説
      Step 4: 公式修了証プレビュー ＆ 高精細PDF即時ダウンロード
      Step 5: 発行完了 ＆ 次コース案内
   2. 発行者台帳の二重記録システム:
      - ブラウザローカル（localStorage）への永続蓄積 ＆ 管理者用CSVエクスポート
      - Googleスプレッドシート（Google Apps Script Webhook）への自動リアルタイム記帳
   3. 証明番号の自動採番（KLA-{Level}-{Year}-{Serial}）
   4. 照会・検証用QRコードの動的生成
   5. html2canvas + jsPDF によるA4横高精細ベクターPDF出力
   ============================================================ */

(function () {
  'use strict';

  // ============================================================
  // Configuration
  // ============================================================
  const CONFIG = {
    // 【Googleスプレッドシート自動保存用Webhook URL】
    // Google Apps Script（GAS）でウェブアプリをデプロイしたURLをここに設定すると、
    // 修了証発行時に「お名前」「メールアドレス」「コース」「得点」「証明番号」が
    // 自動でスプレッドシートにリアルタイム記録されます。
    // （※設定方法は docs/GAS_SPREADSHEET_SETUP.md を参照）
    GOOGLE_SHEETS_WEBHOOK_URL: '', // 例: 'https://script.google.com/macros/s/XXXX/exec'

    STORAGE_KEY: 'kenko_certificates',
  };

  const COURSE_MAP = {
    beginner: {
      code: 'B',
      label: '初級コース',
      fullLabel: '初級コース',
      nextCourseTitle: '中級認定コース（動機づけ面接・社会的処方）',
      nextCourseUrl: 'https://note.com/hero_as_a_hobbty'
    },
    intermediate: {
      code: 'I',
      label: '中級コース',
      fullLabel: '中級コース',
      nextCourseTitle: '上級コース（認定講師養成・地域共創リーダー）',
      nextCourseUrl: 'https://note.com/hero_as_a_hobbty'
    },
    advanced: {
      code: 'A',
      label: '上級コース',
      fullLabel: '上級コース（認定講師）',
      nextCourseTitle: '公式コミュニティ・認定講師活動ネットワーク',
      nextCourseUrl: 'https://note.com/hero_as_a_hobbty'
    },
  };

  // ============================================================
  // Course Access Control (Passcodes for Paid Courses)
  // 初級は無料開放・パスコード不要。
  // 中級・上級はnote有料受講生限定（有料マガジン最終回にキーを記載）。
  // ============================================================
  const COURSE_PASSCODES = {
    beginner: null, // 初級：誰でも受験可能
    intermediate: 'KLA-MID-2026', // 中級：有料note受講生限定認証キー
    advanced: 'KLA-ADV-2026',     // 上級：有料note受講生限定認証キー
  };

  // ============================================================
  // Application State
  // ============================================================
  let currentStep = 1;
  let userData = {
    name: '',
    email: '',
    courseKey: 'beginner',
  };
  let userAnswers = {}; // { [questionIndex]: optionIndex }
  let examResult = {
    total: 15,
    score: 0,
    passed: false,
    date: '',
  };
  let certificateData = null;

  // ============================================================
  // DOM Elements
  // ============================================================
  const $stepIndicator = document.getElementById('step-indicator');
  const $step1 = document.getElementById('step-1');
  const $step2 = document.getElementById('step-2');
  const $step3 = document.getElementById('step-3');
  const $step4 = document.getElementById('step-4');
  const $step5 = document.getElementById('step-5');

  // Step 1 Elements
  const $form = document.getElementById('certificate-form');
  const $inputName = document.getElementById('input-name');
  const $inputEmail = document.getElementById('input-email');
  const $inputCourse = document.getElementById('input-course');
  const $passcodeGroup = document.getElementById('passcode-group');
  const $inputPasscode = document.getElementById('input-passcode');
  const $courseLockHint = document.getElementById('course-lock-hint');

  // Step 2 Elements
  const $examCourseBadge = document.getElementById('exam-course-badge');
  const $examCourseTitle = document.getElementById('exam-course-title');
  const $examUserDisplay = document.getElementById('exam-user-display');
  const $examAnsweredCount = document.getElementById('exam-answered-count');
  const $examTotalCount = document.getElementById('exam-total-count');
  const $examProgressBar = document.getElementById('exam-progress-bar');
  const $questionsContainer = document.getElementById('questions-container');
  const $btnSubmitExam = document.getElementById('btn-submit-exam');
  const $examUnansweredAlert = document.getElementById('exam-unanswered-alert');

  // Step 3 Elements
  const $resultBanner = document.getElementById('result-banner');
  const $resultActions = document.getElementById('result-actions');
  const $explanationsContainer = document.getElementById('explanations-container');
  const $resultBottomActions = document.getElementById('result-bottom-actions');

  // Step 4 Elements
  const $certName = document.getElementById('cert-name');
  const $certCourse = document.getElementById('cert-course');
  const $certDate = document.getElementById('cert-date');
  const $certScore = document.getElementById('cert-score');
  const $certId = document.getElementById('cert-id');
  const $certQr = document.getElementById('cert-qr');
  const $certCanvas = document.getElementById('certificate-canvas');
  const $btnBackToResult = document.getElementById('btn-back-to-result');
  const $btnDownload = document.getElementById('btn-download');

  // Step 5 Elements
  const $completeCertId = document.getElementById('complete-cert-id');
  const $completeName = document.getElementById('complete-name');
  const $completeEmail = document.getElementById('complete-email');
  const $completeCourse = document.getElementById('complete-course');
  const $completeScore = document.getElementById('complete-score');
  const $stepupTitle = document.getElementById('stepup-title');
  const $stepupDesc = document.getElementById('stepup-desc');
  const $btnDownloadAgain = document.getElementById('btn-download-again');
  const $btnNew = document.getElementById('btn-new');

  // Admin Modal Elements
  const $btnOpenAdmin = document.getElementById('btn-open-admin');
  const $linkAdminFooter = document.getElementById('link-admin-footer');
  const $adminModalOverlay = document.getElementById('admin-modal-overlay');
  const $btnCloseAdmin = document.getElementById('btn-close-admin');
  const $adminTotalCount = document.getElementById('admin-total-count');
  const $adminTableBody = document.getElementById('admin-table-body');
  const $btnExportCsv = document.getElementById('btn-export-csv');
  const $btnClearHistory = document.getElementById('btn-clear-history');

  // Theme Toggle
  const $btnThemeToggle = document.getElementById('btn-theme-toggle');

  // ============================================================
  // Initialization
  // ============================================================
  function init() {
    // Parse URL params for course auto-selection (e.g. ?course=beginner&key=...)
    const params = new URLSearchParams(window.location.search);
    const courseParam = params.get('course');
    const keyParam = params.get('key');

    if (courseParam && COURSE_MAP[courseParam]) {
      $inputCourse.value = courseParam;

      if (courseParam === 'beginner') {
        // 初級リンクから来た場合は初級に固定し、中級・上級への切り替えを抑止
        $inputCourse.disabled = true;
        if ($courseLockHint) $courseLockHint.style.display = 'block';
      } else {
        // 有料コースでURLに認証キーが含まれている場合は自動入力
        if (keyParam && $inputPasscode) {
          $inputPasscode.value = keyParam;
        }
      }
    }

    // Check Admin access (?admin=1 or ?admin=true)
    const isAdmin = params.get('admin') === '1' || params.get('admin') === 'true';
    if (isAdmin) {
      if ($btnOpenAdmin) $btnOpenAdmin.style.display = 'inline-flex';
      if ($linkAdminFooter) $linkAdminFooter.style.display = 'inline';
    }

    // Initialize passcode visibility
    updatePasscodeVisibility();
    $inputCourse.addEventListener('change', updatePasscodeVisibility);

    // Attach Event Listeners
    $form.addEventListener('submit', handleRegistrationSubmit);
    $btnSubmitExam.addEventListener('click', handleExamSubmit);
    $btnBackToResult.addEventListener('click', () => goToStep(3));
    $btnDownload.addEventListener('click', handleDownloadCertificate);
    $btnDownloadAgain.addEventListener('click', handleDownloadCertificate);
    $btnNew.addEventListener('click', handleResetAll);

    // Admin Modal Listeners
    $btnOpenAdmin.addEventListener('click', openAdminModal);
    $linkAdminFooter.addEventListener('click', (e) => {
      e.preventDefault();
      openAdminModal();
    });
    $btnCloseAdmin.addEventListener('click', closeAdminModal);
    $adminModalOverlay.addEventListener('click', (e) => {
      if (e.target === $adminModalOverlay) closeAdminModal();
    });
    $btnExportCsv.addEventListener('click', exportLedgerToCSV);
    $btnClearHistory.addEventListener('click', handleClearHistory);

    // Theme Toggle
    $btnThemeToggle.addEventListener('click', toggleTheme);
    loadTheme();

    // Verification check (?verify=ID)
    checkVerification();
  }

  // ============================================================
  // Step Navigation
  // ============================================================
  function goToStep(step) {
    currentStep = step;

    $step1.style.display = step === 1 ? 'block' : 'none';
    $step2.style.display = step === 2 ? 'block' : 'none';
    $step3.style.display = step === 3 ? 'block' : 'none';
    $step4.style.display = step === 4 ? 'block' : 'none';
    $step5.style.display = step === 5 ? 'block' : 'none';

    // Update Step Indicator
    const steps = $stepIndicator.querySelectorAll('.step-indicator__step');
    const lines = $stepIndicator.querySelectorAll('.step-indicator__line');

    steps.forEach((el, i) => {
      const stepNum = i + 1;
      el.classList.remove('active', 'completed');
      if (stepNum === step) {
        el.classList.add('active');
      } else if (stepNum < step) {
        el.classList.add('completed');
      }
    });

    lines.forEach((el, i) => {
      el.classList.toggle('active', i + 1 < step);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ============================================================
  // Step 1: Registration Validation & Handler
  // ============================================================
  function handleRegistrationSubmit(e) {
    e.preventDefault();

    const name = $inputName.value.trim();
    const email = $inputEmail.value.trim();
    const courseKey = $inputCourse.value;

    let valid = true;

    // Validate Name
    if (!name) {
      showError('name', 'お名前を入力してください');
      valid = false;
    } else {
      clearError('name');
    }

    // Validate Email (Mandatory)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      showError('email', 'メールアドレスを入力してください');
      valid = false;
    } else if (!emailRegex.test(email)) {
      showError('email', '有効なメールアドレス形式で入力してください');
      valid = false;
    } else {
      clearError('email');
    }

    if (!courseKey || !COURSE_MAP[courseKey]) {
      showError('course', 'コースを選択してください');
      valid = false;
    } else {
      clearError('course');
    }

    // Validate Passcode for Paid Courses (Intermediate & Advanced)
    const expectedPasscode = COURSE_PASSCODES[courseKey];
    if (expectedPasscode !== null) {
      const enteredPasscode = $inputPasscode ? $inputPasscode.value.trim() : '';
      if (!enteredPasscode) {
        showError('passcode', '受講認証キーを入力してください（有料マガジン最終回に記載）');
        valid = false;
      } else if (enteredPasscode !== expectedPasscode) {
        showError('passcode', '受講認証キーが正しくありません。note有料マガジン最終回をご確認ください');
        valid = false;
      } else {
        clearError('passcode');
      }
    }

    if (!valid) return;

    userData = {
      name,
      email,
      courseKey,
    };

    // Prepare Exam for chosen course
    setupExam(courseKey);
    goToStep(2);
  }

  function showError(field, msg) {
    const errorEl = document.getElementById(`error-${field}`);
    const inputEl = document.getElementById(`input-${field}`);
    if (errorEl) errorEl.textContent = msg;
    if (inputEl) inputEl.classList.add('error');
  }

  function clearError(field) {
    const errorEl = document.getElementById(`error-${field}`);
    const inputEl = document.getElementById(`input-${field}`);
    if (errorEl) errorEl.textContent = '';
    if (inputEl) inputEl.classList.remove('error');
  }

  // ============================================================
  // Step 2: Exam Setup & Rendering
  // ============================================================
  function setupExam(courseKey) {
    const quiz = QUIZ_DATA[courseKey];
    if (!quiz) return;

    userAnswers = {};
    $examCourseBadge.textContent = quiz.courseLabel;
    $examCourseTitle.textContent = quiz.title;
    $examUserDisplay.textContent = `${userData.name} 様 (${userData.email})`;
    $examTotalCount.textContent = quiz.totalQuestions;
    $examAnsweredCount.textContent = '0';
    $examProgressBar.style.width = '0%';
    $examUnansweredAlert.style.display = 'none';

    renderQuestions(quiz.questions);
  }

  function renderQuestions(questions) {
    $questionsContainer.innerHTML = '';

    questions.forEach((q, qIndex) => {
      const card = document.createElement('div');
      card.className = 'quiz-question-card';
      card.id = `quiz-card-${qIndex}`;

      const header = document.createElement('div');
      header.className = 'quiz-q-header';
      header.innerHTML = `
        <span class="quiz-q-num">第 ${qIndex + 1} 問</span>
        <h4 class="quiz-q-text">${escapeHtml(q.question.replace(/^Q\d+\.\s*/, ''))}</h4>
      `;
      card.appendChild(header);

      const optionsDiv = document.createElement('div');
      optionsDiv.className = 'quiz-options';

      q.options.forEach((optText, optIndex) => {
        const optionLabel = document.createElement('label');
        optionLabel.className = 'quiz-option';
        optionLabel.id = `opt-${qIndex}-${optIndex}`;

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = `question-${qIndex}`;
        radio.value = optIndex;
        radio.className = 'quiz-radio';

        radio.addEventListener('change', () => {
          userAnswers[qIndex] = optIndex;
          updateOptionStyles(qIndex, optIndex, q.options.length);
          updateProgress(questions.length);
          card.classList.add('answered');
        });

        optionLabel.appendChild(radio);
        const textSpan = document.createElement('span');
        textSpan.textContent = optText;
        optionLabel.appendChild(textSpan);

        optionsDiv.appendChild(optionLabel);
      });

      card.appendChild(optionsDiv);
      $questionsContainer.appendChild(card);
    });
  }

  function updateOptionStyles(qIndex, selectedOptIndex, totalOptions) {
    for (let i = 0; i < totalOptions; i++) {
      const optEl = document.getElementById(`opt-${qIndex}-${i}`);
      if (optEl) {
        if (i === selectedOptIndex) {
          optEl.classList.add('selected');
        } else {
          optEl.classList.remove('selected');
        }
      }
    }
  }

  function updateProgress(total) {
    const answered = Object.keys(userAnswers).length;
    $examAnsweredCount.textContent = answered;
    const pct = Math.round((answered / total) * 100);
    $examProgressBar.style.width = `${pct}%`;

    if (answered === total) {
      $examUnansweredAlert.style.display = 'none';
    }
  }

  // ============================================================
  // Step 2 -> Step 3: Exam Submission & Grading
  // ============================================================
  function handleExamSubmit() {
    const quiz = QUIZ_DATA[userData.courseKey];
    const total = quiz.questions.length;
    const answeredCount = Object.keys(userAnswers).length;

    // Check if all questions are answered
    if (answeredCount < total) {
      $examUnansweredAlert.style.display = 'block';
      // Scroll to the first unanswered question
      for (let i = 0; i < total; i++) {
        if (userAnswers[i] === undefined) {
          const card = document.getElementById(`quiz-card-${i}`);
          if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.style.borderColor = 'var(--color-danger)';
            setTimeout(() => {
              card.style.borderColor = '';
            }, 2500);
          }
          break;
        }
      }
      return;
    }

    $examUnansweredAlert.style.display = 'none';

    // Calculate score
    let correctCount = 0;
    quiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) {
        correctCount++;
      }
    });

    const isPassed = correctCount >= quiz.passScore;
    examResult = {
      total,
      score: correctCount,
      passed: isPassed,
      date: new Date().toISOString().split('T')[0],
    };

    renderResultView(quiz, correctCount, total, isPassed);
    goToStep(3);
  }

  // ============================================================
  // Step 3: Render Result & Explanations
  // ============================================================
  function renderResultView(quiz, score, total, isPassed) {
    const pct = Math.round((score / total) * 100);

    // Banner
    if (isPassed) {
      $resultBanner.className = 'result-banner result-banner--pass';
      $resultBanner.innerHTML = `
        <div style="font-size:2.5rem;margin-bottom:0.5rem;">🎉</div>
        <h2 class="result-status-title">修了試験 合格！おめでとうございます！</h2>
        <div class="result-score-highlight">${total}問中 ${score}問 正解（正答率 ${pct}%）</div>
        <div class="result-score-sub">合格ライン：70%以上（11問以上）をクリアしました。</div>
      `;

      const nextCourseInfo = COURSE_MAP[userData.courseKey];
      const certBtnHtml = `
        <button type="button" class="btn btn--primary btn--lg" id="btn-proceed-cert">
          <span>公式修了証（PDF）を発行する</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>
      `;

      $resultActions.innerHTML = certBtnHtml;
      $resultBottomActions.innerHTML = certBtnHtml;

      document.getElementById('btn-proceed-cert').addEventListener('click', prepareCertificate);
      const bottomBtn = $resultBottomActions.querySelector('#btn-proceed-cert');
      if (bottomBtn) bottomBtn.addEventListener('click', prepareCertificate);

    } else {
      $resultBanner.className = 'result-banner result-banner--fail';
      $resultBanner.innerHTML = `
        <div style="font-size:2.5rem;margin-bottom:0.5rem;">😢</div>
        <h2 class="result-status-title">惜しい！あと ${quiz.passScore - score} 問で合格です</h2>
        <div class="result-score-highlight">${total}問中 ${score}問 正解（正答率 ${pct}%）</div>
        <div class="result-score-sub">合格基準は <strong>70%以上（11問以上正解）</strong> です。<br>以下の解説で間違えた箇所を確認し、もう一度挑戦しましょう！</div>
      `;

      const retryBtnHtml = `
        <button type="button" class="btn btn--secondary btn--lg" id="btn-retry-exam">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
          <span>もう一度試験に挑戦する</span>
        </button>
      `;

      $resultActions.innerHTML = retryBtnHtml;
      $resultBottomActions.innerHTML = retryBtnHtml;

      document.getElementById('btn-retry-exam').addEventListener('click', () => {
        setupExam(userData.courseKey);
        goToStep(2);
      });
      const bottomRetry = $resultBottomActions.querySelector('#btn-retry-exam');
      if (bottomRetry) {
        bottomRetry.addEventListener('click', () => {
          setupExam(userData.courseKey);
          goToStep(2);
        });
      }
    }

    // Render Explanations
    $explanationsContainer.innerHTML = '';
    quiz.questions.forEach((q, idx) => {
      const userChoice = userAnswers[idx];
      const isCorrect = userChoice === q.answer;

      const card = document.createElement('div');
      card.className = `explanation-card ${isCorrect ? 'is-correct' : 'is-wrong'}`;

      const userChoiceText = userChoice !== undefined ? q.options[userChoice] : '未回答';
      const correctChoiceText = q.options[q.answer];

      card.innerHTML = `
        <div class="explanation-card-header">
          <span style="font-weight:700;">第 ${idx + 1} 問: ${escapeHtml(q.question.replace(/^Q\d+\.\s*/, ''))}</span>
          <span class="explanation-badge ${isCorrect ? 'explanation-badge--correct' : 'explanation-badge--wrong'}">
            ${isCorrect ? '✅ 正解' : '❌ 不正解'}
          </span>
        </div>
        <div class="explanation-user-choice">
          <strong>あなたの回答:</strong> <span style="${isCorrect ? 'color:var(--color-success);font-weight:600;' : 'color:var(--color-danger);font-weight:600;'}">${escapeHtml(userChoiceText)}</span>
        </div>
        ${!isCorrect ? `
          <div class="explanation-user-choice">
            <strong>正解:</strong> <span style="color:var(--color-success);font-weight:600;">${escapeHtml(correctChoiceText)}</span>
          </div>
        ` : ''}
        <div class="explanation-box">
          <strong>💡 解説:</strong> ${escapeHtml(q.explanation)}
        </div>
      `;

      $explanationsContainer.appendChild(card);
    });
  }

  // ============================================================
  // Step 4: Prepare Certificate Preview
  // ============================================================
  function prepareCertificate() {
    const courseInfo = COURSE_MAP[userData.courseKey];
    const certId = generateCertificateId(courseInfo.code);

    certificateData = {
      name: userData.name,
      email: userData.email,
      courseKey: userData.courseKey,
      courseLabel: courseInfo.fullLabel,
      score: examResult.score,
      total: examResult.total,
      scoreStr: `${examResult.total}問中${examResult.score}問正解 (${Math.round((examResult.score / examResult.total) * 100)}%)`,
      date: examResult.date,
      certId: certId,
    };

    // Update Certificate DOM elements
    $certName.textContent = certificateData.name;
    $certCourse.textContent = certificateData.courseLabel;
    $certDate.textContent = formatDateJapanese(certificateData.date);
    $certScore.textContent = certificateData.scoreStr;
    $certId.textContent = certificateData.certId;

    generateQRCode(certificateData.certId);

    goToStep(4);
  }

  function generateCertificateId(courseCode) {
    const year = new Date().getFullYear();
    const history = loadHistory();
    const yearKey = `${courseCode}-${year}`;
    const count = history.filter((h) => h.id && h.id.startsWith(`KLA-${yearKey}`)).length;
    const serial = String(count + 1).padStart(4, '0');
    return `KLA-${courseCode}-${year}-${serial}`;
  }

  function generateQRCode(certId) {
    $certQr.innerHTML = '';
    const verificationUrl = `${window.location.origin}${window.location.pathname}?verify=${certId}`;

    try {
      const qr = qrcode(0, 'M');
      qr.addData(verificationUrl);
      qr.make();

      const img = document.createElement('img');
      img.src = qr.createDataURL(2, 4);
      img.alt = '検証用QRコード';
      img.style.width = '64px';
      img.style.height = '64px';
      $certQr.appendChild(img);
    } catch (e) {
      $certQr.innerHTML = `<div style="font-size:8px;color:#888;text-align:center;line-height:1.2;">ID:<br>${certId}</div>`;
    }
  }

  function formatDateJapanese(dateStr) {
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${year}年${month}月${day}日`;
  }

  // ============================================================
  // Step 4 -> PDF Download & Recipient Recording
  // ============================================================
  async function handleDownloadCertificate() {
    if (!certificateData) return;

    const loading = showLoading('修了証PDFを生成・記録しています...');

    try {
      // 1. Save recipient info to Local Ledger (localStorage)
      saveToHistory(certificateData);

      // 2. Transmit to Google Spreadsheet Webhook if configured
      if (CONFIG.GOOGLE_SHEETS_WEBHOOK_URL) {
        sendToWebhook(certificateData);
      }

      // 3. Render High-Resolution PDF via html2canvas & jsPDF
      const wrapper = document.querySelector('.certificate-wrapper');
      const origWrapperStyle = wrapper.style.cssText;
      wrapper.style.overflow = 'visible';

      const cert = $certCanvas;
      const origCertStyle = cert.style.cssText;
      cert.style.transform = 'none';
      cert.style.margin = '0';

      const canvas = await html2canvas(cert, {
        scale: 2, // 2x Retina resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFEF9',
        logging: false,
        width: 842,
        height: 595,
      });

      wrapper.style.cssText = origWrapperStyle;
      cert.style.cssText = origCertStyle;

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();   // 297mm
      const pdfHeight = pdf.internal.pageSize.getHeight();  // 210mm

      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      const filename = `修了証_${certificateData.name}_${certificateData.courseLabel}_${certificateData.certId}.pdf`;
      pdf.save(filename);

      // 4. Transition to Complete View (Step 5)
      showCompleteView();

    } catch (error) {
      console.error('Certificate generation failed:', error);
      alert('PDF生成中にエラーが発生しました。もう一度お試しください。');
    } finally {
      hideLoading(loading);
    }
  }

  function showCompleteView() {
    $completeCertId.textContent = certificateData.certId;
    $completeName.textContent = certificateData.name;
    $completeEmail.textContent = certificateData.email;
    $completeCourse.textContent = certificateData.courseLabel;
    $completeScore.textContent = certificateData.scoreStr;

    // Setup Step-up Promo
    const courseInfo = COURSE_MAP[certificateData.courseKey];
    $stepupTitle.textContent = `次のステージ：${courseInfo.nextCourseTitle}へ`;

    goToStep(5);
  }

  // ============================================================
  // Recipient Recording: Local Storage & Webhook
  // ============================================================
  function loadHistory() {
    try {
      const data = localStorage.getItem(CONFIG.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  function saveToHistory(data) {
    try {
      const history = loadHistory();
      // Record complete user identity: Name, Email, Certificate ID, Course, Score, Timestamp
      history.push({
        id: data.certId,
        name: data.name,
        email: data.email,
        course: data.courseKey,
        courseLabel: data.courseLabel,
        score: data.scoreStr,
        date: data.date,
        issuedAt: new Date().toISOString(),
      });
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to record certificate recipient in localStorage:', e);
    }
  }

  function sendToWebhook(data) {
    try {
      const payload = {
        certId: data.certId,
        name: data.name,
        email: data.email,
        course: data.courseLabel,
        score: data.scoreStr,
        date: data.date,
        issuedAt: new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
      };

      // Send beacon or fetch POST (no-cors mode for Google Apps Script Web Apps)
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon(CONFIG.GOOGLE_SHEETS_WEBHOOK_URL, blob);
      } else {
        fetch(CONFIG.GOOGLE_SHEETS_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch((err) => console.warn('Webhook transmission error:', err));
      }
    } catch (e) {
      console.warn('Webhook transmission caught:', e);
    }
  }

  // ============================================================
  // Admin Ledger Modal (修了者台帳 & CSV Export)
  // ============================================================
  function openAdminModal() {
    renderAdminTable();
    $adminModalOverlay.style.display = 'flex';
  }

  function closeAdminModal() {
    $adminModalOverlay.style.display = 'none';
  }

  function renderAdminTable() {
    const history = loadHistory();
    $adminTotalCount.textContent = history.length;

    if (history.length === 0) {
      $adminTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center;color:#888;padding:2rem;">まだ発行記録がありません</td>
        </tr>
      `;
      return;
    }

    $adminTableBody.innerHTML = '';
    // Display newest first
    const reversed = [...history].reverse();

    reversed.forEach((item) => {
      const tr = document.createElement('tr');
      const timeStr = item.issuedAt ? new Date(item.issuedAt).toLocaleString('ja-JP') : item.date;

      tr.innerHTML = `
        <td style="white-space:nowrap;font-size:0.8rem;">${escapeHtml(timeStr)}</td>
        <td><code>${escapeHtml(item.id)}</code></td>
        <td style="font-weight:600;color:var(--color-text-primary);">${escapeHtml(item.name)}</td>
        <td><a href="mailto:${escapeHtml(item.email)}" style="color:var(--color-primary);">${escapeHtml(item.email || '—')}</a></td>
        <td><span class="exam-badge">${escapeHtml(item.courseLabel || item.course)}</span></td>
        <td>${escapeHtml(item.score || '—')}</td>
      `;
      $adminTableBody.appendChild(tr);
    });
  }

  function exportLedgerToCSV() {
    const history = loadHistory();
    if (history.length === 0) {
      alert('エクスポートする発行記録がありません。');
      return;
    }

    // CSV Header with UTF-8 BOM
    const header = ['証明番号', '発行日時', '受講者氏名', 'メールアドレス', 'コース', '試験得点'];
    const rows = history.map((item) => [
      `"${(item.id || '').replace(/"/g, '""')}"`,
      `"${(item.issuedAt || item.date || '').replace(/"/g, '""')}"`,
      `"${(item.name || '').replace(/"/g, '""')}"`,
      `"${(item.email || '').replace(/"/g, '""')}"`,
      `"${(item.courseLabel || item.course || '').replace(/"/g, '""')}"`,
      `"${(item.score || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [header.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `健康長寿アドバイザー修了者台帳_${dateStr}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function handleClearHistory() {
    if (confirm('修了者台帳のローカル記録を全消去しますか？\n（※この操作は取り消せません）')) {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
      renderAdminTable();
    }
  }

  // ============================================================
  // Verification Check (?verify=ID)
  // ============================================================
  function checkVerification() {
    const params = new URLSearchParams(window.location.search);
    const verifyId = params.get('verify');

    if (verifyId) {
      const history = loadHistory();
      const found = history.find((h) => h.id === verifyId);

      if (found) {
        alert(`✅ 公式修了証の照会が成功しました。\n\n【照会結果: 有効】\n・証明番号: ${found.id}\n・お名前: ${found.name} 様\n・コース: ${found.courseLabel || found.course}\n・得点: ${found.score || '合格'}\n・発行日時: ${new Date(found.issuedAt).toLocaleDateString('ja-JP')}`);
      } else {
        alert(`⚠️ 証明番号「${verifyId}」は、この端末のローカル台帳には記録されていません。\n（※他の端末で発行された場合はローカル台帳が分かれます）`);
      }

      window.history.replaceState({}, '', window.location.pathname);
    }
  }

  // ============================================================
  // Reset & Helpers
  // ============================================================
  function updatePasscodeVisibility() {
    const courseKey = $inputCourse.value;
    if (courseKey === 'intermediate' || courseKey === 'advanced') {
      if ($passcodeGroup) $passcodeGroup.style.display = 'block';
    } else {
      if ($passcodeGroup) {
        $passcodeGroup.style.display = 'none';
        clearError('passcode');
      }
    }
  }

  function handleResetAll() {
    userData = { name: '', email: '', courseKey: 'beginner' };
    userAnswers = {};
    certificateData = null;
    $form.reset();
    $inputCourse.disabled = false;
    if ($courseLockHint) $courseLockHint.style.display = 'none';
    if ($inputPasscode) $inputPasscode.value = '';
    ['name', 'email', 'course', 'passcode'].forEach(clearError);
    updatePasscodeVisibility();
    goToStep(1);
  }

  function showLoading(text) {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="loading-spinner">
        <div class="loading-spinner__icon"></div>
        <div class="loading-spinner__text">${text}</div>
      </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  }

  function hideLoading(overlay) {
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    $btnThemeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('kenko_cert_theme', next);
  }

  function loadTheme() {
    const saved = localStorage.getItem('kenko_cert_theme');
    if (saved === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      $btnThemeToggle.textContent = '☀️';
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Run on page load
  init();

})();
