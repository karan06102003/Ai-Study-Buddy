/* =====================================================
   FEATURE 6: Smart Flashcard Generator
   ===================================================== */

let flashState = {
  cards: [],
  current: 0,
  known: [],
  practice: [],
  flipped: false,
  sessionMode: false // 'all' | 'practice'
};

function initFlashcards() {
  const generateBtn = document.getElementById('flashcard-generate-btn');
  const savedBtn    = document.getElementById('flashcard-saved-btn');

  if (!generateBtn) return;

  generateBtn.addEventListener('click', generateFlashcards);
  savedBtn?.addEventListener('click', showSavedDecks);
}

async function generateFlashcards() {
  const input = document.getElementById('flashcard-input');
  const topic = input?.value.trim();

  if (!topic) {
    showToast('Please enter a topic! / Topic likhein!');
    return;
  }

  const loading = document.getElementById('flashcard-loading');
  const area    = document.getElementById('flashcard-area');
  const btn     = document.getElementById('flashcard-generate-btn');

  loading.classList.remove('hidden');
  area.innerHTML = '';
  btn.disabled = true;

  try {
    const prompt = buildFlashcardPrompt(topic);
    const rawJson = await callGemini(prompt, 0.7, 2000);

    const jsonMatch = rawJson.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Could not parse flashcards');

    const data = JSON.parse(jsonMatch[0]);
    if (!data.cards || !data.cards.length) throw new Error('No flashcards generated');

    // Save deck
    saveDeck(data);

    flashState = {
      cards: data.cards,
      current: 0,
      known: [],
      practice: [],
      flipped: false,
      topic: data.topic,
      sessionMode: 'all'
    };

    loading.classList.add('hidden');
    btn.disabled = false;

    renderFlashcardSession();
    trackStat('topics_studied');
  } catch (err) {
    loading.classList.add('hidden');
    btn.disabled = false;
    document.getElementById('flashcard-area').innerHTML = buildErrorCard(err.message);
    document.getElementById('retry-btn')?.addEventListener('click', generateFlashcards);
  }
}

function renderFlashcardSession() {
  const area = document.getElementById('flashcard-area');
  if (!area || !flashState.cards.length) return;

  const total   = flashState.cards.length;
  const current = flashState.current;
  const card    = flashState.cards[current] || flashState.cards[0];
  const progress = Math.round((current / total) * 100);

  area.innerHTML = `
    <div class="fade-in">
      <div class="flashcard-nav">
        <span class="flashcard-progress-text">Card ${current + 1} of ${total} · 
          ✅ ${flashState.known.length} known · 🔄 ${flashState.practice.length} to practice</span>
        <button class="action-chip" onclick="restartFlashcards()">🔄 Restart</button>
      </div>

      <div class="flashcard-progress-bar">
        <div class="flashcard-progress-fill" style="width:${progress}%"></div>
      </div>

      <div class="flashcard-viewport" id="flashcard-viewport" onclick="flipCard()">
        <div class="flashcard-inner ${flashState.flipped ? 'flipped' : ''}" id="flashcard-inner">
          <div class="flashcard-face flashcard-front">
            <div class="flashcard-front-hint">👆 Tap to flip</div>
            <div class="flashcard-term">${escHTML(card.front || '')}</div>
            <div style="font-size:12px;opacity:0.5;margin-top:12px;">Think about it first! / पहले सोचो!</div>
          </div>
          <div class="flashcard-face flashcard-back">
            <div class="flashcard-back-label">📖 Answer</div>
            <div class="flashcard-definition">${escHTML(card.back_english || '')}</div>
            ${card.back_hindi ? `<div style="font-size:13px;color:var(--text-secondary);margin-top:8px;padding-top:8px;border-top:1px solid var(--border)">🇮🇳 ${escHTML(card.back_hindi)}</div>` : ''}
            ${card.back_marathi ? `<div style="font-size:13px;color:var(--text-secondary);margin-top:4px">🏵️ ${escHTML(card.back_marathi)}</div>` : ''}
            ${card.example ? `<div class="flashcard-example">Example: ${escHTML(card.example)}</div>` : ''}
          </div>
        </div>
      </div>

      <div id="flashcard-action-hint" style="text-align:center;color:var(--text-muted);font-size:13px;margin-bottom:16px;">
        ${flashState.flipped ? '' : '👆 Click/tap the card to reveal the answer'}
      </div>

      <div class="flashcard-rating-btns ${flashState.flipped ? '' : 'hidden'}" id="rating-btns">
        <button class="rating-btn practice" onclick="rateCard('practice')">🔄 Need Practice</button>
        <button class="rating-btn know"     onclick="rateCard('know')">✅ I Know This!</button>
      </div>

      <div style="text-align:center;margin-top:16px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
        ${current > 0 ? `<button class="btn-secondary" onclick="prevCard()">← Previous</button>` : ''}
        <button class="action-chip" onclick="speakText('${escHTML(card.front).replace(/'/g, "\\'")}')">🔊 Pronounce</button>
        <button class="btn-secondary" onclick="showSavedDecks()">📚 My Decks</button>
      </div>
    </div>`;
}

function flipCard() {
  flashState.flipped = !flashState.flipped;
  const inner = document.getElementById('flashcard-inner');
  const hint  = document.getElementById('flashcard-action-hint');
  const btns  = document.getElementById('rating-btns');

  if (inner) inner.classList.toggle('flipped', flashState.flipped);
  if (hint)  hint.textContent = flashState.flipped ? '' : '👆 Click/tap the card to reveal the answer';
  if (btns)  btns.classList.toggle('hidden', !flashState.flipped);
}

function rateCard(rating) {
  const currentCard = flashState.cards[flashState.current];

  if (rating === 'know') {
    flashState.known.push(currentCard.id || flashState.current);
    showToast('Great! You know this one! 🎉');
  } else {
    flashState.practice.push(currentCard.id || flashState.current);
  }

  nextCard();
}

function nextCard() {
  flashState.flipped = false;
  flashState.current++;

  if (flashState.current >= flashState.cards.length) {
    showFlashcardSummary();
  } else {
    renderFlashcardSession();
  }
}

function prevCard() {
  if (flashState.current > 0) {
    flashState.current--;
    flashState.flipped = false;
    renderFlashcardSession();
  }
}

function restartFlashcards() {
  // Put practice cards first, then mix with known
  const practiceCards = flashState.cards.filter(c =>
    flashState.practice.includes(c.id || flashState.cards.indexOf(c))
  );
  const knownCards = flashState.cards.filter(c =>
    !flashState.practice.includes(c.id || flashState.cards.indexOf(c))
  );

  flashState.cards = [...practiceCards, ...knownCards];
  flashState.current = 0;
  flashState.known = [];
  flashState.practice = [];
  flashState.flipped = false;

  renderFlashcardSession();
}

function showFlashcardSummary() {
  const area = document.getElementById('flashcard-area');
  const total = flashState.cards.length;
  const known = flashState.known.length;
  const practice = flashState.practice.length;
  const pct = Math.round((known / total) * 100);

  area.innerHTML = `
    <div class="fade-in" style="text-align:center;padding:32px 20px;">
      <div style="font-size:56px;margin-bottom:12px;">${pct >= 70 ? '🎉' : '💪'}</div>
      <h2 style="font-size:24px;font-weight:700;color:var(--navy);margin-bottom:8px;">Session Complete!</h2>
      <div style="font-size:48px;font-weight:700;color:var(--saffron);margin:12px 0">${pct}%</div>
      <p style="color:var(--text-secondary);margin-bottom:20px;">
        ✅ ${known} known · 🔄 ${practice} need practice · Total: ${total} cards
      </p>

      ${pct >= 80
        ? '<div class="memory-box" style="margin:16px auto;max-width:400px;">शाबाश! बहुत बढ़िया! तू वाखाण करायला लायक आहेस! 🌟</div>'
        : '<div class="memory-box" style="margin:16px auto;max-width:400px;">Practice cards will come first in your next session. Keep going! 💪 / करत राहा!</div>'}

      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:20px;">
        ${practice > 0 ? `<button class="btn-primary" onclick="practiceOnly()">🔄 Practise ${practice} Weak Cards</button>` : ''}
        <button class="btn-secondary" onclick="restartFlashcards()">🔁 Full Restart</button>
        <button class="btn-secondary" onclick="showSavedDecks()">📚 My Decks</button>
      </div>
    </div>`;
}

function practiceOnly() {
  const practiceIds = [...flashState.practice];
  flashState.cards = flashState.cards.filter(c =>
    practiceIds.includes(c.id || flashState.cards.indexOf(c))
  );
  flashState.current = 0;
  flashState.known = [];
  flashState.practice = [];
  flashState.flipped = false;

  if (flashState.cards.length > 0) {
    renderFlashcardSession();
  } else {
    showToast('No practice cards! You know them all! 🎉');
  }
}

// ── Deck storage ─────────────────────────────────────────
function saveDeck(data) {
  const decks = JSON.parse(localStorage.getItem('flashcard_decks') || '[]');
  const existing = decks.findIndex(d => d.topic === data.topic);

  const deck = {
    topic: data.topic,
    cards: data.cards,
    savedAt: new Date().toISOString(),
    cardCount: data.cards.length
  };

  if (existing >= 0) {
    decks[existing] = deck;
  } else {
    decks.unshift(deck);
    if (decks.length > 10) decks.pop();
  }

  localStorage.setItem('flashcard_decks', JSON.stringify(decks));
}

function showSavedDecks() {
  const decks = JSON.parse(localStorage.getItem('flashcard_decks') || '[]');
  const savedArea = document.getElementById('saved-decks-area');
  const flashArea = document.getElementById('flashcard-area');
  if (!savedArea) return;

  savedArea.classList.remove('hidden');
  flashArea.innerHTML = '';

  if (!decks.length) {
    savedArea.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-art">🃏</div>
        <div class="empty-state-title">No saved decks yet</div>
        <div class="empty-state-desc">Generate flashcards from any topic to get started!</div>
      </div>`;
    return;
  }

  savedArea.innerHTML = `
    <div class="fade-in">
      <div class="section-header">
        <div class="section-dot"></div>
        <div class="section-title">📚 My Saved Flashcard Decks</div>
      </div>
      ${decks.map((deck, i) => `
        <div class="deck-card" onclick="loadDeck(${i})">
          <div class="deck-info">
            <h4>${escHTML(deck.topic)}</h4>
            <p>${deck.cardCount} cards · Saved ${new Date(deck.savedAt).toLocaleDateString()}</p>
          </div>
          <div class="deck-actions">
            <button class="btn-secondary" style="padding:6px 14px;font-size:13px;" onclick="event.stopPropagation();loadDeck(${i})">Start →</button>
            <button class="action-chip" onclick="event.stopPropagation();deleteDeck(${i})">🗑️</button>
          </div>
        </div>`).join('')}
    </div>`;
}

function loadDeck(index) {
  const decks = JSON.parse(localStorage.getItem('flashcard_decks') || '[]');
  const deck = decks[index];
  if (!deck) return;

  flashState = {
    cards: deck.cards,
    current: 0,
    known: [],
    practice: [],
    flipped: false,
    topic: deck.topic,
    sessionMode: 'all'
  };

  document.getElementById('saved-decks-area').classList.add('hidden');
  renderFlashcardSession();
  document.getElementById('flashcard-area').scrollIntoView({ behavior: 'smooth' });
}

function deleteDeck(index) {
  if (!confirm('Delete this deck? / यह deck delete करें?')) return;
  const decks = JSON.parse(localStorage.getItem('flashcard_decks') || '[]');
  decks.splice(index, 1);
  localStorage.setItem('flashcard_decks', JSON.stringify(decks));
  showSavedDecks();
  showToast('Deck deleted! 🗑️');
}
