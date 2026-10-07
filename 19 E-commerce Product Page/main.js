// 19 - E-commerce Product Page (self-contained: SVG product views, no external assets)
const colors = [
  { name: 'Midnight Black', hex: '#23262e', accent: '#4b5063' },
  { name: 'Arctic White', hex: '#eceef2', accent: '#c8ccd8' },
  { name: 'Ocean Blue', hex: '#2f6bd8', accent: '#7fa8ee' },
  { name: 'Sunset Rose', hex: '#d86a8d', accent: '#f0a8bf' },
];
const styles = ['Over-ear', 'On-ear', 'Wireless Earbud'];
const basePrice = { 'Over-ear': 129, 'On-ear': 99, 'Wireless Earbud': 79 };

let selColor = colors[0], selStyle = styles[0], view = 0, pickRating = 0;
let cart = load('aurora-cart', []);
let reviews = load('aurora-reviews', [
  { who: 'Priya S.', stars: 5, text: 'Noise cancellation is superb and the battery really lasts a full week of commutes.', when: 'Sep 28, 2026' },
  { who: 'Daniel K.', stars: 4, text: 'Great sound. Slightly heavy for long sessions but very comfortable pads.', when: 'Oct 02, 2026' },
]);
// The marketing page advertises 128 store reviews; user-added reviews count on top.
const baseReviewCount = 128;

function load(k, fb) { try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; } }
function save(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
const $ = (id) => document.getElementById(id);
const money = (n) => `$${n.toFixed(2)}`;

// --- Product SVG generator (gallery images depend on selected color) ---
function svgFor(i) {
  const c = selColor.hex, a = selColor.accent;
  const views = [
    // front view
    `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Headphones front view">
      <rect width="400" height="400" fill="#f0f2f8"/>
      <path d="M100 220 A100 100 0 0 1 300 220" fill="none" stroke="${c}" stroke-width="26" stroke-linecap="round"/>
      <rect x="76" y="205" width="52" height="96" rx="24" fill="${c}"/>
      <rect x="272" y="205" width="52" height="96" rx="24" fill="${c}"/>
      <rect x="86" y="218" width="32" height="70" rx="16" fill="${a}"/>
      <rect x="282" y="218" width="32" height="70" rx="16" fill="${a}"/>
    </svg>`,
    // side view
    `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Headphones side view">
      <rect width="400" height="400" fill="#e8ebf4"/>
      <path d="M140 230 A70 70 0 0 1 280 230" fill="none" stroke="${c}" stroke-width="22" stroke-linecap="round"/>
      <ellipse cx="210" cy="255" rx="58" ry="72" fill="${c}"/>
      <ellipse cx="210" cy="255" rx="40" ry="54" fill="${a}"/>
      <circle cx="210" cy="255" r="10" fill="#f0f2f8"/>
    </svg>`,
    // folded/detail
    `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Headphones detail view">
      <rect width="400" height="400" fill="#f0f2f8"/>
      <rect x="120" y="120" width="160" height="160" rx="40" fill="${c}"/>
      <rect x="145" y="145" width="110" height="110" rx="28" fill="${a}"/>
      <circle cx="200" cy="200" r="26" fill="#f0f2f8"/>
      <text x="200" y="207" font-size="20" text-anchor="middle" fill="${c}" font-family="sans-serif">ANC</text>
    </svg>`,
    // case
    `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Travel case view">
      <rect width="400" height="400" fill="#e8ebf4"/>
      <rect x="90" y="130" width="220" height="150" rx="60" fill="${c}"/>
      <rect x="110" y="150" width="180" height="110" rx="46" fill="${a}"/>
      <line x1="200" y1="150" x2="200" y2="260" stroke="${c}" stroke-width="8"/>
      <circle cx="200" cy="205" r="14" fill="#f0f2f8"/>
    </svg>`,
  ];
  return views[i];
}

function renderGallery() {
  $('mainImg').innerHTML = svgFor(view);
  const thumbs = $('thumbs');
  thumbs.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    const b = document.createElement('button');
    b.className = 'thumb' + (i === view ? ' active' : '');
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', `View ${i + 1}`);
    b.innerHTML = svgFor(i);
    b.addEventListener('click', () => { view = i; renderGallery(); });
    thumbs.appendChild(b);
  }
}

function renderOptions() {
  const sw = $('swatches');
  sw.innerHTML = '';
  colors.forEach((c) => {
    const b = document.createElement('button');
    b.className = 'swatch' + (c.name === selColor.name ? ' active' : '');
    b.style.background = c.hex;
    b.title = c.name;
    b.setAttribute('role', 'radio');
    b.setAttribute('aria-checked', String(c.name === selColor.name));
    b.setAttribute('aria-label', c.name);
    b.addEventListener('click', () => { selColor = c; $('colorName').textContent = c.name; renderOptions(); renderGallery(); });
    sw.appendChild(b);
  });
  const ch = $('styles');
  ch.innerHTML = '';
  styles.forEach((s) => {
    const b = document.createElement('button');
    b.className = 'chip' + (s === selStyle ? ' active' : '');
    b.textContent = s;
    b.setAttribute('role', 'radio');
    b.setAttribute('aria-checked', String(s === selStyle));
    b.addEventListener('click', () => { selStyle = s; $('styleName').textContent = s; renderOptions(); updatePrice(); });
    ch.appendChild(b);
  });
}

function updatePrice() {
  const p = basePrice[selStyle];
  $('price').textContent = money(p);
  const old = Math.round(p * 1.31);
  document.querySelector('.old-price').textContent = money(old);
}

// --- Quantity ---
function getQty() { return Math.min(10, Math.max(1, Number($('qtyInput').value) || 1)); }
$('qtyMinus').addEventListener('click', () => { $('qtyInput').value = String(Math.max(1, getQty() - 1)); });
$('qtyPlus').addEventListener('click', () => { $('qtyInput').value = String(Math.min(10, getQty() + 1)); });
$('qtyInput').addEventListener('change', () => { $('qtyInput').value = String(getQty()); });

// --- Cart ---
function addToCart(qty) {
  const key = `${selColor.name}|${selStyle}`;
  const existing = cart.find((it) => it.key === key);
  if (existing) existing.qty = Math.min(10, existing.qty + qty);
  else cart.push({ key, color: selColor.name, style: selStyle, price: basePrice[selStyle], qty });
  save('aurora-cart', cart);
  renderCart();
}

function renderCart() {
  const count = cart.reduce((s, it) => s + it.qty, 0);
  $('cartCount').textContent = String(count);
  const list = $('cartItems');
  list.innerHTML = '';
  if (!cart.length) {
    list.innerHTML = '<li class="empty-cart">Your cart is empty 🛒</li>';
  } else {
    cart.forEach((it, i) => {
      const li = document.createElement('li');
      li.className = 'cart-item';
      // style/color come from localStorage -> escape before injecting (self-XSS guard)
      li.innerHTML = `<div><strong>${escapeHtml(it.style)}</strong><div class="meta">${escapeHtml(it.color)} · Qty ${Number(it.qty) || 0} · ${money(it.price)} each</div></div>
        <button class="rm" aria-label="Remove ${escapeHtml(it.style)}" data-i="${i}">✕</button>`;
      list.appendChild(li);
    });
  }
  $('cartTotal').textContent = money(cart.reduce((s, it) => s + it.price * it.qty, 0));
}

$('cartItems').addEventListener('click', (e) => {
  const rm = e.target.closest('.rm');
  if (!rm) return;
  cart.splice(Number(rm.dataset.i), 1);
  save('aurora-cart', cart);
  renderCart();
});

$('addToCart').addEventListener('click', () => { addToCart(getQty()); toast(`Added ${getQty()} × ${selStyle} (${selColor.name}) to cart`); });
$('buyNow').addEventListener('click', () => { addToCart(getQty()); openCart(true); });
$('checkoutBtn').addEventListener('click', () => {
  if (!cart.length) { toast('Cart is empty — add something first!'); return; }
  toast('✅ Order placed! Thank you for shopping.');
  cart = []; save('aurora-cart', cart); renderCart(); openCart(false);
});

function openCart(open) {
  $('cartDrawer').classList.toggle('hidden', !open);
  $('overlay').classList.toggle('hidden', !open);
}
$('cartBtn').addEventListener('click', () => openCart(true));
$('closeCart').addEventListener('click', () => openCart(false));
$('overlay').addEventListener('click', () => openCart(false));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') openCart(false); });

// --- Reviews ---
function starStr(n) { return '★'.repeat(n) + '☆'.repeat(5 - n); }
function renderReviews() {
  $('reviewList').innerHTML = '';
  reviews.forEach((r) => {
    const li = document.createElement('li');
    li.className = 'review-card';
    li.innerHTML = `<div class="who">${escapeHtml(r.who)} <span class="stars" style="font-size:.9rem">${starStr(r.stars)}</span></div>
      <div class="when">${escapeHtml(r.when)}</div><p>${escapeHtml(r.text)}</p>`;
    $('reviewList').appendChild(li);
  });
  const avg = reviews.reduce((s, r) => s + r.stars, 0) / (reviews.length || 1);
  document.querySelector('.rating-text strong').textContent = avg.toFixed(1);
  // FIX: previously used childNodes[3], which was undefined (the <span> only has
  // 3 child nodes) and threw on page load AND after every review submit.
  const countLink = document.querySelector('.rating-text a');
  if (countLink) {
    countLink.textContent = `${baseReviewCount + reviews.length} reviews`;
  }
}
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (ch) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[ch])); }

$('starPick').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-v]');
  if (!btn) return;
  pickRating = Number(btn.dataset.v);
  [...$('starPick').children].forEach((b) => b.classList.toggle('lit', Number(b.dataset.v) <= pickRating));
});
$('reviewForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const text = $('reviewText').value.trim();
  if (!pickRating) { toast('Please pick a star rating.'); return; }
  if (!text) return;
  reviews.unshift({ who: 'You', stars: pickRating, text, when: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) });
  save('aurora-reviews', reviews);
  renderReviews();
  $('reviewText').value = '';
  pickRating = 0;
  [...$('starPick').children].forEach((b) => b.classList.remove('lit'));
  toast('Thanks for your review! ⭐');
});

// --- Toast ---
let toastTimer = null;
function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 2200);
}

// Init
renderGallery();
renderOptions();
updatePrice();
renderCart();
renderReviews();
