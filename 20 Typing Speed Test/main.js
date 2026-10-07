// 20 - Typing Speed Test
const WORDS = ('the quick brown fox jumps over lazy dog while typing practice makes perfect timing accuracy speed keyboard words letters sentences random text sample challenge improve steady flow rhythm focus calm fast correct errors learn build muscle memory every second counts progress test your skills with this typing game exercise routine warm daily goal personal record high score attempt session measure result finish strong keep going never give up on your dreams aspirations goals ambitions future success depends determination discipline dedication effort patience persistence consistency commitment').split(' ');

const $ = (id) => document.getElementById(id);
let targetText = '';
let correctChars = 0, wrongChars = 0;
let keystrokes = 0, mistakesMade = 0; // cumulative typing stats (not just final state)
let duration = 60, timeLeft = 60, timerId = null, started = false, finished = false;
let startTime = 0;

function genText(n = 60) {
  const words = Array.from({ length: n }, () => WORDS[Math.floor(Math.random() * WORDS.length)]);
  targetText = words.join(' ');
}

// Render word-by-word: each word is a nowrap span of character spans, with real
// spaces between words so the browser can wrap at word boundaries (no &nbsp;).
function renderText(typed) {
  const caretIdx = Math.min(typed.length, targetText.length);
  let pos = 0;
  const parts = [];
  for (const word of targetText.split(' ')) {
    const charSpans = word.split('').map((ch) => {
      let cls = '';
      if (pos < typed.length) cls = typed[pos] === ch ? 'ok' : 'bad';
      const caret = pos === caretIdx ? '<span class="caret"></span>' : '';
      pos++;
      return `${caret}<span class="${cls}">${escapeHtml(ch)}</span>`;
    }).join('');
    parts.push(`<span class="word">${charSpans}</span>`);
    pos++; // account for the space between words
  }
  if (caretIdx >= pos - 1) parts.push('<span class="caret"></span>'); // caret at very end
  $('textDisplay').innerHTML = parts.join(' ');
}

function escapeHtml(s) { return s.replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }

function updateStats() {
  // Live WPM uses a minimum elapsed time of 5s so the first second doesn't
  // show absurd values (e.g. 3 chars in 100ms would compute ~360 WPM).
  let elapsedMs;
  if (finished || !started) elapsedMs = duration * 1000;
  else elapsedMs = Math.max(Date.now() - startTime, 5000);
  const elapsedMin = elapsedMs / 60000;
  const wpm = Math.round(correctChars / 5 / elapsedMin);
  const cpm = Math.round(correctChars / elapsedMin);
  // Accuracy from cumulative keystrokes/mistakes, not just the final text state.
  const acc = keystrokes > 0 ? Math.round(((keystrokes - mistakesMade) / keystrokes) * 100) : 100;
  $('wpm').textContent = started || finished ? String(wpm) : '—';
  $('cpm').textContent = started || finished ? String(cpm) : '—';
  $('accuracy').textContent = String(acc);
  return { wpm, cpm, acc };
}

function startTimer() {
  started = true;
  startTime = Date.now();
  timerId = setInterval(() => {
    timeLeft--;
    $('timer').textContent = String(Math.max(timeLeft, 0));
    updateStats();
    if (timeLeft <= 0) endTest();
  }, 1000);
}

function endTest() {
  clearInterval(timerId);
  finished = true;
  $('typeInput').disabled = true;
  const { wpm, cpm, acc } = updateStats();
  // localStorage can throw in private mode / when full — don't lose the result.
  let best = wpm;
  try {
    const bestKey = 'typing-best-' + duration;
    best = Math.max(Number(localStorage.getItem(bestKey)) || 0, wpm);
    localStorage.setItem(bestKey, String(best));
  } catch { best = wpm; }
  $('resWpm').textContent = String(wpm);
  $('resCpm').textContent = String(cpm);
  $('resAcc').textContent = `${acc}%`;
  $('resChars').textContent = String(correctChars);
  $('resBest').textContent = String(best);
  $('result').classList.remove('hidden');
}

function reset() {
  clearInterval(timerId);
  started = false; finished = false;
  correctChars = 0; wrongChars = 0; keystrokes = 0; mistakesMade = 0;
  duration = Number($('duration').value);
  timeLeft = duration;
  $('timer').textContent = String(duration);
  $('typeInput').disabled = false;
  $('typeInput').value = '';
  $('result').classList.add('hidden');
  genText();
  renderText('');
  updateStats();
  $('typeInput').focus();
}

$('typeInput').addEventListener('input', (e) => {
  if (finished) return;
  const typed = $('typeInput').value;
  if (!started && typed.length > 0) startTimer();
  // Count the new keystroke(s): additions count as a keypress, and a char that
  // differs from the target counts as a mistake (kept even after backspacing).
  const prevLen = e.inputType === 'insertText' || e.inputType === 'insertFromPaste'
    ? typed.length - 1 : typed.length;
  if (typed.length > prevLen && e.inputType !== 'deleteContentBackward') {
    keystrokes++;
    const i = prevLen;
    if (i < targetText.length && typed[i] !== targetText[i]) mistakesMade++;
  }
  // recount current position correctness for WPM (chars right now on track)
  correctChars = 0; wrongChars = 0;
  for (let i = 0; i < typed.length && i < targetText.length; i++) {
    if (typed[i] === targetText[i]) correctChars++; else wrongChars++;
  }
  // extend text if user typed everything
  if (typed.length >= targetText.length) {
    const extra = genMore(typed.slice(targetText.length));
    targetText += ' ' + extra;
  }
  renderText(typed);
  updateStats();
});

function genMore(remaining) {
  let out = '';
  const arr = [];
  let len = 1;
  while (len < remaining.length + 200) {
    const w = WORDS[Math.floor(Math.random() * WORDS.length)];
    arr.push(w);
    len += w.length + 1;
  }
  out = arr.join(' ');
  return out;
}

$('restartBtn').addEventListener('click', reset);
$('againBtn').addEventListener('click', reset);
$('duration').addEventListener('change', reset);
// Block paste AND drag-drop so the test can't be cheated.
$('typeInput').addEventListener('paste', (e) => e.preventDefault());
$('typeInput').addEventListener('drop', (e) => e.preventDefault());

reset();
