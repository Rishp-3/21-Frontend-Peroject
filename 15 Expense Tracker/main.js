"use strict";

/* ------------------------------------------------------------------ */
/*  Storage                                                            */
/* ------------------------------------------------------------------ */
const STORAGE_KEY = "expenseTracker.items";

function loadTransactions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTransactions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
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

const balanceAmt = document.getElementById("balanceAmt");
const incomeAmt = document.getElementById("incomeAmt");
const expenseAmt = document.getElementById("expenseAmt");

let transactions = loadTransactions(); // [{id, desc, amount(cents), type, category, date}]

// Default date = today (YYYY-MM-DD for the date input)
dateInput.value = new Date().toISOString().slice(0, 10);

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
function fmt(cents) {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function toCents(str) {
  return Math.round(parseFloat(str) * 100);
}

/* ------------------------------------------------------------------ */
/*  Add transaction                                                    */
/* ------------------------------------------------------------------ */
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

  transactions.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    desc,
    amount: cents,
    type,
    category,
    date,
  });

  saveTransactions();
  txForm.reset();
  dateInput.value = new Date().toISOString().slice(0, 10);
  refreshToggleUI();
  render();
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
      <button type="button" class="tx-del" aria-label="Delete transaction">❌</button>`;
    li.querySelector(".tx-del").addEventListener("click", () => deleteTransaction(t.id));
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
