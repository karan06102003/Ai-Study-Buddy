/* =====================================================
   AI STUDY BUDDY v2.0 — Main Application
   app.js: Profile System, Routing, i18n, UI Logic
   ===================================================== */

'use strict';

// =========================================================
// i18n — Translations
// =========================================================
const TRANSLATIONS = {
  en: {
    nav_home:        'Home',
    nav_explainer:   'Topic Explainer',
    nav_chat:        'Doubt Solver',
    nav_translator:  'Translator',
    nav_mocktest:    'Mock Test',
    nav_flashcards:  'Flashcards',
    nav_planner:     'Planner',
    nav_dashboard:   'Dashboard',
    nav_settings:    'Settings',
    home_title:      '💡 Topic Explainer',
    home_subtitle:   'Type any topic, textbook paragraph, or exam question — get a complete, simple explanation in your language.',
    btn_explain:     '✨ Explain This!',
    chat_title:      '💬 Doubt Solver',
    chat_subtitle:   'Ask any doubt in Hindi, Marathi, or English. I answer in your language!',
    btn_clear_chat:  '🗑️ Clear Chat',
    trans_title:     '🌐 Language Bridge',
    trans_subtitle:  'Paste any English paragraph from your textbook — get it in simple Hindi, Marathi & simplified English.',
    btn_translate:   '🌐 Translate & Simplify',
    test_title:      '📝 Mock Test Generator',
    test_subtitle:   'Generate a complete exam-style test with auto-evaluation and detailed answers.',
    test_subject:    'Subject',
    test_topic:      'Topic',
    test_class:      'Class / Course Level',
    test_board:      'Exam Board / University',
    test_duration:   'Test Duration',
    btn_generate_test: '📝 Generate Mock Test',
    flash_title:     '🃏 Smart Flashcards',
    flash_subtitle:  'Generate flashcards from any topic. Study smart with spaced repetition.',
    btn_generate_cards: '🃏 Generate Flashcards',
    btn_saved_decks: '📚 My Saved Decks',
    plan_title:      '📅 Study Planner',
    plan_subtitle:   'Enter your exam details and get a personalized day-by-day study plan.',
    btn_generate_plan: '📅 Generate Study Plan',
    dash_title:      '📊 My Progress',
    dash_subtitle:   'Track your learning journey and celebrate your achievements.',
    tagline:         'Study Made Simple',
    error_ai_busy:   'AI is busy right now. Please try again in a moment.',
    loading_1:       'AI is thinking...',
    loading_2:       'Preparing your answer...',
    loading_3:       'Just a moment...'
  },
  hi: {
    nav_home:        'होम',
    nav_explainer:   'विषय समझाइए',
    nav_chat:        'संदेह हल करें',
    nav_translator:  'अनुवादक',
    nav_mocktest:    'मॉक टेस्ट',
    nav_flashcards:  'फ्लैशकार्ड',
    nav_planner:     'अध्ययन योजना',
    nav_dashboard:   'डैशबोर्ड',
    nav_settings:    'सेटिंग्स',
    home_title:      '💡 विषय समझाइए',
    home_subtitle:   'कोई भी विषय, पाठ्यपुस्तक का वाक्य, या परीक्षा प्रश्न टाइप करें।',
    btn_explain:     '✨ समझाइए!',
    chat_title:      '💬 संदेह समाधान',
    chat_subtitle:   'हिंदी, मराठी या अंग्रेजी में कोई भी सवाल पूछें।',
    btn_clear_chat:  '🗑️ चैट साफ करें',
    trans_title:     '🌐 भाषा सेतु',
    trans_subtitle:  'अपनी पाठ्यपुस्तक का कोई भी अंग्रेजी अनुच्छेद पेस्ट करें।',
    btn_translate:   '🌐 अनुवाद करें',
    test_title:      '📝 मॉक टेस्ट',
    test_subtitle:   'ऑटो-मूल्यांकन के साथ पूर्ण परीक्षा-शैली का टेस्ट बनाएं।',
    test_subject:    'विषय',
    test_topic:      'टॉपिक',
    test_class:      'कक्षा / स्तर',
    test_board:      'परीक्षा बोर्ड / विश्वविद्यालय',
    test_duration:   'टेस्ट की अवधि',
    btn_generate_test: '📝 मॉक टेस्ट बनाएं',
    flash_title:     '🃏 स्मार्ट फ्लैशकार्ड',
    flash_subtitle:  'किसी भी विषय से फ्लैशकार्ड बनाएं।',
    btn_generate_cards: '🃏 फ्लैशकार्ड बनाएं',
    btn_saved_decks: '📚 मेरे सेव किए डेक',
    plan_title:      '📅 अध्ययन योजना',
    plan_subtitle:   'अपनी परीक्षा की जानकारी डालें और दिन-प्रतिदिन की अध्ययन योजना पाएं।',
    btn_generate_plan: '📅 योजना बनाएं',
    dash_title:      '📊 मेरी प्रगति',
    dash_subtitle:   'अपनी सीखने की यात्रा ट्रैक करें।',
    tagline:         'पढ़ाई अब आसान है',
    error_ai_busy:   'AI अभी थोड़ा व्यस्त है। एक मिनट बाद कोशिश करें।',
    loading_1:       'AI समझ रहा है...',
    loading_2:       'उत्तर तैयार हो रहा है...',
    loading_3:       'बस एक पल...'
  },
  mr: {
    nav_home:        'होम',
    nav_explainer:   'विषय समजवा',
    nav_chat:        'शंका निराकरण',
    nav_translator:  'अनुवादक',
    nav_mocktest:    'मॉक टेस्ट',
    nav_flashcards:  'फ्लॅशकार्ड',
    nav_planner:     'अभ्यास योजना',
    nav_dashboard:   'डॅशबोर्ड',
    nav_settings:    'सेटिंग्ज',
    home_title:      '💡 विषय समजवा',
    home_subtitle:   'कोणताही विषय, पाठ्यपुस्तकातील परिच्छेद, किंवा परीक्षा प्रश्न टाइप करा.',
    btn_explain:     '✨ समजवा!',
    chat_title:      '💬 शंका निराकरण',
    chat_subtitle:   'हिंदी, मराठी किंवा इंग्रजीत कोणताही प्रश्न विचारा.',
    btn_clear_chat:  '🗑️ चॅट साफ करा',
    trans_title:     '🌐 भाषा सेतू',
    trans_subtitle:  'तुमच्या पाठ्यपुस्तकातील कोणताही इंग्रजी परिच्छेद पेस्ट करा.',
    btn_translate:   '🌐 भाषांतर करा',
    test_title:      '📝 मॉक टेस्ट',
    test_subtitle:   'ऑटो-मूल्यांकनासह संपूर्ण परीक्षा-शैलीचा टेस्ट तयार करा.',
    test_subject:    'विषय',
    test_topic:      'टॉपिक',
    test_class:      'वर्ग / स्तर',
    test_board:      'परीक्षा बोर्ड / विद्यापीठ',
    test_duration:   'टेस्टचा कालावधी',
    btn_generate_test: '📝 मॉक टेस्ट तयार करा',
    flash_title:     '🃏 स्मार्ट फ्लॅशकार्ड',
    flash_subtitle:  'कोणत्याही विषयातून फ्लॅशकार्ड तयार करा.',
    btn_generate_cards: '🃏 फ्लॅशकार्ड तयार करा',
    btn_saved_decks: '📚 माझे सेव्ह केलेले डेक',
    plan_title:      '📅 अभ्यास योजना',
    plan_subtitle:   'तुमच्या परीक्षेची माहिती द्या आणि दिवसनिहाय अभ्यास योजना मिळवा.',
    btn_generate_plan: '📅 योजना तयार करा',
    dash_title:      '📊 माझी प्रगती',
    dash_subtitle:   'तुमचा शिकण्याचा प्रवास ट्रॅक करा.',
    tagline:         'अभ्यास करा सोप्या भाषेत',
    error_ai_busy:   'AI आत्ता थोडा व्यस्त आहे. एक मिनिटानंतर पुन्हा प्रयत्न करा.',
    loading_1:       'AI समजत आहे...',
    loading_2:       'उत्तर तयार होत आहे...',
    loading_3:       'थोडा वेळ...'
  }
};

// =========================================================
// App State & Profile
// =========================================================
let currentLang  = 'en';
let currentPage  = 'home';
let isFirstVisit = false;

// USER_PROFILE — global object used by gemini.js prompts
window.USER_PROFILE = {};

// =========================================================
// Boot
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  // Load saved language
  currentLang = localStorage.getItem('app_language') || detectBrowserLanguage();

  // Load profile
  loadProfile();

  // Online/offline detection
  initOfflineDetection();

  // Check first-time visit
  isFirstVisit = !localStorage.getItem('app_onboarded');

  // Initialize navigation
  initNavigation();

  // Initialize language toggle
  initLanguageToggle();

  // Apply language
  applyLanguage(currentLang);

  // Initialize settings page
  initSettings();

  // Apply branch-specific navigation
  applyBranchNav();

  // Show onboarding or go straight to app
  if (isFirstVisit) {
    startOnboarding();
  } else {
    updateProfileBadge();
    populateExplainerFromProfile();
  }

  // Initialize all features
  initExplainer();
  initChat();
  initTranslator();
  initMockTest();
  initFlashcards();
  initPlanner();
  initDashboard();
  initCodePlayground();
  initDrugReference();
  initCaseStudy();
  initPlacement();

  // Quick topic suggestions on home
  renderQuickTopics();

  // Chat quick prompts
  initChatQuickPrompts();

  // Load cached last response
  loadCachedResponses();

  // Show initial page
  navigateTo(localStorage.getItem('last_page') || 'home');
}

// =========================================================
// PROFILE SYSTEM
// =========================================================
const DEFAULT_PROFILE = {
  name: '',
  language: 'en',
  branchId: 'class12',
  branchLabel: 'Class 12',
  semester: '1st Year / Semester 1-2',
  university: 'Maharashtra HSC',
  medium: 'Marathi Medium'
};

function loadProfile() {
  const saved = localStorage.getItem('user_profile');
  window.USER_PROFILE = saved ? JSON.parse(saved) : { ...DEFAULT_PROFILE };
  // Sync language
  if (window.USER_PROFILE.language) {
    currentLang = window.USER_PROFILE.language;
    localStorage.setItem('app_language', currentLang);
  }
}

function saveProfile(profileData) {
  window.USER_PROFILE = { ...profileData };
  localStorage.setItem('user_profile', JSON.stringify(profileData));
  localStorage.setItem('app_language', profileData.language || 'en');
  currentLang = profileData.language || 'en';
}

function openProfileSetup() {
  // Render branch selector
  renderBranchSelector();
  // Pre-fill existing values
  const p = window.USER_PROFILE;
  if (p.name) document.getElementById('profile-name').value = p.name;
  document.querySelectorAll('.lang-pick-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === (p.language || 'en'));
  });
  document.querySelectorAll('.medium-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.medium === (p.medium || 'Marathi Medium'));
  });
  const semSel = document.getElementById('profile-semester');
  if (semSel && p.semester) semSel.value = p.semester;
  const uniSel = document.getElementById('profile-university');
  if (uniSel && p.university) uniSel.value = p.university;

  // Show overlay
  document.getElementById('profile-overlay')?.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function renderBranchSelector() {
  const container = document.getElementById('branch-group-list');
  if (!container || !window.BRANCHES) return;

  // Group by group
  const groups = {};
  window.BRANCHES.forEach(b => {
    if (!groups[b.group]) groups[b.group] = [];
    groups[b.group].push(b);
  });

  container.innerHTML = Object.entries(groups).map(([gName, branches]) => `
    <div class="branch-group">
      <div class="branch-group-label">${gName}</div>
      <div class="branch-options">
        ${branches.map(b => `
          <button class="branch-option-btn ${(window.USER_PROFILE.branchId === b.id) ? 'active' : ''}" 
            data-branch-id="${b.id}" data-branch-label="${b.label}">
            <span>${b.icon}</span>
            <span>${b.label}</span>
          </button>`).join('')}
      </div>
    </div>`).join('');

  // Branch selection
  container.querySelectorAll('.branch-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.branch-option-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function initProfileSetup() {
  // Lang pick buttons
  document.querySelectorAll('.lang-pick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lang-pick-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Medium buttons
  document.querySelectorAll('.medium-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.medium-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Save button
  document.getElementById('profile-save-btn')?.addEventListener('click', () => {
    const activeBranch = document.querySelector('.branch-option-btn.active');
    const activeLang   = document.querySelector('.lang-pick-btn.active');
    const activeMedium = document.querySelector('.medium-btn.active');

    const profile = {
      name:         document.getElementById('profile-name')?.value?.trim() || '',
      language:     activeLang?.dataset.lang || 'en',
      branchId:     activeBranch?.dataset.branchId || 'class12',
      branchLabel:  activeBranch?.dataset.branchLabel || 'Class 12',
      semester:     document.getElementById('profile-semester')?.value || '1st Year',
      university:   document.getElementById('profile-university')?.value || 'Maharashtra HSC',
      medium:       activeMedium?.dataset.medium || 'Marathi Medium'
    };

    saveProfile(profile);
    document.getElementById('profile-overlay')?.classList.add('hidden');
    document.body.style.overflow = '';

    // Re-apply everything
    applyLanguage(currentLang);
    applyBranchNav();
    applyBranchAccent();
    updateProfileBadge();
    updateSettingsProfileDisplay();
    populateExplainerFromProfile();
    renderQuickTopics();

    // Complete onboarding if pending
    if (!localStorage.getItem('app_onboarded')) {
      completeOnboarding();
    }

    showToast(`Profile saved! Welcome, ${profile.name || 'Student'}! 🎓`);
    navigateTo('home');
  });
}

function applyBranchNav() {
  const profile = window.USER_PROFILE;
  const branchId = profile.branchId || '';

  const showCode      = window.CODE_BRANCHES?.includes(branchId);
  const showDrug      = window.PHARMACY_BRANCHES?.includes(branchId);
  const showCase      = window.MBA_BRANCHES?.includes(branchId);
  const showPlacement = window.PLACEMENT_BRANCHES?.includes(branchId);

  toggleNavItem('nav-code-li', showCode);
  toggleNavItem('nav-drug-li', showDrug);
  toggleNavItem('nav-casestudy-li', showCase);
  toggleNavItem('nav-placement-li', showPlacement);

  applyBranchAccent();
}

function toggleNavItem(liId, show) {
  const li = document.getElementById(liId);
  if (li) li.classList.toggle('hidden', !show);
}

function applyBranchAccent() {
  const branchId = window.USER_PROFILE?.branchId || '';
  const accent = window.BRANCH_ACCENTS?.[branchId] || '#FF6B35';
  document.documentElement.style.setProperty('--branch-accent', accent);
}

function updateProfileBadge() {
  const badge = document.getElementById('profile-badge');
  if (!badge) return;
  const p = window.USER_PROFILE;
  if (!p.branchId) return;
  const branch = window.BRANCHES?.find(b => b.id === p.branchId);
  const icon = branch?.icon || '🎓';
  badge.textContent = `${icon} ${p.name || p.branchLabel?.split(' ')[0] || 'Profile'}`;
  badge.classList.remove('hidden');
  badge.title = `${p.branchLabel} · ${p.university}`;
}

function updateSettingsProfileDisplay() {
  const el = document.getElementById('settings-profile-display');
  if (!el) return;
  const p = window.USER_PROFILE;
  if (!p.branchId) {
    el.innerHTML = '<p style="color:var(--text-secondary);font-size:14px;">No profile set. Click Edit Profile to set up.</p>';
    return;
  }
  el.innerHTML = `
    <div class="profile-summary-grid">
      <div class="profile-summary-item"><span class="ps-label">Name</span><span class="ps-val">${escHTML(p.name || 'Anonymous Student')}</span></div>
      <div class="profile-summary-item"><span class="ps-label">Branch</span><span class="ps-val">${escHTML(p.branchLabel || '')}</span></div>
      <div class="profile-summary-item"><span class="ps-label">Year / Sem</span><span class="ps-val">${escHTML(p.semester || '')}</span></div>
      <div class="profile-summary-item"><span class="ps-label">University</span><span class="ps-val">${escHTML(p.university || '')}</span></div>
      <div class="profile-summary-item"><span class="ps-label">Medium</span><span class="ps-val">${escHTML(p.medium || '')}</span></div>
      <div class="profile-summary-item"><span class="ps-label">Language</span><span class="ps-val">${p.language === 'hi' ? '🇮🇳 Hindi' : p.language === 'mr' ? '🏵️ Marathi' : '🇬🇧 English'}</span></div>
    </div>`;
}

function populateExplainerFromProfile() {
  const p = window.USER_PROFILE;
  if (!p.branchId) return;

  // Set explainer-class selector
  const clsSel = document.getElementById('explainer-class');
  if (clsSel && p.branchLabel) {
    // Try to match option
    const opts = Array.from(clsSel.options);
    const match = opts.find(o => o.value.toLowerCase().includes(p.branchLabel.split(' ')[0].toLowerCase()));
    if (match) clsSel.value = match.value;
  }

  // Set board selector
  const boardSel = document.getElementById('explainer-board');
  if (boardSel && p.university) {
    const opts = Array.from(boardSel.options);
    const match = opts.find(o => o.value === p.university);
    if (match) boardSel.value = match.value;
  }
}

// =========================================================
// Navigation / Routing
// =========================================================
function initNavigation() {
  document.querySelectorAll('.sidebar-nav-item').forEach(item => {
    item.addEventListener('click', () => navigateTo(item.dataset.page));
  });
  document.querySelectorAll('.bottom-nav-item').forEach(item => {
    item.addEventListener('click', () => navigateTo(item.dataset.page));
  });
  document.getElementById('settings-btn')?.addEventListener('click', () => navigateTo('settings'));
}

function navigateTo(page) {
  if (!page) return;

  // Guard branch-specific pages
  const profile = window.USER_PROFILE;
  if (page === 'code' && !window.CODE_BRANCHES?.includes(profile.branchId)) {
    showToast('Code Playground is available for Engineering/BCA/MCA/BSc CS students. Update your profile in Settings.');
    return;
  }
  if (page === 'drug' && !window.PHARMACY_BRANCHES?.includes(profile.branchId)) {
    showToast('Drug Reference is available for Pharmacy students. Update your profile in Settings.');
    return;
  }
  if (page === 'casestudy' && !window.MBA_BRANCHES?.includes(profile.branchId)) {
    showToast('Business Tools is available for BBA/MBA students. Update your profile in Settings.');
    return;
  }

  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));

  // Show target page
  const target = document.getElementById(`page-${page}`);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('fade-in');
    setTimeout(() => target.classList.remove('fade-in'), 400);
  }

  // Update active state
  document.querySelectorAll('.sidebar-nav-item, .bottom-nav-item').forEach(item => {
    const isActive = item.dataset.page === page;
    item.classList.toggle('active', isActive);
  });

  currentPage = page;
  localStorage.setItem('last_page', page);

  if (page === 'dashboard') renderDashboard();
  if (page === 'settings') updateSettingsProfileDisplay();

  window.scrollTo({ top: 0, behavior: 'smooth' });
  window.speechSynthesis?.cancel();
}

// =========================================================
// Language System
// =========================================================
function detectBrowserLanguage() {
  const lang = navigator.language || 'en';
  if (lang.startsWith('mr')) return 'mr';
  if (lang.startsWith('hi')) return 'hi';
  return 'en';
}

function initLanguageToggle() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => switchLanguage(btn.dataset.lang));
  });
  document.querySelectorAll('.lang-option-btn').forEach(btn => {
    btn.addEventListener('click', () => switchLanguage(btn.dataset.lang));
  });
  document.querySelectorAll('.ob-lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.ob-lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      switchLanguage(btn.dataset.lang);
    });
  });
}

function switchLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('app_language', lang);
  if (window.USER_PROFILE) window.USER_PROFILE.language = lang;
  applyLanguage(lang);
  showToast(`Language: ${lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'मराठी'}`);
}

function applyLanguage(lang) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key]) el.textContent = t[key];
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  document.querySelectorAll('.lang-option-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  const taglineEl = document.getElementById('header-tagline');
  if (taglineEl && t.tagline) taglineEl.textContent = t.tagline;
  document.documentElement.lang = lang === 'mr' ? 'mr' : lang === 'hi' ? 'hi' : 'en';
}

function t(key) {
  return (TRANSLATIONS[currentLang] || TRANSLATIONS.en)[key] || key;
}

// =========================================================
// Quick Topics by Branch
// =========================================================
const QUICK_TOPICS_MAP = {
  cse:       ['Linked Lists', 'Binary Search', 'DBMS Normalization', 'OS Scheduling', 'TCP/IP vs UDP', 'OOP Concepts'],
  mechanical:['Carnot Cycle', 'Bernoulli\'s Theorem', 'Stress Strain Curve', 'Manufacturing Processes', 'Gear Trains'],
  civil:     ['Bending Moment Diagram', 'Concrete Mix Design', 'Surveying Methods', 'Soil Bearing Capacity'],
  electrical:['Thevenin Theorem', 'Transformer Working', 'PID Controller', 'Power Factor', 'Induction Motor'],
  extc:      ['Amplitude Modulation', 'Op-Amp Applications', 'CMOS Logic Gates', 'Bluetooth vs WiFi'],
  chemical:  ['Distillation Process', 'Heat Exchanger Types', 'Chemical Reaction Kinetics', 'Distillation'],
  bca:       ['Data Structures Arrays', 'PHP MySQL CRUD', 'HTML CSS Flexbox', 'Java OOP', 'Database Keys'],
  mca:       ['Algorithm Complexity', 'Cloud Computing', 'Machine Learning Basics', 'Data Mining'],
  bba:       ['SWOT Analysis', 'BCG Matrix', 'Consumer Behaviour', 'Marketing Mix 4P', 'Balance Sheet'],
  mba:       ['Porter\'s 5 Forces', 'NPV IRR', 'Supply Chain Management', 'PESTLE Analysis', 'Working Capital'],
  bsc_physics:  ['Newton\'s Laws', 'Planck\'s Quantum Theory', 'Electromagnetic Induction', 'Bernoulli\'s Principle'],
  bsc_chemistry:['Organic Reaction Mechanisms', 'Periodic Trends', 'Equilibrium Constant', 'Electrochemistry'],
  bsc_mathematics: ['Integration by Parts', 'Linear Algebra Eigenvalues', 'Differential Equations', 'Group Theory'],
  bsc_biology: ['Cell Division Mitosis Meiosis', 'DNA Replication', 'Photosynthesis', 'Mendelian Genetics'],
  bpharm:    ['Pharmacokinetics', 'Drug Receptor Interaction', 'Dissolution Rate', 'Beta-Blockers', 'Antibiotics'],
  dpharm:    ['Dosage Forms', 'Pharmacognosy', 'Drug Store Management', 'Hospital Pharmacy'],
  class11:   ['Newton\'s Laws of Motion', 'Cell Biology', 'Financial Statements', 'Demand Supply'],
  class12:   ['Organic Chemistry Reactions', 'Calculus Integration', 'Genetics', 'Electromagnetic Induction'],
};

function renderQuickTopics() {
  const container = document.getElementById('quick-topics');
  if (!container) return;

  const branchId = window.USER_PROFILE?.branchId || 'class12';
  const topics = QUICK_TOPICS_MAP[branchId] || QUICK_TOPICS_MAP.class12;

  container.innerHTML = `
    <div class="quick-topics-label">📌 Popular topics in your branch:</div>
    <div class="quick-topics-chips">
      ${topics.map(topic => `<button class="quick-topic-chip">${topic}</button>`).join('')}
    </div>`;

  container.querySelectorAll('.quick-topic-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const input = document.getElementById('explainer-input');
      if (input) {
        input.value = chip.textContent;
        document.getElementById('explainer-btn')?.click();
      }
    });
  });
}

function initChatQuickPrompts() {
  document.querySelectorAll('.quick-prompt-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const input = document.getElementById('chat-input');
      if (input) {
        input.value = chip.textContent;
        input.focus();
      }
    });
  });
  document.getElementById('chat-export')?.addEventListener('click', exportChat);
}

function exportChat() {
  const history = JSON.parse(localStorage.getItem('chat_history') || '[]');
  if (!history.length) { showToast('No chat history to export!'); return; }
  const text = history.map(h =>
    `[${h.time || ''}] ${h.role === 'user' ? 'You' : 'AI Study Buddy'}:\n${h.content}`
  ).join('\n\n---\n\n');
  navigator.clipboard.writeText(text).then(() => showToast('Chat exported to clipboard! 📋'));
}

// =========================================================
// Onboarding
// =========================================================
let currentSlide = 1;
const TOTAL_SLIDES = 4;

function startOnboarding() {
  const overlay = document.getElementById('onboarding-overlay');
  if (overlay) overlay.classList.remove('hidden');

  document.getElementById('ob-next-btn')?.addEventListener('click', nextSlide);
  document.getElementById('ob-prev-btn')?.addEventListener('click', prevSlide);
  document.getElementById('ob-skip-btn')?.addEventListener('click', () => {
    completeOnboarding();
    openProfileSetup();
  });
  document.getElementById('ob-start-btn')?.addEventListener('click', () => {
    const overlay = document.getElementById('onboarding-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.3s';
      setTimeout(() => { overlay.classList.add('hidden'); overlay.style.opacity = ''; }, 300);
    }
    initProfileSetup();
    openProfileSetup();
  });
  document.querySelectorAll('.ob-dot').forEach(dot => {
    dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.dot)));
  });
}

function nextSlide() {
  if (currentSlide < TOTAL_SLIDES) { currentSlide++; updateSlide(); }
  else {
    const overlay = document.getElementById('onboarding-overlay');
    if (overlay) { overlay.style.opacity = '0'; overlay.style.transition = 'opacity 0.3s'; setTimeout(() => { overlay.classList.add('hidden'); overlay.style.opacity = ''; }, 300); }
    initProfileSetup();
    openProfileSetup();
  }
}
function prevSlide() { if (currentSlide > 1) { currentSlide--; updateSlide(); } }
function goToSlide(s) { currentSlide = s; updateSlide(); }

function updateSlide() {
  document.querySelectorAll('.onboarding-slide').forEach(s => s.classList.remove('active'));
  document.querySelector(`.onboarding-slide[data-slide="${currentSlide}"]`)?.classList.add('active');
  document.querySelectorAll('.ob-dot').forEach(d => d.classList.toggle('active', parseInt(d.dataset.dot) === currentSlide));
  const prevBtn = document.getElementById('ob-prev-btn');
  const nextBtn = document.getElementById('ob-next-btn');
  if (prevBtn) prevBtn.style.visibility = currentSlide === 1 ? 'hidden' : 'visible';
  if (nextBtn) nextBtn.textContent = currentSlide === TOTAL_SLIDES ? 'Set Up Profile 🎓' : 'Next →';
}

function completeOnboarding() {
  localStorage.setItem('app_onboarded', 'true');
  const overlay = document.getElementById('onboarding-overlay');
  if (overlay) { overlay.style.opacity = '0'; overlay.style.transition = 'opacity 0.4s'; setTimeout(() => overlay.classList.add('hidden'), 400); }
}

// =========================================================
// Settings
// =========================================================
function initSettings() {
  document.getElementById('test-tts-btn')?.addEventListener('click', () => {
    const lang = document.getElementById('speech-lang-select')?.value || 'en-IN';
    const text = lang.startsWith('hi') ? 'नमस्ते! मैं AI Study Buddy हूँ।'
      : lang.startsWith('mr') ? 'नमस्कार! मी AI Study Buddy आहे.'
      : 'Hello! I am AI Study Buddy, your free AI study partner!';
    speakText(text, lang);
  });

  document.getElementById('edit-profile-btn')?.addEventListener('click', () => {
    initProfileSetup();
    openProfileSetup();
  });

  document.getElementById('clear-chat-history-btn')?.addEventListener('click', () => {
    if (!confirm('Clear all chat history?')) return;
    localStorage.removeItem('chat_history');
    showToast('Chat history cleared! 🗑️');
  });
  document.getElementById('clear-progress-btn')?.addEventListener('click', () => {
    if (!confirm('Clear all progress data? This cannot be undone!')) return;
    ['user_stats', 'test_scores', 'study_plan'].forEach(k => localStorage.removeItem(k));
    showToast('Progress data cleared!');
  });
  document.getElementById('clear-all-btn')?.addEventListener('click', () => {
    if (!confirm('⚠️ This will delete ALL your data. Are you absolutely sure?')) return;
    const lang = localStorage.getItem('app_language');
    const onboarded = localStorage.getItem('app_onboarded');
    const profile = localStorage.getItem('user_profile');
    localStorage.clear();
    if (lang)     localStorage.setItem('app_language', lang);
    if (onboarded)localStorage.setItem('app_onboarded', onboarded);
    if (profile)  localStorage.setItem('user_profile', profile);
    showToast('All data cleared!');
    location.reload();
  });
}

function checkApiKeyStatus() { /* No-op: keyless */ }

// =========================================================
// Voice: Speech Recognition & TTS
// =========================================================
let recognition = null;

function attachVoiceInput(micBtn, targetInput, context) {
  if (!micBtn || !targetInput) return;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) { micBtn.style.opacity = '0.4'; micBtn.title = 'Voice input not supported'; return; }

  micBtn.addEventListener('click', () => {
    if (recognition) { recognition.stop(); micBtn.classList.remove('recording'); recognition = null; return; }
    recognition = new SpeechRecognition();
    const lang = localStorage.getItem('speech_lang') ||
      (currentLang === 'hi' ? 'hi-IN' : currentLang === 'mr' ? 'mr-IN' : 'en-IN');
    recognition.lang = lang;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => { micBtn.classList.add('recording'); micBtn.textContent = '⏹️'; showToast('Listening...'); };
    recognition.onresult = (e) => { targetInput.value = Array.from(e.results).map(r => r[0].transcript).join(''); };
    recognition.onend = () => { micBtn.classList.remove('recording'); micBtn.textContent = '🎤'; recognition = null; };
    recognition.onerror = (e) => { micBtn.classList.remove('recording'); micBtn.textContent = '🎤'; recognition = null; showToast(`Voice error: ${e.error}`); };
    recognition.start();
  });
}

// =========================================================
// TTS System
// =========================================================
let _activeSpeechBtn  = null;
let _currentUtterance = null;

function speakText(text, lang) { toggleReadAloud(text, lang, null); }

function toggleReadAloud(text, lang, btn) {
  const synth = window.speechSynthesis;
  if (!synth) { showToast('TTS not supported. Try Chrome or Edge.'); return; }
  if (btn && _activeSpeechBtn === btn) {
    if (synth.paused) { synth.resume(); _setBtnState(btn, 'pause'); }
    else if (synth.speaking) { synth.pause(); _setBtnState(btn, 'resume'); }
    else { _startSpeech(text, lang, btn); }
    return;
  }
  if (synth.speaking || synth.paused) { synth.cancel(); _resetSpeechBtn(_activeSpeechBtn); }
  _startSpeech(text, lang, btn);
}

function _startSpeech(text, lang, btn) {
  const synth = window.speechSynthesis;
  const cleanText = text.replace(/<[^>]*>/g, '').trim().substring(0, 3000);
  if (!cleanText) return;
  _currentUtterance = new SpeechSynthesisUtterance(cleanText);
  const settingsLang = document.getElementById('speech-lang-select')?.value;
  _currentUtterance.lang = lang || settingsLang || (currentLang === 'hi' ? 'hi-IN' : currentLang === 'mr' ? 'mr-IN' : 'en-IN');
  _currentUtterance.rate = 0.88; _currentUtterance.pitch = 1.0; _currentUtterance.volume = 1.0;
  _currentUtterance.onstart = () => { _activeSpeechBtn = btn; _setBtnState(btn, 'pause'); };
  _currentUtterance.onend   = () => { _resetSpeechBtn(_activeSpeechBtn); _activeSpeechBtn = null; _currentUtterance = null; };
  _currentUtterance.onerror = (e) => { if (e.error === 'interrupted') return; _resetSpeechBtn(_activeSpeechBtn); _activeSpeechBtn = null; };
  synth.speak(_currentUtterance);
}

function _setBtnState(btn, state) {
  if (!btn) return;
  const s = { pause: { icon: '⏸️', label: 'Pause' }, resume: { icon: '▶️', label: 'Resume' }, speak: { icon: '🔊', label: 'Read Aloud' } }[state] || { icon: '🔊', label: 'Read Aloud' };
  btn.innerHTML = `${s.icon} ${s.label}`;
  btn.classList.toggle('tts-active', state !== 'speak');
}

function _resetSpeechBtn(btn) { if (btn) _setBtnState(btn, 'speak'); }

document.addEventListener('click', (e) => {
  if (e.target.matches('.sidebar-nav-item, .bottom-nav-item')) {
    window.speechSynthesis?.cancel();
    _resetSpeechBtn(_activeSpeechBtn);
    _activeSpeechBtn = null;
  }
});

window.toggleReadAloud = toggleReadAloud;
window.speakText = speakText;

// =========================================================
// Offline Detection
// =========================================================
function initOfflineDetection() {
  const banner = document.getElementById('offline-banner');
  const update = () => { if (banner) banner.classList.toggle('hidden', navigator.onLine); };
  window.addEventListener('online',  update);
  window.addEventListener('offline', update);
  update();
}

// =========================================================
// Toast Notifications
// =========================================================
let toastTimeout;
function showToast(message, duration = 3000) {
  let toast = document.getElementById('global-toast');
  if (!toast) { toast = document.createElement('div'); toast.id = 'global-toast'; toast.className = 'toast'; document.body.appendChild(toast); }
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimeout = setTimeout(() => toast.classList.remove('show'), duration);
}

// =========================================================
// Response cache (last 5 for offline)
// =========================================================
function cacheLastResponse(feature, data) {
  const cache = JSON.parse(localStorage.getItem('response_cache') || '{}');
  cache[feature] = { ...data, cachedAt: Date.now() };
  const keys = Object.keys(cache);
  if (keys.length > 5) delete cache[keys[0]];
  localStorage.setItem('response_cache', JSON.stringify(cache));
}

function loadCachedResponses() {
  if (!navigator.onLine) {
    const cache = JSON.parse(localStorage.getItem('response_cache') || '{}');
    if (cache.explainer) {
      const results = document.getElementById('explainer-results');
      const input   = document.getElementById('explainer-input');
      if (results && cache.explainer.response && input) {
        input.value = cache.explainer.topic || '';
        results.innerHTML = `
          <div class="ai-card" style="border-left-color:var(--amber);">
            <div class="ai-card-header">
              <span class="ai-card-icon">📱</span>
              <div class="ai-card-title">Cached Response (Offline Mode)</div>
            </div>
            <div class="ai-card-body">${markdownToHtml(cache.explainer.response)}</div>
          </div>`;
      }
    }
  }
}

// =========================================================
// Markdown to HTML
// =========================================================
function markdownToHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/```[\w]*\n?([\s\S]*?)```/g, '<pre class="code-block"><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code style="background:var(--bg);padding:2px 6px;border-radius:4px;font-family:monospace;font-size:13px;">$1</code>')
    .replace(/^####\s+(.+)$/gm, '<h5 style="font-weight:700;color:var(--navy);margin:12px 0 4px;font-size:13px;">$1</h5>')
    .replace(/^###\s+(.+)$/gm,  '<h4 style="font-weight:700;color:var(--navy);margin:14px 0 6px;font-size:14px;">$1</h4>')
    .replace(/^##\s+(.+)$/gm,   '<h3 style="font-weight:700;color:var(--navy);margin:16px 0 8px;font-size:16px;border-bottom:2px solid var(--border);padding-bottom:4px;">$1</h3>')
    .replace(/^#\s+(.+)$/gm,    '<h2 style="font-weight:700;color:var(--navy);margin:18px 0 10px;font-size:18px;">$1</h2>')
    .replace(/^\|\s*.+\s*\|.*$/gm, (row) => {
      const cells = row.split('|').filter(c => c.trim());
      return '<tr>' + cells.map(c => `<td style="border:1px solid var(--border);padding:6px 10px;">${c.trim()}</td>`).join('') + '</tr>';
    })
    .replace(/(<tr>.*<\/tr>\s*)+/gs, m => `<table style="border-collapse:collapse;width:100%;margin:8px 0;">${m}</table>`)
    .replace(/^[-•]\s+(.+)$/gm, '<li style="margin-bottom:6px;">$1</li>')
    .replace(/(<li[^>]*>.*<\/li>\s*)+/gs, m => `<ul style="padding-left:20px;margin:8px 0">${m}</ul>`)
    .replace(/^\d+\.\s+(.+)$/gm, '<li style="margin-bottom:6px;">$1</li>')
    .replace(/\n\n/g, '</p><p style="margin:10px 0">')
    .replace(/\n/g, '<br/>')
    .trim();
}

function escHTML(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

// =========================================================
// Error Cards
// =========================================================
function buildErrorCard(errorMsg) {
  return `
    <div class="ai-card fade-in" style="border-left-color:var(--error);">
      <div class="ai-card-header">
        <span class="ai-card-icon">⚠️</span>
        <div class="ai-card-title">AI अभी थोड़ा व्यस्त है / AI is busy right now</div>
      </div>
      <div class="ai-card-body">
        <p>एक मिनट बाद कोशिश करें। / Please try again in a moment.</p>
        <p style="font-size:12px;color:var(--text-secondary);margin-top:6px;">Error: ${escHTML(errorMsg)}</p>
      </div>
      <div class="ai-card-footer">
        <button class="btn-primary" id="retry-btn">🔄 Try Again</button>
      </div>
    </div>`;
}

function buildApiWarningCard() {
  return `
    <div class="api-warning-card fade-in">
      <div class="api-warning-icon">⚠️</div>
      <div class="api-warning-title">Internet Connection Needed</div>
      <div class="api-warning-desc">
        Please check your internet connection.<br/>
        <em>AI Study Buddy is completely free — no API key required!</em>
      </div>
      <button class="btn-primary" onclick="location.reload()" style="margin-top:8px;">🔄 Refresh</button>
    </div>`;
}

// =========================================================
// Extract section from AI response
// =========================================================
function extractSection(text, sectionName) {
  const regex = new RegExp(`##?\\s*${sectionName}[^\\n]*\\n([\\s\\S]*?)(?=##?\\s*SECTION|##?\\s*ENCOURAGING|$)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}

// =========================================================
// Stats tracking
// =========================================================
function trackStat(key) {
  const stats = JSON.parse(localStorage.getItem('user_stats') || '{}');
  stats[key] = (stats[key] || 0) + 1;
  const weekKey = `week_${getWeekNumber()}`;
  stats[weekKey] = stats[weekKey] || {};
  stats[weekKey][key] = (stats[weekKey][key] || 0) + 1;

  // Study day tracking
  const today = new Date().toISOString().split('T')[0];
  if (!stats.study_days) stats.study_days = {};
  stats.study_days[today] = true;

  localStorage.setItem('user_stats', JSON.stringify(stats));
}

function getWeekNumber() {
  const d = new Date(), onejan = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d - onejan) / 86400000 + onejan.getDay() + 1) / 7);
}

// =========================================================
// Expose globals to feature modules
// =========================================================
window.navigateTo         = navigateTo;
window.showToast          = showToast;
window.speakText          = speakText;
window.markdownToHtml     = markdownToHtml;
window.escHTML            = escHTML;
window.trackStat          = trackStat;
window.buildApiWarningCard = buildApiWarningCard;
window.buildErrorCard     = buildErrorCard;
window.attachVoiceInput   = attachVoiceInput;
window.cacheLastResponse  = cacheLastResponse;
window.extractSection     = extractSection;
window.calculateStreak    = calculateStreak;
window.flipCard           = flipCard;
window.rateCard           = rateCard;
window.nextCard           = nextCard;
window.prevCard           = prevCard;
window.restartFlashcards  = restartFlashcards;
window.practiceOnly       = practiceOnly;
window.showSavedDecks     = showSavedDecks;
window.loadDeck           = loadDeck;
window.deleteDeck         = deleteDeck;
window.askSimpler         = askSimpler;
window.openProfileSetup   = openProfileSetup;
