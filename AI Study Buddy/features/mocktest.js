/* =====================================================
   FEATURE 3: Mock Test Generator
   ===================================================== */

let testState = {
  questions: [],
  answers: {},
  startTime: null,
  timer: null,
  duration: 0,
  submitted: false
};

function initMockTest() {
  const generateBtn = document.getElementById('test-generate-btn');
  if (!generateBtn) return;
  generateBtn.addEventListener('click', generateMockTest);
}

async function generateMockTest() {
  const subject  = document.getElementById('test-subject').value.trim();
  const topic    = document.getElementById('test-topic').value.trim();
  const cls      = document.getElementById('test-class').value;
  const board    = document.getElementById('test-board').value;
  const duration = document.getElementById('test-duration').value;

  if (!subject || !topic) {
    showToast('Please enter subject and topic / Subject aur topic likhein!');
    return;
  }

  const loading = document.getElementById('test-loading');
  const testArea = document.getElementById('test-area');
  const resultsArea = document.getElementById('test-results-area');

  loading.classList.remove('hidden');
  testArea.classList.add('hidden');
  resultsArea.classList.add('hidden');
  document.getElementById('test-generate-btn').disabled = true;

  // Scale token budget with test size to avoid truncated JSON
  const durationNum = parseInt(duration) || 30;
  const tokenBudget = durationNum <= 10 ? 2500
                    : durationNum <= 20 ? 3500
                    : 4500; // 30-min full test needs the most tokens

  try {
    const prompt = buildMockTestPrompt(subject, topic, cls, board, duration);
    const rawResponse = await callAIJson(prompt, tokenBudget);

    const testData = extractTestJson(rawResponse);
    if (!testData || !testData.questions || !testData.questions.length) {
      throw new Error('No questions generated. Please try again.');
    }

    loading.classList.add('hidden');

    testState = {
      questions: testData.questions,
      answers: {},
      startTime: Date.now(),
      timer: null,
      duration: durationNum * 60,
      submitted: false,
      testData
    };

    renderTestUI(testData);
    startTestTimer();
    testArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (err) {
    loading.classList.add('hidden');
    document.getElementById('test-generate-btn').disabled = false;
    // Show error in the test area with a retry button
    testArea.classList.remove('hidden');
    testArea.innerHTML = `
      <div class="ai-card fade-in" style="border-left-color:var(--error);">
        <div class="ai-card-header">
          <span class="ai-card-icon">⚠️</span>
          <div class="ai-card-title">Could not generate test</div>
        </div>
        <div class="ai-card-body">
          <p>The AI returned an incomplete response. Please try:</p>
          <ul style="margin:8px 0 0 16px;font-size:14px;">
            <li>Reducing the test duration (10 or 20 minutes)</li>
            <li>Being more specific with the topic</li>
            <li>Clicking <strong>Generate Mock Test</strong> again</li>
          </ul>
          <p style="font-size:12px;color:var(--text-secondary);margin-top:8px;">Technical: ${escHTML(err.message)}</p>
        </div>
        <div class="ai-card-footer">
          <button class="btn-primary" onclick="generateMockTest()">🔄 Try Again</button>
        </div>
      </div>`;
    console.error('Mock test error:', err);
  }
}

// Robust JSON extractor — handles markdown fences and truncated JSON
function extractTestJson(raw) {
  if (!raw) return null;

  // Strip markdown code fences (```json ... ``` or ``` ... ```)
  let cleaned = raw.replace(/^```[\w]*\n?/gm, '').replace(/^```$/gm, '').trim();

  // Find the outermost JSON object
  const start = cleaned.indexOf('{');
  if (start === -1) return null;
  let jsonStr = cleaned.slice(start);

  // Try direct parse first
  try { return JSON.parse(jsonStr); } catch (_) {}

  // Attempt repair: truncated JSON — close open structures
  jsonStr = repairTruncatedJson(jsonStr);
  try { return JSON.parse(jsonStr); } catch (_) {}

  // Last resort: find the last complete question entry and trim there
  const lastComplete = jsonStr.lastIndexOf('}');
  if (lastComplete > 0) {
    try { return JSON.parse(jsonStr.slice(0, lastComplete + 1)); } catch (_) {}
  }

  return null;
}

// Close unclosed JSON arrays/objects caused by token truncation
function repairTruncatedJson(str) {
  const stack = [];
  let inString = false;
  let escape = false;

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (escape) { escape = false; continue; }
    if (ch === '\\' && inString) { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{' || ch === '[') stack.push(ch);
    else if (ch === '}' || ch === ']') stack.pop();
  }

  // Remove trailing comma before we close
  let repaired = str.trimEnd().replace(/,\s*$/, '');

  // Close all unclosed structures
  while (stack.length) {
    repaired += stack[stack.length - 1] === '{' ? '}' : ']';
    stack.pop();
  }
  return repaired;
}

function renderTestUI(testData) {
  const testArea = document.getElementById('test-area');
  testArea.classList.remove('hidden');

  const topicName = testData.title || 'Mock Test';

  let questionsHtml = testData.questions.map((q, i) => renderQuestion(q, i)).join('');

  testArea.innerHTML = `
    <div class="test-header-bar">
      <div class="test-info">
        <h3>${escHTML(topicName)}</h3>
        <p>${escHTML(testData.subject)} · ${escHTML(testData.class)} · ${escHTML(testData.board)} · ${testData.total_marks} marks</p>
      </div>
      <div class="test-timer" id="test-timer">
        ${formatTime(testState.duration)}
      </div>
    </div>

    <div id="test-questions-list">
      ${questionsHtml}
    </div>

    <div class="test-submit-area">
      <p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">
        Double check your answers before submitting!
      </p>
      <button class="btn-primary" id="test-submit-btn" style="font-size:16px;padding:14px 32px;">
        📬 Submit Test
      </button>
    </div>
  `;

  // Attach MCQ listeners
  testArea.querySelectorAll('.test-mcq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const qId = btn.dataset.qid;
      const optIdx = parseInt(btn.dataset.opt);
      testState.answers[qId] = optIdx;
      // Update UI
      document.querySelectorAll(`.test-mcq-btn[data-qid="${qId}"]`).forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  // Attach input listeners for fill/short
  testArea.querySelectorAll('.test-answer-input').forEach(input => {
    input.addEventListener('input', () => {
      testState.answers[input.dataset.qid] = input.value;
    });
  });

  document.getElementById('test-submit-btn').addEventListener('click', submitTest);
}

function renderQuestion(q, index) {
  const qNum = index + 1;
  const typeLabel = q.type === 'mcq' ? 'MCQ' : q.type === 'fill' ? 'Fill in the Blank' : 'Short Answer';

  let answerHtml = '';

  if (q.type === 'mcq' && q.options) {
    const optLabels = ['A', 'B', 'C', 'D'];
    answerHtml = `<div class="test-mcq-options">
      ${q.options.map((opt, i) => `
        <button class="test-mcq-btn" data-qid="${q.id}" data-opt="${i}">
          <span style="font-weight:700;color:var(--saffron);min-width:20px">${optLabels[i]}.</span>
          ${escHTML(opt)}
        </button>`).join('')}
    </div>`;
  } else if (q.type === 'fill') {
    answerHtml = `<input type="text" class="test-answer-input" data-qid="${q.id}" placeholder="Type your answer here..." style="height:44px;resize:none;" />`;
  } else {
    answerHtml = `<textarea class="test-answer-input" data-qid="${q.id}" placeholder="Write your answer here..." rows="3"></textarea>`;
  }

  return `
    <div class="test-question-card">
      <div>
        <span class="test-q-num">Q${qNum}</span>
        <span class="test-q-type">${typeLabel}</span>
        <span style="float:right;font-size:12px;color:var(--text-muted)">${q.marks} mark${q.marks > 1 ? 's' : ''}</span>
      </div>
      <div class="test-q-text">${escHTML(q.text)}</div>
      ${answerHtml}
    </div>`;
}

function startTestTimer() {
  const timerEl = document.getElementById('test-timer');
  let remaining = testState.duration;

  testState.timer = setInterval(() => {
    remaining--;
    if (timerEl) timerEl.textContent = formatTime(remaining);

    if (remaining <= 60) timerEl?.classList.add('warning');
    if (remaining <= 10) { timerEl?.classList.remove('warning'); timerEl?.classList.add('danger'); }

    if (remaining <= 0) {
      clearInterval(testState.timer);
      showToast('⏰ Time is up! Auto-submitting...');
      setTimeout(submitTest, 1500);
    }
  }, 1000);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function submitTest() {
  if (testState.submitted) return;
  testState.submitted = true;
  clearInterval(testState.timer);

  const { questions, answers } = testState;
  let correct = 0, total = questions.length;

  const evaluation = questions.map((q, i) => {
    let isCorrect = false;
    let studentAnswer = answers[q.id];

    if (q.type === 'mcq') {
      isCorrect = parseInt(studentAnswer) === q.correct;
    } else if (q.type === 'fill') {
      isCorrect = studentAnswer &&
        studentAnswer.toLowerCase().trim().includes(q.correct_answer?.toLowerCase().trim() || '__');
    } else {
      // Short answers: give partial credit if they wrote something meaningful
      isCorrect = studentAnswer && studentAnswer.trim().length > 10;
    }

    if (isCorrect) correct++;
    return { ...q, studentAnswer, isCorrect };
  });

  const pct = Math.round((correct / total) * 100);
  const grade = pct >= 80 ? 'A+' : pct >= 70 ? 'A' : pct >= 60 ? 'B' : pct >= 50 ? 'C' : 'D';
  const motivational = pct >= 80
    ? 'शाबाश! बहुत बढ़िया! 🎉 तुम हे खूप छान केलंत!'
    : pct >= 60
    ? 'अच्छा प्रयास! और मेहनत करो। / चांगला प्रयत्न! अजून जास्त मेहनत करा!'
    : 'हार मत मानो! / हार मानू नका! Every expert was once a beginner. Keep going! 💪';

  // Save score
  saveTestScore({
    subject: testState.testData?.subject,
    topic: testState.testData?.title,
    score: pct,
    correct, total,
    date: new Date().toISOString()
  });

  // Update test area to show results
  document.getElementById('test-area').classList.add('hidden');
  const resultsArea = document.getElementById('test-results-area');
  resultsArea.classList.remove('hidden');

  resultsArea.innerHTML = `
    <div class="test-result-header fade-in">
      <div class="result-score">${pct}%</div>
      <div class="result-score-label">Your Score</div>
      <div class="result-grade">Grade: ${grade}</div>
      <div class="result-motivational">${motivational}</div>
    </div>

    <div class="result-stats fade-in">
      <div class="stat-card">
        <div class="stat-value" style="color:var(--green)">${correct}</div>
        <div class="stat-label">Correct ✅</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color:var(--error)">${total - correct}</div>
        <div class="stat-label">Wrong ❌</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${total}</div>
        <div class="stat-label">Total Questions</div>
      </div>
    </div>

    <h3 style="font-size:18px;font-weight:700;color:var(--navy);margin:16px 0 12px;">
      📋 Detailed Review
    </h3>

    ${evaluation.map((q, i) => renderEvalCard(q, i)).join('')}

    <div style="text-align:center;margin-top:24px;">
      <button class="btn-primary" onclick="location.reload()">📝 Take Another Test</button>
      <button class="btn-secondary" style="margin-left:10px;" onclick="navigateTo('dashboard')">📊 View My Progress</button>
    </div>
  `;

  resultsArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
  trackStat('tests_taken');
}

function renderEvalCard(q, index) {
  const optLabels = ['A', 'B', 'C', 'D'];
  const statusIcon = q.isCorrect ? '✅' : '❌';
  const statusClass = q.isCorrect ? 'style="border-left-color:var(--green)"' : 'style="border-left-color:var(--error)"';

  let answerDetail = '';
  if (q.type === 'mcq' && q.options) {
    const studentIdx = parseInt(q.studentAnswer);
    answerDetail = `
      <div style="margin:10px 0;font-size:13px;">
        <div style="color:${q.isCorrect ? 'var(--green-dark)' : 'var(--error)'}">
          Your answer: ${!isNaN(studentIdx) ? `${optLabels[studentIdx]}. ${q.options[studentIdx]}` : 'No answer'}
        </div>
        ${!q.isCorrect ? `<div style="color:var(--green-dark)">Correct: ${optLabels[q.correct]}. ${q.options[q.correct]}</div>` : ''}
      </div>`;
  } else {
    answerDetail = `
      <div style="margin:10px 0;font-size:13px;">
        <div style="color:var(--text-secondary)">Your answer: ${escHTML(q.studentAnswer || 'No answer')}</div>
        ${!q.isCorrect ? `<div style="color:var(--green-dark);margin-top:4px;">Model answer: ${escHTML(q.model_answer || q.correct_answer || '')}</div>` : ''}
      </div>`;
  }

  return `
    <div class="ai-card" ${statusClass}>
      <div style="display:flex;align-items:flex-start;gap:10px">
        <div style="font-size:20px;flex-shrink:0">${statusIcon}</div>
        <div style="flex:1">
          <div style="font-weight:600;font-size:14px;color:var(--text-primary)">Q${index + 1}. ${escHTML(q.text)}</div>
          ${answerDetail}
          <div style="background:var(--bg);padding:10px 12px;border-radius:var(--radius-sm);font-size:13px;color:var(--text-secondary);margin-top:8px;">
            💡 <strong>Explanation:</strong> ${escHTML(q.explanation || '')}
          </div>
        </div>
      </div>
    </div>`;
}

function saveTestScore(scoreData) {
  const scores = JSON.parse(localStorage.getItem('test_scores') || '[]');
  scores.push(scoreData);
  if (scores.length > 50) scores.shift();
  localStorage.setItem('test_scores', JSON.stringify(scores));
}
