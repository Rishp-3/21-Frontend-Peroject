"use strict";

/* ------------------------------------------------------------------ */
/*  Elements & state                                                   */
/* ------------------------------------------------------------------ */
const slidesEl = document.getElementById("slides");
const slideEls = Array.from(slidesEl.children);
const dotsEl = document.getElementById("dots");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const playToggle = document.getElementById("playToggle");
const progressBar = document.getElementById("progressBar");
const slider = document.getElementById("slider");

const AUTOPLAY_MS = 4000;
let current = 0;
let playing = true;
let hovering = false;
let progressRaf = null;
let slideStartTs = 0;

/* ------------------------------------------------------------------ */
/*  Dots                                                               */
/* ------------------------------------------------------------------ */
slideEls.forEach((_, i) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.className = "dot";
  dot.setAttribute("role", "tab");
  dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
  dot.addEventListener("click", () => goTo(i, true));
  dotsEl.appendChild(dot);
});
const dotEls = Array.from(dotsEl.children);

/* ------------------------------------------------------------------ */
/*  Core navigation                                                    */
/* ------------------------------------------------------------------ */
function render() {
  slidesEl.style.transform = `translateX(-${current * 100}%)`;
  dotEls.forEach((d, i) => {
    d.classList.toggle("active", i === current);
    d.setAttribute("aria-selected", String(i === current));
  });
}

function goTo(index, userAction = false) {
  current = (index + slideEls.length) % slideEls.length;
  render();
  if (userAction) restartAutoplay();
}

function next() {
  goTo(current + 1);
}

function prev() {
  goTo(current - 1);
}

/* ------------------------------------------------------------------ */
/*  Autoplay + progress bar                                            */
/* ------------------------------------------------------------------ */
function tickProgress(ts) {
  if (!playing) return;
  if (hovering) {
    // While hovered, keep the loop alive but freeze progress
    progressRaf = requestAnimationFrame(tickProgress);
    return;
  }
  if (!slideStartTs) slideStartTs = ts;
  const elapsed = ts - slideStartTs;
  progressBar.style.width = `${Math.min((elapsed / AUTOPLAY_MS) * 100, 100)}%`;
  if (elapsed >= AUTOPLAY_MS) {
    slideStartTs = ts;
    next();
  }
  progressRaf = requestAnimationFrame(tickProgress);
}

function startAutoplay() {
  playing = true;
  playToggle.textContent = "⏸ Pause";
  playToggle.setAttribute("aria-pressed", "true");
  slideStartTs = 0;
  cancelAnimationFrame(progressRaf);
  progressRaf = requestAnimationFrame(tickProgress);
}

function stopAutoplay() {
  playing = false;
  playToggle.textContent = "▶ Play";
  playToggle.setAttribute("aria-pressed", "false");
  cancelAnimationFrame(progressRaf);
  progressBar.style.width = "0%";
}

function restartAutoplay() {
  if (playing) {
    slideStartTs = 0; // reset progress after a manual jump
  }
}

playToggle.addEventListener("click", () => {
  if (playing) stopAutoplay();
  else startAutoplay();
});

/* Pause on hover, resume on leave (desktop nicety) */
slider.addEventListener("mouseenter", () => {
  hovering = true;
});
slider.addEventListener("mouseleave", () => {
  hovering = false;
  slideStartTs = 0; // restart the interval cleanly after the pause
});

/* ------------------------------------------------------------------ */
/*  Buttons & keyboard                                                 */
/* ------------------------------------------------------------------ */
prevBtn.addEventListener("click", () => {
  prev();
  restartAutoplay();
});
nextBtn.addEventListener("click", () => {
  next();
  restartAutoplay();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    prev();
    restartAutoplay();
  } else if (event.key === "ArrowRight") {
    next();
    restartAutoplay();
  }
});

/* ------------------------------------------------------------------ */
/*  Touch swipe                                                        */
/* ------------------------------------------------------------------ */
let touchStartX = 0;
let touchEndX = 0;

slidesEl.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

slidesEl.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) next();
    else prev();
    restartAutoplay();
  }
}, { passive: true });

/* ------------------------------------------------------------------ */
/*  Init                                                               */
/* ------------------------------------------------------------------ */
render();
startAutoplay();
