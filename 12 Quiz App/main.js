"use strict";

/* ------------------------------------------------------------------ */
/*  Quiz data                                                          */
/* ------------------------------------------------------------------ */
const QUESTIONS = [
  {
    question: "Which planet is known as the Red Planet?",
    answers: ["Venus", "Mars", "Jupiter", "Mercury"],
    correct: 1,
  },
  {
    question: "What is the largest ocean on Earth?",
    answers: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
    correct: 2,
  },
  {
    question: "Which language runs natively in web browsers?",
    answers: ["Python", "C++", "Java", "JavaScript"],
    correct: 3,
  },
  {
    question: "How many continents are there on Earth?",
    answers: ["5", "6", "7", "8"],
    correct: 2,
  },
  {
    question: "What does 'HTML' stand for?",
    answers: [
      "HyperText Markup Language",
      "High Transfer Machine Language",
      "Hyperlink Text Mark Language",
      "Home Tool Markup Language",
    ],
    correct: 0,
  },
  {
    question: "Which gas do plants primarily absorb for photosynthesis?",
    answers: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
    correct: 2,
  },
  {
    question: "Who painted the Mona Lisa?",
    answers: ["Vincent van Gogh", "Pablo Picasso", "Michelangelo", "Leonardo da Vinci"],
    correct: 3,
  },
  {
    question: "What is the smallest prime number?",
    answers: ["0", "1", "2", "3"],
    correct: 2,
  },
];

const TIME_PER_QUESTION = 15;
const BEST_KEY = "quizAppBestScore";

/* ------------------------------------------------------------------ */
/*  Elements                                                           */
/* ------------------------------------------------------------------ */
const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const nextBtn = document.getElementById("nextBtn");

const questionCountEl = document.getElementById("questionCount");
const timerEl = document.getElementById("timer");
const quizProgressEl = document.getElementById("quizProgress");
const questionTextEl = document.getElementById("questionText");
const answersEl = document.getElementById("answers");
const scoreLiveEl = document.getElementById("scoreLive");

const finalScoreEl = document.getElementById("finalScore");
const totalQuestionsEl = document.getElementById("totalQuestions");
const resultEmojiEl = document.getElementById("resultEmoji");
const resultMessageEl = document.getElementById("resultMessage");
const correctCountEl = document.getElementById("correctCount");
const wrongCountEl = document.getElementById("wrongCount");
const bestScoreEl = document.getElementById("bestScore");

/* ------------------------------------------------------------------ */
/*  State                                                             */
/* ------------------------------------------------------------------ */
let index = 0;
let score = 0;
let answered = false;
let timeLeft = TIME_PER_QUESTION;
let countdownId = null;

/* ------------------------------------------------------------------ */
/*  Screen helpers                                                    */
/* ------------------------------------------------------------------ */
function show(screen) {
  [startScreen, quizScreen, resultScreen].forEach((s) => s.classList.add("hidden"));
  screen.classList.remove("hidden");
}

/* ------------------------------------------------------------------ */
/*  Timer                                                             */
/* ------------------------------------------------------------------ */
function startTimer() {
  stopTimer();
  timeLeft = TIME_PER_QUESTION;
  renderTimer();
  countdownId = setInterval(() => {
    timeLeft--;
    renderTimer();
    if (timeLeft <= 0) {
      stopTimer();
      handleTimeout();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(countdownId);
  countdownId = null;
}

function renderTimer() {
  timerEl.textContent = `⏱ ${timeLeft}`;
  timerEl.classList.toggle("low", timeLeft <= 5);
}

function handleTimeout() {
  if (answered) return;
  answered = true;
  const q = QUESTIONS[index];
  Array.from(answersEl.children).forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add("correct");
  });
  nextBtn.classList.remove("hidden");
}

/* ------------------------------------------------------------------ */
/*  Rendering                                                         */
/* ------------------------------------------------------------------ */
function loadQuestion() {
  const q = QUESTIONS[index];
  answered = false;

  questionCountEl.textContent = `Question ${index + 1} / ${QUESTIONS.length}`;
  quizProgressEl.style.width = `${(index / QUESTIONS.length) * 100}%`;
  questionTextEl.textContent = q.question;
  scoreLiveEl.textContent = `Score: ${score}`;
  nextBtn.classList.add("hidden");

  answersEl.innerHTML = "";
  q.answers.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "answer-btn";
    btn.textContent = text;
    btn.addEventListener("click", () => selectAnswer(i, btn));
    answersEl.appendChild(btn);
  });

  startTimer();
}

function selectAnswer(choice, btn) {
  if (answered) return;
  answered = true;
  stopTimer();

  const q = QUESTIONS[index];
  const buttons = Array.from(answersEl.children);
  buttons.forEach((b) => (b.disabled = true));

  if (choice === q.correct) {
    btn.classList.add("correct");
    score++;
    scoreLiveEl.textContent = `Score: ${score}`;
  } else {
    btn.classList.add("wrong");
    buttons[q.correct].classList.add("correct");
  }

  nextBtn.classList.remove("hidden");
}

function goNext() {
  index++;
  if (index < QUESTIONS.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

/* ------------------------------------------------------------------ */
/*  Results                                                           */
/* ------------------------------------------------------------------ */
function showResults() {
  stopTimer();
  quizProgressEl.style.width = "100%";

  const total = QUESTIONS.length;
  const wrong = total - score;
  const pct = score / total;

  finalScoreEl.textContent = score;
  totalQuestionsEl.textContent = total;
  correctCountEl.textContent = score;
  wrongCountEl.textContent = wrong;

  let emoji, message;
  if (pct === 1) {
    emoji = "🏆";
    message = "Perfect score! You're a quiz champion!";
  } else if (pct >= 0.75) {
    emoji = "🎉";
    message = "Excellent work — just a step away from perfect!";
  } else if (pct >= 0.5) {
    emoji = "👍";
    message = "Good job! A little practice and you'll ace it.";
  } else {
    emoji = "😅";
    message = "Tough round — give it another try!";
  }
  resultEmojiEl.textContent = emoji;
  resultMessageEl.textContent = message;

  // Persist best score
  const prevBest = Number(localStorage.getItem(BEST_KEY) || 0);
  const best = Math.max(prevBest, score);
  localStorage.setItem(BEST_KEY, String(best));
  bestScoreEl.textContent = best;

  show(resultScreen);
}

/* ------------------------------------------------------------------ */
/*  Flow control                                                      */
/* ------------------------------------------------------------------ */
function startQuiz() {
  index = 0;
  score = 0;
  show(quizScreen);
  loadQuestion();
}

startBtn.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", goNext);

// Show saved best score on the start screen area (result screen element is reused)
const storedBest = localStorage.getItem(BEST_KEY);
if (storedBest) bestScoreEl.textContent = storedBest;
