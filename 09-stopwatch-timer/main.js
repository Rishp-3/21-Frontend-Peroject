// Stopwatch with lap tracking — uses performance.now() for accuracy.
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const msEl = document.getElementById("mseconds");
const startBtn = document.getElementById("startBtn");
const lapBtn = document.getElementById("lapBtn");
const resetBtn = document.getElementById("resetBtn");
const statusText = document.getElementById("statusText");
const lapTableBody = document.querySelector("#lapTable tbody");
const lapCountEl = document.getElementById("lapCount");
const emptyNote = document.getElementById("emptyNote");
const bestData = document.getElementById("bestData");
const worstData = document.getElementById("worstData");
const averageData = document.getElementById("averageData");

let running = false;
let elapsed = 0; // total elapsed ms
let startTime = 0;
let rafId = null;
let laps = []; // lap durations in ms
let lastLapMark = 0; // elapsed ms at previous lap

function pad(n, len = 2) {
  return String(n).padStart(len, "0");
}

function format(ms) {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const cs = Math.floor((ms % 1000) / 10);
  return { h: pad(h), m: pad(m), s: pad(s), cs: pad(cs) };
}

function formatFull(ms) {
  const t = format(ms);
  return `${t.h}:${t.m}:${t.s}.${t.cs}`;
}

function render() {
  const current = elapsed + (running ? performance.now() - startTime : 0);
  const t = format(current);
  hoursEl.textContent = t.h;
  minutesEl.textContent = t.m;
  secondsEl.textContent = t.s;
  msEl.textContent = "." + t.cs;
}

function tick() {
  if (!running) return;
  render();
  rafId = requestAnimationFrame(tick);
}

function setStatus() {
  if (running) {
    statusText.textContent = "Running";
    statusText.className = "running";
    startBtn.querySelector(".startText").textContent = "Pause";
    startBtn.querySelector(".startIcon").textContent = "⏸";
    startBtn.classList.add("running");
  } else {
    const idle = elapsed === 0;
    statusText.textContent = idle ? "Idle" : "Paused";
    statusText.className = idle ? "" : "paused";
    startBtn.querySelector(".startText").textContent = idle ? "Start" : "Resume";
    startBtn.querySelector(".startIcon").textContent = "▶";
    startBtn.classList.remove("running");
  }
  lapBtn.disabled = !running;
}

function renderLaps() {
  lapTableBody.innerHTML = "";
  lapCountEl.textContent = "Laps: " + laps.length;
  emptyNote.style.display = laps.length ? "none" : "block";

  if (laps.length) {
    let totalMs = 0;
    laps.forEach((lap, i) => {
      totalMs += lap;
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${i + 1}</td><td>${formatFull(lap)}</td><td>${formatFull(totalMs)}</td>`;
      lapTableBody.prepend(tr); // newest on top
    });

    const best = Math.min(...laps);
    const worst = Math.max(...laps);
    bestData.textContent = formatFull(best);
    worstData.textContent = formatFull(worst);
    averageData.textContent = formatFull(laps.reduce((a, b) => a + b, 0) / laps.length);

    // highlight rows
    [...lapTableBody.rows].forEach((row) => {
      // rowIndex counts rows inside <thead> too -> off-by-one. sectionRowIndex is
      // the index within tbody only, which matches how we prepend lap rows.
      const idx = row.sectionRowIndex; // tbody-only index (fixes off-by-one vs rowIndex)
      if (idx < 0 || idx >= laps.length) return;
      const lapTime = laps[laps.length - 1 - idx];
      // Highlight only the FIRST lap (lowest lap number) achieving best/worst time.
      const firstBestIdx = laps.indexOf(best);
      const firstWorstIdx = laps.indexOf(worst);
      if (lapTime === best && firstBestIdx === laps.length - 1 - idx) row.classList.add("best-lap");
      else if (lapTime === worst && firstWorstIdx === laps.length - 1 - idx) row.classList.add("worst-lap");
    });
  } else {
    bestData.textContent = "--:--.--";
    worstData.textContent = "--:--.--";
    averageData.textContent = "--:--.--";
  }
}

startBtn.addEventListener("click", function () {
  if (running) {
    running = false;
    elapsed += performance.now() - startTime;
    cancelAnimationFrame(rafId);
  } else {
    running = true;
    startTime = performance.now();
    tick();
  }
  setStatus();
});

lapBtn.addEventListener("click", function () {
  if (!running) return;
  const now = elapsed + (performance.now() - startTime);
  laps.push(now - lastLapMark);
  lastLapMark = now;
  renderLaps();
});

resetBtn.addEventListener("click", function () {
  running = false;
  cancelAnimationFrame(rafId);
  elapsed = 0;
  lastLapMark = 0;
  laps = [];
  render();
  renderLaps();
  setStatus();
});

// init
render();
setStatus();
renderLaps();
