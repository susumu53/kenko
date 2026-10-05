/* ============================================================
   いのちを学ぶ基礎講座 修了試験 ＆ 公式修了証発行システム
   
   機能:
   1. 4ステップ統合ウィザード
      Step 1: 受験者登録（氏名・メールアドレス）
      Step 2: オンライン修了試験（全25問・自動進捗トラッキング）
      Step 3: 自動採点・合否判定（72%以上合格）・全問エビデンス解説
      Step 4: 公式修了証プレビュー ＆ 高精細PDF即時ダウンロード
      Step 5: 発行完了 ＆ 健康長寿アドバイザー等連携案内
   2. 発行者台帳の二重記録システム:
      - ブラウザローカル（localStorage）への永続蓄積 ＆ 管理者用CSVエクスポート
      - Googleスプレッドシート（Google Apps Script Webhook）への自動リアルタイム記帳
   3. 証明番号の自動採番（INO-BSC-{Year}-{Serial}）
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
    GOOGLE_SHEETS_WEBHOOK_URL: '', // 例: 'https://script.google.com/macros/s/XXXX/exec'
    STORAGE_KEY: 'inochi_certificates',
  };

  const COURSE_MAP = {
    inochi: {
      code: 'BSC',
      label: '基礎認定コース',
      fullLabel: 'ゲートキーパー × グリーフケア 基礎',
      nextCourseTitle: '健康長寿アドバイザー 認定制度',
      nextCourseUrl: '../certificate/index.html'
    }
  };

  // ============================================================
  // Application State
  // ============================================================
  let currentStep = 1;
  let userData = {
    name: '',
    email: '',
    courseKey: 'inochi',
  };
  let userAnswers = {}; // { [questionIndex]: optionIndex }
  let examResult = {
    total: 25,
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
  const $errorName = document.getElementById('error-name');
  const $errorEmail = document.getElementById('error-email');

  // Step 2 Elements
  const $examCourseBadge = document.getElementById('exam-course-badge');
  const $examCourseTitle = document.getElementById('exam-course-title');
  const $examUserDisplay = document.getElementById('exam-user-display');
  const $examAnsweredCount = document.getElementById('exam-answered-count');
  const $examTotalCount = document.getElementById('exam-total-count');
  const $examProgressBar = document.getElementById('exam-progress-bar');
  const $questionsContainer = document.getElementById('questions-container');
  const $examUnansweredAlert = document.getElementById('exam-unanswered-alert');
  const $btnSubmitExam = document.getElementById('btn-submit-exam');

  // Step 3 Elements
  const $resultBanner = document.getElementById('result-banner');
  const $resultActions = document.getElementById('result-actions');
  const $explanationsContainer = document.getElementById('explanations-container');
  const $resultBottomActions = document.getElementById('result-bottom-actions');

  // Step 4 Elements
  const $certCanvas = document.getElementById('certificate-canvas');
  const $certName = document.getElementById('cert-name');
  const $certCourse = document.getElementById('cert-course');
  const $certDate = document.getElementById('cert-date');
  const $certScore = document.getElementById('cert-score');
  const $certId = document.getElementById('cert-id');
  const $certQr = document.getElementById('cert-qr');
  const $btnBackToResult = document.getElementById('btn-back-to-result');
  const $btnDownload = document.getElementById('btn-download');

  // Step 5 Elements
  const $completeCertId = document.getElementById('complete-cert-id');
  const $completeName = document.getElementById('complete-name');
  const $completeEmail = document.getElementById('complete-email');
  const $completeCourse = document.getElementById('complete-course');
  const $completeDate = document.getElementById('complete-date');
  const $btnRedownload = document.getElementById('btn-redownload');
  const $btnRestart = document.getElementById('btn-restart');

  // Modal Elements
  const $btnOpenAdmin = document.getElementById('btn-open-admin');
  const $adminModal = document.getElementById('admin-modal');
  const $modalAdminBackdrop = document.getElementById('modal-admin-backdrop');
  const $btnCloseAdmin = document.getElementById('btn-close-admin');
  const $statTotal = document.getElementById('stat-total');
  const $statLatestDate = document.getElementById('stat-latest-date');
  const $adminSearchInput = document.getElementById('admin-search-input');
  const $adminTableBody = document.getElementById('admin-table-body');
  const $btnExportCsv = document.getElementById('btn-export-csv');

  // Consultation Modal Elements
  const $btnOpenHelp = document.getElementById('btn-open-help');
  const $consultationModal = document.getElementById('consultation-modal');
  const $modalConsultationBackdrop = document.getElementById('modal-consultation-backdrop');
  const $btnCloseConsultation = document.getElementById('btn-close-consultation');
  const $btnCloseConsultation2 = document.getElementById('btn-close-consultation-2');

  // Theme toggle
  const $btnThemeToggle = document.getElementById('btn-theme-toggle');

  // ============================================================
  // Initialization
  // ============================================================
  function init() {
    initTheme();
    bindEvents();
    checkAdminAccess();
  }

  function checkAdminAccess() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === '1' || params.get('admin') === 'true') {
      if ($btnOpenAdmin) {
        $btnOpenAdmin.style.display = 'inline-flex';
      }
    }
  }

  // ============================================================
  // Event Bindings
  // ============================================================
  function bindEvents() {
    // Step 1: Form submission
    $form.addEventListener('submit', handleFormSubmit);

    // Real-time input validation clear
    $inputName.addEventListener('input', () => clearError($errorName, $inputName));
    $inputEmail.addEventListener('input', () => clearError($errorEmail, $inputEmail));

    // Step 2: Submit exam
    $btnSubmitExam.addEventListener('click', handleSubmitExam);

    // Step 4: Preview buttons
    $btnBackToResult.addEventListener('click', () => goToStep(3));
    $btnDownload.addEventListener('click', handleDownloadPdf);

    // Step 5: Redownload & Restart
    $btnRedownload.addEventListener('click', handleDownloadPdf);
    $btnRestart.addEventListener('click', handleRestart);

    // Admin Modal
    $btnOpenAdmin.addEventListener('click', openAdminModal);
    $btnCloseAdmin.addEventListener('click', closeAdminModal);
    $modalAdminBackdrop.addEventListener('click', closeAdminModal);
    $adminSearchInput.addEventListener('input', handleAdminSearch);
    $btnExportCsv.addEventListener('click', handleExportCsv);

    // Consultation Modal
    if ($btnOpenHelp) {
      $btnOpenHelp.addEventListener('click', (e) => {
        e.preventDefault();
        openConsultationModal();
      });
    }
    if ($btnCloseConsultation) $btnCloseConsultation.addEventListener('click', closeConsultationModal);
    if ($btnCloseConsultation2) $btnCloseConsultation2.addEventListener('click', closeConsultationModal);
    if ($modalConsultationBackdrop) $modalConsultationBackdrop.addEventListener('click', closeConsultationModal);

    // Theme toggle
    $btnThemeToggle.addEventListener('click', toggleTheme);

    // Escape key closes modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAdminModal();
        closeConsultationModal();
      }
    });
  }

  // ============================================================
  // Theme Management
  // ============================================================
  function initTheme() {
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    $btnThemeToggle.textContent = saved === 'dark' ? '☀️' : '🌙';
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    $btnThemeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
  }

  // ============================================================
  // Step Navigation
  // ============================================================
  function goToStep(step) {
    currentStep = step;

    // Update Step Indicator
    const $steps = $stepIndicator.querySelectorAll('.step-indicator__step');
    $steps.forEach($s => {
      const sNum = parseInt($s.getAttribute('data-step'), 10);
      $s.classList.remove('active', 'completed');
      if (sNum === step) {
        $s.classList.add('active');
      } else if (sNum < step) {
        $s.classList.add('completed');
      }
    });

    // Toggle Section visibility
    $step1.style.display = step === 1 ? 'block' : 'none';
    $step2.style.display = step === 2 ? 'block' : 'none';
    $step3.style.display = step === 3 ? 'block' : 'none';
    $step4.style.display = step === 4 ? 'block' : 'none';
    $step5.style.display = step === 5 ? 'block' : 'none';

    // Smooth scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ============================================================
  // Validation Helpers
  // ============================================================
  function showError($elem, $input, message) {
    $elem.textContent = message;
    $elem.style.display = 'block';
    if ($input) $input.classList.add('has-error');
  }

  function clearError($elem, $input) {
    $elem.textContent = '';
    $elem.style.display = 'none';
    if ($input) $input.classList.remove('has-error');
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ============================================================
  // Step 1: Form Handling
  // ============================================================
  function handleFormSubmit(e) {
    e.preventDefault();

    let hasError = false;
    const name = $inputName.value.trim();
    const email = $inputEmail.value.trim();
    const courseKey = $inputCourse.value;

    if (!name) {
      showError($errorName, $inputName, '修了証に印字するお名前を入力してください');
      hasError = true;
    } else if (name.length > 50) {
      showError($errorName, $inputName, 'お名前は50文字以内で入力してください');
      hasError = true;
    }

    if (!email) {
      showError($errorEmail, $inputEmail, 'メールアドレスを入力してください');
      hasError = true;
    } else if (!validateEmail(email)) {
      showError($errorEmail, $inputEmail, '正しいメールアドレスの形式で入力してください');
      hasError = true;
    }

    if (hasError) return;

    // Save user data in state
    userData = { name, email, courseKey };
    userAnswers = {};

    // Render questions and start exam
    renderExam(courseKey);
    goToStep(2);
  }

  // ============================================================
  // Step 2: Exam Rendering & Tracking
  // ============================================================
  function renderExam(courseKey) {
    const courseQuiz = QUIZ_DATA[courseKey];
    if (!courseQuiz) {
      alert('試験データが見つかりません。');
      return;
    }

    $examCourseBadge.textContent = courseQuiz.courseLabel;
    $examCourseTitle.textContent = courseQuiz.title;
    $examUserDisplay.textContent = `${userData.name} 様（${userData.email}）`;

    const total = courseQuiz.questions.length;
    $examTotalCount.textContent = total;
    $examAnsweredCount.textContent = '0';
    $examProgressBar.style.width = '0%';
    $examUnansweredAlert.style.display = 'none';

    // Clear previous
    $questionsContainer.innerHTML = '';

    // Render each question
    courseQuiz.questions.forEach((q, qIndex) => {
      const $card = document.createElement('div');
      $card.className = 'question-card';
      $card.id = `question-card-${qIndex}`;

      const $header = document.createElement('div');
      $header.className = 'question-card__header';

      const $number = document.createElement('span');
      $number.className = 'question-card__number';
      $number.textContent = `第 ${qIndex + 1} 問 / 全 ${total} 問`;

      const $status = document.createElement('span');
      $status.className = 'question-card__status';
      $status.id = `question-status-${qIndex}`;
      $status.textContent = '未回答';

      $header.appendChild($number);
      $header.appendChild($status);

      const $title = document.createElement('h3');
      $title.className = 'question-card__title';
      $title.textContent = q.question;

      const $options = document.createElement('div');
      $options.className = 'options-list';

      q.options.forEach((optText, optIndex) => {
        const $label = document.createElement('label');
        $label.className = 'option-item';
        $label.setAttribute('for', `q${qIndex}_opt${optIndex}`);

        const $radio = document.createElement('input');
        $radio.type = 'radio';
        $radio.name = `question_${qIndex}`;
        $radio.id = `q${qIndex}_opt${optIndex}`;
        $radio.value = optIndex;

        $radio.addEventListener('change', () => {
          handleOptionSelect(qIndex, optIndex, total);
        });

        const $optTextSpan = document.createElement('span');
        $optTextSpan.className = 'option-item__text';
        $optTextSpan.textContent = optText;

        $label.appendChild($radio);
        $label.appendChild($optTextSpan);
        $options.appendChild($label);
      });

      $card.appendChild($header);
      $card.appendChild($title);
      $card.appendChild($options);

      $questionsContainer.appendChild($card);
    });
  }

  function handleOptionSelect(qIndex, optIndex, total) {
    userAnswers[qIndex] = optIndex;

    // Update status badge
    const $status = document.getElementById(`question-status-${qIndex}`);
    if ($status) {
      $status.textContent = '回答済';
      $status.classList.add('answered');
    }

    // Highlight selected card
    const $card = document.getElementById(`question-card-${qIndex}`);
    if ($card) {
      const $labels = $card.querySelectorAll('.option-item');
      $labels.forEach(($lbl, idx) => {
        if (idx === optIndex) {
          $lbl.classList.add('selected');
        } else {
          $lbl.classList.remove('selected');
        }
      });
    }

    // Update progress
    const answeredCount = Object.keys(userAnswers).length;
    $examAnsweredCount.textContent = answeredCount;
    const pct = Math.round((answeredCount / total) * 100);
    $examProgressBar.style.width = `${pct}%`;

    // Hide alert if all answered
    if (answeredCount === total) {
      $examUnansweredAlert.style.display = 'none';
    }
  }

  // ============================================================
  // Step 2 -> Step 3: Exam Grading & Result
  // ============================================================
  function handleSubmitExam() {
    const courseQuiz = QUIZ_DATA[userData.courseKey];
    const total = courseQuiz.questions.length;
    const answeredCount = Object.keys(userAnswers).length;

    // Check all questions answered
    if (answeredCount < total) {
      $examUnansweredAlert.style.display = 'block';
      // Scroll to first unanswered question
      for (let i = 0; i < total; i++) {
        if (userAnswers[i] === undefined) {
          const $firstUnanswered = document.getElementById(`question-card-${i}`);
          if ($firstUnanswered) {
            $firstUnanswered.scrollIntoView({ behavior: 'smooth', block: 'center' });
            $firstUnanswered.style.outline = '2px solid var(--color-danger)';
            setTimeout(() => { $firstUnanswered.style.outline = ''; }, 2000);
          }
          break;
        }
      }
      return;
    }

    // Grading
    let correctCount = 0;
    courseQuiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) {
        correctCount++;
      }
    });

    const passScore = courseQuiz.passScore;
    const passed = correctCount >= passScore;
    const now = new Date();
    const dateFormatted = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;

    examResult = {
      total,
      score: correctCount,
      passed,
      date: dateFormatted,
      timestamp: now.toISOString(),
    };

    // Render results & explanations
    renderResults(passed, correctCount, total, passScore);
    renderExplanations(courseQuiz);

    goToStep(3);
  }

  function renderResults(passed, score, total, passScore) {
    const percentage = Math.round((score / total) * 100);

    if (passed) {
      $resultBanner.className = 'result-banner result-banner--pass';
      $resultBanner.innerHTML = `
        <div class="result-banner__icon">🎉</div>
        <h2 class="result-banner__title">合格おめでとうございます！</h2>
        <div class="result-banner__score">
          得点: <strong>${score}</strong> / ${total} 問正解 （正答率 ${percentage}% / 合格基準: ${passScore}問以上）
        </div>
        <p class="result-banner__message">
          「いのちを学ぶ基礎講座」の全カリキュラムを深く理解され、見守りと見送りの基本姿勢・知識がしっかりと身についています。<br>
          以下のボタンから「公式修了証（PDF）」を発行・ダウンロードしてください。
        </p>
      `;

      $resultActions.innerHTML = `
        <button class="btn btn--primary btn--lg" id="btn-proceed-cert">
          <span>公式修了証を発行する</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>
      `;
      $resultBottomActions.innerHTML = `
        <button class="btn btn--primary btn--lg" id="btn-proceed-cert-bottom">
          <span>公式修了証を発行する</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>
      `;

      document.getElementById('btn-proceed-cert').addEventListener('click', proceedToCertificate);
      document.getElementById('btn-proceed-cert-bottom').addEventListener('click', proceedToCertificate);

    } else {
      $resultBanner.className = 'result-banner result-banner--fail';
      $resultBanner.innerHTML = `
        <div class="result-banner__icon">🌱</div>
        <h2 class="result-banner__title">あと一歩でした（再受験が可能です）</h2>
        <div class="result-banner__score">
          得点: <strong>${score}</strong> / ${total} 問正解 （正答率 ${percentage}% / 合格基準: ${passScore}問以上）
        </div>
        <p class="result-banner__message">
          合格ライン（${passScore}問以上正解）まであと少しでした。<br>
          下の詳細解説で間違えた箇所を確認し、講義テキストを復習した上で、何度でも再挑戦いただけます。
        </p>
      `;

      $resultActions.innerHTML = `
        <button class="btn btn--primary btn--lg" id="btn-retry-exam">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M21 2v6h-6"/></svg>
          <span>もう一度修了試験に挑戦する</span>
        </button>
      `;
      $resultBottomActions.innerHTML = `
        <button class="btn btn--primary btn--lg" id="btn-retry-exam-bottom">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M21 2v6h-6"/></svg>
          <span>もう一度修了試験に挑戦する</span>
        </button>
      `;

      document.getElementById('btn-retry-exam').addEventListener('click', retryExam);
      document.getElementById('btn-retry-exam-bottom').addEventListener('click', retryExam);
    }
  }

  function renderExplanations(courseQuiz) {
    $explanationsContainer.innerHTML = '';

    courseQuiz.questions.forEach((q, idx) => {
      const userChoice = userAnswers[idx];
      const isCorrect = userChoice === q.answer;

      const $exp = document.createElement('div');
      $exp.className = `explanation-card ${isCorrect ? 'explanation-card--correct' : 'explanation-card--wrong'}`;

      const $badge = document.createElement('div');
      $badge.className = `explanation-badge ${isCorrect ? 'badge--correct' : 'badge--wrong'}`;
      $badge.textContent = isCorrect ? '正解 ○' : '不正解 ×';

      const $title = document.createElement('h4');
      $title.className = 'explanation-title';
      $title.textContent = q.question;

      const $yourAns = document.createElement('div');
      $yourAns.className = 'explanation-answer';
      $yourAns.innerHTML = `<strong>あなたの回答:</strong> ${q.options[userChoice] || '未回答'}`;

      const $correctAns = document.createElement('div');
      $correctAns.className = 'explanation-correct';
      $correctAns.innerHTML = `<strong>正解:</strong> ${q.options[q.answer]}`;

      const $text = document.createElement('div');
      $text.className = 'explanation-text';
      $text.innerHTML = `<strong>【講義解説】</strong><br>${q.explanation}`;

      $exp.appendChild($badge);
      $exp.appendChild($title);
      $exp.appendChild($yourAns);
      if (!isCorrect) {
        $exp.appendChild($correctAns);
      }
      $exp.appendChild($text);

      $explanationsContainer.appendChild($exp);
    });
  }

  function retryExam() {
    userAnswers = {};
    renderExam(userData.courseKey);
    goToStep(2);
  }

  // ============================================================
  // Step 4: Certificate Preview & PDF Generation
  // ============================================================
  function proceedToCertificate() {
    const courseMeta = COURSE_MAP[userData.courseKey];
    const certNumber = generateCertificateId(courseMeta.code);

    certificateData = {
      id: certNumber,
      name: userData.name,
      email: userData.email,
      courseKey: userData.courseKey,
      courseLabel: courseMeta.fullLabel,
      score: `${examResult.total}問中${examResult.score}問正解 (${Math.round((examResult.score / examResult.total) * 100)}%)`,
      scoreRaw: examResult.score,
      totalQuestions: examResult.total,
      date: examResult.date,
      timestamp: examResult.timestamp,
    };

    // Update Certificate Preview DOM
    $certName.textContent = certificateData.name;
    $certCourse.textContent = certificateData.courseLabel;
    $certDate.textContent = certificateData.date;
    $certScore.textContent = certificateData.score;
    $certId.textContent = certificateData.id;

    // Generate Verification QR Code
    generateQrCode(certificateData);

    goToStep(4);
  }

  function generateCertificateId(courseCode) {
    const year = new Date().getFullYear();
    const records = getStoredCertificates();
    const nextSeq = records.length + 1;
    const seqPadded = String(nextSeq).padStart(4, '0');
    return `INO-${courseCode}-${year}-${seqPadded}`;
  }

  function generateQrCode(data) {
    $certQr.innerHTML = '';
    try {
      if (typeof qrcode === 'undefined') {
        $certQr.textContent = `[認証ID: ${data.id}]`;
        return;
      }
      // Verification payload
      const payload = JSON.stringify({
        cert: data.id,
        name: data.name,
        course: data.courseLabel,
        date: data.date,
        v: '1.0'
      });

      const qr = qrcode(0, 'M');
      qr.addData(payload);
      qr.make();
      $certQr.innerHTML = qr.createImgTag(3, 4);
    } catch (e) {
      console.warn('QR Code generation fallback:', e);
      $certQr.textContent = `[ID: ${data.id}]`;
    }
  }

  // ============================================================
  // PDF Download (html2canvas + jsPDF)
  // ============================================================
  async function handleDownloadPdf() {
    if (!certificateData) return;

    $btnDownload.disabled = true;
    const originalText = $btnDownload.innerHTML;
    $btnDownload.innerHTML = `
      <span class="spinner"></span>
      <span>高精細PDFを生成中...</span>
    `;

    try {
      // 1. Temporarily prepare canvas for export
      const $canvas = $certCanvas;
      const prevTransform = $canvas.style.transform;
      $canvas.style.transform = 'none';

      // 2. Render to canvas (A4 landscape ratio)
      const canvas = await html2canvas($canvas, {
        scale: 2.5, // High resolution for clear text and borders
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFEFA',
      });

      $canvas.style.transform = prevTransform;

      // 3. Export to jsPDF (A4 Landscape: 297mm x 210mm)
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);

      // 4. Trigger download
      const filename = `修了証_いのちを学ぶ基礎講座_${certificateData.name}_${certificateData.id}.pdf`;
      pdf.save(filename);

      // 5. Save record to local storage & webhook
      saveCertificateRecord(certificateData);

      // 6. Transition to Step 5 (Completion)
      showCompletionStep();

    } catch (error) {
      console.error('PDF generation error:', error);
      alert('PDFの生成中にエラーが発生しました。もう一度お試しください。');
    } finally {
      $btnDownload.disabled = false;
      $btnDownload.innerHTML = originalText;
    }
  }

  function showCompletionStep() {
    $completeCertId.textContent = certificateData.id;
    $completeName.textContent = certificateData.name;
    $completeEmail.textContent = certificateData.email;
    $completeCourse.textContent = certificateData.courseLabel;
    $completeDate.textContent = certificateData.date;

    goToStep(5);
  }

  function handleRestart() {
    userAnswers = {};
    certificateData = null;
    $inputName.value = '';
    $inputEmail.value = '';
    goToStep(1);
  }

  // ============================================================
  // Data Persistence (LocalStorage + Webhook)
  // ============================================================
  function getStoredCertificates() {
    try {
      const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed to read certificates:', e);
      return [];
    }
  }

  function saveCertificateRecord(cert) {
    // 1. Save to LocalStorage
    try {
      const records = getStoredCertificates();
      // Avoid duplicate by ID
      const exists = records.some(r => r.id === cert.id);
      if (!exists) {
        records.push(cert);
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(records));
      }
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }

    // 2. Send to Google Sheets Webhook (if configured)
    if (CONFIG.GOOGLE_SHEETS_WEBHOOK_URL) {
      try {
        fetch(CONFIG.GOOGLE_SHEETS_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cert),
        }).catch(err => console.warn('Webhook dispatch failed:', err));
      } catch (e) {
        console.warn('Webhook error:', e);
      }
    }
  }

  // ============================================================
  // Admin Ledger Modal
  // ============================================================
  function openAdminModal() {
    renderAdminTable();
    $adminModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeAdminModal() {
    $adminModal.style.display = 'none';
    document.body.style.overflow = '';
  }

  function renderAdminTable(filterQuery = '') {
    const records = getStoredCertificates();
    $statTotal.textContent = records.length;

    if (records.length > 0) {
      const latest = records[records.length - 1];
      $statLatestDate.textContent = latest.date;
    } else {
      $statLatestDate.textContent = '—';
    }

    const q = filterQuery.toLowerCase().trim();
    const filtered = records.filter(r => {
      if (!q) return true;
      return (
        (r.name && r.name.toLowerCase().includes(q)) ||
        (r.email && r.email.toLowerCase().includes(q)) ||
        (r.id && r.id.toLowerCase().includes(q)) ||
        (r.courseLabel && r.courseLabel.toLowerCase().includes(q))
      );
    });

    if (filtered.length === 0) {
      $adminTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center;color:var(--color-text-tertiary);padding:2rem;">
            ${records.length === 0 ? 'まだ発行記録がありません' : '該当する受講者が見つかりません'}
          </td>
        </tr>
      `;
      return;
    }

    $adminTableBody.innerHTML = filtered.map(r => `
      <tr>
        <td><code>${escapeHtml(r.id)}</code></td>
        <td><strong>${escapeHtml(r.name)}</strong></td>
        <td>${escapeHtml(r.email)}</td>
        <td>${escapeHtml(r.score)}</td>
        <td>${escapeHtml(r.date)}</td>
      </tr>
    `).reverse().join('');
  }

  function handleAdminSearch(e) {
    renderAdminTable(e.target.value);
  }

  function handleExportCsv() {
    const records = getStoredCertificates();
    if (records.length === 0) {
      alert('エクスポートする発行記録がありません。');
      return;
    }

    const headers = ['証明番号', '氏名', 'メールアドレス', '認定コース', '得点', '合格日', '発行タイムスタンプ'];
    const rows = records.map(r => [
      `"${r.id}"`,
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.email.replace(/"/g, '""')}"`,
      `"${r.courseLabel}"`,
      `"${r.score}"`,
      `"${r.date}"`,
      `"${r.timestamp || ''}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `いのちを学ぶ基礎講座_発行台帳_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // ============================================================
  // Consultation Modal
  // ============================================================
  function openConsultationModal() {
    if ($consultationModal) {
      $consultationModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  function closeConsultationModal() {
    if ($consultationModal) {
      $consultationModal.style.display = 'none';
      document.body.style.overflow = '';
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

  // Start app
  document.addEventListener('DOMContentLoaded', init);

})();
