/* =====================================================
   FEATURE: Drug Reference (Pharmacy-specific)
   For: D.Pharm, B.Pharm, M.Pharm, Pharm.D
   ===================================================== */

function initDrugReference() {
  const page = document.getElementById('page-drug');
  if (!page) return;
  renderDrugReferencePage(page);
}

function renderDrugReferencePage(page) {
  page.innerHTML = `
    <div class="page-hero">
      <h1 class="page-title">💊 Drug Reference</h1>
      <p class="page-subtitle">Look up any drug — mechanism, pharmacokinetics, side effects, and GPAT exam tips. All explained simply!</p>
    </div>

    <div class="drug-disclaimer">
      ⚠️ <strong>Educational purposes only.</strong> Always consult a licensed pharmacist or doctor for actual medical advice.
    </div>

    <!-- Drug Lookup -->
    <div class="input-card" style="margin-bottom:20px;">
      <div class="section-header" style="margin-bottom:12px;">
        <div class="section-dot" style="background:var(--branch-accent, var(--green));"></div>
        <div class="section-title">🔍 Drug Information Lookup</div>
      </div>
      <div class="input-row">
        <input type="text" id="drug-search-input" class="form-input" 
          placeholder="Enter drug name (e.g., Atorvastatin, Metformin, Paracetamol, Amlodipine)..." 
          style="height:48px;font-size:15px;" aria-label="Drug name" />
        <button class="mic-btn" id="drug-mic">🎤</button>
      </div>
      <div class="input-actions" style="margin-top:12px;">
        <button class="btn-primary" id="drug-lookup-btn">💊 Get Drug Info</button>
        <button class="btn-secondary" id="drug-gpat-btn">🎯 GPAT MCQs</button>
        <button class="btn-secondary" id="drug-dosage-btn">📊 Dosage Calculator Practice</button>
      </div>
    </div>

    <div class="loading-state hidden" id="drug-loading">
      <div class="skeleton-card"></div>
      <div class="loading-messages" id="drug-loading-msg">Looking up drug information...</div>
    </div>
    <div id="drug-result" class="results-container"></div>

    <!-- Common Drug Categories Quick Reference -->
    <div class="drug-categories-section">
      <div class="section-header" style="margin-bottom:12px;margin-top:24px;">
        <div class="section-dot" style="background:var(--branch-accent, var(--green));"></div>
        <div class="section-title">📂 Browse by Drug Category</div>
      </div>
      <div class="drug-category-grid">
        ${renderDrugCategories()}
      </div>
    </div>

    <!-- Clinical Case Scenario -->
    <div class="input-card" style="margin-top:24px;">
      <div class="section-header" style="margin-bottom:12px;">
        <div class="section-dot" style="background:var(--branch-accent, var(--green));"></div>
        <div class="section-title">🏥 Clinical Case Scenario Practice</div>
      </div>
      <p style="font-size:14px;color:var(--text-secondary);margin-bottom:12px;">
        Practice selecting appropriate drug therapy for patient cases — great for B.Pharm and Pharm.D students.
      </p>
      <div class="input-actions">
        <select id="case-specialty" class="select-input">
          <option value="Cardiovascular">Cardiovascular (CVS)</option>
          <option value="Respiratory">Respiratory</option>
          <option value="Diabetes and Endocrine">Diabetes & Endocrine</option>
          <option value="CNS and Psychiatric">CNS & Psychiatric</option>
          <option value="Antibiotic therapy">Antibiotic Therapy</option>
          <option value="Pain Management">Pain Management</option>
          <option value="Gastrointestinal">Gastrointestinal</option>
        </select>
        <button class="btn-primary" id="case-scenario-btn">🏥 Generate Case</button>
      </div>
      <div id="case-result" class="results-container" style="margin-top:16px;"></div>
    </div>
  `;

  // Listeners
  const lookupBtn = document.getElementById('drug-lookup-btn');
  const gpatBtn   = document.getElementById('drug-gpat-btn');
  const dosageBtn = document.getElementById('drug-dosage-btn');
  const caseBtn   = document.getElementById('case-scenario-btn');
  const input     = document.getElementById('drug-search-input');
  const mic       = document.getElementById('drug-mic');

  lookupBtn?.addEventListener('click', lookupDrug);
  gpatBtn?.addEventListener('click', generateGPATMCQs);
  dosageBtn?.addEventListener('click', generateDosagePractice);
  caseBtn?.addEventListener('click', generateClinicalCase);
  mic && attachVoiceInput(mic, input, 'drug');

  input?.addEventListener('keydown', e => {
    if (e.key === 'Enter') lookupDrug();
  });

  // Category buttons
  document.querySelectorAll('.drug-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;
      input.value = `drugs used in ${category}`;
      lookupDrug();
    });
  });
}

function renderDrugCategories() {
  const categories = [
    { icon: '❤️', name: 'Cardiovascular', cats: ['Antihypertensives', 'Antiarrhythmics', 'Antianginals', 'Diuretics'] },
    { icon: '🧠', name: 'CNS Drugs', cats: ['Analgesics', 'Antipsychotics', 'Antidepressants', 'Antiepileptics'] },
    { icon: '🦠', name: 'Anti-infectives', cats: ['Antibiotics', 'Antifungals', 'Antivirals', 'Antiparasitics'] },
    { icon: '🩺', name: 'Endocrine', cats: ['Antidiabetics', 'Thyroid drugs', 'Corticosteroids'] },
    { icon: '🫁', name: 'Respiratory', cats: ['Bronchodilators', 'Antihistamines', 'Antitussives'] },
    { icon: '🤢', name: 'GIT Drugs', cats: ['Antacids', 'Antiemetics', 'Laxatives'] },
  ];

  return categories.map(cat => `
    <div class="drug-cat-card">
      <div class="drug-cat-icon">${cat.icon}</div>
      <div class="drug-cat-name">${cat.name}</div>
      <div class="drug-cat-items">
        ${cat.cats.map(c => `
          <button class="drug-cat-btn action-chip" data-category="${c}">${c}</button>
        `).join('')}
      </div>
    </div>`).join('');
}

async function lookupDrug() {
  const input  = document.getElementById('drug-search-input');
  const loading = document.getElementById('drug-loading');
  const result  = document.getElementById('drug-result');

  const drugName = input?.value?.trim();
  if (!drugName) { showToast('Please enter a drug name!'); return; }

  loading.classList.remove('hidden');
  result.innerHTML = '';
  const interval = startLoadingMessages('drug-loading-msg');

  try {
    const prompt = buildDrugReferencePrompt(drugName);
    const response = await callAI(prompt, 0.5, 2500);

    loading.classList.add('hidden');
    stopLoadingMessages(interval);

    result.innerHTML = `
      <div class="ai-card fade-in" style="border-left-color:var(--branch-accent, #059669);">
        <div class="ai-card-header">
          <span class="ai-card-icon">💊</span>
          <div>
            <div class="ai-card-title">Drug Profile: ${escHTML(drugName)}</div>
            <div style="font-size:12px;color:var(--text-secondary);">Educational Reference — For Pharmacy Students</div>
          </div>
        </div>
        <div class="ai-card-body">${markdownToHtml(response)}</div>
        <div class="ai-card-footer">
          <button class="action-chip" onclick="toggleReadAloud(this.closest('.ai-card').querySelector('.ai-card-body').textContent, 'hi-IN', this)">🔊 Read Aloud</button>
          <button class="action-chip" onclick="navigator.clipboard.writeText(this.closest('.ai-card').querySelector('.ai-card-body').textContent); showToast('Copied!');">📋 Copy Notes</button>
          <button class="action-chip" onclick="saveAsFlashcard('${escHTML(drugName)}', this.closest('.ai-card').querySelector('.ai-card-body').textContent)">🃏 Save as Flashcard</button>
        </div>
      </div>`;

    trackStat('drug_lookups');
  } catch (err) {
    loading.classList.add('hidden');
    stopLoadingMessages(interval);
    result.innerHTML = buildErrorCard(err.message);
  }
}

async function generateGPATMCQs() {
  const input = document.getElementById('drug-search-input');
  const result = document.getElementById('drug-result');
  const topic = input?.value?.trim() || 'Pharmacology';

  result.innerHTML = `<div class="loading-state"><div class="skeleton-card"></div><div class="loading-messages">Generating GPAT-style MCQs on ${escHTML(topic)}...</div></div>`;

  try {
    const prompt = `Generate 10 GPAT-style MCQ questions on: "${topic}" for pharmacy students.

For each question:
**Q[n].** [Question text]
(A) [Option A]  (B) [Option B]  (C) [Option C]  (D) [Option D]
✅ **Answer:** [Correct option]
💡 **Explanation:** [Why this is correct, explained simply in Hindi/English]

Make questions at GPAT difficulty level. Cover mechanism of action, pharmacokinetics, side effects, and drug interactions. This is a Marathi/Hindi medium pharmacy student preparing for GPAT.`;

    const response = await callAI(prompt, 0.6, 2500);
    result.innerHTML = `
      <div class="ai-card fade-in" style="border-left-color:var(--branch-accent, #059669);">
        <div class="ai-card-header">
          <span class="ai-card-icon">🎯</span>
          <div class="ai-card-title">GPAT MCQs — ${escHTML(topic)}</div>
        </div>
        <div class="ai-card-body">${markdownToHtml(response)}</div>
      </div>`;
    trackStat('gpat_practice');
  } catch (err) {
    result.innerHTML = buildErrorCard(err.message);
  }
}

async function generateDosagePractice() {
  const result = document.getElementById('drug-result');
  result.innerHTML = `<div class="loading-state"><div class="skeleton-card"></div><div class="loading-messages">Generating dosage calculation problems...</div></div>`;

  try {
    const prompt = `Generate 5 dosage calculation practice problems for pharmacy students.

For each problem:

**Problem [n]: [Type of problem]**
[Patient scenario with weight, age, drug ordered, dosage form available]

**Formula to use:** [Which formula — mg/kg, drip rate calculation, etc.]

**Step-by-step Solution:**
Step 1: [first step with calculation]
Step 2: [next step]
...
**Final Answer:** [answer with units]

**Trick to Remember:** [A simple trick for Marathi/Hindi medium students to not make mistakes in this type]

Include: weight-based dosing, IV drip rate, pediatric dosing, reconstitution problems. This is for B.Pharm / D.Pharm students.`;

    const response = await callAI(prompt, 0.5, 2500);
    result.innerHTML = `
      <div class="ai-card fade-in" style="border-left-color:var(--branch-accent, #059669);">
        <div class="ai-card-header">
          <span class="ai-card-icon">📊</span>
          <div class="ai-card-title">Dosage Calculation Practice</div>
        </div>
        <div class="ai-card-body">${markdownToHtml(response)}</div>
      </div>`;
    trackStat('dosage_practice');
  } catch (err) {
    result.innerHTML = buildErrorCard(err.message);
  }
}

async function generateClinicalCase() {
  const specialty = document.getElementById('case-specialty')?.value || 'Cardiovascular';
  const result = document.getElementById('case-result');
  result.innerHTML = `<div class="loading-state"><div class="skeleton-card"></div><div class="loading-messages">Generating clinical case...</div></div>`;

  try {
    const prompt = `Generate a clinical pharmacy case scenario for pharmacy students (${specialty}).

**PATIENT CASE:**
[Patient details: age, gender, weight, presenting complaints, relevant history, vitals, lab values]

**Current Medication (if any):**
[List any medications the patient is on]

**Clinical Questions for the Student:**
Q1: What is the most appropriate drug therapy for this patient? Justify your choice.
Q2: What is the recommended dose and frequency? How did you calculate it?
Q3: What potential drug interactions or contraindications should be checked?
Q4: What counseling points would you give this patient in simple language?
Q5: What monitoring parameters will you follow?

**Model Answers:**
[Provide complete model answers for each question]

**Key Learning Points:**
[3-4 take-aways for exam preparation]

⚠️ Educational purposes only. For actual patient care, consult a licensed pharmacist/doctor.`;

    const response = await callAI(prompt, 0.6, 2500);
    result.innerHTML = `
      <div class="ai-card fade-in" style="border-left-color:var(--branch-accent, #059669);">
        <div class="ai-card-header">
          <span class="ai-card-icon">🏥</span>
          <div class="ai-card-title">Clinical Case — ${escHTML(specialty)}</div>
        </div>
        <div class="ai-card-body">${markdownToHtml(response)}</div>
      </div>`;
    trackStat('clinical_cases');
  } catch (err) {
    result.innerHTML = buildErrorCard(err.message);
  }
}

function saveAsFlashcard(front, backText) {
  const decks = JSON.parse(localStorage.getItem('flashcard_decks') || '[]');
  const drugDeck = decks.find(d => d.topic === 'Drug Reference') || { topic: 'Drug Reference', cards: [], cardCount: 0, savedAt: Date.now() };
  drugDeck.cards.push({
    id: Date.now(),
    front: front,
    back_english: backText.substring(0, 500),
    back_hindi: '',
    back_marathi: '',
    example: 'See full drug profile for details',
    status: 'new'
  });
  drugDeck.cardCount = drugDeck.cards.length;

  const idx = decks.findIndex(d => d.topic === 'Drug Reference');
  if (idx >= 0) decks[idx] = drugDeck;
  else decks.push(drugDeck);

  localStorage.setItem('flashcard_decks', JSON.stringify(decks));
  showToast('✅ Saved as flashcard in Drug Reference deck!');
}

window.initDrugReference = initDrugReference;
window.saveAsFlashcard   = saveAsFlashcard;
