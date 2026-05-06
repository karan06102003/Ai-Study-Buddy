/* =====================================================
   FEATURE 4: Doubt Solver Chat
   ===================================================== */

let chatHistory = [];

function initChat() {
  const input   = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  const clearBtn= document.getElementById('chat-clear');
  const mic     = document.getElementById('chat-mic');

  if (!sendBtn) return;

  // Load history from localStorage
  chatHistory = JSON.parse(localStorage.getItem('chat_history') || '[]');
  if (chatHistory.length > 0) {
    renderChatHistory();
  }

  sendBtn.addEventListener('click', sendMessage);
  clearBtn.addEventListener('click', clearChatHistory);
  mic && attachVoiceInput(mic, input, 'chat');

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Auto-resize textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });
}

function renderChatHistory() {
  const container = document.getElementById('chat-messages');
  if (!container) return;

  // Keep welcome message, append history
  const welcome = container.querySelector('.chat-welcome');

  chatHistory.slice(-20).forEach(msg => {
    const bubble = createBubble(msg.role, msg.content, msg.time);
    container.appendChild(bubble);
  });

  container.scrollTop = container.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById('chat-input');
  const message = input.value.trim();
  if (!message) return;

  // Clear input
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  input.value = '';
  input.style.height = 'auto';

  // Show user bubble
  appendBubble('user', message, time);

  // Add to history
  chatHistory.push({ role: 'user', content: message, time });

  // Show thinking
  const thinking = document.getElementById('chat-thinking');
  const thinkingText = document.getElementById('thinking-text');
  thinking.classList.remove('hidden');
  const thinkMsgs = ['AI समझ रहा है...', 'Thinking...', 'AI समजत आहे...'];
  let ti = 0;
  const thinkInterval = setInterval(() => {
    ti = (ti + 1) % thinkMsgs.length;
    if (thinkingText) thinkingText.textContent = thinkMsgs[ti];
  }, 1200);

  try {
    const prompt = buildChatPrompt(chatHistory.slice(-10), message);
    const response = await callGemini(prompt, 0.75, 1500);

    clearInterval(thinkInterval);
    thinking.classList.add('hidden');

    const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    appendBubble('ai', response, aiTime);

    chatHistory.push({ role: 'ai', content: response, time: aiTime });

    // Persist (keep last 40 messages)
    if (chatHistory.length > 40) chatHistory = chatHistory.slice(-40);
    localStorage.setItem('chat_history', JSON.stringify(chatHistory));
    trackStat('questions_asked');
  } catch (err) {
    clearInterval(thinkInterval);
    thinking.classList.add('hidden');

    appendBubble('ai', `⚠️ AI अभी थोड़ा व्यस्त है — कृपया एक मिनट बाद कोशिश करें।\n(AI is a bit busy, please try again in a moment.)`, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }
}

function appendBubble(role, content, time) {
  const container = document.getElementById('chat-messages');
  if (!container) return;

  const bubble = createBubble(role, content, time);
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

function createBubble(role, content, time) {
  const div = document.createElement('div');
  div.className = `chat-bubble ${role}`;

  const formattedContent = role === 'ai'
    ? markdownToHtml(content)
    : escHTML(content).replace(/\n/g, '<br/>');

  const actionsHtml = role === 'ai' ? `
    <div class="bubble-actions">
      <button class="bubble-action-btn" onclick="toggleReadAloud(this.closest('.chat-bubble').querySelector('.bubble-content').textContent, null, this)">🔊 Read Aloud</button>
      <button class="bubble-action-btn" onclick="askSimpler(this)">🔄 Explain Simpler</button>
    </div>` : '';

  div.innerHTML = `
    <div class="bubble-content">${formattedContent}</div>
    ${actionsHtml}
    <div class="bubble-time">${time || ''}</div>`;

  return div;
}

async function askSimpler(btn) {
  const bubble = btn.closest('.chat-bubble');
  const originalText = bubble.querySelector('.bubble-content')?.textContent || '';
  const chatInput = document.getElementById('chat-input');

  if (chatInput) {
    chatInput.value = `Please explain this even more simply, using an Indian example: "${originalText.substring(0, 150)}"`;
    await sendMessage();
  }
}

function clearChatHistory() {
  if (!confirm('Clear all chat history? / सारा chat history delete करें?')) return;
  chatHistory = [];
  localStorage.removeItem('chat_history');

  const container = document.getElementById('chat-messages');
  if (container) {
    container.innerHTML = `
      <div class="chat-welcome">
        <div class="chat-welcome-icon">🤖</div>
        <div class="chat-welcome-text">
          <strong>Chat cleared! / Chat साफ हो गई!</strong><br/>
          Ask me a new question! / नया सवाल पूछें!
        </div>
      </div>`;
  }
  showToast('Chat cleared! 🗑️');
}
