/* =====================================================
   FEATURE 5: Study Planner
   ===================================================== */

let starSelection = 0;
let plannerData = null;

function initPlanner() {
  const generateBtn = document.getElementById('planner-generate-btn');
  if (!generateBtn) return;

  generateBtn.addEventListener('click', generatePlan);

  // Star rating
  const stars = document.querySelectorAll('#planner-stars .star');
  stars.forEach(star => {
    star.addEventListener('click', () => {
      starSelection = parseInt(star.dataset.val);
      stars.forEach((s, i) => {
        s.classList.toggle('active', i < starSelection);
      });
      const labels = ['Not started', 'Beginner', 'Some idea', 'Good', 'Very prepared'];
      const label = document.getElementById('star-label');
      if (label) label.textContent = `${starSelection}/5 — ${labels[starSelection - 1]}`;
    });
  });

  // Set default date to 30 days from now
  const dateInput = document.getElementById('planner-date');
  if (dateInput) {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    dateInput.value = defaultDate.toISOString().split('T')[0];
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  // Load saved plan
  loadSavedPlan();
}

async function generatePlan() {
  const subject = document.getElementById('planner-subject').value.trim();
  const date    = document.getElementById('planner-date').value;
  const topics  = document.getElementById('planner-topics').value.trim();
  const prep    = starSelection || 3;

  if (!subject || !date) {
    showToast('Subject aur exam date fill karein! / Please fill subject and exam date!');
    return;
  }

  const loading = document.getElementById('planner-loading');
  const area = document.getElementById('planner-area');
  const btn = document.getElementById('planner-generate-btn');

  loading.classList.remove('hidden');
  area.innerHTML = '';
  btn.disabled = true;

  try {
    const prompt = buildPlannerPrompt(subject, date, topics || subject, prep);
    const rawJson = await callGemini(prompt, 0.6, 2500);

    const jsonMatch = rawJson.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Could not parse plan');

    plannerData = JSON.parse(jsonMatch[0]);

    loading.classList.add('hidden');
    btn.disabled = false;

    // Save plan
    const savedPlan = {
      subject, date, topics, prep,
      data: plannerData,
      completedDays: {},
      generatedAt: new Date().toISOString()
    };
    localStorage.setItem('study_plan', JSON.stringify(savedPlan));

    renderPlan(plannerData, {});
    area.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (err) {
    loading.classList.add('hidden');
    btn.disabled = false;
    area.innerHTML = buildErrorCard(err.message);
    document.getElementById('retry-btn')?.addEventListener('click', generatePlan);
  }
}

function loadSavedPlan() {
  const saved = JSON.parse(localStorage.getItem('study_plan') || 'null');
  if (!saved) return;

  // Populate form
  const sub = document.getElementById('planner-subject');
  const date = document.getElementById('planner-date');
  const topics = document.getElementById('planner-topics');
  if (sub   ) sub.value    = saved.subject || '';
  if (date  ) date.value   = saved.date    || '';
  if (topics) topics.value = saved.topics  || '';

  // Load plan display
  if (saved.data) {
    plannerData = saved.data;
    renderPlan(saved.data, saved.completedDays || {});
  }
}

function renderPlan(data, completedDays) {
  const area = document.getElementById('planner-area');
  if (!area || !data) return;

  const today = new Date().toISOString().split('T')[0];
  const streak = calculateStreak(completedDays);
  const totalDays = (data.daily_plans || []).length;
  const completedCount = Object.keys(completedDays).length;

  const plans = (data.daily_plans || []).slice(0, 60); // max 60 days shown

  area.innerHTML = `
    ${streak > 0 ? `<div class="streak-banner">🔥 You've studied ${streak} days in a row! Incredible!</div>` : ''}

    <div class="planner-header">
      <h3>📅 ${escHTML(data.subject || 'Study')} Plan — ${totalDays} Days</h3>
      <p>Exam: ${escHTML(data.exam_date || '')} · ${completedCount}/${totalDays} days completed · Prep level: ${data.prep_level || 3}/5 ⭐</p>
      ${data.overall_strategy ? `<p style="margin-top:8px;font-size:13px;font-style:italic;opacity:0.85">${escHTML(data.overall_strategy)}</p>` : ''}
    </div>

    <div class="planner-progress-bar-wrap" style="margin-bottom:20px;">
      <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted);margin-bottom:6px;">
        <span>Progress</span>
        <span>${completedCount}/${totalDays} days (${Math.round(completedCount/Math.max(totalDays,1)*100)}%)</span>
      </div>
      <div class="flashcard-progress-bar">
        <div class="flashcard-progress-fill" style="width:${Math.round(completedCount/Math.max(totalDays,1)*100)}%"></div>
      </div>
    </div>

    <div id="plan-days-list">
      ${plans.map(day => renderPlanDay(day, completedDays, today)).join('')}
    </div>
  `;

  // Attach checkbox listeners
  area.querySelectorAll('.plan-day-check').forEach(btn => {
    btn.addEventListener('click', () => toggleDayComplete(btn.dataset.day, completedDays));
  });
}

function renderPlanDay(day, completedDays, today) {
  const isCompleted = !!completedDays[day.day];
  const isToday = day.date === today;
  const isPast = day.date < today;

  const borderStyle = isToday ? 'border: 2px solid var(--saffron);' : '';

  return `
    <div class="plan-day ${isCompleted ? 'completed' : ''}" id="plan-day-${day.day}" style="${borderStyle}">
      <div class="plan-day-check" data-day="${day.day}" role="button" aria-label="Mark day ${day.day} complete">
        ${isCompleted ? '✓' : ''}
      </div>
      <div class="plan-day-content">
        <div class="plan-day-header">
          <span class="plan-day-date">Day ${day.day} · ${day.date || ''}</span>
          ${isToday ? '<span class="plan-day-chip" style="background:var(--saffron);color:#fff">Today 📍</span>' : ''}
          ${isCompleted ? '<span class="plan-day-chip" style="background:var(--success-light);color:var(--green-dark);border-color:var(--green)">✓ Done</span>' : ''}
          <span class="plan-day-chip">${escHTML(day.technique || 'Study')}</span>
          <span class="plan-day-chip">${day.duration_hours || 2}h</span>
        </div>
        <div class="plan-day-title">${escHTML(day.focus || '')}</div>
        <div class="plan-day-desc">${escHTML(day.what_to_study || '')}</div>
        ${day.tip ? `<div style="font-size:12px;color:var(--saffron-dark);margin-top:4px">💡 ${escHTML(day.tip)}</div>` : ''}
      </div>
    </div>`;
}

function toggleDayComplete(dayNum, completedDays) {
  const saved = JSON.parse(localStorage.getItem('study_plan') || '{}');
  saved.completedDays = saved.completedDays || {};

  if (saved.completedDays[dayNum]) {
    delete saved.completedDays[dayNum];
  } else {
    saved.completedDays[dayNum] = new Date().toISOString();
    showToast('Day marked complete! 🎉 / एक दिन पूरा! 🎉');
    trackStat('study_days');
  }

  localStorage.setItem('study_plan', JSON.stringify(saved));

  if (plannerData) {
    renderPlan(plannerData, saved.completedDays);
  }
}

function calculateStreak(completedDays) {
  if (!completedDays || Object.keys(completedDays).length === 0) return 0;
  const dates = Object.values(completedDays)
    .map(d => new Date(d).toISOString().split('T')[0])
    .sort()
    .reverse();

  let streak = 0;
  let current = new Date();
  current.setHours(0, 0, 0, 0);

  for (const dateStr of dates) {
    const d = new Date(dateStr);
    const diff = Math.round((current - d) / (1000 * 60 * 60 * 24));
    if (diff <= 1) {
      streak++;
      current = d;
    } else {
      break;
    }
  }

  return streak;
}
