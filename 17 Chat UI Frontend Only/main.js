// 17 - Chat UI (frontend only, simulated bot replies)

// Escape untrusted text before it is interpolated into innerHTML (XSS fix).
function esc(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

const conversations = [
  { id: 'alex', name: 'Alex', color: '#4f6df5', status: 'online', unread: 0, messages: [
    { from: 'peer', text: 'Hey! Are we still on for tomorrow?', ts: Date.now() - 3600e3 },
    { from: 'me', text: 'Absolutely 😄', ts: Date.now() - 3500e3 },
  ]},
  { id: 'mia', name: 'Mia Chen', color: '#e0518f', status: 'online', unread: 2, messages: [
    { from: 'peer', text: 'Sent you the design files 📎', ts: Date.now() - 7200e3 },
    { from: 'peer', text: 'Let me know what you think!', ts: Date.now() - 7100e3 },
  ]},
  { id: 'sam', name: 'Sam', color: '#2fbf71', status: 'last seen 1h ago', unread: 0, messages: [
    { from: 'me', text: 'Great game yesterday 🔥', ts: Date.now() - 86400e3 },
    { from: 'peer', text: 'Rematch this weekend?', ts: Date.now() - 86000e3 },
  ]},
  { id: 'team', name: 'Project Team', color: '#f5a623', status: '5 members', unread: 0, messages: [
    { from: 'peer', text: 'Standup at 10am sharp.', ts: Date.now() - 20 * 3600e3 },
  ]},
];

const botReplies = [
  "That sounds great!", "Interesting — tell me more 🤔", "Haha, nice one 😄",
  "I'll check and get back to you.", "Sure thing 👍", "Really? That's awesome!",
  "Can you send me the details?", "Let's do it!", "Good point. I agree.",
];

const els = {
  convList: document.getElementById('convList'),
  convSearch: document.getElementById('convSearch'),
  messages: document.getElementById('messages'),
  composer: document.getElementById('composer'),
  msgInput: document.getElementById('msgInput'),
  typing: document.getElementById('typingIndicator'),
  peerName: document.getElementById('peerName'),
  peerStatus: document.getElementById('peerStatus'),
  headerAvatar: document.getElementById('headerAvatar'),
  sidebar: document.getElementById('sidebar'),
  sidebarOpen: document.getElementById('sidebarOpen'),
  sidebarClose: document.getElementById('sidebarClose'),
};

let activeId = conversations[0].id;
const activeConv = () => conversations.find((c) => c.id === activeId);
const fmtTime = (ts) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

function renderConvList(filter = '') {
  const f = filter.trim().toLowerCase();
  els.convList.innerHTML = '';
  conversations
    .filter((c) => c.name.toLowerCase().includes(f))
    .forEach((c) => {
      const last = c.messages[c.messages.length - 1];
      const li = document.createElement('li');
      li.className = 'conv-item' + (c.id === activeId ? ' active' : '');
      li.dataset.id = c.id;
      li.innerHTML = `
        <div class="avatar" style="background:${c.color}">${c.name[0]}</div>
        <div class="conv-meta">
          <div class="conv-name">${esc(c.name)}</div>
          <div class="conv-preview">${last ? esc((last.from === 'me' ? 'You: ' : '') + last.text) : 'No messages yet'}</div>
        </div>
        ${c.unread ? `<span class="unread-badge">${c.unread}</span>` : ''}`;
      els.convList.appendChild(li);
    });
}

function renderMessages() {
  const c = activeConv();
  els.peerName.textContent = c.name;
  els.peerStatus.textContent = c.status;
  els.headerAvatar.textContent = c.name[0];
  els.headerAvatar.style.background = c.color;
  els.messages.innerHTML = c.messages.map((m) => `
    <div class="msg-row ${m.from}">
      <div class="bubble">${escapeHtml(m.text)}<span class="time">${fmtTime(m.ts)}</span></div>
    </div>`).join('');
  scrollToBottom();
}

function scrollToBottom() { els.messages.scrollTop = els.messages.scrollHeight; }

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function sendMessage(text) {
  const c = activeConv();
  c.messages.push({ from: 'me', text, ts: Date.now() });
  renderMessages();
  renderConvList(els.convSearch.value);
  simulateReply(c);
}

let replyTimer = null;
function simulateReply(conv) {
  clearTimeout(replyTimer);
  replyTimer = setTimeout(() => {
    if (activeId !== conv.id) return; // don't show typing for non-active chat
    els.typing.classList.remove('hidden');
    setTimeout(() => {
      els.typing.classList.add('hidden');
      const reply = botReplies[Math.floor(Math.random() * botReplies.length)];
      conv.messages.push({ from: 'peer', text: reply, ts: Date.now() });
      if (activeId === conv.id) renderMessages();
      else conv.unread++;
      renderConvList(els.convSearch.value);
    }, 900 + Math.random() * 1200);
  }, 400);
}

// Events
els.composer.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = els.msgInput.value.trim();
  if (!text) return;
  sendMessage(text);
  els.msgInput.value = '';
  els.msgInput.focus();
});

els.convList.addEventListener('click', (e) => {
  const item = e.target.closest('.conv-item');
  if (!item) return;
  activeId = item.dataset.id;
  const c = activeConv();
  c.unread = 0;
  renderConvList(els.convSearch.value);
  renderMessages();
  els.sidebar.classList.remove('open');
});

els.convSearch.addEventListener('input', () => renderConvList(els.convSearch.value));
els.sidebarOpen.addEventListener('click', () => els.sidebar.classList.add('open'));
els.sidebarClose.addEventListener('click', () => els.sidebar.classList.remove('open'));

// Init
renderConvList();
renderMessages();
