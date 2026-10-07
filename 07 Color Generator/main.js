const colorShow = document.querySelector(".colorShow");
const colorText = document.querySelector(".colorText");
const button = document.querySelector(".button");
const hexValue = document.querySelector(".hexValue");
const rgbValue = document.querySelector(".rgbValue");
const hslValue = document.querySelector(".hslValue");
const cmykValue = document.querySelector(".cmykValue");
const recBox = document.querySelectorAll(".recBox");

const HEX_CHARS = "0123456789ABCDEF";
let currentHex = "";

// Recent palette starts EMPTY (previously it was pre-filled with fake greys).
const recentColors = [];

/* ---------- Local color conversions (no external API needed) ---------- */
function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}
function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0));
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}
function rgbToCmyk({ r, g, b }) {
  const rr = r / 255, gg = g / 255, bb = b / 255;
  const k = 1 - Math.max(rr, gg, bb);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - rr - k) / (1 - k)) * 100),
    m: Math.round(((1 - gg - k) / (1 - k)) * 100),
    y: Math.round(((1 - bb - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}
// Small friendly name lookup (best-effort; falls back to the hex code).
function colorName(hex, hsl) {
  if (hsl.l >= 97) return "White";
  if (hsl.l <= 4) return "Black";
  if (hsl.s <= 8) return hsl.l > 66 ? "Light Gray" : hsl.l > 33 ? "Gray" : "Dark Gray";
  const h = hsl.h;
  const light = hsl.l > 70, dark = hsl.l < 28;
  const band =
    h < 15 || h >= 345 ? "Red" :
    h < 40 ? "Orange" :
    h < 65 ? "Yellow" :
    h < 150 ? "Green" :
    h < 190 ? "Cyan" :
    h < 250 ? "Blue" :
    h < 290 ? "Purple" : "Pink";
  return (dark ? "Dark " : light ? "Light " : "") + band;
}

function generateHex() {
  let out = "";
  for (let i = 0; i < 6; i++) out += HEX_CHARS[Math.floor(Math.random() * 16)];
  return out;
}

function renderColor(hex) {
  currentHex = hex.toUpperCase();
  const full = "#" + currentHex;
  const rgb = hexToRgb(currentHex);
  const hsl = rgbToHsl(rgb);
  const cmyk = rgbToCmyk(rgb);

  colorShow.style.backgroundColor = full;
  colorText.innerText = colorName(full, hsl);
  hexValue.innerText = full;
  rgbValue.innerText = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  hslValue.innerText = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  cmykValue.innerText = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;

  // Update recent swatches (most recent first)
  recentColors.unshift(full);
  if (recentColors.length > 6) recentColors.pop();
  recBox.forEach((box, i) => {
    box.style.backgroundColor = recentColors[i] || "#e9e9ee";
    box.dataset.color = recentColors[i] || "";
    box.title = recentColors[i] ? `Click to copy ${recentColors[i]}` : "";
  });
}

/* ---------------- Clipboard copying (advertised feature) ---------------- */
async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) { /* fall through to legacy path */ }
  // Fallback for non-secure contexts / older browsers
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
  document.body.removeChild(ta);
  return ok;
}

function flashCopied(btn) {
  btn.classList.add("copied");
  setTimeout(() => btn.classList.remove("copied"), 1200);
}

const valueByType = {
  hex: () => hexValue.innerText.trim(),
  rgb: () => rgbValue.innerText.trim(),
  hsl: () => hslValue.innerText.trim(),
  cmyk: () => cmykValue.innerText.trim(),
};

document.querySelectorAll(".copyBtn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const get = valueByType[btn.dataset.copy];
    const text = get ? get() : "";
    if (!text || text.includes("---")) return; // nothing generated yet
    if (await copyText(text)) flashCopied(btn);
  });
});

// Recent swatches are clickable too
recBox.forEach((box) => {
  box.style.cursor = "pointer";
  box.addEventListener("click", async () => {
    const c = box.dataset.color;
    if (c && await copyText(c)) flashCopied(box);
  });
});

/* -------------------------------- Main -------------------------------- */
button.addEventListener("click", () => renderColor(generateHex()));

// Generate a real random color on page load (was #000000 before)
renderColor(generateHex());
