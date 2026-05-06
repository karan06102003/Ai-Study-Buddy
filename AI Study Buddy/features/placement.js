/* =====================================================
   FEATURE: Placement & Career Prep
   For: Engineering, BCA, MCA, MBA branches
   ===================================================== */

function initPlacement() {
  const page = document.getElementById('page-placement');
  if (!page) return;
  renderPlacementPage(page);
}

function renderPlacementPage(page) {
  const profile = window.USER_PROFILE || {};
  const branch  = profile.branchLabel || 'Engineering';
  const isMBA   = window.MBA_BRANCHES?.includes(profile.branchId);

  page.innerHTML = `
    <div class="page-hero">
      <h1 class="page-title">🚀 Career & Placement Prep</h1>
      <p class="page-subtitle">Aptitude practice, technical interview prep, HR rounds, resume tips — designed for Indian students from Marathi/Hindi medium backgrounds.</p>
    </div>

    <!-- Mode Tabs -->
    <div class="biz-tabs">
      <button class="biz-tab active" data-mode="aptitude">🧮 Aptitude</button>
      <button class="biz-tab" data-mode="technical">💻 Technical</button>
      <button class="biz-tab" data-mode="hr">🤝 HR Round</button>
      <button class="biz-tab" data-mode="resume">📄 Resume</button>
      ${!isMBA ? '<button class="biz-tab" data-mode="gate">🎯 GATE / GPAT / CAT</button>' : ''}
    </div>

    <!-- Aptitude Practice -->
    <div class="biz-panel active" id="mode-aptitude">
      <div class="input-card">
        <div class="section-header" style="margin-bottom:12px;">
          <div class="section-dot"></div>
          <div class="section-title">🧮 Aptitude Practice — Campus Placement Style</div>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Topic</label>
            <select id="aptitude-topic" class="select-input">
              <option value="Percentages and Profit-Loss">Percentages & Profit-Loss</option>
              <option value="Time Speed and Distance">Time, Speed & Distance</option>
              <option value="Ratios and Proportions">Ratios & Proportions</option>
              <option value="Number Systems">Number Systems</option>
              <option value="Averages and Mixtures">Averages & Mixtures</option>
              <option value="Logical Reasoning Puzzles">Logical Reasoning Puzzles</option>
              <option value="Series Completion">Series Completion</option>
              <option value="Seating Arrangement and Directions">Seating Arrangement & Directions</option>
              <option value="Reading Comprehension">Reading Comprehension (Verbal)</option>
              <option value="Coding Decoding">Coding-Decoding</option>
              <option value="Mixed Aptitude">Mixed Aptitude (All Topics)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Company Style</label>
            <select id="aptitude-company" class="select-input">
              <option value="TCS NQT">TCS NQT</option>
              <option value="Infosys">Infosys</option>
              <option value="Wipro">Wipro</option>
              <option value="Cognizant">Cognizant</option>
              <option value="Capgemini">Capgemini</option>
              <option value="Accenture">Accenture</option>
              <option value="HCL">HCL</option>
              <option value="Campus Placement General">General Campus Placement</option>
            </select>
          </div>
        </div>
        <div class="input-actions" style="margin-top:12px;">
          <button class="btn-primary" id="gen-aptitude-btn">🧮 Generate Practice Set</button>
        </div>
      </div>
      <div id="aptitude-result" class="results-container"></div>
    </div>

    <!-- Technical Interview -->
    <div class="biz-panel hidden" id="mode-technical">
      <div class="input-card">
        <div class="section-header" style="margin-bottom:12px;">
          <div class="section-dot"></div>
          <div class="section-title">💻 Technical Interview Prep — ${escHTML(branch)}</div>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Subject / Topic</label>
            <input type="text" id="tech-topic" class="form-input" 
              placeholder="e.g., Data Structures, DBMS, OS, OOPs, Networking, ${isMBA ? 'Finance, Marketing' : 'Thermodynamics, Control Systems'}" />
          </div>
          <div class="form-group">
            <label class="form-label">Interview Level</label>
            <select id="tech-level" class="select-input">
              <option value="Fresher (On-Campus)">Fresher (On-Campus)</option>
              <option value="Internship">Internship</option>
              <option value="1-2 Years Experience">1-2 Years Experience</option>
            </select>
          </div>
        </div>
        <div class="input-actions" style="margin-top:12px;">
          <button class="btn-primary" id="gen-tech-btn">💻 Generate Interview Q&A</button>
        </div>
      </div>
      <div id="tech-result" class="results-container"></div>
    </div>

    <!-- HR Round -->
    <div class="biz-panel hidden" id="mode-hr">
      <div class="input-card">
        <div class="section-header" style="margin-bottom:12px;">
          <div class="section-dot"></div>
          <div class="section-title">🤝 HR Interview Preparation</div>
        </div>
        <p style="font-size:14px;color:var(--text-secondary);margin-bottom:12px;">
          Specially designed for Marathi/Hindi medium students — how to express ideas confidently in English during HR interviews.
        </p>
        <div class="hr-question-chips">
          ${renderHRQuestionChips()}
        </div>
        <div class="form-group" style="margin-top:12px;">
          <label class="form-label">Or type any HR question:</label>
          <input type="text" id="hr-question-input" class="form-input" 
            placeholder='e.g., "Tell me about yourself", "Why should we hire you?", "What is your weakness?"' />
        </div>
        <div class="input-actions" style="margin-top:12px;">
          <button class="btn-primary" id="hr-prep-btn">🤝 Get Model Answer</button>
        </div>
      </div>
      <div id="hr-result" class="results-container"></div>
    </div>

    <!-- Resume Helper -->
    <div class="biz-panel hidden" id="mode-resume">
      <div class="input-card">
        <div class="section-header" style="margin-bottom:12px;">
          <div class="section-dot"></div>
          <div class="section-title">📄 Resume Bullet Point Generator</div>
        </div>
        <p style="font-size:14px;color:var(--text-secondary);margin-bottom:12px;">
          Describe your project, internship, or skill in simple language — get professional resume bullet points!
        </p>
        <textarea id="resume-description" class="main-textarea" rows="4"
          placeholder="Describe your project or experience in simple language (Hindi or English). e.g., 'I built a website for college fest using HTML CSS JavaScript. It showed schedule and registration form. 150 students used it.' / 'मैंने Python में library management system बनाया...'" ></textarea>
        <div class="form-group" style="margin-top:12px;">
          <label class="form-label">Context</label>
          <select id="resume-context" class="select-input">
            <option value="Academic Project">Academic / College Project</option>
            <option value="Internship">Internship Experience</option>
            <option value="Personal Project">Personal / Self-Made Project</option>
            <option value="Technical Skill">Technical Skill</option>
            <option value="Achievement">Achievement / Extra-curricular</option>
          </select>
        </div>
        <div class="input-actions" style="margin-top:12px;">
          <button class="btn-primary" id="resume-gen-btn">📄 Generate Resume Bullets</button>
        </div>
      </div>
      <div id="resume-result" class="results-container"></div>
    </div>

    <!-- GATE / GPAT / CAT Prep -->
    ${!isMBA ? `
    <div class="biz-panel hidden" id="mode-gate">
      <div class="input-card">
        <div class="section-header" style="margin-bottom:12px;">
          <div class="section-dot"></div>
          <div class="section-title">🎯 GATE / GPAT / CAT Prep</div>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Exam Type</label>
            <select id="exam-type-select" class="select-input">
              ${window.PHARMACY_BRANCHES?.includes(profile.branchId) ? '<option value="gpat">GPAT (Pharmacy)</option>' : ''}
              ${window.MBA_BRANCHES?.includes(profile.branchId) ? '<option value="cat">CAT / MAT (MBA)</option>' : ''}
              <option value="gate">GATE (Engineering)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Subject / Topic</label>
            <input type="text" id="exam-topic" class="form-input" placeholder="e.g., Data Structures, Networks, Pharmacology, Quantitative Aptitude" />
          </div>
        </div>
        <div class="input-actions" style="margin-top:12px;">
          <button class="btn-primary" id="gen-exam-btn">🎯 Generate Practice Questions</button>
        </div>
      </div>
      <div id="exam-result" class="results-container"></div>
    </div>` : ''}
  `;

  // Tab switching
  document.querySelectorAll('#page-placement .biz-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#page-placement .biz-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('#page-placement .biz-panel').forEach(p => p.classList.add('hidden'));
      tab.classList.add('active');
      document.getElementById(`mode-${tab.dataset.mode}`)?.classList.remove('hidden');
    });
  });

  // HR question chips
  document.querySelectorAll('.hr-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.getElementById('hr-question-input').value = chip.textContent;
    });
  });

  // Event listeners
  document.getElementById('gen-aptitude-btn')?.addEventListener('click', generateAptitude);
  document.getElementById('gen-tech-btn')?.addEventListener('click', generateTechnical);
  document.getElementById('hr-prep-btn')?.addEventListener('click', prepareHRAnswer);
  document.getElementById('resume-gen-btn')?.addEventListener('click', generateResumeBullets);
  document.getElementById('gen-exam-btn')?.addEventListener('click', generateExamPractice);
}

function renderHRQuestionChips() {
  const questions = [
    'Tell me about yourself',
    'Why should we hire you?',
    'What is your greatest strength?',
    'What is your greatest weakness?',
    'Where do you see yourself in 5 years?',
    'Why do you want to join our company?',
    'Describe a challenge you faced',
    'What are your salary expectations?'
  ];
  return questions.map(q => `<button class="action-chip hr-chip">${q}</button>`).join('');
}

async function generateAptitude() {
  const topic   = document.getElementById('aptitude-topic')?.value;
  const company = document.getElementById('aptitude-company')?.value;
  const result  = document.getElementById('aptitude-result');

  result.innerHTML = `<div class="loading-state"><div class="skeleton-card"></div><div class="loading-messages">Generating ${company} style aptitude questions...</div></div>`;

  try {
    const prompt = buildPlacementPrompt('aptitude', `${topic} — ${company} campus placement style`);
    const response = await callAI(prompt, 0.6, 2500);
    result.innerHTML = `
      <div class="ai-card fade-in">
        <div class="ai-card-header">
          <span class="ai-card-icon">🧮</span>
          <div class="ai-card-title">${escHTML(topic)} — ${escHTML(company)} Style</div>
        </div>
        <div class="ai-card-body">${markdownToHtml(response)}</div>
      </div>`;
    trackStat('aptitude_practice');
  } catch (err) {
    result.innerHTML = buildErrorCard(err.message);
  }
}

async function generateTechnical() {
  const topic  = document.getElementById('tech-topic')?.value?.trim();
  const level  = document.getElementById('tech-level')?.value;
  const result = document.getElementById('tech-result');

  if (!topic) { showToast('Please enter a topic!'); return; }

  result.innerHTML = `<div class="loading-state"><div class="skeleton-card"></div><div class="loading-messages">Generating technical interview Q&A...</div></div>`;

  try {
    const prompt = buildPlacementPrompt('technical', `${topic} at ${level} level`);
    const response = await callAI(prompt, 0.6, 2500);
    result.innerHTML = `
      <div class="ai-card fade-in">
        <div class="ai-card-header">
          <span class="ai-card-icon">💻</span>
          <div class="ai-card-title">Technical Interview — ${escHTML(topic)}</div>
        </div>
        <div class="ai-card-body">${markdownToHtml(response)}</div>
      </div>`;
    trackStat('tech_interview');
  } catch (err) {
    result.innerHTML = buildErrorCard(err.message);
  }
}

async function prepareHRAnswer() {
  const question = document.getElementById('hr-question-input')?.value?.trim();
  const result   = document.getElementById('hr-result');

  if (!question) { showToast('Please enter an HR question!'); return; }

  result.innerHTML = `<div class="loading-state"><div class="skeleton-card"></div><div class="loading-messages">Preparing HR answer...</div></div>`;

  try {
    const prompt = buildPlacementPrompt('hr', question);
    const response = await callAI(prompt, 0.7, 2000);
    result.innerHTML = `
      <div class="ai-card fade-in">
        <div class="ai-card-header">
          <span class="ai-card-icon">🤝</span>
          <div class="ai-card-title">HR Answer — "${escHTML(question)}"</div>
        </div>
        <div class="ai-card-body">${markdownToHtml(response)}</div>
        <div class="ai-card-footer">
          <button class="action-chip" onclick="toggleReadAloud(this.closest('.ai-card').querySelector('.ai-card-body').textContent, 'en-IN', this)">🔊 Practise Speaking</button>
          <button class="action-chip" onclick="navigator.clipboard.writeText(this.closest('.ai-card').querySelector('.ai-card-body').textContent); showToast('Copied!');">📋 Copy Answer</button>
        </div>
      </div>`;
    trackStat('hr_prep');
  } catch (err) {
    result.innerHTML = buildErrorCard(err.message);
  }
}

async function generateResumeBullets() {
  const desc    = document.getElementById('resume-description')?.value?.trim();
  const context = document.getElementById('resume-context')?.value;
  const result  = document.getElementById('resume-result');

  if (!desc) { showToast('Please describe your project or experience!'); return; }

  result.innerHTML = `<div class="loading-state"><div class="skeleton-card"></div><div class="loading-messages">Writing professional resume bullets...</div></div>`;

  try {
    const prompt = buildPlacementPrompt('resume', `${context}: ${desc}`);
    const response = await callAI(prompt, 0.65, 1500);
    result.innerHTML = `
      <div class="ai-card fade-in">
        <div class="ai-card-header">
          <span class="ai-card-icon">📄</span>
          <div class="ai-card-title">Resume Bullet Points — ${escHTML(context)}</div>
        </div>
        <div class="ai-card-body">${markdownToHtml(response)}</div>
        <div class="ai-card-footer">
          <button class="action-chip" onclick="navigator.clipboard.writeText(this.closest('.ai-card').querySelector('.ai-card-body').textContent); showToast('Copied! Paste into your resume 📄');">📋 Copy Bullets</button>
        </div>
      </div>`;
    trackStat('resume_help');
  } catch (err) {
    result.innerHTML = buildErrorCard(err.message);
  }
}

async function generateExamPractice() {
  const examType = document.getElementById('exam-type-select')?.value || 'gate';
  const topic    = document.getElementById('exam-topic')?.value?.trim() || 'General';
  const result   = document.getElementById('exam-result');

  const examNames = { gate: 'GATE', gpat: 'GPAT', cat: 'CAT/MAT' };

  result.innerHTML = `<div class="loading-state"><div class="skeleton-card"></div><div class="loading-messages">Generating ${examNames[examType]} practice questions...</div></div>`;

  try {
    const prompt = buildPlacementPrompt('gate', `${examNames[examType]} exam on topic: ${topic}`);
    const response = await callAI(prompt, 0.6, 2500);
    result.innerHTML = `
      <div class="ai-card fade-in">
        <div class="ai-card-header">
          <span class="ai-card-icon">🎯</span>
          <div class="ai-card-title">${examNames[examType]} Practice — ${escHTML(topic)}</div>
        </div>
        <div class="ai-card-body">${markdownToHtml(response)}</div>
      </div>`;
    trackStat('exam_prep');
  } catch (err) {
    result.innerHTML = buildErrorCard(err.message);
  }
}

window.initPlacement = initPlacement;
