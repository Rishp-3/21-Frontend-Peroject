// Number Guessing Game — vanilla JS with localStorage stats.
const MIN = 1;
const MAX = 100;

const guessForm = document.getElementById("guessForm");
const guessInput = document.getElementById("guessInput");
const message = document.getElementById("message");
const attemptsEl = document.getElementById("attempts");
const bestScoreEl = document.getElementById("bestScore");
const gamesWonEl = document.getElementById("gamesWon");
const historyEl = document.getElementById("history");
const newGameBtn = document.getElementById("newGame");

let secret = randomSecret();
let attempts = 0;
let gameOver = false;

function randomSecret() {
  return Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
}

function loadStats() {
  // Guard against corrupted localStorage JSON (would throw on load before).
  let raw;
  try {
    raw = JSON.parse(localStorage.getItem("ngg-stats") || "{}");
  } catch {
    raw = {};
  }
  const stats = raw;
  bestScoreEl.textContent = stats.best ?? "\u2013";
  gamesWonEl.textContent = stats.wins ?? 0;
  return { best: stats.best ?? null, wins: stats.wins ?? 0 };
}

function saveWin(count) {
  const stats = loadStats();
  stats.wins += 1;
  if (stats.best === null || count < stats.best) stats.best = count;
  localStorage.setItem("ngg-stats", JSON.stringify(stats));
  bestScoreEl.textContent = stats.best;
  gamesWonEl.textContent = stats.wins;
}

function setMessage(text, cls) {
  message.textContent = text;
  message.className = "message" + (cls ? " " + cls : "");
}

function addHistory(value, dir) {
  const li = document.createElement("li");
  li.textContent = value + (dir ? " (" + dir + ")" : "");
  if (dir) li.classList.add(dir === "low" ? "low" : dir === "high" ? "high" : "win");
  historyEl.appendChild(li);
}

function resetGame() {
  secret = randomSecret();
  attempts = 0;
  gameOver = false;
  attemptsEl.textContent = "0";
  historyEl.innerHTML = "";
  guessInput.value = "";
  guessInput.disabled = false;
  setMessage("New game started. Take your first guess!");
  guessInput.focus();
}

guessForm.addEventListener("submit", function (event) {
  event.preventDefault();
  if (gameOver) {
    setMessage("Game over — press “New Game” to play again.");
    return;
  }

  const value = Number(guessInput.value);

  if (!Number.isInteger(value) || value < MIN || value > MAX) {
    setMessage(`Please enter a whole number between ${MIN} and ${MAX}.`);
    return;
  }

  attempts += 1;
  attemptsEl.textContent = attempts;

  if (value === secret) {
    gameOver = true;
    guessInput.disabled = true;
    setMessage(`🎉 Correct! You won in ${attempts} ${attempts === 1 ? "attempt" : "attempts"}.`, "win");
    addHistory(value, "win");
    saveWin(attempts);
  } else {
    const tooLow = value < secret;
    // Hot/cold hint promised in the meta description, based on distance.
    // Also passes low/high classes so the .message.low/.high CSS actually applies.
    const dist = Math.abs(value - secret);
    const heat = dist <= 2 ? "🔥 Very hot!" : dist <= 5 ? "♨️ Warm" : dist <= 15 ? "🌤️ Cool" : "🧊 Cold";
    setMessage(
      `${value} is TOO ${tooLow ? "LOW ⬆️" : "HIGH ⬇️"} — ${heat}`,
      tooLow ? "low" : "high"
    );
    addHistory(value, tooLow ? "low" : "high");
  }

  guessInput.value = "";
  guessInput.focus();
});

newGameBtn.addEventListener("click", resetGame);

loadStats();
resetGame();
