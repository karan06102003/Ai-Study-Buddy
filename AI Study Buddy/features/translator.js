/* =====================================================
   FEATURE 2: Language Bridge Translator
   ===================================================== */

function initTranslator() {
  const input   = document.getElementById('translator-input');
  const btn     = document.getElementById('translator-btn');
  const mic     = document.getElementById('translator-mic');
  const loading = document.getElementById('translator-loading');
  const results = document.getElementById('translator-results');

  if (!btn) return;

  btn.addEventListener('click', () => runTranslator());
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) runTranslator();
  });

  attachVoiceInput(mic, input, 'translator');

  async function runTranslator() {
    const text = input.value.trim();
    if (!text) {
      showToast('Please paste some English text first!');
      return;
    }

    results.innerHTML = '';
    loading.classList.remove('hidden');
    btn.disabled = true;

    try {
      const prompt = buildTranslatorPrompt(text);
      const response = await callGemini(prompt, 0.5, 2000);
      trackStat('topics_studied');
      cacheLastResponse('translator', { text, response });

      loading.classList.add('hidden');
      results.innerHTML = renderTranslation(text, response);
      results.scrollIntoView({ behavior: 'smooth', block: 'start' });
      initTranslationTabs();
    } catch (err) {
      loading.classList.add('hidden');
      results.innerHTML = buildErrorCard(err.message);
      document.getElementById('retry-btn')?.addEventListener('click', runTranslator);
    } finally {
      btn.disabled = false;
    }
  }
}

function renderTranslation(originalText, rawResponse) {
  const hindi    = extractSection(rawResponse, 'हिंदी अनुवाद') || extractSection(rawResponse, 'Hindi Translation') || '';
  const marathi  = extractSection(rawResponse, 'मराठी भाषांतर') || extractSection(rawResponse, 'Marathi Translation') || '';
  const simple   = extractSection(rawResponse, 'Simplified English') || '';
  const vocab    = extractSection(rawResponse, 'Key Vocabulary') || extractSection(rawResponse, 'महत्वाचे शब्द') || '';

  return `
    <div class="fade-in">
      <div class="ai-card" style="margin-bottom:16px;">
        <div class="ai-card-header">
          <span class="ai-card-icon">📄</span>
          <div class="ai-card-title">Original Text</div>
        </div>
        <div class="ai-card-body" style="background:var(--bg);padding:12px;border-radius:var(--radius-md);font-style:italic;color:var(--text-secondary);">
          ${escHTML(originalText).replace(/\n/g, '<br/>')}
        </div>
      </div>

      <div class="translation-tabs">
        <button class="trans-tab active" data-tab="hindi">🇮🇳 हिंदी</button>
        <button class="trans-tab" data-tab="marathi">🏵️ मराठी</button>
        <button class="trans-tab" data-tab="simple">🔤 Simple English</button>
        <button class="trans-tab" data-tab="vocab">📚 Vocabulary</button>
      </div>

      <div class="trans-content" id="tab-hindi">
        <div class="ai-card" style="border-left-color: #138808;">
          <div class="ai-card-header">
            <span class="ai-card-icon">🇮🇳</span>
            <div class="ai-card-title">हिंदी अनुवाद (Hindi Translation)</div>
          </div>
          <div class="ai-card-body">${markdownToHtml(hindi || rawResponse.substring(0, 500))}</div>
          <div class="ai-card-footer">
            <button class="action-chip" onclick="speakText(this.closest('.ai-card').querySelector('.ai-card-body').textContent, 'hi-IN')">🔊 हिंदी में पढ़ें</button>
          </div>
        </div>
      </div>

      <div class="trans-content hidden" id="tab-marathi">
        <div class="ai-card" style="border-left-color: #FF9933;">
          <div class="ai-card-header">
            <span class="ai-card-icon">🏵️</span>
            <div class="ai-card-title">मराठी भाषांतर (Marathi Translation)</div>
          </div>
          <div class="ai-card-body">${markdownToHtml(marathi || 'Translation not available')}</div>
          <div class="ai-card-footer">
            <button class="action-chip" onclick="speakText(this.closest('.ai-card').querySelector('.ai-card-body').textContent, 'mr-IN')">🔊 मराठीत वाचा</button>
          </div>
        </div>
      </div>

      <div class="trans-content hidden" id="tab-simple">
        <div class="ai-card" style="border-left-color: var(--green);">
          <div class="ai-card-header">
            <span class="ai-card-icon">🔤</span>
            <div class="ai-card-title">Simplified English Version</div>
          </div>
          <div class="ai-card-body">${markdownToHtml(simple || 'Please check Hindi or Marathi tab for the translation.')}</div>
          <div class="ai-card-footer">
            <button class="action-chip" onclick="speakText(this.closest('.ai-card').querySelector('.ai-card-body').textContent, 'en-IN')">🔊 Read Aloud</button>
          </div>
        </div>
      </div>

      <div class="trans-content hidden" id="tab-vocab">
        <div class="ai-card" style="border-left-color: var(--navy);">
          <div class="ai-card-header">
            <span class="ai-card-icon">📚</span>
            <div class="ai-card-title">Key Vocabulary / महत्वाचे शब्द</div>
          </div>
          <div class="ai-card-body">${markdownToHtml(vocab || 'Vocabulary will appear here.')}</div>
        </div>
      </div>
    </div>`;
}

function initTranslationTabs() {
  document.querySelectorAll('.trans-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.trans-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.trans-content').forEach(c => c.classList.add('hidden'));
      tab.classList.add('active');
      document.getElementById(`tab-${tab.dataset.tab}`)?.classList.remove('hidden');
    });
  });
}
