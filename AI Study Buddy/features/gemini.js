/* =====================================================
   AI ENGINE v2.0 — Pollinations.ai (OpenAI-compatible)
   Best free reasoning model — no API key needed
   Model: openai (GPT-OSS via gen.pollinations.ai)
   Updated: April 2026 — new unified API endpoint
   ===================================================== */

// New unified OpenAI-compatible endpoint (primary)
const POLLINATIONS_URL     = 'https://gen.pollinations.ai/v1/chat/completions';
// Legacy endpoint kept as fallback
const POLLINATIONS_URL_OLD = 'https://text.pollinations.ai/';

// ── System Persona — Profile-Aware ──────────────────────
function buildSystemPersona() {
  const profile = window.USER_PROFILE || {};
  const branch  = profile.branchLabel || 'General';
  const sem     = profile.semester    || 'current semester';
  const lang    = profile.language    || 'English';
  const medium  = profile.medium      || 'Mixed medium';
  const uni     = profile.university  || 'their university';

  return `You are "AI Study Buddy" — India's most knowledgeable, warm, and encouraging AI academic assistant. You are like a brilliant, patient older sibling who studied the same course and genuinely wants their younger sibling to succeed.

STUDENT PROFILE:
- Branch / Course: ${branch}
- Current Semester / Year: ${sem}
- Language background: ${medium}
- Preferred language: ${lang}
- University / Board: ${uni}

YOUR COMMUNICATION RULES:
1. If the student wrote in Hindi → respond ENTIRELY in simple Hindi
2. If the student wrote in Marathi → respond ENTIRELY in simple Marathi
3. If the student wrote in English → respond in simple, clear English
4. If mixed languages → respond in simple Hindi
5. ALWAYS use real Indian examples: chai, cricket, dal-roti, rickshaw, IRCTC, Aadhaar, farming, monsoon, IPL, Bollywood, local markets — whatever makes the concept click
6. NEVER make the student feel stupid. Frame everything positively and encouragingly
7. For Marathi/Hindi medium background students: acknowledge that English terminology is new and explain even more carefully
8. If you must use a technical English term, immediately explain it in brackets: e.g., "Photosynthesis (प्रकाश संश्लेषण — सूरज की रोशनी से पौधे खाना बनाते हैं)"
9. Structure all responses with clear sections so students can scan
10. End every response with one line of genuine encouragement in Hindi or Marathi

BRANCH-SPECIFIC RULES:
- Engineering/CSE/BCA/MCA: Include code examples when needed. Use pseudocode before actual code. Explain algorithms step by step.
- Pharmacy: Always mention mechanism in simple terms. Use body-as-factory analogies. Always add: "⚠️ For educational purposes only — consult a doctor/pharmacist for actual medical advice."
- MBA/BBA: Use Indian company examples (Amul, Tata, Reliance, Zomato, Ola, IRCTC, Flipkart). Frame in practical business decisions.
- BSc Science: Link theory to real-world applications. Use Indian scientific achievements where possible.
- All branches: Tell students what topics are typically asked in exams and what marks they carry.

FORMATTING:
- Use ## for section headings
- Use **bold** for key terms
- Use bullet points for lists
- Keep paragraphs short (3-4 sentences max)
- Use code blocks for code/pseudocode`;
}

// Backward compatible — used by prompts that inline the persona
const SYSTEM_PERSONA = buildSystemPersona();

// ── Language detection ───────────────────────────────────
function detectInputLanguage(text) {
  if (!text) return 'en';
  const devanagari = (text.match(/[\u0900-\u097F]/g) || []).length;
  const total = text.length;
  if (devanagari / total > 0.2) {
    const marathiWords = ['आहे', 'आहेत', 'करा', 'कर', 'माझा', 'माझी', 'तुमचा', 'कारण', 'सांगा', 'जाऊ', 'येतो', 'नाही', 'काय', 'कसे'];
    const isMarathi = marathiWords.some(w => text.includes(w));
    return isMarathi ? 'mr' : 'hi';
  }
  return 'en';
}

// ── Core AI call — Pollinations.ai (OpenAI-compatible, no key) ──
async function callGemini(prompt, temperature = 0.7, maxTokens = 2500) {
  const persona = buildSystemPersona(); // Always use fresh profile-aware persona

  const body = JSON.stringify({
    messages: [
      { role: 'system', content: persona },
      { role: 'user',   content: prompt }
    ],
    model: 'openai',          // Current model name on gen.pollinations.ai
    temperature: temperature,
    max_tokens: maxTokens,
    private: true
  });

  // --- Primary: new gen.pollinations.ai endpoint ---
  let response;
  try {
    response = await fetch(POLLINATIONS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    });
  } catch (networkErr) {
    // Network failure — fall through to legacy endpoint
    response = null;
  }

  // --- Fallback: legacy text.pollinations.ai endpoint ---
  if (!response || !response.ok) {
    const legacyBody = JSON.stringify({
      messages: [
        { role: 'system', content: persona },
        { role: 'user',   content: prompt }
      ],
      model: 'openai',
      temperature: temperature,
      max_tokens: maxTokens,
      private: true
    });
    response = await fetch(POLLINATIONS_URL_OLD, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: legacyBody
    });
  }

  if (!response.ok) {
    throw new Error(`Server error (${response.status}). Please try again.`);
  }

  // New API returns OpenAI-style JSON; legacy returns plain text
  const raw = await response.text();
  if (!raw || raw.trim().length < 5) throw new Error('Empty response. Please try again.');

  // Try to parse as OpenAI-style JSON first
  try {
    const json = JSON.parse(raw);
    if (json?.choices?.[0]?.message?.content) {
      return json.choices[0].message.content;
    }
  } catch (_) { /* Not JSON — treat as plain text (legacy endpoint) */ }

  return raw;
}

// ── Fallback with retry (for robustness) ─────────────────
async function callAI(prompt, temperature = 0.7, maxTokens = 2500, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await callGemini(prompt, temperature, maxTokens);
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
}

// ── Dedicated JSON caller — minimal persona, low temp, json_object mode ──
// Use this for Mock Test / Flashcards / Planner where response MUST be JSON.
async function callAIJson(prompt, maxTokens = 3500) {
  const SYSTEM_JSON = `You are a JSON generator for an Indian educational app.
Output ONLY valid, complete JSON — no markdown, no code fences, no explanation.
Do not truncate the JSON. Do not add any text before or after the JSON object.`;

  const makeBody = (url) => JSON.stringify({
    messages: [
      { role: 'system', content: SYSTEM_JSON },
      { role: 'user',   content: prompt }
    ],
    model: 'openai',
    temperature: 0.2,      // Low temperature = deterministic, well-formed JSON
    max_tokens: maxTokens,
    private: true,
    response_format: { type: 'json_object' }  // Force JSON mode if supported
  });

  // Try primary endpoint
  let response;
  try {
    response = await fetch(POLLINATIONS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: makeBody(POLLINATIONS_URL)
    });
  } catch (_) { response = null; }

  // Fallback to legacy endpoint (without response_format)
  if (!response || !response.ok) {
    const legacyBody = JSON.stringify({
      messages: [
        { role: 'system', content: SYSTEM_JSON },
        { role: 'user',   content: prompt }
      ],
      model: 'openai',
      temperature: 0.2,
      max_tokens: maxTokens,
      private: true
    });
    response = await fetch(POLLINATIONS_URL_OLD, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: legacyBody
    });
  }

  if (!response || !response.ok) {
    throw new Error(`Server error (${response?.status}). Please try again.`);
  }

  const raw = await response.text();
  if (!raw || raw.trim().length < 5) throw new Error('Empty response.');

  // Parse OpenAI-style wrapper if present
  try {
    const json = JSON.parse(raw);
    if (json?.choices?.[0]?.message?.content) {
      return json.choices[0].message.content;
    }
    // Already the JSON object we want
    return JSON.stringify(json);
  } catch (_) {}

  return raw;
}

// ── Prompt: Topic Explainer (Profile-Aware) ──────────────
function buildExplainerPrompt(topic, classLevel, board) {
  const profile = window.USER_PROFILE || {};
  const branch  = profile.branchLabel || classLevel || 'Class 12';
  const uni     = profile.university  || board || 'Maharashtra HSC';

  return `A student studying ${branch} at ${uni} needs help with: "${topic}"

Please provide a COMPLETE study guide with ALL these sections. Use these EXACT headers:

## SECTION A — Simple Explanation 💡
Explain in very simple language, like talking to a 16-year-old. Use at least ONE real-life Indian analogy (chai, cricket, auto-rickshaw, farming, local markets, monsoon, factory, etc.). Write like a friendly elder sibling — not a textbook. Minimum 150 words.

## SECTION B — Key Terms Glossary 📖
List every difficult English word in this topic. For EACH word:
- **Word**: [term]
- **Simple English**: [easy definition]
- **हिंदी में**: [Hindi meaning]
- **मराठी मध्ये**: [Marathi meaning]
- **Example**: [one real example sentence]
List at least 5-8 terms.

## SECTION C — Formula / Structure Sheet 📐
${profile.branchId && (window.FORMULA_BRANCHES || []).includes(profile.branchId)
  ? 'Show the key formulas, equations, or frameworks for this topic. For engineering/science: mathematical formulas. For pharmacy: pharmacokinetic equations or drug structure. For MBA: key frameworks like SWOT, BCG etc. shown as a simple table.'
  : 'Show 2-3 key points, frameworks, or structured summaries that students must memorize for exams.'}

## SECTION D — Memory Tricks 🧠
Give 1-2 creative mnemonics or memory tricks. Preferably use Hindi or Marathi words in the trick — this helps mother-tongue students remember better. Be creative and fun!

## SECTION E — Practice Questions 📝
Generate EXACTLY 10 questions:

**Fill in the Blanks (4 questions):**
1. [question with ______]
2. [question with ______]
3. [question with ______]
4. [question with ______]

**Short Answer (3 questions):**
5. [2-3 line answer expected]
6. [2-3 line answer expected]
7. [2-3 line answer expected]

**MCQ (2 questions):**
8. [question]
(A) option1  (B) option2  (C) option3  (D) option4

9. [question]
(A) option1  (B) option2  (C) option3  (D) option4

**Explain in your own words (1 question):**
10. [open-ended question]

## SECTION F — Exam Tips 🎯
Give 2-3 SPECIFIC tips on how this topic is typically asked in ${uni} exams. What key phrases must be included. What mistakes to avoid. Be practical and specific.

## SECTION G — Previous Year Questions 📋
Generate 3 questions in the style of actual previous year papers for ${uni}. Format them exactly like a real exam paper.

## ENCOURAGING MESSAGE 🌟
End with a short motivational message in Hindi or Marathi, 1-2 sentences.

Remember: If the topic was given in Hindi or Marathi, give the main explanation in that language but keep section headers in English.`;
}

// ── Prompt: Language Bridge Translator ───────────────────
function buildTranslatorPrompt(text) {
  return `A Marathi/Hindi medium student needs help understanding this English text from their textbook:

"${text}"

Please provide ALL of the following:

## हिंदी अनुवाद (Hindi Translation)
Translate into simple, clear Hindi. Use everyday words — not formal/literary Hindi. Natural and easy to understand.

## मराठी भाषांतर (Marathi Translation)
Translate into simple, clear, conversational Marathi.

## Simplified English Version
Rewrite in VERY SIMPLE English. Only common vocabulary. Short sentences. As if explaining to a beginner English learner.

## Key Vocabulary List (महत्वाचे शब्द)
Extract the most difficult English words. For each:
- **Word**: [term]
- Hindi: [meaning]
- Marathi: [meaning]
- Example: [simple sentence]
List at least 5 words.

End with: "अगर कोई और शब्द समझ नहीं आया, तो बेझिझक पूछें! / आणखी काही समजलं नाही तर विचारा!"`;
}

// ── Prompt: Mock Test ────────────────────────────────────
function buildMockTestPrompt(subject, topic, classLevel, board, duration) {
  // Reduced counts so JSON fits within token budget reliably
  const numQ = duration === '10' ? 8 : duration === '20' ? 10 : 12;
  const mcqCount  = Math.ceil(numQ * 0.4);
  const fillCount = Math.ceil(numQ * 0.3);
  const shortCount = numQ - mcqCount - fillCount;
  const profile = window.USER_PROFILE || {};
  const uni = profile.university || board || 'University';

  return `You are a JSON generator. Generate an exam-style mock test.
Subject: ${subject}, Topic: "${topic}", Level: ${classLevel}, University: ${uni}.
Total questions: ${numQ} (${mcqCount} MCQ, ${fillCount} fill-in-blank, ${shortCount} short answer).

Return ONLY this JSON structure, nothing else:

{
  "title": "Mock Test: ${topic}",
  "subject": "${subject}",
  "class": "${classLevel}",
  "board": "${uni}",
  "duration": ${duration},
  "total_marks": ${numQ},
  "questions": [
    {
      "id": 1,
      "type": "mcq",
      "text": "Question?",
      "options": ["A", "B", "C", "D"],
      "correct": 0,
      "explanation": "Brief reason.",
      "marks": 1
    },
    {
      "id": 2,
      "type": "fill",
      "text": "_______ is the concept of hiding data.",
      "correct_answer": "Encapsulation",
      "explanation": "Brief reason.",
      "marks": 1
    },
    {
      "id": 3,
      "type": "short",
      "text": "Define inheritance in 2-3 lines.",
      "model_answer": "Sample answer.",
      "explanation": "Key points to mention.",
      "marks": 2
    }
  ]
}

RULES:
- Keep explanations SHORT (1 sentence max).
- Generate exactly ${numQ} questions total.
- Do NOT add any text before or after the JSON.
- Ensure the JSON is complete and valid.`;
}

// ── Prompt: Chat / Doubt Solver ──────────────────────────
function buildChatPrompt(history, userMessage) {
  const lang = detectInputLanguage(userMessage);
  const langInstr = lang === 'hi'
    ? 'The student wrote in Hindi. Respond ENTIRELY in simple Hindi.'
    : lang === 'mr'
    ? 'The student wrote in Marathi. Respond ENTIRELY in simple Marathi.'
    : 'The student wrote in English. Respond in clear, simple English.';

  const historyText = history.slice(-6).map(h =>
    `${h.role === 'user' ? 'Student' : 'AI Study Buddy'}: ${h.content}`
  ).join('\n');

  const profile = window.USER_PROFILE || {};
  const branchCtx = profile.branchLabel
    ? `NOTE: The student is studying ${profile.branchLabel}. Keep your answer relevant to that branch.`
    : '';

  return `${langInstr}
${branchCtx}

Previous conversation:
${historyText}

Student's question: "${userMessage}"

Answer clearly and warmly. Use Indian examples. Structure if multiple points. End with encouragement.`;
}

// ── Prompt: Study Planner ────────────────────────────────
function buildPlannerPrompt(subject, examDate, topics, prepLevel) {
  const today = new Date().toISOString().split('T')[0];
  const daysDiff = Math.max(1, Math.ceil((new Date(examDate) - new Date(today)) / (1000*60*60*24)));
  const profile = window.USER_PROFILE || {};
  const branch = profile.branchLabel || 'General';

  return `Create a practical day-by-day study plan for a ${branch} student.

Subject: ${subject}
Exam Date: ${examDate} (${daysDiff} days from today: ${today})
Topics to cover: ${topics}
Current preparation level: ${prepLevel}/5 stars

Return ONLY valid JSON:

{
  "subject": "${subject}",
  "exam_date": "${examDate}",
  "total_days": ${daysDiff},
  "prep_level": ${prepLevel},
  "overall_strategy": "2-3 sentence summary of study strategy for this student",
  "daily_plans": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "focus": "Topic name",
      "what_to_study": "What exactly to study today — be specific",
      "duration_hours": 2,
      "technique": "Technique name (Reading/Practice/Problems/Revision/Mock Test)",
      "tip": "A quick practical tip for today"
    }
  ]
}

Rules:
- Last 2 days: Revision only, no new topics
- Day before exam: Light revision + rest
- Spread topics evenly by importance
- Include revision cycles (after every 5 days, revise old topics)
- For prep level 1-2: More time on basics. For 4-5: Focus on practice and mock tests.
Return ONLY valid JSON.`;
}

// ── Prompt: Flashcard Generator ──────────────────────────
function buildFlashcardPrompt(topic) {
  const profile = window.USER_PROFILE || {};
  const branch = profile.branchId || '';

  let cardType = '';
  if (window.PHARMACY_BRANCHES && window.PHARMACY_BRANCHES.includes(branch)) {
    cardType = 'For pharmacy: Front = drug name, Back = drug class + mechanism + key side effect + dosage form';
  } else if (window.MBA_BRANCHES && window.MBA_BRANCHES.includes(branch)) {
    cardType = 'For management: Front = business term/concept, Back = definition + Indian company example + exam formula';
  } else if (window.CODE_BRANCHES && window.CODE_BRANCHES.includes(branch)) {
    cardType = 'For CS/IT: Front = concept/algorithm name, Back = pseudocode + time complexity + real use-case';
  } else if (window.SCIENCE_BRANCHES && window.SCIENCE_BRANCHES.includes(branch)) {
    cardType = 'For science: Front = formula name / concept, Back = formula + what each variable means + real example';
  } else {
    cardType = 'Front = English term/concept, Back = Hindi/Marathi explanation + real-life example';
  }

  return `Generate 15-20 smart flashcards for: "${topic}"

Card type guidance: ${cardType}

Output ONLY valid JSON:
{
  "topic": "${topic}",
  "cards": [
    {
      "id": 1,
      "front": "English term or concept or question",
      "back_english": "Simple English explanation (2-3 sentences max)",
      "back_hindi": "Hindi explanation (आसान भाषा में 1-2 वाक्य)",
      "back_marathi": "Marathi explanation (सोप्या भाषेत 1-2 वाक्य)",
      "example": "One real Indian life example sentence"
    }
  ]
}

Make cards: one idea per card, simple language, include Indian examples, mix foundational and advanced.
Return ONLY valid JSON.`;
}

// ── Prompt: Code Helper ──────────────────────────────────
function buildCodeHelperPrompt(code, language, task, description = '') {
  const tasks = {
    explain:  `Explain EVERY line of this ${language} code in simple language. Number each line group. Use simple Hindi/English. Explain what it does like talking to a beginner:`,
    debug:    `Find ALL bugs in this ${language} code. For each bug: (1) What line it's on, (2) What the bug is, (3) Why it causes a problem, (4) The corrected code. Then show the full corrected version:`,
    improve:  `Suggest improvements for this ${language} code. Show: (1) What to change and why, (2) The improved version with comments. Focus on readability, efficiency, and best practices:`,
    write:    `Write complete ${language} code for this requirement: "${description}"\n\nInclude: comments explaining each section, sample input/output, and a brief explanation of how it works.`,
    convert:  `Convert this code to ${description || 'Python'}. Show both original and converted version side by side with explanations:`
  };

  const taskPrompt = tasks[task] || `Help with this ${language} code:`;

  return `${taskPrompt}

\`\`\`${language}
${code}
\`\`\`

Remember: Explain in simple language. Use comments. Make it easy for a student from Marathi/Hindi medium background to understand.`;
}

// ── Prompt: Formula Library ──────────────────────────────
function buildFormulaLibraryPrompt(topic, branch) {
  return `Generate a comprehensive formula/concept sheet for: "${topic}" for ${branch} students.

Format your response as:

## 📐 Key Formulas & Equations

For each formula:

### Formula Name
**Formula:** [Write the formula clearly, e.g., F = ma]
**Variables:**
- [Variable 1] = [What it means] (Unit: [unit])
- [Variable 2] = [What it means] (Unit: [unit])

**Simple Explanation:** [Explain in 1-2 simple sentences with Indian analogy]
**When to Use:** [When do you apply this formula?]
**Common Mistake:** [One mistake students often make]
**Example:** [One solved numerical example with steps]

---

List ALL important formulas for this topic. Make it exam-ready.
End with: "## 💡 Quick Memory Tips" — 2-3 tricks to remember these formulas.`;
}

// ── Prompt: Drug Reference ───────────────────────────────
function buildDrugReferencePrompt(drugName) {
  return `Provide complete educational information about the drug: "${drugName}"

## 💊 Drug Profile: ${drugName}

### Basic Information
- **Drug Class / Category:**
- **Generic Name:** 
- **Common Brand Names in India:**

### Mechanism of Action (कैसे काम करती है)
[Explain how the drug works in the body. Use a simple analogy — like comparing the body to a factory, and the drug to a worker/key/blocker. Keep it simple for pharmacy students.]

### Indications (किस बीमारी में उपयोग)
[List what conditions/diseases it treats]

### Contraindications (कब नहीं देनी चाहिए)
[When should this drug NOT be given]

### Side Effects (दुष्प्रभाव)
[Common and important side effects]

### ADME (Pharmacokinetics)
- **Absorption (अवशोषण):** 
- **Distribution (वितरण):**
- **Metabolism (मेटाबॉलिज्म):**
- **Excretion (उत्सर्जन):**

### Dosage Forms Available
[Tablets, injections, syrups, etc. available in India]

### Key Points for GPAT / University Exam
[3-5 most important points that are commonly asked in exams]

⚠️ **DISCLAIMER:** This information is for EDUCATIONAL PURPOSES ONLY. For actual patient care, always consult a licensed pharmacist or doctor.

End with one line of encouragement for pharmacy students in Hindi/Marathi.`;
}

// ── Prompt: Case Study & MBA Tools ──────────────────────
function buildCaseStudyPrompt(caseText) {
  return `Analyze this business case study for an MBA/BBA student:

"${caseText}"

Provide a complete analysis:

## 🏢 Case Study Analysis

### 1. Key Stakeholders (मुख्य पक्षकार)
List who is affected and how.

### 2. Core Problem Identification (मुख्य समस्या)
What is the central business problem? Be specific.

### 3. SWOT Analysis
| | **Strengths** | **Weaknesses** |
|---|---|---|
| **Internal** | [List strengths] | [List weaknesses] |

| | **Opportunities** | **Threats** |
|---|---|---|
| **External** | [List opportunities] | [List threats] |

### 4. Possible Solutions (संभावित समाधान)
For each solution: Brief description + Pros + Cons

### 5. Recommended Solution (अनुशंसित समाधान)
Which solution is best and WHY. Support with business logic.

### 6. What the Examiner Expects
[3-4 specific points that MBA professors look for in exam answers]

### 7. Key Frameworks Applied
[Which frameworks: Porter's 5 Forces / BCG Matrix / Ansoff Matrix / etc. — and why they apply]

Use Indian company examples where relevant (Tata, Reliance, Amul, Zomato, Ola, Flipkart).`;
}

// ── Prompt: Placement & Career Prep ─────────────────────
function buildPlacementPrompt(type, userText) {
  const profile = window.USER_PROFILE || {};
  const branch = profile.branchLabel || 'Engineering';

  const prompts = {
    aptitude: `Generate 10 aptitude questions (mix of Quantitative, Logical Reasoning, Verbal Ability) in the style of TCS / Infosys / Wipro / Cognizant campus placement 2024.

For each question: Question + 4 options + Correct answer + DETAILED SOLUTION with formula/logic explained simply in Hindi/English.

Topic/Area: "${userText || 'Mixed Aptitude'}"`,

    technical: `Generate 10 ${branch} technical interview questions at campus placement level.

Topic: "${userText || 'Core subjects'}"

For each question: Concept question + Ideal answer (3-5 lines) + Key points to mention + Common mistake candidates make.
Use examples relevant to ${branch} students.`,

    hr: `Generate 8 common HR interview questions with ideal model answers specifically written for:
- A ${branch} student
- From Marathi/Hindi medium background
- Appearing for campus placements in India

Question: "${userText || 'Tell me about yourself'}"

For each HR question:
1. The question
2. How to think about it (framework)
3. A model answer in simple, professional English
4. Tips for students who think in Marathi/Hindi but need to answer in English`,

    resume: `Write 5 strong, ATS-friendly resume bullet points for a ${branch} student's resume based on:

"${userText}"

Each bullet point should:
- Start with a strong action verb
- Include quantifiable impact where possible  
- Be 1-2 lines max
- Be suitable for Indian campus recruitment
- Sound professional and confident`,

    gate: `Generate 5 GATE-level questions for ${branch} on: "${userText}"

For each question: Technical question + 4 options + Correct answer + Detailed explanation with derivation/logic.
Mark the expected GATE difficulty level (Easy/Medium/Hard).`
  };

  return prompts[type] || `Help a ${branch} student with placement preparation for: "${userText}"`;
}

// ── Prompt: Notes Digitizer ──────────────────────────────
function buildNotesDigitizerPrompt(notesDescription) {
  return `A student has shared their handwritten notes (described below). Help them digitize and organize this content.

Notes Content:
"${notesDescription}"

Please provide:

## 📝 Digitized Notes

### Summary (Quick Overview)
[2-3 sentence summary of what these notes cover]

### Key Points (मुख्य बिंदु)
[List the most important points from the notes, well-organized]

### Detailed Content
[Expand and clarify each point from the notes in a clear, structured format]

### 5 Practice Questions
Based on these notes, generate 5 exam-style questions with answers:
1. [Question] — Answer: [answer]

### Quick Flashcards (5 cards)
Front: [Term/Concept] → Back: [Explanation in Hindi/English]

End with study tips specific to this topic.`;
}

// ── Motivational quotes ───────────────────────────────────
const QUOTES = [
  { hi: 'शिक्षा सबसे शक्तिशाली हथियार है जिसे आप दुनिया बदलने के लिए उपयोग कर सकते हैं। — नेल्सन मंडेला', mr: 'शिक्षण हे सर्वात शक्तिशाली शस्त्र आहे ज्याने तुम्ही जगाला बदलू शकता. — Nelson Mandela', en: 'Education is the most powerful weapon you can use to change the world. — Nelson Mandela' },
  { hi: 'सपने वो नहीं जो नींद में आएं, सपने वो हैं जो नींद न आने दें। — APJ Abdul Kalam', mr: 'स्वप्न म्हणजे झोपेत दिसणारे नाही; स्वप्न म्हणजे जे झोपू देत नाही. — APJ Abdul Kalam', en: 'Dream is not what you see in sleep; dream is what does not let you sleep. — APJ Abdul Kalam' },
  { hi: 'शिक्षित बनो, संगठित रहो, संघर्ष करो। — डॉ. बाबासाहेब आम्बेडकर', mr: 'शिका, संघटित व्हा, संघर्ष करा. — डॉ. बाबासाहेब आंबेडकर', en: 'Educate, Agitate, Organize. — Dr. B.R. Ambedkar' },
  { hi: 'अपनी भाषा में सोचो, अंग्रेजी में लिखो — दोनों तुम्हारी ताकत हैं।', mr: 'आपल्या भाषेत विचार करा, इंग्रजीत लिहा — दोन्ही तुमची शक्ती आहे.', en: 'Think in your language, write in English — both are your superpowers.' },
  { hi: 'मराठी माध्यम की नींव तुम्हारी सबसे बड़ी ताकत है।', mr: 'मराठी माध्यमाचा पाया तुमची सर्वात मोठी ताकद आहे.', en: 'Your mother-tongue foundation is your greatest strength.' },
  { hi: 'हर विशेषज्ञ एक बार शुरुआती था। हिम्मत मत हारो।', mr: 'प्रत्येक तज्ञ एकेकाळी नवशिखा होता. हिम्मत ठेवा.', en: 'Every expert was once a beginner. Never give up.' },
  { hi: 'पढ़ाई में लगा समय कभी बर्बाद नहीं होता। — Chhatrapati Shivaji Maharaj spirit', mr: 'अभ्यासात घालवलेला वेळ कधीही वाया जात नाही.', en: 'Time spent in learning is never wasted.' },
  { hi: 'बड़े सपने देखो, कड़ी मेहनत करो, सफलता जरूर मिलेगी।', mr: 'मोठी स्वप्न पहा, कठोर परिश्रम करा, यश नक्की मिळेल.', en: 'Dream big, work hard, success will follow.' },
  { hi: 'हर दिन थोड़ा-थोड़ा पढ़ो — पहाड़ भी एक कदम से चढ़ा जाता है।', mr: 'रोज थोडं थोडं शिका — डोंगरही एक पाऊल टाकूनच चढतात.', en: 'Study a little each day — even mountains are climbed one step at a time.' },
  { hi: 'जो आज मेहनत करता है, कल वो इतिहास बनाता है।', mr: 'जो आज कष्ट करतो, तो उद्या इतिहास घडवतो.', en: 'Those who work hard today will make history tomorrow.' },
  { hi: 'अंग्रेजी एक भाषा है, ज्ञान तुम्हारे भीतर है।', mr: 'इंग्रजी एक भाषा आहे, ज्ञान तुमच्याच आत आहे.', en: 'English is just a language; the knowledge is already inside you.' },
  { hi: 'कड़ी मेहनत का कोई विकल्प नहीं — यह सफलता की एकमात्र कुंजी है।', mr: 'कठोर परिश्रमाला कोणताही पर्याय नाही — हीच यशाची गुरुकिल्ली आहे.', en: 'There is no substitute for hard work — it is the only key to success.' }
];

const LOADING_MESSAGES = [
  'AI सोच रहा है... / AI विचार करत आहे... / AI is thinking...',
  'तुम्हारे लिए उत्तर बना रहा है... / Preparing your answer...',
  'बस एक पल और... / Just a moment more... / थोडा वेळ...',
  'लगभग तैयार है... / तयार होत आहे... / Almost ready...'
];

function getRandomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

function startLoadingMessages(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return null;
  let i = 0;
  el.textContent = LOADING_MESSAGES[0];
  const interval = setInterval(() => {
    i = (i + 1) % LOADING_MESSAGES.length;
    el.textContent = LOADING_MESSAGES[i];
  }, 1800);
  return interval;
}

function stopLoadingMessages(interval) {
  if (interval) clearInterval(interval);
}

// ── Calculate streak ─────────────────────────────────────
function calculateStreak(completedDays) {
  if (!completedDays || !Object.keys(completedDays).length) return 0;
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    if (completedDays[key]) streak++;
    else if (i > 0) break;
  }
  return streak;
}

// Expose globally
window.callGemini              = callGemini;
window.callAI                  = callAI;
window.callAIJson              = callAIJson;
window.detectInputLanguage     = detectInputLanguage;
window.buildExplainerPrompt    = buildExplainerPrompt;
window.buildTranslatorPrompt   = buildTranslatorPrompt;
window.buildMockTestPrompt     = buildMockTestPrompt;
window.buildChatPrompt         = buildChatPrompt;
window.buildPlannerPrompt      = buildPlannerPrompt;
window.buildFlashcardPrompt    = buildFlashcardPrompt;
window.buildCodeHelperPrompt   = buildCodeHelperPrompt;
window.buildFormulaLibraryPrompt = buildFormulaLibraryPrompt;
window.buildDrugReferencePrompt  = buildDrugReferencePrompt;
window.buildCaseStudyPrompt    = buildCaseStudyPrompt;
window.buildPlacementPrompt    = buildPlacementPrompt;
window.buildNotesDigitizerPrompt = buildNotesDigitizerPrompt;
window.getRandomQuote          = getRandomQuote;
window.startLoadingMessages    = startLoadingMessages;
window.stopLoadingMessages     = stopLoadingMessages;
window.calculateStreak         = calculateStreak;
window.QUOTES                  = QUOTES;
