// 18 - Music Player (Web Audio synthesized tracks — no external audio files needed)
const tracks = [
  { title: 'Neon Dreams', artist: 'Synthwave Cat', bpm: 100, notes: [220, 261.63, 329.63, 261.63, 293.66, 349.23, 293.66, 261.63], wave: 'sawtooth', beats: 16 },
  { title: 'Midnight Loop', artist: 'Chill Beats', bpm: 84, notes: [174.61, 220, 261.63, 220, 196, 246.94, 220, 174.61], wave: 'triangle', beats: 16 },
  { title: 'Pixel Party', artist: 'Chip Trio', bpm: 128, notes: [523.25, 659.25, 783.99, 659.25, 587.33, 783.99, 880, 659.25], wave: 'square', beats: 16 },
  { title: 'Ocean Drive', artist: 'Retrosunset', bpm: 92, notes: [196, 246.94, 293.66, 392, 349.23, 293.66, 246.94, 196], wave: 'sine', beats: 16 },
];

const els = {
  art: document.getElementById('albumArt'),
  title: document.getElementById('trackTitle'),
  artist: document.getElementById('trackArtist'),
  seek: document.getElementById('seekBar'),
  cur: document.getElementById('curTime'),
  tot: document.getElementById('totTime'),
  shuffle: document.getElementById('shuffleBtn'),
  prev: document.getElementById('prevBtn'),
  play: document.getElementById('playBtn'),
  next: document.getElementById('nextBtn'),
  repeat: document.getElementById('repeatBtn'),
  vol: document.getElementById('volBar'),
  list: document.getElementById('playlist'),
};

let ctx = null, masterGain = null;
let index = 0, playing = false, shuffle = false, repeat = false;
let currentStep = 0, stepTimer = null, elapsedBeats = 0;

const trackDur = (t) => (t.beats / t.bpm) * 60; // seconds
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

function ensureCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = els.vol.value / 100;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
}

function playNote(freq, dur, wave) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = wave;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  osc.connect(g).connect(masterGain);
  osc.start();
  osc.stop(ctx.currentTime + dur + 0.05);
}

function tick() {
  const t = tracks[index];
  const beatSec = 60 / t.bpm;
  const note = t.notes[currentStep % t.notes.length];
  playNote(note, beatSec * 0.9, t.wave);
  if (currentStep % 4 === 0) playNote(note / 2, beatSec * 1.8, 'sine'); // bass every bar
  currentStep++;
  elapsedBeats++;
  updateProgress();
  if (elapsedBeats >= t.beats) {
    stopTimer();
    if (repeat) { startPlayback(true); }
    else { nextTrack(true); }
  }
}

function startTimer() {
  stopTimer();
  const beatSec = 60 / tracks[index].bpm;
  stepTimer = setInterval(tick, beatSec * 1000);
}
function stopTimer() { clearInterval(stepTimer); stepTimer = null; }

function updateProgress() {
  const t = tracks[index];
  const sec = (elapsedBeats / t.bpm) * 60;
  els.seek.value = String((sec / trackDur(t)) * 100);
  els.cur.textContent = fmt(sec);
}

function loadTrack(i, autoplay = playing) {
  index = ((i % tracks.length) + tracks.length) % tracks.length;
  const t = tracks[index];
  els.title.textContent = t.title;
  els.artist.textContent = t.artist;
  els.tot.textContent = fmt(trackDur(t));
  els.seek.value = '0';
  els.cur.textContent = '0:00';
  currentStep = 0; elapsedBeats = 0;
  renderPlaylist();
  if (autoplay) startPlayback(true);
}

function startPlayback(reset = false) {
  ensureCtx();
  if (reset) { currentStep = 0; elapsedBeats = 0; }
  playing = true;
  els.play.textContent = '⏸';
  els.art.classList.add('playing');
  startTimer();
}

function pause() {
  playing = false;
  els.play.textContent = '▶';
  els.art.classList.remove('playing');
  stopTimer();
}

function togglePlay() { playing ? pause() : startPlayback(elapsedBeats === 0 && currentStep === 0); }

function pickNextIdx() {
  if (shuffle) {
    let r;
    do { r = Math.floor(Math.random() * tracks.length); } while (tracks.length > 1 && r === index);
    return r;
  }
  return index + 1;
}

function nextTrack(auto = false) { loadTrack(pickNextIdx(), auto ? true : playing); if (!auto && playing) startPlayback(true); }
function prevTrack() {
  if (elapsedBeats > 4) { loadTrack(index, playing); if (playing) startPlayback(true); }
  else loadTrack(index - 1, playing);
  if (playing) startPlayback(true);
}

function renderPlaylist() {
  els.list.innerHTML = '';
  tracks.forEach((t, i) => {
    const li = document.createElement('li');
    li.className = 'pl-item' + (i === index ? ' active' : '');
    li.innerHTML = `<span>${i === index && playing ? '🎧 ' : ''}${t.title} — ${t.artist}</span><span class="len">${fmt(trackDur(t))}</span>`;
    li.addEventListener('click', () => { loadTrack(i, true); startPlayback(true); });
    els.list.appendChild(li);
  });
}

// Events
els.play.addEventListener('click', togglePlay);
els.next.addEventListener('click', () => nextTrack(false));
els.prev.addEventListener('click', prevTrack);
els.shuffle.addEventListener('click', () => { shuffle = !shuffle; els.shuffle.classList.toggle('on', shuffle); });
els.repeat.addEventListener('click', () => { repeat = !repeat; els.repeat.classList.toggle('on', repeat); });
els.vol.addEventListener('input', () => { if (masterGain) masterGain.gain.value = els.vol.value / 100; });
els.seek.addEventListener('input', () => {
  const t = tracks[index];
  elapsedBeats = (Number(els.seek.value) / 100) * t.beats;
  currentStep = Math.floor(elapsedBeats);
  updateProgress();
});

// Init
loadTrack(0, false);
renderPlaylist();
