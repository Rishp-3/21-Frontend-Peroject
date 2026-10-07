// 20 - Typing Speed Test
const WORDS =
  "the quick brown fox jumps over lazy dog while typing practice makes perfect timing accuracy speed keyboard words letters sentences random text sample challenge improve steady flow rhythm focus calm fast correct errors learn build muscle memory every second counts progress test your skills with this typing game exercise routine warm daily goal personal record high score attempt session measure result finish strong keep going never give up on your dreams aspirations goals ambitions future success depends determination discipline dedication effort patience persistence consistency commitment".split(
    " ",
  );

const $ = (id) => document.getElementById(id);
let targetWords = [],
  targetText = "";
let typedLen = 0,
  correctChars = 0,
  wrongChars = 0;
let duration = 60,
  timeLeft = 60,
  timerId = null,
  started = false,
  finished = false;
let startTime = 0;

function genText(n = 60) {
  targetWords = Array.from(
    { length: n },
    () => WORDS[Math.floor(Math.random() * WORDS.length)],
  );
  targetText = targetWords.join(" ");
}

function renderText(typed) {
  const chars = targetText.split("").map((ch, i) => {
    let cls = "";
    if (i < typed.length) cls = typed[i] === ch ? "ok" : "bad";
    return `<span class="${cls}">${ch === " " ? "&nbsp;" : escapeHtml(ch)}</span>`;
  });
  const caretIdx = Math.min(typed.length, targetText.length);
  chars.splice(caretIdx, 0, '<span class="caret"></span>');
  $("textDisplay").innerHTML = chars.join("");
}

function escapeHtml(s) {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}

function updateStats() {
  const elapsedMin =
    started && !finished ? (Date.now() - startTime) / 60000 : duration / 60;
  const wpm = elapsedMin > 0 ? Math.round(correctChars / 5 / elapsedMin) : 0;
  const cpm = elapsedMin > 0 ? Math.round(correctChars / elapsedMin) : 0;
  const total = correctChars + wrongChars;
  const acc = total > 0 ? Math.round((correctChars / total) * 100) : 100;
  $("wpm").textContent = String(wpm);
  $("cpm").textContent = String(cpm);
  $("accuracy").textContent = String(acc);
  return { wpm, cpm, acc };
}

function startTimer() {
  started = true;
  startTime = Date.now();
  timerId = setInterval(() => {
    timeLeft--;
    $("timer").textContent = String(Math.max(timeLeft, 0));
    updateStats();
    if (timeLeft <= 0) endTest();
  }, 1000);
}

function endTest() {
  clearInterval(timerId);
  finished = true;
  $("typeInput").disabled = true;
  const { wpm, cpm, acc } = updateStats();
  const bestKey = "typing-best-" + duration;
  const best = Math.max(Number(localStorage.getItem(bestKey)) || 0, wpm);
  localStorage.setItem(bestKey, String(best));
  $("resWpm").textContent = String(wpm);
  $("resCpm").textContent = String(cpm);
  $("resAcc").textContent = `${acc}%`;
  $("resChars").textContent = String(correctChars);
  $("resBest").textContent = String(best);
  $("result").classList.remove("hidden");
}

function reset() {
  clearInterval(timerId);
  started = false;
  finished = false;
  typedLen = 0;
  correctChars = 0;
  wrongChars = 0;
  duration = Number($("duration").value);
  timeLeft = duration;
  $("timer").textContent = String(duration);
  $("typeInput").disabled = false;
  $("typeInput").value = "";
  $("result").classList.add("hidden");
  genText();
  renderText("");
  updateStats();
  $("typeInput").focus();
}

$("typeInput").addEventListener("input", () => {
  if (finished) return;
  const typed = $("typeInput").value;
  if (!started && typed.length > 0) startTimer();
  // recount from scratch for simplicity & correctness
  correctChars = 0;
  wrongChars = 0;
  for (let i = 0; i < typed.length && i < targetText.length; i++) {
    if (typed[i] === targetText[i]) correctChars++;
    else wrongChars++;
  }
  // extend text if user typed everything
  if (typed.length >= targetText.length) {
    const extra = genMore(typed.slice(targetText.length));
    targetText += " " + extra;
  }
  renderText(typed);
  updateStats();
});

function genMore(remaining) {
  let out = "";
  const arr = [];
  let len = 1;
  while (len < remaining.length + 200) {
    const w = WORDS[Math.floor(Math.random() * WORDS.length)];
    arr.push(w);
    len += w.length + 1;
  }
  out = arr.join(" ");
  return out;
}

$("restartBtn").addEventListener("click", reset);
$("againBtn").addEventListener("click", reset);
$("duration").addEventListener("change", reset);
$("typeInput").addEventListener("paste", (e) => e.preventDefault());

reset();
