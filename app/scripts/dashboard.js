/**
 * 実現健康長寿アプリ — Dashboard Module
 * PHR記録・可視化ダッシュボード
 */

const Dashboard = (() => {

  const METRICS = [
    { key: 'steps', label: '歩数', icon: '🚶', unit: '歩', goal: 8000, color: 'var(--ring-2)' },
    { key: 'sleepHours', label: '睡眠', icon: '😴', unit: '時間', goal: 7, color: 'var(--ring-5)' },
    { key: 'vegetableServings', label: '野菜', icon: '🥗', unit: '品', goal: 5, color: 'var(--ring-3)' },
    { key: 'socialOutings', label: '社会参加', icon: '🤝', unit: '回', goal: 1, color: 'var(--ring-4)' },
  ];

  const MOODS = [
    { value: 5, emoji: '😄', label: 'とても良い' },
    { value: 4, emoji: '🙂', label: '良い' },
    { value: 3, emoji: '😐', label: '普通' },
    { value: 2, emoji: '😔', label: '少し低い' },
    { value: 1, emoji: '😣', label: '良くない' },
  ];

  function render(container) {
    const today = Store.today();
    const todayLog = Store.get(`dailyLogs.${today}`) || {};
    const logs = Store.getDailyLogs(7);

    container.innerHTML = `
      <div class="dashboard animate-fade">
        <h2 style="font-size: var(--text-2xl); font-weight: 700; margin-bottom: var(--space-6);">
          📈 今日の記録
        </h2>

        <!-- Today's Quick Entry -->
        <div class="card card--elevated mb-6">
          <div class="card__header">
            <div class="card__title">今日 ${formatDate(today)}</div>
            <span class="badge badge--info">${getDayOfWeek(today)}</span>
          </div>

          <div class="stat-grid mb-4">
            ${METRICS.map(m => {
              const val = todayLog[m.key] || 0;
              const pct = Math.min((val / m.goal) * 100, 100);
              return `
                <div class="stat-card" id="metric-${m.key}" style="cursor: pointer;">
                  <div class="stat-card__icon">${m.icon}</div>
                  <div class="stat-card__value" style="color: ${pct >= 100 ? 'var(--color-success)' : 'var(--color-text-primary)'};">
                    ${val || '—'}
                  </div>
                  <div class="stat-card__label">${m.label}</div>
                  <div class="progress-bar mt-2" style="height: 4px;">
                    <div class="progress-bar__fill" style="width: ${pct}%; background: ${m.color};"></div>
                  </div>
                  <div class="text-xs text-muted mt-1">目標: ${m.goal}${m.unit}</div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Mood -->
          <div class="mb-4">
            <div class="form-label">今日の気分</div>
            <div class="flex gap-2" id="mood-selector">
              ${MOODS.map(m => `
                <button class="btn btn--ghost btn--icon ${todayLog.mood === m.value ? 'active' : ''}"
                  data-mood="${m.value}" title="${m.label}"
                  style="font-size: var(--text-2xl); ${todayLog.mood === m.value ? 'background: var(--color-primary-surface); transform: scale(1.2);' : ''}">
                  ${m.emoji}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Quick Note -->
          <div>
            <div class="form-label">今日のメモ</div>
            <textarea class="form-input" id="daily-notes" rows="2" placeholder="今日の出来事や気づきを記録..."
              style="resize: vertical;">${todayLog.notes || ''}</textarea>
          </div>
        </div>

        <!-- Input Modal Triggers -->
        <div id="metric-input-area" class="mb-6"></div>

        <!-- Weekly Trend -->
        <div class="card mb-6">
          <h3 class="card__title mb-4">📊 1週間の推移</h3>
          <div id="weekly-chart-container">
            <canvas id="weekly-chart" width="600" height="240"></canvas>
          </div>
        </div>

        <!-- Health Japan 21 Comparison -->
        <div class="card mb-6" style="background: var(--color-primary-surface);">
          <h3 class="card__title mb-2">🏛️ 健康日本21（第三次）目標との比較</h3>
          <p class="text-sm text-muted mb-4">あなたの直近7日間の平均値</p>
          ${renderPolicyComparison(logs)}
        </div>

        <!-- Streaks & Badges -->
        <div class="card">
          <h3 class="card__title mb-4">🏆 達成バッジ</h3>
          <div class="flex gap-3" style="flex-wrap: wrap;">
            ${renderBadges(logs, todayLog)}
          </div>
        </div>
      </div>
    `;

    // Event: Metric card click → show input
    METRICS.forEach(m => {
      document.getElementById(`metric-${m.key}`)?.addEventListener('click', () => {
        showMetricInput(m, todayLog[m.key] || 0);
      });
    });

    // Event: Mood selector
    document.getElementById('mood-selector')?.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const mood = Number(btn.dataset.mood);
        Store.logDaily(today, { mood });
        render(container);
      });
    });

    // Event: Notes auto-save
    document.getElementById('daily-notes')?.addEventListener('blur', (e) => {
      Store.logDaily(today, { notes: e.target.value });
    });

    // Draw chart
    setTimeout(() => drawWeeklyChart(logs), 100);
  }

  function showMetricInput(metric, currentVal) {
    const area = document.getElementById('metric-input-area');
    area.innerHTML = `
      <div class="card card--elevated animate-scale" style="border: 2px solid var(--color-primary);">
        <div class="flex items-center justify-between mb-4">
          <h3 class="card__title">${metric.icon} ${metric.label}を記録</h3>
          <button class="btn btn--ghost btn--icon" id="close-metric-input">✕</button>
        </div>
        <div class="flex items-center gap-4 mb-4">
          <input type="number" class="form-input" id="metric-value" value="${currentVal}"
            min="0" style="width: 120px; font-size: var(--text-2xl); font-weight: 700; text-align: center;">
          <span class="text-muted">${metric.unit}</span>
          <span class="text-sm text-muted">目標: ${metric.goal}${metric.unit}</span>
        </div>
        <button class="btn btn--primary btn--full" id="save-metric">記録する</button>
      </div>
    `;

    document.getElementById('close-metric-input').addEventListener('click', () => {
      area.innerHTML = '';
    });

    document.getElementById('save-metric').addEventListener('click', () => {
      const val = Number(document.getElementById('metric-value').value);
      Store.logDaily(Store.today(), { [metric.key]: val });
      area.innerHTML = '';
      const container = document.getElementById('page-dashboard')?.querySelector('.dashboard-content');
      if (container) render(container);
      else location.reload();
    });
  }

  function renderPolicyComparison(logs) {
    const avgSteps = average(logs.map(l => l.steps || 0));
    const avgSleep = average(logs.map(l => l.sleepHours || 0));

    return `
      <div style="display: flex; flex-direction: column; gap: var(--space-3);">
        <div class="flex items-center justify-between">
          <span>🚶 平均歩数</span>
          <div class="flex items-center gap-2">
            <strong>${Math.round(avgSteps).toLocaleString()}</strong>
            <span class="text-sm text-muted">/ 8,000歩</span>
            ${avgSteps >= 8000 ? '<span class="badge badge--success">達成✓</span>' : ''}
          </div>
        </div>
        <div class="flex items-center justify-between">
          <span>😴 平均睡眠</span>
          <div class="flex items-center gap-2">
            <strong>${avgSleep.toFixed(1)}</strong>
            <span class="text-sm text-muted">/ 6〜9時間</span>
            ${avgSleep >= 6 && avgSleep <= 9 ? '<span class="badge badge--success">適正✓</span>' : ''}
          </div>
        </div>
      </div>
    `;
  }

  function renderBadges(logs, todayLog) {
    const badges = [];
    const filledDays = logs.filter(l => l.steps > 0 || l.sleepHours > 0).length;

    if (filledDays >= 7) badges.push({ emoji: '🔥', label: '7日連続記録' });
    if (filledDays >= 3) badges.push({ emoji: '📝', label: '3日以上記録' });

    const stepsGoalDays = logs.filter(l => (l.steps || 0) >= 8000).length;
    if (stepsGoalDays >= 5) badges.push({ emoji: '🏃', label: '歩数目標5日達成' });

    if (todayLog.socialOutings > 0) badges.push({ emoji: '🤝', label: '今日の社会参加' });
    if (todayLog.mood >= 4) badges.push({ emoji: '😄', label: '今日は良い気分' });

    if (badges.length === 0) {
      return '<p class="text-muted text-sm">記録を続けてバッジを獲得しましょう！</p>';
    }

    return badges.map(b => `
      <div style="display: flex; align-items: center; gap: var(--space-2); padding: var(--space-2) var(--space-3); background: var(--color-secondary-surface); border-radius: var(--radius-lg); font-size: var(--text-sm);">
        <span style="font-size: var(--text-lg);">${b.emoji}</span>
        <span style="font-weight: 500;">${b.label}</span>
      </div>
    `).join('');
  }

  function drawWeeklyChart(logs) {
    const canvas = document.getElementById('weekly-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = 600, h = 240;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = '100%';
    canvas.style.maxWidth = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, w, h);

    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    // Draw steps bar chart
    const maxSteps = Math.max(8000, ...logs.map(l => l.steps || 0));
    const barWidth = chartW / logs.length * 0.6;
    const barGap = chartW / logs.length;

    // Goal line
    const goalY = padding.top + chartH - (8000 / maxSteps) * chartH;
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.moveTo(padding.left, goalY);
    ctx.lineTo(w - padding.right, goalY);
    ctx.strokeStyle = 'rgba(27, 122, 78, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(27, 122, 78, 0.6)';
    ctx.font = '11px sans-serif';
    ctx.fillText('目標 8,000歩', w - padding.right - 70, goalY - 4);

    // Bars
    logs.forEach((log, i) => {
      const steps = log.steps || 0;
      const barH = (steps / maxSteps) * chartH;
      const x = padding.left + i * barGap + (barGap - barWidth) / 2;
      const y = padding.top + chartH - barH;

      const gradient = ctx.createLinearGradient(x, y, x, padding.top + chartH);
      gradient.addColorStop(0, steps >= 8000 ? '#2DA06A' : '#F39C12');
      gradient.addColorStop(1, steps >= 8000 ? '#2DA06A33' : '#F39C1233');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
      ctx.fill();

      // Date label
      ctx.fillStyle = '#8A8A85';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      const dayLabel = log.date ? log.date.slice(5).replace('-', '/') : '';
      ctx.fillText(dayLabel, x + barWidth / 2, h - 10);

      // Value label
      if (steps > 0) {
        ctx.fillStyle = '#5C5C58';
        ctx.font = '10px sans-serif';
        ctx.fillText(steps.toLocaleString(), x + barWidth / 2, y - 6);
      }
    });
  }

  // Utilities
  function average(arr) {
    const nonZero = arr.filter(v => v > 0);
    return nonZero.length > 0 ? nonZero.reduce((a, b) => a + b, 0) / nonZero.length : 0;
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  }

  function getDayOfWeek(dateStr) {
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return days[new Date(dateStr).getDay()] + '曜日';
  }

  return { render };
})();
