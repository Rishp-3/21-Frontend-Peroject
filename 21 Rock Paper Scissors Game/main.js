// 21 - Rock Paper Scissors Game
const MOVES = ['rock', 'paper', 'scissors'];
const EMOJI = { rock: '✊', paper: '🖐', scissors: '✌️' };
const BEATS = { rock: 'scissors', paper: 'rock', scissors: 'paper' };

const $ = (id) => document.getElementById(id);
let playerScore = 0, cpuScore = 0, streak = 0, gamesWon = 0, busy = false;
let target = Number($('targetSel').value);

const stats = loadStats();
gamesWon = stats.gamesWon;
$('gamesWon').textContent = String(gamesWon);

function loadStats() {
  try { return JSON.parse(localStorage.getItem('rps-stats')) || { gamesWon: 0 }; }
  catch { return { gamesWon: 0 }; }
}
function saveStats() { localStorage.setItem('rps-stats', JSON.stringify({ gamesWon })); }

function setStatus(msg, cls) {
  const s = $('status');
  s.textContent = msg;
  s.className = 'status' + (cls ? ' ' + cls : '');
}

function pickCpu() {
  // Slightly adaptive CPU: 40% of the time it counters the player's most recent move
  if (lastPlayerMove && Math.random() < 0.4) {
    return MOVES.find((m) => BEATS[m] === lastPlayerMove);
  }
  return MOVES[Math.floor(Math.random() * 3)];
}
let lastPlayerMove = null;

let roundToken = 0; // FIX: invalidates in-flight rounds when Reset is pressed mid-animation

async function play(playerMove) {
  if (busy) return;
  busy = true;
  const myRound = ++roundToken;
  document.querySelectorAll('.choice').forEach((b) => (b.disabled = true));

  $('playerHand').textContent = '✊';
  $('cpuHand').textContent = '✊';
  $('playerHand').classList.add('shake');
  $('cpuHand').classList.add('shake');
  setStatus('Rock… Paper… Scissors…');
  await wait(600);
  if (myRound !== roundToken) return; // match was reset while animating – discard result

  const cpuMove = pickCpu();
  $('playerHand').textContent = EMOJI[playerMove];
  $('cpuHand').textContent = EMOJI[cpuMove];
  $('playerHand').classList.remove('shake');
  $('cpuHand').classList.remove('shake');
  lastPlayerMove = playerMove;

  if (playerMove === cpuMove) {
    setStatus(`Draw — both threw ${EMOJI[playerMove]} ${playerMove}!`, 'draw');
  } else if (BEATS[playerMove] === cpuMove) {
    playerScore++;
    streak++;
    setStatus(`You win! ${EMOJI[playerMove]} ${playerMove} beats ${EMOJI[cpuMove]} ${cpuMove} 🎉`, 'win');
  } else {
    cpuScore++;
    streak = 0;
    setStatus(`CPU wins! ${EMOJI[cpuMove]} ${cpuMove} beats ${EMOJI[playerMove]} ${playerMove} 🤖`, 'lose');
  }
  $('playerScore').textContent = String(playerScore);
  $('cpuScore').textContent = String(cpuScore);
  $('streak').textContent = String(streak);

  if (playerScore >= target || cpuScore >= target) {
    const playerWon = playerScore >= target;
    if (playerWon) { gamesWon++; saveStats(); $('gamesWon').textContent = String(gamesWon); }
    setStatus(`${playerWon ? '🏆 You won the match!' : '💻 CPU won the match.'} Final ${playerScore}–${cpuScore}. Press Reset to play again.`);
    $('status').classList.add('gameover');
    return; // keep buttons disabled until reset
  }
  busy = false;
  document.querySelectorAll('.choice').forEach((b) => (b.disabled = false));
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function resetMatch() {
  roundToken++;      // cancel any in-flight round (race-condition fix)
  playerScore = 0; cpuScore = 0; busy = false; streak = 0; lastPlayerMove = null;
  $('playerScore').textContent = '0';
  $('cpuScore').textContent = '0';
  $('streak').textContent = '0';
  $('playerHand').textContent = '❔';
  $('cpuHand').textContent = '❔';
  setStatus('Make your move!');
  document.querySelectorAll('.choice').forEach((b) => (b.disabled = false));
}

document.querySelectorAll('.choice').forEach((btn) => {
  btn.addEventListener('click', () => play(btn.dataset.move));
});
$('resetBtn').addEventListener('click', resetMatch);
$('targetSel').addEventListener('change', () => {
  target = Number($('targetSel').value);
  $('target').textContent = String(target);
  resetMatch();
});

// Keyboard shortcuts: R / P / S
document.addEventListener('keydown', (e) => {
  // Ignore keystrokes while a form control (select/input/textarea) has focus,
  // otherwise pressing "s" inside the target dropdown would throw scissors.
  const tag = document.activeElement && document.activeElement.tagName;
  if (tag === 'SELECT' || tag === 'INPUT' || tag === 'TEXTAREA') return;
  const map = { r: 'rock', p: 'paper', s: 'scissors' };
  const m = map[e.key.toLowerCase()];
  if (m && !busy) play(m);
});
