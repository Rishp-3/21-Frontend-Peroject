# 🧠 Quiz App

## Description
An interactive multiple-choice quiz with a per-question countdown timer, instant answer feedback, live scoring and a detailed results screen. Best score is persisted with `localStorage`.

## Features
- ✅ 8 general-knowledge questions with 4 options each
- ✅ 15-second countdown per question (pulses red under 5s)
- ✅ Auto-reveal of the correct answer when time runs out
- ✅ Instant green/red feedback on selection
- ✅ Progress bar + question counter
- ✅ Live score display during the quiz
- ✅ Result screen: score, correct/wrong counts, best score, motivational message
- ✅ Best score saved in `localStorage` across sessions
- ✅ Play Again restarts with fresh state
- ✅ Fully responsive (mobile / tablet / desktop)

## Technologies Used
- HTML5
- CSS3 (grid, transitions, keyframe animations, media queries)
- Vanilla JavaScript (`setInterval`, DOM rendering, `localStorage`)

## How to Run
```bash
# Option 1: just open the file
open "12 Quiz App/index.html"        # macOS
start  "12 Quiz App\index.html"      # Windows

# Option 2: local server
cd "12 Quiz App"
python3 -m http.server 8000
# visit http://localhost:8000
```

## Main Functionality
Click **Start Quiz** to begin. Each question shows four answer buttons and a 15-second timer; selecting an answer locks the question, marks it correct (green) or wrong (red) and reveals the right option. When the timer expires the question is counted as wrong. Press **Next** to continue; after the final question a results card summarises your performance and best-ever score, and **Play Again** resets everything.
