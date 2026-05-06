/* =====================================================
   FEATURE: Code Playground
   Piston API (free, no key) + AI Code Helper
   For: Engineering CSE/IT, BCA, MCA, BSc CS
   ===================================================== */

const PISTON_URL = 'https://emkc.org/api/v2/piston/execute';

const LANGUAGE_MAP = {
  python:     { id: 'python',     version: '3.10.0',  label: 'Python 3',    icon: '🐍' },
  javascript: { id: 'javascript', version: '18.15.0', label: 'JavaScript',  icon: '🟨' },
  java:       { id: 'java',       version: '15.0.2',  label: 'Java',        icon: '☕' },
  c:          { id: 'c',          version: '10.2.0',  label: 'C',           icon: '🔵' },
  cpp:        { id: 'c++',        version: '10.2.0',  label: 'C++',         icon: '🔷' },
  php:        { id: 'php',        version: '8.2.3',   label: 'PHP',         icon: '🐘' },
};

const DEFAULT_CODE = {
  python: `# Python Example
def greet(name):
    print(f"Hello, {name}! Welcome to AI Study Buddy!")

greet("Student")
for i in range(1, 6):
    print(f"Line {i}")`,

  java: `// Java Example
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from AI Study Buddy!");
        for (int i = 1; i <= 5; i++) {
            System.out.println("Line " + i);
        }
    }
}`,

  c: `// C Example
#include <stdio.h>

int main() {
    printf("Hello from AI Study Buddy!\\n");
    int i;
    for (i = 1; i <= 5; i++) {
        printf("Line %d\\n", i);
    }
    return 0;
}`,

  cpp: `// C++ Example
#include <iostream>
using namespace std;

int main() {
    cout << "Hello from AI Study Buddy!" << endl;
    for (int i = 1; i <= 5; i++) {
        cout << "Line " << i << endl;
    }
    return 0;
}`,

  javascript: `// JavaScript Example
function greet(name) {
    console.log(\`Hello, \${name}! Welcome to AI Study Buddy!\`);
}

greet("Student");
for (let i = 1; i <= 5; i++) {
    console.log(\`Line \${i}\`);
}`,

  php: `<?php
// PHP Example
function greet($name) {
    echo "Hello, $name! Welcome to AI Study Buddy!\\n";
}

greet("Student");
for ($i = 1; $i <= 5; $i++) {
    echo "Line $i\\n";
}
?>`
};

function initCodePlayground() {
  const page = document.getElementById('page-code');
  if (!page) return;

  renderCodePlayground(page);
  setupCodeListeners();
}

function renderCodePlayground(page) {
  page.innerHTML = `
    <div class="page-hero">
      <h1 class="page-title">💻 Code Playground</h1>
      <p class="page-subtitle">Write, Run, and Debug code with AI help. Powered by Piston API — free & no key needed!</p>
    </div>

    <div class="code-playground-layout">
      
      <!-- Editor Panel -->
      <div class="code-editor-panel">
        <div class="code-editor-header">
          <div class="lang-selector-row">
            <select id="code-lang-select" class="select-input code-lang-select" aria-label="Select programming language">
              ${Object.entries(LANGUAGE_MAP).map(([key, l]) =>
                `<option value="${key}">${l.icon} ${l.label}</option>`
              ).join('')}
            </select>
            <div class="code-header-actions">
              <button class="btn-primary code-run-btn" id="code-run-btn">▶ Run Code</button>
              <button class="btn-secondary" id="code-clear-btn">🗑️ Clear</button>
              <button class="btn-secondary" id="code-copy-btn">📋 Copy</button>
            </div>
          </div>
        </div>

        <div class="code-editor-wrapper" id="code-editor-wrapper">
          <div class="line-numbers" id="line-numbers">1</div>
          <textarea id="code-editor" class="code-editor-textarea" 
            spellcheck="false" autocorrect="off" autocapitalize="none"
            placeholder="Write your code here..."
            aria-label="Code editor">${DEFAULT_CODE.python}</textarea>
        </div>

        <!-- Input for programs that need stdin -->
        <div class="code-stdin-row">
          <label style="font-size:13px;color:var(--text-secondary);font-weight:500;">📥 Program Input (stdin):</label>
          <input type="text" id="code-stdin" class="form-input" placeholder="Enter input values here (if your program needs input)..." style="margin-top:4px;" />
        </div>
      </div>

      <!-- Output Panel -->
      <div class="code-output-panel">
        <div class="code-output-header">
          <span style="font-weight:700;color:var(--navy);">📤 Output</span>
          <span id="code-run-time" style="font-size:12px;color:var(--text-secondary);"></span>
        </div>
        <div id="code-output" class="code-output-area">
          <span style="color:var(--text-secondary);">Run your code to see output here...</span>
        </div>
      </div>
    </div>

    <!-- AI Help Buttons -->
    <div class="ai-code-help-section">
      <div class="section-header" style="margin-bottom:12px;">
        <div class="section-dot"></div>
        <div class="section-title">🤖 AI Code Assistant</div>
      </div>
      <div class="ai-help-buttons">
        <button class="ai-help-btn" id="ai-explain-btn" data-task="explain">
          <span class="ai-help-icon">🔍</span>
          <span>Explain Code</span>
          <span style="font-size:11px;opacity:0.7;">Line by line</span>
        </button>
        <button class="ai-help-btn" id="ai-debug-btn" data-task="debug">
          <span class="ai-help-icon">🐛</span>
          <span>Find Bugs</span>
          <span style="font-size:11px;opacity:0.7;">Auto-debug</span>
        </button>
        <button class="ai-help-btn" id="ai-improve-btn" data-task="improve">
          <span class="ai-help-icon">⬆️</span>
          <span>Improve Code</span>
          <span style="font-size:11px;opacity:0.7;">Best practices</span>
        </button>
        <button class="ai-help-btn" id="ai-write-btn" data-task="write">
          <span class="ai-help-icon">✏️</span>
          <span>Write for Me</span>
          <span style="font-size:11px;opacity:0.7;">Describe in Hindi/English</span>
        </button>
        <button class="ai-help-btn" id="ai-convert-btn" data-task="convert">
          <span class="ai-help-icon">🔄</span>
          <span>Convert Language</span>
          <span style="font-size:11px;opacity:0.7;">Python ↔ Java ↔ C</span>
        </button>
      </div>

      <!-- Write from scratch input -->
      <div id="write-from-scratch-input" class="hidden" style="margin-top:12px;">
        <div class="input-card" style="padding:16px;">
          <label class="form-label">Describe what you want to build (Hindi or English):</label>
          <textarea id="code-description" class="main-textarea" rows="2" 
            placeholder="e.g., Write a program to find factorial of a number / एक नंबर का factorial निकालने वाला program बनाओ"></textarea>
          <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;">
            <select id="convert-to-lang" class="select-input" style="flex:1;min-width:140px;">
              ${Object.entries(LANGUAGE_MAP).map(([key, l]) =>
                `<option value="${key}">${l.icon} ${l.label}</option>`
              ).join('')}
            </select>
            <button class="btn-primary" id="execute-ai-task-btn">🤖 Generate</button>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Response Area -->
    <div id="code-ai-loading" class="loading-state hidden">
      <div class="skeleton-card"></div>
      <div class="loading-messages" id="code-loading-msg">AI is analyzing your code...</div>
    </div>
    <div id="code-ai-result" class="results-container"></div>

    <!-- DSA Practice Mode -->
    <div class="dsa-practice-section">
      <div class="section-header" style="margin-bottom:12px;">
        <div class="section-dot"></div>
        <div class="section-title">🏆 DSA Practice Mode</div>
      </div>
      <div class="input-card">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">DSA Topic</label>
            <select id="dsa-topic-select" class="select-input">
              <option value="Arrays">Arrays</option>
              <option value="Linked Lists">Linked Lists</option>
              <option value="Stacks and Queues">Stacks and Queues</option>
              <option value="Binary Trees">Binary Trees</option>
              <option value="Graphs (BFS/DFS)">Graphs (BFS/DFS)</option>
              <option value="Sorting Algorithms">Sorting Algorithms</option>
              <option value="Searching Algorithms">Searching Algorithms</option>
              <option value="Dynamic Programming">Dynamic Programming</option>
              <option value="Recursion">Recursion</option>
              <option value="Hashing">Hashing</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Difficulty</label>
            <select id="dsa-difficulty" class="select-input">
              <option value="Easy">Easy (Beginner)</option>
              <option value="Medium" selected>Medium</option>
              <option value="Hard">Hard (Interview Level)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Language</label>
            <select id="dsa-lang" class="select-input">
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="C++">C++</option>
              <option value="C">C</option>
            </select>
          </div>
        </div>
        <div class="input-actions">
          <button class="btn-primary" id="dsa-generate-btn">🏆 Generate DSA Problem</button>
        </div>
      </div>
      <div id="dsa-result" class="results-container"></div>
    </div>
  `;
}

function setupCodeListeners() {
  const editor     = document.getElementById('code-editor');
  const langSelect = document.getElementById('code-lang-select');
  const runBtn     = document.getElementById('code-run-btn');
  const clearBtn   = document.getElementById('code-clear-btn');
  const copyBtn    = document.getElementById('code-copy-btn');

  if (!editor) return;

  // Update line numbers
  function updateLineNumbers() {
    const lines = editor.value.split('\n').length;
    const ln = document.getElementById('line-numbers');
    if (ln) ln.textContent = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
  }
  updateLineNumbers();
  editor.addEventListener('input', updateLineNumbers);
  editor.addEventListener('scroll', () => {
    const ln = document.getElementById('line-numbers');
    if (ln) ln.scrollTop = editor.scrollTop;
  });

  // Tab key support
  editor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
      editor.selectionStart = editor.selectionEnd = start + 2;
      updateLineNumbers();
    }
    // Ctrl+Enter to run
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runCode();
    }
  });

  // Language change → load default code
  langSelect?.addEventListener('change', () => {
    const lang = langSelect.value;
    if (DEFAULT_CODE[lang] && (!editor.value || editor.value.trim() === '' || 
        Object.values(DEFAULT_CODE).some(c => c.trim() === editor.value.trim()))) {
      editor.value = DEFAULT_CODE[lang];
      updateLineNumbers();
    }
  });

  // Run button
  runBtn?.addEventListener('click', runCode);
  clearBtn?.addEventListener('click', () => {
    editor.value = '';
    updateLineNumbers();
    document.getElementById('code-output').innerHTML = '<span style="color:var(--text-secondary);">Output cleared.</span>';
  });
  copyBtn?.addEventListener('click', async () => {
    await navigator.clipboard.writeText(editor.value).catch(() => {});
    showToast('Code copied! 📋');
  });

  // AI Help buttons
  document.querySelectorAll('.ai-help-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const task = btn.dataset.task;
      const writeInput = document.getElementById('write-from-scratch-input');
      if (task === 'write' || task === 'convert') {
        writeInput?.classList.toggle('hidden', writeInput?.classList.contains('hidden') === false && document.getElementById('execute-ai-task-btn').dataset.task === task);
        writeInput?.classList.remove('hidden');
        document.getElementById('execute-ai-task-btn').dataset.task = task;
        const descEl = document.getElementById('code-description');
        const convertEl = document.getElementById('convert-to-lang');
        if (task === 'write') {
          descEl.placeholder = 'Describe what program to write (Hindi or English)...';
          convertEl.parentElement.style.display = 'none';
        } else {
          descEl.placeholder = 'Optionally describe any special conversion requirements...';
          convertEl.parentElement.style.display = 'block';
        }
      } else {
        writeInput?.classList.add('hidden');
        runAICodeTask(task);
      }
    });
  });

  document.getElementById('execute-ai-task-btn')?.addEventListener('click', () => {
    const task = document.getElementById('execute-ai-task-btn').dataset.task || 'write';
    runAICodeTask(task);
  });

  // DSA Practice
  document.getElementById('dsa-generate-btn')?.addEventListener('click', generateDSAProblem);
}

async function runCode() {
  const editor   = document.getElementById('code-editor');
  const langSel  = document.getElementById('code-lang-select');
  const stdin    = document.getElementById('code-stdin');
  const output   = document.getElementById('code-output');
  const runBtn   = document.getElementById('code-run-btn');
  const runTime  = document.getElementById('code-run-time');

  const code = editor?.value?.trim();
  if (!code) { showToast('Please write some code first!'); return; }

  const langKey = langSel?.value || 'python';
  const lang = LANGUAGE_MAP[langKey];
  if (!lang) return;

  output.innerHTML = '<span style="color:var(--text-secondary);font-family:monospace;">🔄 Running...</span>';
  runBtn.disabled = true;
  runBtn.textContent = '⏳ Running...';
  const startTime = Date.now();

  try {
    const resp = await fetch(PISTON_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: lang.id,
        version:  lang.version,
        files: [{ name: 'main', content: code }],
        stdin: stdin?.value || '',
        run_timeout: 10000
      })
    });

    if (!resp.ok) throw new Error(`Execution server error: ${resp.status}`);

    const data = await resp.json();
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    if (runTime) runTime.textContent = `⏱ ${elapsed}s`;

    const run = data.run || {};
    const hasError = run.stderr && run.stderr.trim();
    const hasOutput = run.stdout && run.stdout.trim();

    let html = '';
    if (hasOutput) {
      html += `<div style="color:#2ECC71;font-family:monospace;white-space:pre-wrap;">${escHTML(run.stdout)}</div>`;
    }
    if (hasError) {
      html += `<div style="color:#E74C3C;font-family:monospace;white-space:pre-wrap;margin-top:${hasOutput ? '8px' : '0'};">⚠️ Error:\n${escHTML(run.stderr)}</div>`;
    }
    if (!hasOutput && !hasError) {
      html = '<span style="color:var(--text-secondary);font-family:monospace;">(No output produced)</span>';
    }

    output.innerHTML = html;
    trackStat('code_runs');
  } catch (err) {
    output.innerHTML = `<div style="color:#E74C3C;font-family:monospace;">⚠️ Could not run code: ${escHTML(err.message)}<br/><br/>Check your internet connection. The Piston API is free and should work when online.</div>`;
  } finally {
    runBtn.disabled = false;
    runBtn.textContent = '▶ Run Code';
  }
}

async function runAICodeTask(task) {
  const editor   = document.getElementById('code-editor');
  const langSel  = document.getElementById('code-lang-select');
  const descEl   = document.getElementById('code-description');
  const convertEl = document.getElementById('convert-to-lang');
  const loading  = document.getElementById('code-ai-loading');
  const result   = document.getElementById('code-ai-result');

  const code = editor?.value?.trim();
  const langKey = langSel?.value || 'python';
  const langLabel = LANGUAGE_MAP[langKey]?.label || langKey;

  if (task !== 'write' && !code) {
    showToast('Please write some code first!');
    return;
  }

  let description = descEl?.value?.trim() || '';
  if (task === 'convert') description = LANGUAGE_MAP[convertEl?.value]?.label || 'Python';

  loading.classList.remove('hidden');
  result.innerHTML = '';
  const interval = startLoadingMessages('code-loading-msg');

  try {
    const prompt = buildCodeHelperPrompt(code || '', langLabel, task, description);
    const response = await callAI(prompt, 0.5, 2500);

    loading.classList.add('hidden');
    stopLoadingMessages(interval);

    const taskLabels = {
      explain: '🔍 Code Explanation',
      debug: '🐛 Bug Analysis & Fix',
      improve: '⬆️ Code Improvements',
      write: '✏️ Generated Code',
      convert: '🔄 Language Conversion'
    };

    result.innerHTML = `
      <div class="ai-card fade-in">
        <div class="ai-card-header">
          <span class="ai-card-icon">🤖</span>
          <div class="ai-card-title">${taskLabels[task] || 'AI Analysis'}</div>
        </div>
        <div class="ai-card-body">${markdownToHtml(response)}</div>
        <div class="ai-card-footer">
          <button class="action-chip" onclick="navigator.clipboard.writeText(this.closest('.ai-card').querySelector('.ai-card-body').textContent)">📋 Copy</button>
          <button class="action-chip" onclick="document.getElementById('code-editor').value = extractCodeFromResponse(this.closest('.ai-card').querySelector('.ai-card-body').textContent); updateEditorLineNumbers();">📥 Use This Code</button>
        </div>
      </div>`;

    trackStat('code_ai_uses');
  } catch (err) {
    loading.classList.add('hidden');
    stopLoadingMessages(interval);
    result.innerHTML = buildErrorCard(err.message);
  }
}

function extractCodeFromResponse(text) {
  // Try to extract code block from AI response
  const match = text.match(/```[\w]*\n?([\s\S]*?)```/);
  return match ? match[1].trim() : text;
}

function updateEditorLineNumbers() {
  const editor = document.getElementById('code-editor');
  const ln = document.getElementById('line-numbers');
  if (editor && ln) {
    const lines = editor.value.split('\n').length;
    ln.textContent = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
  }
}

async function generateDSAProblem() {
  const topic = document.getElementById('dsa-topic-select')?.value || 'Arrays';
  const diff  = document.getElementById('dsa-difficulty')?.value || 'Medium';
  const lang  = document.getElementById('dsa-lang')?.value || 'Python';
  const result = document.getElementById('dsa-result');

  result.innerHTML = `<div class="loading-state"><div class="skeleton-card"></div><div class="loading-messages">Generating ${diff} ${topic} problem...</div></div>`;

  try {
    const prompt = `Generate a ${diff} level DSA coding problem on: "${topic}"

Format:
## Problem Statement
[Clear problem description with constraints]

## Example
Input: [sample input]
Output: [expected output]
Explanation: [why this is the output]

## Hints (for students who are stuck)
Hint 1: [gentle hint]
Hint 2: [more specific hint]

## Solution in ${lang}
\`\`\`${lang.toLowerCase()}
[complete solution code with comments in Hindi/English]
\`\`\`

## Time Complexity: O(?)
## Space Complexity: O(?)

## Explanation of Solution
[Explain the algorithm step by step, like teaching a friend]

This is for a student from Marathi/Hindi medium background studying for ${lang} placement interviews.`;

    const response = await callAI(prompt, 0.6, 2000);
    result.innerHTML = `
      <div class="ai-card fade-in">
        <div class="ai-card-header">
          <span class="ai-card-icon">🏆</span>
          <div class="ai-card-title">${diff} — ${topic} Problem (${lang})</div>
        </div>
        <div class="ai-card-body">${markdownToHtml(response)}</div>
        <div class="ai-card-footer">
          <button class="action-chip" onclick="
            const code = extractCodeFromResponse(this.closest('.ai-card').querySelector('.ai-card-body').textContent);
            document.getElementById('code-editor').value = code;
            updateEditorLineNumbers();
            navigateTo('code');
            showToast('Code loaded in editor!');
          ">📥 Load Solution in Editor</button>
        </div>
      </div>`;
    trackStat('dsa_problems');
  } catch (err) {
    result.innerHTML = buildErrorCard(err.message);
  }
}

window.initCodePlayground    = initCodePlayground;
window.extractCodeFromResponse = extractCodeFromResponse;
window.updateEditorLineNumbers = updateEditorLineNumbers;
