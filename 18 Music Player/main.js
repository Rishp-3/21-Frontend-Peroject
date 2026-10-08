// 18 - Music Player (Web Audio synthesized tracks — no external audio files needed)
const tracks = [
  {
    title: "Neon Dreams",
    artist: "Synthwave Cat",
    bpm: 100,
    notes: [220, 261.63, 329.63, 261.63, 293.66, 349.23, 293.66, 261.63],
    wave: "sawtooth",
    beats: 32,
  },
  {
    title: "Midnight Loop",
    artist: "Chill Beats",
    bpm: 84,
    notes: [174.61, 220, 261.63, 220, 196, 246.94, 220, 174.61],
    wave: "triangle",
    beats: 32,
  },
  {
    title: "Pixel Party",
    artist: "Chip Trio",
    bpm: 128,
    notes: [523.25, 659.25, 783.99, 659.25, 587.33, 783.99, 880, 659.25],
    wave: "square",
    beats: 32,
  },
  {
    title: "Ocean Drive",
    artist: "Retrosunset",
    bpm: 92,
    notes: [196, 246.94, 293.66, 392, 349.23, 293.66, 246.94, 196],
    wave: "sine",
    beats: 32,
  },
];

const els = {
  art: document.getElementById("albumArt"),
  title: document.getElementById("trackTitle"),
  artist: document.getElementById("trackArtist"),
  seek: document.getElementById("seekBar"),
  cur: document.getElementById("curTime"),
  tot: document.getElementById("totTime"),
  shuffle: document.getElementById("shuffleBtn"),
  prev: document.getElementById("prevBtn"),
  play: document.getElementById("playBtn"),
  next: document.getElementById("nextBtn"),
  repeat: document.getElementById("repeatBtn"),
  vol: document.getElementById("volBar"),
  list: document.getElementById("playlist"),
};

let ctx = null,
  masterGain = null;
let index = 0,
  playing = false,
  shuffle = false,
  repeat = false;
let currentStep = 0,
  stepTimer = null,
  elapsedBeats = 0;

const trackDur = (t) => (t.beats / t.bpm) * 60; // seconds
const fmt = (s) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function ensureCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = els.vol.value / 100;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
}

/* Lookahead scheduler (instead of setInterval per beat): a small timer wakes up
   ~4x/sec and schedules any notes that fall within the next 0.15s using the exact
   Web Audio clock (ctx.currentTime). This removes the jitter of setInterval and keeps
   the rhythm tight even when the main thread is busy or a tab is throttled. */
const LOOKAHEAD_MS = 25; // how often the scheduler wakes
const SCHEDULE_AHEAD = 0.15; // seconds of notes scheduled in advance
let nextNoteTime = 0; // audio-clock time for the next beat

function scheduleBeat(time, t) {
  // Schedule one beat at absolute audio time `time` (no drift).
  const beatSec = 60 / t.bpm;
  const note = t.notes[currentStep % t.notes.length];
  playNoteAt(note, beatSec * 0.9, t.wave, time);
  if (currentStep % 4 === 0) playNoteAt(note / 2, beatSec * 1.8, "sine", time); // bass every bar
  currentStep++;
  elapsedBeats++;
}

function schedulerTick() {
  const t = tracks[index];
  const beatSec = 60 / t.bpm;
  while (playing && nextNoteTime < ctx.currentTime + SCHEDULE_AHEAD) {
    if (elapsedBeats >= t.beats) {
      // Track finished exactly on the audio clock.
      stopScheduler();
      if (repeat) startPlayback(true);
      else nextTrack(true);
      return;
    }
    // Guard against past times after a seek/tab-throttle jump.
    if (nextNoteTime < ctx.currentTime) nextNoteTime = ctx.currentTime;
    scheduleBeat(nextNoteTime, t);
    nextNoteTime += beatSec;
  }
  updateProgress();
}

function playNoteAt(freq, dur, wave, when) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = wave;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(0.25, when + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
  osc.connect(g).connect(masterGain);
  osc.start(when);
  osc.stop(when + dur + 0.05);
}

function startScheduler() {
  stopScheduler();
  nextNoteTime = ctx.currentTime + 0.06; // first note sounds immediately-ish
  stepTimer = setInterval(schedulerTick, LOOKAHEAD_MS);
  schedulerTick();
}
function stopScheduler() {
  clearInterval(stepTimer);
  stepTimer = null;
}

function updateProgress() {
  const t = tracks[index];
  const beatSec = 60 / t.bpm;
  // Interpolate between scheduled beats using the audio clock for a smooth bar.
  const untilNext = playing
    ? Math.max(0, nextNoteTime - ctx.currentTime) / beatSec
    : 0;
  const beatsDone = Math.max(0, elapsedBeats - untilNext);
  const sec = (beatsDone / t.bpm) * 60;
  els.seek.value = String((sec / trackDur(t)) * 100);
  els.cur.textContent = fmt(Math.min(sec, trackDur(t)));
}

function loadTrack(i, autoplay = playing) {
  stopScheduler();
  if (ctx) masterGain.gain.value = els.vol.value / 100;
  index = ((i % tracks.length) + tracks.length) % tracks.length;
  const t = tracks[index];
  els.title.textContent = t.title;
  els.artist.textContent = t.artist;
  els.tot.textContent = fmt(trackDur(t));
  els.seek.value = "0";
  els.cur.textContent = "0:00";
  currentStep = 0;
  elapsedBeats = 0;
  renderPlaylist();
  if (autoplay) startPlayback(true);
}

function startPlayback(reset = false) {
  ensureCtx();
  if (reset) {
    currentStep = 0;
    elapsedBeats = 0;
  }
  playing = true;
  masterGain.gain.value = els.vol.value / 100; // undo pause-mute
  els.play.textContent = "⏸";
  els.art.classList.add("playing");
  startScheduler();
}

function pause() {
  playing = false;
  els.play.textContent = "▶";
  els.art.classList.remove("playing");
  stopScheduler();
  // Mute instantly so notes scheduled up to 0.15s ahead don't leak after pause,
  // then restore the volume for the next resume.
  masterGain.gain.setTargetAtTime(0, ctx.currentTime, 0.01);
  setTimeout(() => {
    if (!playing) masterGain.gain.value = els.vol.value / 100;
  }, 120);
}

function togglePlay() {
  playing ? pause() : startPlayback(elapsedBeats === 0 && currentStep === 0);
}

function pickNextIdx() {
  if (shuffle) {
    let r;
    do {
      r = Math.floor(Math.random() * tracks.length);
    } while (tracks.length > 1 && r === index);
    return r;
  }
  return index + 1;
}

/* loadTrack(i, autoplay=true) already starts playback, so no extra startPlayback here. */
function nextTrack(auto = false) {
  loadTrack(pickNextIdx(), auto || playing);
}
function prevTrack() {
  if (elapsedBeats > 4)
    loadTrack(index, playing); // restart current track
  else loadTrack(index - 1, playing); // previous track
}

function renderPlaylist() {
  els.list.innerHTML = "";
  tracks.forEach((t, i) => {
    const li = document.createElement("li");
    li.className = "pl-item" + (i === index ? " active" : "");
    /* Real <button> inside the li so keyboard users can Tab to and activate tracks. */
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pl-btn";
    btn.setAttribute("aria-current", i === index ? "true" : "false");
    const name = document.createElement("span");
    name.textContent = `${i === index && playing ? "🎧 " : ""}${t.title} — ${t.artist}`;
    const len = document.createElement("span");
    len.className = "len";
    len.textContent = fmt(trackDur(t));
    btn.append(name, len);
    btn.addEventListener("click", () => loadTrack(i, true)); // autoplay handled by loadTrack
    li.appendChild(btn);
    els.list.appendChild(li);
  });
}

// Events
els.play.addEventListener("click", togglePlay);
els.next.addEventListener("click", () => nextTrack(false));
els.prev.addEventListener("click", prevTrack);
els.shuffle.addEventListener("click", () => {
  shuffle = !shuffle;
  els.shuffle.classList.toggle("on", shuffle);
});
els.repeat.addEventListener("click", () => {
  repeat = !repeat;
  els.repeat.classList.toggle("on", repeat);
});
els.vol.addEventListener("input", () => {
  if (masterGain) masterGain.gain.value = els.vol.value / 100;
});
els.seek.addEventListener("input", () => {
  const t = tracks[index];
  elapsedBeats = (Number(els.seek.value) / 100) * t.beats;
  currentStep = Math.floor(elapsedBeats);
  updateProgress();
});

// Init
loadTrack(0, false);
renderPlaylist();
