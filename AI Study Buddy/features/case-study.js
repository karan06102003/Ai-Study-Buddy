/* =====================================================
   FEATURE: Case Study & MBA Business Tools
   For: BBA, MBA students
   ===================================================== */

function initCaseStudy() {
  const page = document.getElementById('page-casestudy');
  if (!page) return;
  renderCaseStudyPage(page);
}

function renderCaseStudyPage(page) {
  page.innerHTML = `
    <div class="page-hero">
      <h1 class="page-title">📊 Business Tools</h1>
      <p class="page-subtitle">Case study analysis, MBA frameworks, business math, GD prep — all with Indian company examples!</p>
    </div>

    <!-- Tool Tabs -->
    <div class="biz-tabs" id="biz-tabs">
      <button class="biz-tab active" data-tool="case">📋 Case Study</button>
      <button class="biz-tab" data-tool="framework">🏗️ Frameworks</button>
      <button class="biz-tab" data-tool="bizmath">🔢 Business Math</button>
      <button class="biz-tab" data-tool="gd">🎤 GD Prep</button>
      <button class="biz-tab" data-tool="essay">✍️ Essay Writer</button>
    </div>

    <!-- Case Study Analyzer -->
    <div class="biz-panel active" id="panel-case">
      <div class="input-card">
        <div class="section-header" style="margin-bottom:12px;">
          <div class="section-dot" style="background:var(--branch-accent,#D97706);"></div>
          <div class="section-title">📋 Case Study Analyzer</div>
        </div>
        <p style="font-size:14px;color:var(--text-secondary);margin-bottom:12px;">
          Paste your business case study and get a complete MBA-style analysis with SWOT, solutions, and what the examiner expects.
        </p>
        <textarea id="case-text-input" class="main-textarea" rows="6" 
          placeholder="Paste your case study here... (e.g., 'Amul's success in the Indian dairy market...' or any business scenario)"></textarea>
        <div class="input-actions" style="margin-top:12px;">
          <button class="btn-primary" id="analyze-case-btn">📊 Analyze Case Study</button>
        </div>
      </div>
      <div class="loading-state hidden" id="case-loading">
        <div class="skeleton-card"></div>
        <div class="loading-messages" id="case-loading-msg">Analyzing case study...</div>
      </div>
      <div id="case-result" class="results-container"></div>
    </div>

    <!-- Framework Explainer -->
    <div class="biz-panel hidden" id="panel-framework">
      <div class="input-card">
        <div class="section-header" style="margin-bottom:12px;">
          <div class="section-dot" style="background:var(--branch-accent,#D97706);"></div>
          <div class="section-title">🏗️ MBA Framework Explainer</div>
        </div>
        <p style="font-size:14px;color:var(--text-secondary);margin-bottom:16px;">
          Learn key business frameworks with Indian company examples. Great for exams and interviews!
        </p>
        <div class="framework-buttons-grid">
          ${renderFrameworkButtons()}
        </div>
        <div class="form-group" style="margin-top:16px;">
          <label class="form-label">Apply framework to this company/situation:</label>
          <input type="text" id="framework-company" class="form-input" 
            placeholder="e.g., Zomato, Amul, Reliance Jio, local chai stall, startup idea..." />
        </div>
        <div class="input-actions" style="margin-top:12px;">
          <button class="btn-primary" id="explain-framework-btn">🏗️ Explain Framework</button>
        </div>
      </div>
      <div id="framework-result" class="results-container"></div>
    </div>

    <!-- Business Math Solver -->
    <div class="biz-panel hidden" id="panel-bizmath">
      <div class="input-card">
        <div class="section-header" style="margin-bottom:12px;">
          <div class="section-dot" style="background:var(--branch-accent,#D97706);"></div>
          <div class="section-title">🔢 Business Math Solver</div>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Problem Type</label>
            <select id="bizmath-type" class="select-input">
              <option value="NPV IRR">NPV / IRR Analysis</option>
              <option value="Break-Even Analysis">Break-Even Analysis</option>
              <option value="Ratio Analysis">Ratio Analysis</option>
              <option value="Working Capital">Working Capital Management</option>
              <option value="Cost of Capital WACC">Cost of Capital (WACC)</option>
              <option value="Time Value of Money">Time Value of Money</option>
              <option value="Payback Period">Payback Period</option>
              <option value="Marketing Math ROI">Marketing Math (ROI, Market Share)</option>
            </select>
          </div>
        </div>
        <div class="form-group" style="margin-top:12px;">
          <label class="form-label">Describe your problem (in Hindi or English):</label>
          <textarea id="bizmath-problem" class="main-textarea" rows="4"
            placeholder="e.g., A company invests ₹5 lakh today and expects ₹2 lakh per year for 4 years. Calculate NPV at 10% discount rate. / कंपनी ने ₹5 लाख invest किए और हर साल ₹2 लाख return की उम्मीद है..."></textarea>
        </div>
        <div class="input-actions" style="margin-top:12px;">
          <button class="btn-primary" id="solve-bizmath-btn">🔢 Solve Step by Step</button>
        </div>
      </div>
      <div id="bizmath-result" class="results-container"></div>
    </div>

    <!-- GD Prep -->
    <div class="biz-panel hidden" id="panel-gd">
      <div class="input-card">
        <div class="section-header" style="margin-bottom:12px;">
          <div class="section-dot" style="background:var(--branch-accent,#D97706);"></div>
          <div class="section-title">🎤 Group Discussion Prep</div>
        </div>
        <p style="font-size:14px;color:var(--text-secondary);margin-bottom:12px;">
          Enter any GD topic and get a complete preparation guide — opening line, key points, statistics, counterarguments.
        </p>
        <input type="text" id="gd-topic-input" class="form-input" style="height:48px;"
          placeholder="Enter GD topic (e.g., 'Social Media — Boon or Bane?', 'Should India become cashless?')" />
        <div class="input-actions" style="margin-top:12px;">
          <button class="btn-primary" id="gd-prep-btn">🎤 Prepare for This GD</button>
        </div>
      </div>
      <div id="gd-result" class="results-container"></div>
    </div>

    <!-- Essay / Report Writer -->
    <div class="biz-panel hidden" id="panel-essay">
      <div class="input-card">
        <div class="section-header" style="margin-bottom:12px;">
          <div class="section-dot" style="background:var(--branch-accent,#D97706);"></div>
          <div class="section-title">✍️ Academic Essay / Report Writer</div>
        </div>
        <div class="form-grid">
          <div class="form-group full-width">
            <label class="form-label">Essay / Report Topic</label>
            <input type="text" id="essay-topic" class="form-input" 
              placeholder="e.g., Impact of Digital India on Rural Economy, CSR in Indian Companies..." />
          </div>
          <div class="form-group">
            <label class="form-label">Word Limit</label>
            <select id="essay-length" class="select-input">
              <option value="300">300 words (Short Answer)</option>
              <option value="500" selected>500 words (Essay)</option>
              <option value="800">800 words (Long Essay)</option>
              <option value="1200">1200 words (Assignment)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Format</label>
            <select id="essay-format" class="select-input">
              <option value="essay">Academic Essay</option>
              <option value="report">Business Report</option>
              <option value="note">Short Note</option>
              <option value="letter">Business Letter</option>
            </select>
          </div>
        </div>
        <div class="input-actions" style="margin-top:12px;">
          <button class="btn-primary" id="write-essay-btn">✍️ Write for Me</button>
        </div>
      </div>
      <div id="essay-result" class="results-container"></div>
    </div>
  `;

  // Tab switching
  document.querySelectorAll('.biz-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.biz-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.biz-panel').forEach(p => p.classList.add('hidden'));
      tab.classList.add('active');
      document.getElementById(`panel-${tab.dataset.tool}`)?.classList.remove('hidden');
    });
  });

  // Event listeners
  document.getElementById('analyze-case-btn')?.addEventListener('click', analyzeCaseStudy);
  document.getElementById('explain-framework-btn')?.addEventListener('click', explainFramework);
  document.getElementById('solve-bizmath-btn')?.addEventListener('click', solveBizMath);
  document.getElementById('gd-prep-btn')?.addEventListener('click', prepareGD);
  document.getElementById('write-essay-btn')?.addEventListener('click', writeEssay);

  // Framework selection
  document.querySelectorAll('.framework-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.framework-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function renderFrameworkButtons() {
  const frameworks = [
    { id: 'swot', icon: '🔲', name: 'SWOT Analysis' },
    { id: 'pestle', icon: '🌍', name: 'PESTLE Analysis' },
    { id: 'porter', icon: '5️⃣', name: "Porter's 5 Forces" },
    { id: 'bcg', icon: '📊', name: 'BCG Matrix' },
    { id: 'ansoff', icon: '🗺️', name: 'Ansoff Matrix' },
    { id: 'balanced', icon: '⚖️', name: 'Balanced Scorecard' },
    { id: 'mckinsey', icon: '7️⃣', name: "McKinsey 7S" },
    { id: 'vrio', icon: '💎', name: 'VRIO Framework' },
  ];
  return frameworks.map(f => `
    <button class="framework-btn ${f.id === 'swot' ? 'active' : ''}" data-framework="${f.id}" data-name="${f.name}">
      <span>${f.icon}</span>
      <span>${f.name}</span>
    </button>`).join('');
}

async function analyzeCaseStudy() {
  const text = document.getElementById('case-text-input')?.value?.trim();
  if (!text) { showToast('Please paste a case study first!'); return; }

  const loading = document.getElementById('case-loading');
  const result  = document.getElementById('case-result');
  loading.classList.remove('hidden');
  result.innerHTML = '';
  const interval = startLoadingMessages('case-loading-msg');

  try {
    const prompt = buildCaseStudyPrompt(text);
    const response = await callAI(prompt, 0.6, 2500);

    loading.classList.add('hidden');
    stopLoadingMessages(interval);
    result.innerHTML = `
      <div class="ai-card fade-in" style="border-left-color:var(--branch-accent,#D97706);">
        <div class="ai-card-header">
          <span class="ai-card-icon">📊</span>
          <div class="ai-card-title">Case Study Analysis</div>
        </div>
        <div class="ai-card-body">${markdownToHtml(response)}</div>
        <div class="ai-card-footer">
          <button class="action-chip" onclick="navigator.clipboard.writeText(this.closest('.ai-card').querySelector('.ai-card-body').textContent); showToast('Copied!');">📋 Copy Analysis</button>
          <button class="action-chip" onclick="toggleReadAloud(this.closest('.ai-card').querySelector('.ai-card-body').textContent, null, this)">🔊 Read Aloud</button>
        </div>
      </div>`;
    trackStat('case_studies');
  } catch (err) {
    loading.classList.add('hidden');
    stopLoadingMessages(interval);
    result.innerHTML = buildErrorCard(err.message);
  }
}

async function explainFramework() {
  const activeBtn = document.querySelector('.framework-btn.active');
  const framework = activeBtn?.dataset.name || 'SWOT Analysis';
  const company   = document.getElementById('framework-company')?.value?.trim() || 'a local Indian company';
  const result    = document.getElementById('framework-result');

  result.innerHTML = `<div class="loading-state"><div class="skeleton-card"></div><div class="loading-messages">Explaining ${framework}...</div></div>`;

  try {
    const prompt = `Explain the ${framework} framework for an MBA/BBA student and apply it to: "${company}"

## 🏗️ What is ${framework}?
[Explain the framework in very simple language. What it is, why it's used, when to use it — in 4-5 sentences]

## Understanding the Components
[Explain each component of the framework clearly with a simple definition]

## Applied to: ${company}
[Apply the full framework to the company/situation provided. Be specific and realistic.]

## How to Use This in Exams
[3-4 tips on how to write ${framework} analysis in MBA exams to get full marks]

## Indian Company Examples
[Give 2 more examples using Indian companies like Tata, Reliance, Amul, Zomato, Ola, Flipkart etc.]

Use simple language suitable for a Hindi/Marathi medium student learning business concepts.`;

    const response = await callAI(prompt, 0.6, 2000);
    result.innerHTML = `
      <div class="ai-card fade-in" style="border-left-color:var(--branch-accent,#D97706);">
        <div class="ai-card-header">
          <span class="ai-card-icon">🏗️</span>
          <div class="ai-card-title">${framework} — Applied to ${escHTML(company)}</div>
        </div>
        <div class="ai-card-body">${markdownToHtml(response)}</div>
      </div>`;
    trackStat('framework_studies');
  } catch (err) {
    result.innerHTML = buildErrorCard(err.message);
  }
}

async function solveBizMath() {
  const type    = document.getElementById('bizmath-type')?.value || 'NPV IRR';
  const problem = document.getElementById('bizmath-problem')?.value?.trim();
  const result  = document.getElementById('bizmath-result');

  if (!problem) { showToast('Please describe your problem!'); return; }

  result.innerHTML = `<div class="loading-state"><div class="skeleton-card"></div><div class="loading-messages">Solving ${type} problem step by step...</div></div>`;

  try {
    const prompt = `Solve this ${type} business math problem step by step for an MBA/BBA student:

Problem: "${problem}"

## 📐 Formula Used
[State the formula clearly]

## Given Information (दी गई जानकारी)
[List all given values clearly]

## Step-by-Step Solution (हल)
Step 1: [First step with calculation]
Step 2: [Second step...]
...
**Final Answer:** [Answer with proper units and interpretation]

## Interpretation (व्याख्या)
[What does this answer mean for the business decision? Should the company proceed?]

## Common Mistakes (सामान्य गलतियाँ)
[2-3 mistakes students make in this type of problem]

Explain every step clearly in simple Hindi/English so a Mumbai University MBA student can follow.`;

    const response = await callAI(prompt, 0.4, 2000);
    result.innerHTML = `
      <div class="ai-card fade-in" style="border-left-color:var(--branch-accent,#D97706);">
        <div class="ai-card-header">
          <span class="ai-card-icon">🔢</span>
          <div class="ai-card-title">${type} — Step-by-Step Solution</div>
        </div>
        <div class="ai-card-body">${markdownToHtml(response)}</div>
      </div>`;
    trackStat('biz_math');
  } catch (err) {
    result.innerHTML = buildErrorCard(err.message);
  }
}

async function prepareGD() {
  const topic  = document.getElementById('gd-topic-input')?.value?.trim();
  const result = document.getElementById('gd-result');
  if (!topic) { showToast('Please enter a GD topic!'); return; }

  result.innerHTML = `<div class="loading-state"><div class="skeleton-card"></div><div class="loading-messages">Preparing GD material for "${escHTML(topic)}"...</div></div>`;

  try {
    const prompt = `Prepare complete Group Discussion (GD) material for MBA/BBA students on the topic: "${topic}"

## 🎤 GD Preparation Guide

### Strong Opening Statement (पहला वाक्य)
[2 alternative opening lines to start the GD strongly. Professional, confident English that even a Hindi-medium student can use.]

### Key Points to Make (मुख्य बिंदु)
[7-8 strong, specific points to raise during the GD. Mix facts, examples, and logical arguments.]

### Facts & Statistics to Quote
[3-4 real Indian statistics or recent data points that will impress the panel]

### Indian Examples to Use
[Specific Indian companies, government schemes, or real events related to this topic]

### Counterarguments to Anticipate (विरोधी तर्क)
[3 counterarguments others might make, and how to respond to them]

### Strong Conclusion (समापन)
[2 ways to conclude the GD powerfully]

### Words and Phrases to Use
[Transition phrases for agreeing, disagreeing politely, adding to a point — helpful for Hindi/Marathi medium students]`;

    const response = await callAI(prompt, 0.7, 2500);
    result.innerHTML = `
      <div class="ai-card fade-in" style="border-left-color:var(--branch-accent,#D97706);">
        <div class="ai-card-header">
          <span class="ai-card-icon">🎤</span>
          <div class="ai-card-title">GD Prep — ${escHTML(topic)}</div>
        </div>
        <div class="ai-card-body">${markdownToHtml(response)}</div>
        <div class="ai-card-footer">
          <button class="action-chip" onclick="navigator.clipboard.writeText(this.closest('.ai-card').querySelector('.ai-card-body').textContent); showToast('Copied!');">📋 Copy</button>
          <button class="action-chip" onclick="toggleReadAloud(this.closest('.ai-card').querySelector('.ai-card-body').textContent, null, this)">🔊 Practise Aloud</button>
        </div>
      </div>`;
    trackStat('gd_prep');
  } catch (err) {
    result.innerHTML = buildErrorCard(err.message);
  }
}

async function writeEssay() {
  const topic  = document.getElementById('essay-topic')?.value?.trim();
  const length = document.getElementById('essay-length')?.value || '500';
  const format = document.getElementById('essay-format')?.value || 'essay';
  const result = document.getElementById('essay-result');

  if (!topic) { showToast('Please enter an essay topic!'); return; }

  result.innerHTML = `<div class="loading-state"><div class="skeleton-card"></div><div class="loading-messages">Writing ${length}-word ${format}...</div></div>`;

  try {
    const formatInstructions = {
      essay: 'academic essay with Introduction, 3 body paragraphs (with topic sentences), and Conclusion',
      report: 'business report with Executive Summary, problem statement, findings, analysis, recommendations, and conclusion',
      note: 'short note format with brief introduction, key points as numbered list, and conclusion',
      letter: 'formal business letter with proper format (sender address, date, salutation, body paragraphs, closing)'
    };

    const prompt = `Write a ${length}-word ${formatInstructions[format]} on: "${topic}"

For an MBA/BBA university assignment. Requirements:
- Professional academic English
- Use Indian examples and context where relevant (India's economy, Indian companies, Indian government policies)
- Include specific facts, data, or examples as much as possible
- Clear structure with paragraphs and logical flow
- A strong conclusion with recommendations or future outlook

Write the complete ${format} ready to submit as an assignment.`;

    const response = await callAI(prompt, 0.7, 2500, 1);
    result.innerHTML = `
      <div class="ai-card fade-in" style="border-left-color:var(--branch-accent,#D97706);">
        <div class="ai-card-header">
          <span class="ai-card-icon">✍️</span>
          <div class="ai-card-title">${format.charAt(0).toUpperCase() + format.slice(1)} — ${escHTML(topic)}</div>
        </div>
        <div class="ai-card-body">${markdownToHtml(response)}</div>
        <div class="ai-card-footer">
          <button class="action-chip" onclick="navigator.clipboard.writeText(this.closest('.ai-card').querySelector('.ai-card-body').textContent); showToast('Essay copied!');">📋 Copy Essay</button>
        </div>
      </div>`;
    trackStat('essays_written');
  } catch (err) {
    result.innerHTML = buildErrorCard(err.message);
  }
}

window.initCaseStudy = initCaseStudy;
