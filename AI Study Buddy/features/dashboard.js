/* =====================================================
   FEATURE 7: Progress Dashboard
   ===================================================== */

function initDashboard() {
  // Dashboard renders when navigating to it
}

function renderDashboard() {
  const content = document.getElementById('dashboard-content');
  if (!content) return;

  const stats = getStats();
  const scores = JSON.parse(localStorage.getItem('test_scores') || '[]');
  const plan = JSON.parse(localStorage.getItem('study_plan') || 'null');
  const streak = plan ? calculateStreak(plan.completedDays || {}) : getStatVal('study_days_streak');
  const lang = localStorage.getItem('app_language') || 'en';
  const quote = getRandomQuote();

  const weekTopics = getWeeklyStats();

  content.innerHTML = `
    <!-- Quote of the Day -->
    <div class="quote-card fade-in">
      <div class="quote-text">${escHTML(quote[lang] || quote.en)}</div>
      <div class="quote-author">— Daily Motivation for Indian Students</div>
    </div>

    <!-- Weekly Summary -->
    <div class="weekly-summary fade-in">
      <div class="weekly-summary-title">📅 This Week's Summary</div>
      <div class="weekly-summary-text">
        This week you studied <strong>${weekTopics.topics}</strong> topics, 
        asked <strong>${weekTopics.questions}</strong> questions, 
        and completed <strong>${weekTopics.tests}</strong> mock tests.
        ${weekTopics.topics > 0 ? '🔥 Great progress!' : '💡 Start studying today — every expert was once a beginner!'}
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="dash-stats-grid fade-in">
      <div class="dash-stat-card">
        <div class="dash-stat-icon">📚</div>
        <div class="dash-stat-value">${stats.topics_studied || 0}</div>
        <div class="dash-stat-label">Topics Studied</div>
      </div>
      <div class="dash-stat-card">
        <div class="dash-stat-icon">💬</div>
        <div class="dash-stat-value">${stats.questions_asked || 0}</div>
        <div class="dash-stat-label">Questions Asked</div>
      </div>
      <div class="dash-stat-card">
        <div class="dash-stat-icon">📝</div>
        <div class="dash-stat-value">${stats.tests_taken || 0}</div>
        <div class="dash-stat-label">Tests Taken</div>
      </div>
      <div class="dash-stat-card">
        <div class="dash-stat-icon">🔥</div>
        <div class="dash-stat-value">${streak}</div>
        <div class="dash-stat-label">Day Streak</div>
      </div>
    </div>

    <!-- Score Chart -->
    ${scores.length > 0 ? renderScoreChart(scores) : ''}

    <!-- Strong & Weak Topics -->
    ${renderTopicAnalysis(scores)}

    <!-- Recent Scores -->
    ${scores.length > 0 ? renderRecentScores(scores) : renderGetStarted()}

    <!-- Flashcard Stats -->
    ${renderFlashcardStats()}
  `;

  // Draw chart
  if (scores.length > 0) drawScoreChart(scores);
}

function renderScoreChart(scores) {
  return `
    <div class="chart-card fade-in">
      <div class="chart-title">📈 Mock Test Score History</div>
      <canvas id="score-chart" width="800" height="180" aria-label="Score history chart"></canvas>
    </div>`;
}

function drawScoreChart(scores) {
  const canvas = document.getElementById('score-chart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const w = canvas.offsetWidth;
  const h = 180;
  canvas.width = w;
  canvas.height = h;

  const recent = scores.slice(-12);
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;

  ctx.clearRect(0, 0, w, h);

  if (recent.length < 2) {
    ctx.fillStyle = '#5C6B7A';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Take more tests to see your progress chart!', w / 2, h / 2);
    return;
  }

  // Grid lines
  ctx.strokeStyle = '#E8ECF0';
  ctx.lineWidth = 1;
  [0, 25, 50, 75, 100].forEach(val => {
    const y = padding.top + chartH - (val / 100) * chartH;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(padding.left + chartW, y);
    ctx.stroke();
    ctx.fillStyle = '#8E9AB0';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(val + '%', padding.left - 6, y + 4);
  });

  // Points
  const points = recent.map((s, i) => ({
    x: padding.left + (i / (recent.length - 1)) * chartW,
    y: padding.top + chartH - ((s.score || 0) / 100) * chartH,
    score: s.score || 0,
    subject: s.subject || ''
  }));

  // Fill gradient
  const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
  grad.addColorStop(0, 'rgba(255,107,53,0.3)');
  grad.addColorStop(1, 'rgba(255,107,53,0)');
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
  ctx.lineTo(points[0].x, padding.top + chartH);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = '#FF6B35';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Dots
  points.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = p.score >= 60 ? '#2ECC71' : '#E74C3C';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Score label
    ctx.fillStyle = '#1A1A5E';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(p.score + '%', p.x, p.y - 10);
  });

  // X axis labels
  points.forEach((p, i) => {
    if (i % Math.max(1, Math.floor(points.length / 5)) === 0 || i === points.length - 1) {
      ctx.fillStyle = '#8E9AB0';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(p.subject?.substring(0, 8) || `Test ${i + 1}`, p.x, h - 8);
    }
  });
}

function renderTopicAnalysis(scores) {
  if (!scores.length) return '';

  const subjectMap = {};
  scores.forEach(s => {
    if (!s.subject) return;
    if (!subjectMap[s.subject]) subjectMap[s.subject] = { total: 0, count: 0 };
    subjectMap[s.subject].total += s.score;
    subjectMap[s.subject].count++;
  });

  const subjects = Object.entries(subjectMap).map(([sub, d]) => ({
    name: sub,
    avg: Math.round(d.total / d.count)
  }));

  const strong = subjects.filter(s => s.avg >= 70);
  const weak   = subjects.filter(s => s.avg < 60);

  if (!strong.length && !weak.length) return '';

  return `
    <div class="card fade-in">
      <div class="section-header" style="margin-bottom:12px">
        <div class="section-dot"></div>
        <div class="section-title">📊 Subject Performance Analysis</div>
      </div>
      ${strong.length ? `
        <div style="margin-bottom:14px;">
          <div style="font-size:13px;font-weight:700;color:var(--green-dark);margin-bottom:8px;">💪 Strong Subjects</div>
          <div class="topic-pills">
            ${strong.map(s => `<span class="topic-pill strong">${escHTML(s.name)} (${s.avg}%)</span>`).join('')}
          </div>
        </div>` : ''}
      ${weak.length ? `
        <div>
          <div style="font-size:13px;font-weight:700;color:var(--error);margin-bottom:8px;">📖 Needs Revision</div>
          <div class="topic-pills">
            ${weak.map(s => `<span class="topic-pill weak">${escHTML(s.name)} (${s.avg}%)</span>`).join('')}
          </div>
        </div>` : ''}
    </div>`;
}

function renderRecentScores(scores) {
  const recent = scores.slice(-5).reverse();
  return `
    <div class="card fade-in">
      <div class="section-header" style="margin-bottom:12px">
        <div class="section-dot"></div>
        <div class="section-title">📝 Recent Mock Test Scores</div>
      </div>
      ${recent.map(s => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);">
          <div>
            <div style="font-size:14px;font-weight:600;color:var(--text-primary)">${escHTML(s.topic || s.subject || 'Test')}</div>
            <div style="font-size:12px;color:var(--text-muted)">${s.subject || ''} · ${new Date(s.date).toLocaleDateString()}</div>
          </div>
          <div style="font-size:20px;font-weight:700;color:${s.score >= 70 ? 'var(--green)' : s.score >= 50 ? 'var(--saffron)' : 'var(--error)'}">
            ${s.score}%
          </div>
        </div>`).join('')}
    </div>`;
}

function renderFlashcardStats() {
  const decks = JSON.parse(localStorage.getItem('flashcard_decks') || '[]');
  if (!decks.length) return '';

  return `
    <div class="card fade-in">
      <div class="section-header" style="margin-bottom:12px">
        <div class="section-dot"></div>
        <div class="section-title">🃏 My Flashcard Decks</div>
      </div>
      <div style="display:flex;align-items:center;gap:16px;">
        <div style="font-size:36px;font-weight:700;color:var(--saffron)">${decks.length}</div>
        <div>
          <div style="font-size:14px;font-weight:600">Saved Decks</div>
          <div style="font-size:13px;color:var(--text-muted)">${decks.reduce((a, d) => a + d.cardCount, 0)} total flashcards</div>
        </div>
        <button class="btn-secondary" style="margin-left:auto" onclick="navigateTo('flashcards')">Study Now →</button>
      </div>
    </div>`;
}

function renderGetStarted() {
  return `
    <div class="api-warning-card fade-in">
      <div class="api-warning-icon">🚀</div>
      <div class="api-warning-title">Your Journey Starts Here!</div>
      <div class="api-warning-desc">
        Use the Topic Explainer to study your first topic, or take a Mock Test to see how ready you are.<br/>
        <em>Your progress will automatically be tracked here.</em>
      </div>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:8px;">
        <button class="btn-primary" onclick="navigateTo('home')">💡 Start Studying</button>
        <button class="btn-secondary" onclick="navigateTo('mocktest')">📝 Take a Test</button>
      </div>
    </div>`;
}

// ── Stats helpers ────────────────────────────────────────
function getStats() {
  return JSON.parse(localStorage.getItem('user_stats') || '{}');
}

function getStatVal(key) {
  return getStats()[key] || 0;
}

function trackStat(key) {
  const stats = getStats();
  stats[key] = (stats[key] || 0) + 1;

  // Weekly stats
  const weekKey = `week_${getWeekNumber()}`;
  stats[weekKey] = stats[weekKey] || {};
  stats[weekKey][key] = (stats[weekKey][key] || 0) + 1;

  localStorage.setItem('user_stats', JSON.stringify(stats));
}

function getWeekNumber() {
  const d = new Date();
  const onejan = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d - onejan) / 86400000 + onejan.getDay() + 1) / 7);
}

function getWeeklyStats() {
  const stats = getStats();
  const weekKey = `week_${getWeekNumber()}`;
  const week = stats[weekKey] || {};
  return {
    topics: week.topics_studied || 0,
    questions: week.questions_asked || 0,
    tests: week.tests_taken || 0
  };
}
