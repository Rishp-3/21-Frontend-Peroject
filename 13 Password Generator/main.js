"use strict";

/* ------------------------------------------------------------------ */
/*  Character sets                                                     */
/* ------------------------------------------------------------------ */
const CHARSETS = {
  upper: "ABCDEFGHJKLMNPQRSTUVWXYZ", // ambiguous chars (I, O) removed
  lower: "abcdefghijkmnopqrstuvwxyz", // ambiguous chars (l) removed
  numbers: "23456789", // ambiguous chars (0, 1) removed
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?",
};

/* ------------------------------------------------------------------ */
/*  Elements                                                           */
/* ------------------------------------------------------------------ */
const output = document.getElementById("pwOutput");
const copyBtn = document.getElementById("copyBtn");
const copyMsg = document.getElementById("copyMsg");
const lengthRange = document.getElementById("lengthRange");
const lengthValue = document.getElementById("lengthValue");
const generateBtn = document.getElementById("generateBtn");
const strengthFill = document.getElementById("strengthFill");
const strengthLabel = document.getElementById("strengthLabel");
const historyList = document.getElementById("historyList");

const optEls = {
  upper: document.getElementById("optUpper"),
  lower: document.getElementById("optLower"),
  numbers: document.getElementById("optNumbers"),
  symbols: document.getElementById("optSymbols"),
};

const history = []; // in-memory only — never persisted for security

/* ------------------------------------------------------------------ */
/*  Cryptographically stronger random index                            */
/* ------------------------------------------------------------------ */
function secureRandomInt(max) {
  if (window.crypto && window.crypto.getRandomValues) {
    const arr = new Uint32Array(1);
    window.crypto.getRandomValues(arr);
    return arr[0] % max;
  }
  return Math.floor(Math.random() * max);
}

/* ------------------------------------------------------------------ */
/*  Generation                                                         */
/* ------------------------------------------------------------------ */
function activeSets() {
  return Object.keys(CHARSETS).filter((k) => optEls[k].checked);
}

function generatePassword() {
  const sets = activeSets();
  const length = Number(lengthRange.value);

  if (sets.length === 0) {
    output.value = "";
    copyMsg.textContent = "⚠ Select at least one character type!";
    copyMsg.style.color = "#f87171";
    updateStrength("");
    return;
  }

  // Guarantee at least one character from every selected set
  const chars = sets.map(
    (key) => CHARSETS[key][secureRandomInt(CHARSETS[key].length)],
  );

  // Fill the rest from the combined pool
  const pool = sets.map((key) => CHARSETS[key]).join("");
  while (chars.length < length) {
    chars.push(pool[secureRandomInt(pool.length)]);
  }

  // Fisher–Yates shuffle so guaranteed chars aren't always first
  for (let i = chars.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  const pw = chars.slice(0, length).join("");
  output.value = pw;
  copyMsg.textContent = "";
  updateStrength(pw);
  addHistory(pw);
}

/* ------------------------------------------------------------------ */
/*  Strength meter (entropy-based)                                     */
/* ------------------------------------------------------------------ */
function updateStrength(pw) {
  if (!pw) {
    strengthFill.style.width = "0%";
    strengthLabel.textContent = "Strength: –";
    return;
  }

  let poolSize = 0;
  if (/[A-Z]/.test(pw)) poolSize += 24;
  if (/[a-z]/.test(pw)) poolSize += 25;
  if (/[0-9]/.test(pw)) poolSize += 8;
  if (/[^A-Za-z0-9]/.test(pw)) poolSize += 26;

  const entropy = pw.length * Math.log2(Math.max(poolSize, 2)); // bits

  let pct, label, color;
  if (entropy < 40) {
    pct = 25;
    label = "Weak";
    color = "#dc2626";
  } else if (entropy < 60) {
    pct = 50;
    label = "Fair";
    color = "#f59e0b";
  } else if (entropy < 90) {
    pct = 75;
    label = "Strong";
    color = "#84cc16";
  } else {
    pct = 100;
    label = "Very Strong";
    color = "#22c55e";
  }

  strengthFill.style.width = `${pct}%`;
  strengthFill.style.background = color;
  strengthLabel.textContent = `Strength: ${label} (~${Math.round(entropy)} bits)`;
}

/* ------------------------------------------------------------------ */
/*  History                                                            */
/* ------------------------------------------------------------------ */
function addHistory(pw) {
  if (history[0] === pw) return;
  history.unshift(pw);
  if (history.length > 5) history.pop();
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = "";
  if (history.length === 0) {
    const li = document.createElement("li");
    li.className = "history-empty";
    li.textContent = "No passwords generated yet.";
    historyList.appendChild(li);
    return;
  }
  history.forEach((pw) => {
    const li = document.createElement("li");
    li.textContent = pw;
    li.title = "Click to copy";
    li.addEventListener("click", () => copyToClipboard(pw));
    historyList.appendChild(li);
  });
}

/* ------------------------------------------------------------------ */
/*  Copy to clipboard                                                  */
/* ------------------------------------------------------------------ */
async function copyToClipboard(text) {
  if (!text) return;
  let ok = false;
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      ok = false;
    }
  }
  if (!ok) {
    // Fallback for older browsers / insecure contexts (file://)
    const prevType = output.type;
    output.type = "text"; // reveal so selection works
    output.select();
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    window.getSelection().removeAllRanges();
    output.type = prevType;
  }
  showCopied(
    ok
      ? "✅ Copied to clipboard!"
      : "⚠ Copy failed — select and copy manually.",
  );
}

function showCopied(msg) {
  copyMsg.textContent = msg;
  copyMsg.style.color = msg.startsWith("✅") ? "#4ade80" : "#f87171";
  clearTimeout(showCopied.t);
  showCopied.t = setTimeout(() => (copyMsg.textContent = ""), 2200);
}

/* ------------------------------------------------------------------ */
/*  Wiring                                                             */
/* ------------------------------------------------------------------ */
lengthRange.addEventListener("input", () => {
  lengthValue.textContent = lengthRange.value;
});

Object.values(optEls).forEach((cb) =>
  cb.addEventListener("change", generatePassword),
);
generateBtn.addEventListener("click", generatePassword);
copyBtn.addEventListener("click", () => copyToClipboard(output.value));

// Initial password on load
generatePassword();
