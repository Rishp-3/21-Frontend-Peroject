// 16 - Movie Search App (OMDb API)
// SECURITY NOTE: the previous OMDb key committed here was a PERSONAL key (OMDb
// has no public demo keys) and is still visible in git history — rotate it.
// Get your own free key at https://www.omdbapi.com/apikey.aspx and put it in
// config.js (gitignored; copy config.example.js to config.js).
const API_KEY = (typeof MOVIE_CONFIG !== 'undefined' && MOVIE_CONFIG.API_KEY) || '';
const BASE = 'https://www.omdbapi.com/';

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const yearFilter = document.getElementById('yearFilter');
const statusLine = document.getElementById('statusLine');
const resultsGrid = document.getElementById('resultsGrid');
const pager = document.getElementById('pager');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const modalContent = document.getElementById('modalContent');

let state = { query: '', page: 1, totalResults: 0 };
let debounceTimer = null;

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

function setStatus(msg, isError = false) {
  statusLine.textContent = msg || '';
  statusLine.classList.toggle('error', Boolean(isError));
}

function showSkeletons(n = 8) {
  resultsGrid.innerHTML = Array.from({ length: n }, () => `
    <div class="skeleton">
      <div class="sk-line sk-poster"></div>
      <div class="sk-line" style="width:80%"></div>
      <div class="sk-line" style="width:45%"></div>
    </div>`).join('');
}

function renderResults(items) {
  resultsGrid.innerHTML = items.map((m) => `
    <article class="movie-card" data-id="${esc(m.imdbID)}" tabindex="0" role="button" aria-label="Details for ${esc(m.Title)}">
      <div class="poster-wrap">
        ${m.Poster && m.Poster !== 'N/A'
          ? `<img class="poster-img" src="${esc(m.Poster)}" alt="Poster for ${esc(m.Title)}" loading="lazy">`
          : '<div class="no-poster">No Poster</div>'}
      </div>
      <div class="movie-info">
        <h2 class="movie-title">${esc(m.Title)}</h2>
        <p class="movie-year">${esc(m.Year)}</p>
      </div>
    </article>`).join('');
}

function updatePager() {
  const totalPages = Math.ceil(state.totalResults / 10);
  pageInfo.textContent = `Page ${state.page} of ${Math.max(totalPages, 1)} (${state.totalResults} results)`;
  prevBtn.disabled = state.page <= 1;
  nextBtn.disabled = state.page >= totalPages;
  pager.style.visibility = state.query ? 'visible' : 'hidden';
}

let reqCounter = 0;
async function search(page = 1) {
  const q = state.query.trim();
  if (!q) return;
  if (!API_KEY) {
    resultsGrid.innerHTML = '';
    state.totalResults = 0;
    updatePager();
    setStatus('No API key configured. Add your free OMDb API key to API_KEY in main.js.', true);
    return;
  }
  const reqId = ++reqCounter;
  state.reqId = reqId;
  state.page = page;
  showSkeletons();
  setStatus(`Searching “${q}”…`);
  try {
    const params = new URLSearchParams({ apikey: API_KEY, type: 'movie', page: String(page) });
    if (q.length) params.set('s', q);
    const y = yearFilter.value;
    if (y) params.set('y', y);
    const res = await fetch(`${BASE}?${params}`);
    const data = await res.json();
    if (reqId !== state.reqId) return; // stale
    if (reqId !== state.reqId) return; // stale response – newer search already in flight
    if (data.Response === 'False') {
      resultsGrid.innerHTML = '';
      const msg = data.Error && /invalid api key/i.test(data.Error)
        ? 'Invalid API key – add your own OMDb key to API_KEY in main.js.'
        : data.Error && /limit/i.test(data.Error)
          ? 'OMDb daily request limit reached – try again tomorrow.'
          : `No movies found for “${q}”.`;
      setStatus(msg, true);
      state.totalResults = 0;
      updatePager();
      return;
    }
    state.totalResults = Number(data.totalResults) || 0;
    renderResults(data.Search || []);
    setStatus(`Found ${state.totalResults} result${state.totalResults === 1 ? '' : 's'} for “${q}”.`);
    updatePager();
  } catch (err) {
    if (reqId !== state.reqId) return;
    resultsGrid.innerHTML = '';
    setStatus('Network error — please check your connection and try again.', true);
  }

  // Replace broken poster URLs with a placeholder after render
  resultsGrid.querySelectorAll('img.poster-img').forEach((img) => {
    img.addEventListener('error', () => {
      const ph = document.createElement('div');
      ph.className = 'no-poster';
      ph.textContent = 'No Poster';
      img.replaceWith(ph);
    });
  });
}

async function openDetail(imdbID) {
  modalContent.innerHTML = '<p>Loading details…</p>';
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  try {
    const res = await fetch(`${BASE}?apikey=${API_KEY}&i=${imdbID}&plot=full`);
    const m = await res.json();
    if (m.Response === 'False') {
      modalContent.innerHTML = '<p>Could not load details.</p>';
      return;
    }
    const ratings = (m.Ratings || [])
      .map((r) => `<span class="rating-chip">${esc(r.Source)}: ${esc(r.Value)}</span>`)
      .join('');
    modalContent.innerHTML = `
      <div class="modal-row">
        <div class="modal-poster">
          ${m.Poster && m.Poster !== 'N/A' ? `<img src="${esc(m.Poster)}" alt="Poster for ${esc(m.Title)}">` : '<div class="no-poster">No Poster</div>'}
        </div>
        <div class="modal-details">
          <h2 id="modalTitle">${esc(m.Title)} <span class="movie-year">(${esc(m.Year)})</span></h2>
          <p class="modal-meta">${esc(m.Rated)} • ${esc(m.Released)} • ${esc(m.Runtime)} • ${esc(m.Genre)}</p>
          <p class="modal-plot">${esc(m.Plot)}</p>
          <p class="modal-meta"><strong>Director:</strong> ${esc(m.Director)}<br><strong>Cast:</strong> ${esc(m.Actors)}</p>
          <div class="ratings">${ratings}</div>
        </div>
      </div>`;
  } catch {
    modalContent.innerHTML = '<p>Network error while loading details.</p>';
  }
}

function closeModal() {
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

// Events
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  state.query = searchInput.value;
  search(1);
});

searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const q = searchInput.value.trim();
    if (q.length >= 2) {
      state.query = q;
      search(1);
    } else if (q === '') {
      resultsGrid.innerHTML = '';
      state.query = '';
      state.totalResults = 0;
      setStatus('Type at least 2 characters to search.');
      updatePager();
    }
  }, 500);
});

yearFilter.addEventListener('change', () => {
  if (state.query) search(1);
});

resultsGrid.addEventListener('click', (e) => {
  const card = e.target.closest('.movie-card');
  if (card) openDetail(card.dataset.id);
});
resultsGrid.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    const card = e.target.closest('.movie-card');
    if (card) { e.preventDefault(); openDetail(card.dataset.id); }
  }
});

prevBtn.addEventListener('click', () => { if (state.page > 1) search(state.page - 1); });
nextBtn.addEventListener('click', () => {
  const totalPages = Math.ceil(state.totalResults / 10);
  if (state.page < totalPages) search(state.page + 1);
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// Populate year dropdown (current year back to 1970)
(function populateYears() {
  const now = new Date().getFullYear();
  for (let y = now; y >= 1970; y--) {
    const opt = document.createElement('option');
    opt.value = String(y);
    opt.textContent = String(y);
    yearFilter.appendChild(opt);
  }
})();

setStatus('Type at least 2 characters to search.');
updatePager();
