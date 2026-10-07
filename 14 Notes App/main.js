"use strict";

/* ------------------------------------------------------------------ */
/*  Storage helpers                                                    */
/* ------------------------------------------------------------------ */
const STORAGE_KEY = "notesApp.items";

function loadNotes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveNotes() {
  // Storage can fail (quota exceeded / private mode) — surface it instead of crashing.
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return true;
  } catch {
    setStatus("Could not save: browser storage is full or unavailable.");
    return false;
  }
}

function setStatus(msg) {
  const el = document.getElementById("statusMsg");
  if (el) el.textContent = msg;
}

/* ------------------------------------------------------------------ */
/*  Elements & state                                                   */
/* ------------------------------------------------------------------ */
const titleInput = document.getElementById("noteTitle");
const bodyInput = document.getElementById("noteBody");
const addBtn = document.getElementById("addBtn");
const searchInput = document.getElementById("searchInput");
const notesGrid = document.getElementById("notesGrid");
const emptyState = document.getElementById("emptyState");
const notesCount = document.getElementById("notesCount");
const charCount = document.getElementById("charCount");
const swatches = Array.from(document.querySelectorAll(".swatch"));

let notes = loadNotes(); // [{id, title, body, color, date}]
let selectedColor = "yellow";
let editingId = null;

/* ------------------------------------------------------------------ */
/*  Color picker                                                       */
/* ------------------------------------------------------------------ */
swatches.forEach((sw) => {
  sw.addEventListener("click", () => {
    selectedColor = sw.dataset.color;
    swatches.forEach((s) => {
      s.classList.toggle("active", s === sw);
      s.setAttribute("aria-checked", String(s === sw));
    });
  });
});

/* ------------------------------------------------------------------ */
/*  Character counter                                                  */
/* ------------------------------------------------------------------ */
bodyInput.addEventListener("input", () => {
  charCount.textContent = `${bodyInput.value.length} / 2000`;
});

/* ------------------------------------------------------------------ */
/*  Add / update note                                                  */
/* ------------------------------------------------------------------ */
addBtn.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  if (!title && !body) {
    titleInput.focus();
    shake(addBtn);
    return;
  }

  if (editingId !== null) {
    const note = notes.find((n) => n.id === editingId);
    if (note) {
      note.title = title || "(Untitled)";
      note.body = body;
      note.color = selectedColor;
      note.date = Date.now();
    }
    cancelEdit();
  } else {
    notes.unshift({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      title: title || "(Untitled)",
      body,
      color: selectedColor,
      date: Date.now(),
    });
  }

  saveNotes();
  clearComposer();
  render();
});

function clearComposer() {
  titleInput.value = "";
  bodyInput.value = "";
  charCount.textContent = "0 / 2000";
  titleInput.focus();
}

function shake(el) {
  el.style.animation = "none";
  void el.offsetWidth; // restart animation
  el.animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-5px)" },
      { transform: "translateX(5px)" },
      { transform: "translateX(-4px)" },
      { transform: "translateX(0)" },
    ],
    { duration: 260 }
  );
}

/* ------------------------------------------------------------------ */
/*  Edit mode                                                          */
/* ------------------------------------------------------------------ */
function startEdit(note) {
  editingId = note.id;
  titleInput.value = note.title === "(Untitled)" ? "" : note.title;
  bodyInput.value = note.body;
  charCount.textContent = `${note.body.length} / 2000`;
  selectedColor = note.color;
  swatches.forEach((s) => {
    s.classList.toggle("active", s.dataset.color === note.color);
    s.setAttribute("aria-checked", String(s.dataset.color === note.color));
  });
  addBtn.textContent = "💾 Save Changes";
  cancelEditBtn.hidden = false; // Cancel only makes sense while editing
  window.scrollTo({ top: 0, behavior: "smooth" });
  titleInput.focus();
}

function cancelEdit() {
  editingId = null;
  addBtn.textContent = "➕ Add Note";
  cancelEditBtn.hidden = true;
  titleInput.value = "";
  bodyInput.value = "";
  charCount.textContent = "0 / 2000";
}

cancelEditBtn.addEventListener("click", cancelEdit);
// Escape also exits edit mode.
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && editingId !== null) cancelEdit();
});

/* ------------------------------------------------------------------ */
/*  Delete                                                             */
/* ------------------------------------------------------------------ */
function deleteNote(id, cardEl) {
  cardEl.classList.add("removing");
  setTimeout(() => {
    notes = notes.filter((n) => n.id !== id);
    if (editingId === id) cancelEdit();
    saveNotes();
    render();
  }, 180);
}

/* ------------------------------------------------------------------ */
/*  Search                                                             */
/* ------------------------------------------------------------------ */
searchInput.addEventListener("input", render);

/* Ctrl/Cmd+Enter in composer submits */
bodyInput.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") addBtn.click();
});

/* ------------------------------------------------------------------ */
/*  Rendering                                                          */
/* ------------------------------------------------------------------ */
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function highlight(text, query) {
  // FIX: previously we regex-replaced on the FULLY escaped string, so searching
  // for "amp"/"lt"/"gt" injected <mark> inside &amp;/&lt;/&gt; entities and broke
  // rendering. Correct approach: split the RAW text around matches (case-insensitive),
  // escape each piece individually, then wrap only the escaped match in <mark>.
  if (!query) return escapeHtml(text);
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  let out = "";
  let i = 0;
  while (true) {
    const idx = lower.indexOf(q, i);
    if (idx === -1) { out += escapeHtml(text.slice(i)); break; }
    out += escapeHtml(text.slice(i, idx));
    out += "<mark>" + escapeHtml(text.slice(idx, idx + q.length)) + "</mark>";
    i = idx + q.length;
  }
  return out;
}

function formatDate(ts) {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function render() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = notes.filter(
    (n) =>
      !query ||
      n.title.toLowerCase().includes(query) ||
      n.body.toLowerCase().includes(query)
  );

  notesGrid.innerHTML = "";
  filtered.forEach((note) => {
    const card = document.createElement("article");
    card.className = `note ${note.color}`;

    card.innerHTML = `
      <h3 class="note-title">${highlight(note.title, query)}</h3>
      <p class="note-body">${highlight(note.body, query)}</p>
      <div class="note-footer">
        <span class="note-date">${formatDate(note.date)}</span>
        <div class="note-actions">
          <button type="button" class="icon-btn edit" aria-label="Edit note">✏️</button>
          <button type="button" class="icon-btn del" aria-label="Delete note">🗑️</button>
        </div>
      </div>`;

    card.querySelector(".edit").addEventListener("click", () => startEdit(note));
    card.querySelector(".del").addEventListener("click", () => {
      if (confirm(`Delete "${note.title}"?`)) deleteNote(note.id, card);
    });

    notesGrid.appendChild(card);
  });

  // Empty states
  if (filtered.length === 0) {
    emptyState.classList.remove("hidden");
    emptyState.textContent =
      notes.length === 0
        ? "📭 No notes yet — add your first one above!"
        : "🔍 No notes match your search.";
  } else {
    emptyState.classList.add("hidden");
  }

  notesCount.textContent = `${notes.length} note${notes.length === 1 ? "" : "s"}`;
}

/* Initial paint */
render();
