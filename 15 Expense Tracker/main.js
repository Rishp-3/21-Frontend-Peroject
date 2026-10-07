"use strict";

/* ------------------------------------------------------------------ */
/*  Storage                                                            */
/* ------------------------------------------------------------------ */
const STORAGE_KEY = "expenseTracker.items";
const CURRENCY_KEY = "expenseTracker.currency";

function loadTransactions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTransactions() {
  // Storage can fail (quota / private mode) — surface instead of crashing.
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch {
    alert("Could not save: browser storage is full or unavailable.");
  }
}

/* Local date as YYYY-MM-DD (toISOString() is UTC and would show yesterday's
   date late at night in timezones ahead of UTC, e.g. Asia/Kolkata). */
function localTodayISO(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/* ------------------------------------------------------------------ */
/*  Elements & state                                                   */
/* ------------------------------------------------------------------ */
const txForm = document.getElementById("txForm");
const descInput = document.getElementById("txDesc");
const amountInput = document.getElementById("txAmount");
const categorySelect = document.getElementById("txCategory");
const dateInput = document.getElementById("txDate");
const filterType = document.getElementById("filterType");
const filterSort = document.getElementById("filterSort");
const txList = document.getElementById("txList");
const emptyState = document.getElementById("emptyState");
const clearAllBtn = document.getElementById("clearAllBtn");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

const balanceAmt = document.getElementById("balanceAmt");
const incomeAmt = document.getElementById("incomeAmt");
const expenseAmt = document.getElementById("expenseAmt");

let transactions = loadTransactions(); // [{id, desc, amount(cents), type, category, date}]

// Default date = today (YYYY-MM-DD for the date input)
dateInput.value = localTodayISO();

/* ------------------------------------------------------------------ */
/*  Income / expense toggle styling                                    */
/* ------------------------------------------------------------------ */
const typeRadios = Array.from(document.querySelectorAll('input[name="txType"]'));
function refreshToggleUI() {
  const value = typeRadios.find((r) => r.checked).value;
  document.querySelector(".income-opt").classList.toggle("selected", value === "income");
  document.querySelector(".expense-opt").classList.toggle("selected", value === "expense");
}
typeRadios.forEach((r) => r.addEventListener("change", refreshToggleUI));
refreshToggleUI();

/* ------------------------------------------------------------------ */
/*  Money helpers (store cents to avoid float drift)                   */
/* ------------------------------------------------------------------ */
const CURRENCIES = { USD: "en-US", INR: "en-IN", EUR: "de-DE" };
let currency = (() => {
  try { return localStorage.getItem(CURRENCY_KEY) || "USD"; } catch { return "USD"; }
})();
if (!CURRENCIES[currency]) currency = "USD";

function fmt(cents) {
  return (cents / 100).toLocaleString(CURRENCIES[currency], {
    style: "currency",
    currency,
  });
}

// Currency selector wiring
const currencySelect = document.getElementById("currencySelect");
currencySelect.value = currency;
currencySelect.addEventListener("change", () => {
  currency = currencySelect.value;
  try { localStorage.setItem(CURRENCY_KEY, currency); } catch {}
  render();
});

function toCents(str) {
  return Math.round(parseFloat(str) * 100);
}

/* ------------------------------------------------------------------ */
/*  Add transaction                                                    */
/* ------------------------------------------------------------------ */
let editingId = null;

txForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const desc = descInput.value.trim();
  const cents = toCents(amountInput.value);
  const type = typeRadios.find((r) => r.checked).value;
  const category = categorySelect.value;
  const date = dateInput.value;

  if (!desc || !Number.isFinite(cents) || cents <= 0 || !category || !date) {
    return; // HTML5 validation normally catches this
  }

  if (editingId) {
    // Update the transaction being edited, then leave edit mode.
    const t = transactions.find((x) => x.id === editingId);
    if (t) Object.assign(t, { desc, amount: cents, type, category, date });
    stopEdit();
  } else {
    transactions.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      desc,
      amount: cents,
      type,
      category,
      date,
    });
  }

  saveTransactions();
  txForm.reset();
  dateInput.value = localTodayISO();
  refreshToggleUI();
  render();
});

function startEdit(t) {
  editingId = t.id;
  descInput.value = t.desc;
  amountInput.value = (t.amount / 100).toFixed(2);
  categorySelect.value = t.category;
  dateInput.value = t.date;
  typeRadios.forEach((r) => { r.checked = r.value === t.type; });
  refreshToggleUI();
  submitBtn.textContent = "Update Transaction";
  cancelEditBtn.hidden = false;
  descInput.focus();
}

function stopEdit() {
  editingId = null;
  submitBtn.textContent = "Add Transaction";
  cancelEditBtn.hidden = true;
}

cancelEditBtn.addEventListener("click", () => {
  txForm.reset();
  dateInput.value = localTodayISO();
  refreshToggleUI();
  stopEdit();
});

/* ------------------------------------------------------------------ */
/*  Delete / clear                                                     */
/* ------------------------------------------------------------------ */
function deleteTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  saveTransactions();
  render();
}

clearAllBtn.addEventListener("click", () => {
  if (transactions.length === 0) return;
  if (confirm("Delete ALL transactions? This cannot be undone.")) {
    transactions = [];
    saveTransactions();
    render();
  }
});

/* ------------------------------------------------------------------ */
/*  Filters                                                            */
/* ------------------------------------------------------------------ */
filterType.addEventListener("change", render);
filterSort.addEventListener("change", render);

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

function visibleTransactions() {
  let list = [...transactions];
  const type = filterType.value;
  if (type !== "all") list = list.filter((t) => t.type === type);

  switch (filterSort.value) {
    case "oldest":
      list.sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
      break;
    case "high":
      list.sort((a, b) => b.amount - a.amount);
      break;
    case "low":
      list.sort((a, b) => a.amount - b.amount);
      break;
    default: // newest
      list.sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  }
  return list;
}

function renderSummary() {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  balanceAmt.textContent = fmt(income - expense);
  incomeAmt.textContent = fmt(income);
  expenseAmt.textContent = fmt(expense);
  renderBreakdown();
}

const breakdownBars = document.getElementById("breakdownBars");
const breakdownEmpty = document.getElementById("breakdownEmpty");

/* Simple horizontal CSS bars: one per expense category, width ∝ share of total. */
function renderBreakdown() {
  const totals = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => { totals[t.category] = (totals[t.category] || 0) + t.amount; });

  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const max = entries.length ? entries[0][1] : 0;
  breakdownBars.innerHTML = "";
  breakdownEmpty.hidden = entries.length > 0;

  entries.forEach(([cat, cents], i) => {
    const row = document.createElement("div");
    row.className = "bar-row";
    const label = document.createElement("span");
    label.className = "bar-label";
    label.textContent = cat;
    const track = document.createElement("div");
    track.className = "bar-track";
    const fill = document.createElement("div");
    fill.className = "bar-fill";
    fill.style.width = `${Math.round((cents / max) * 100)}%`;
    fill.setAttribute("role", "img");
    fill.setAttribute("aria-label", `${cat}: ${fmt(cents)}`);
    const amt = document.createElement("span");
    amt.className = "bar-amount";
    amt.textContent = fmt(cents);
    track.appendChild(fill);
    row.append(label, track, amt);
    breakdownBars.appendChild(row);
  });
}

function render() {
  const list = visibleTransactions();
  txList.innerHTML = "";

  list.forEach((t) => {
    const li = document.createElement("li");
    li.className = `tx-item ${t.type}`;
    const sign = t.type === "income" ? "+" : "−";
    li.innerHTML = `
      <div class="tx-info">
        <div class="tx-desc">${escapeHtml(t.desc)}</div>
        <div class="tx-meta">${escapeHtml(t.category)} • ${formatDate(t.date)}</div>
      </div>
      <span class="tx-amount ${t.type}">${sign}${fmt(t.amount)}</span>
      <span class="tx-actions">
        <button type="button" class="tx-edit" aria-label="Edit transaction">✏️</button>
        <button type="button" class="tx-del" aria-label="Delete transaction">🗑️</button>
      </span>`;
    li.querySelector(".tx-del").addEventListener("click", () => deleteTransaction(t.id));
    li.querySelector(".tx-edit").addEventListener("click", () => startEdit(t));
    txList.appendChild(li);
  });

  emptyState.classList.toggle("hidden", list.length > 0);
  emptyState.textContent =
    transactions.length === 0
      ? "No transactions yet. Add one above! 🧾"
      : "No transactions match the current filter. 🧐";

  renderSummary();
}

function formatDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* Initial paint */
render();
