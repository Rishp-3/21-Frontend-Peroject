# 20 - Typing Speed Test

## Description
A classic MonkeyType-style typing test: a stream of random words is shown, you type along, and the app measures your **WPM, CPM, accuracy and countdown** in real time, coloring each character green/red as you go.

## Features
- Live per-character correct/incorrect highlighting with blinking caret
- Real-time WPM / CPM / accuracy stats
- Selectable duration: 30 / 60 / 120 seconds
- Endless text — new words are generated as you reach the end
- Results panel with personal best per duration (localStorage)
- Paste blocking so scores stay honest; restart anytime
- Fully responsive dark UI

## Technologies Used
HTML5, CSS3 (Grid, keyframes), Vanilla JavaScript, localStorage

## How to Run
```bash
cd "20 Typing Speed Test"
python3 -m http.server 8000   # or open index.html directly
```

## Main Functionality
Start typing → the timer begins on your first keystroke → each character is validated against the target text → stats update every keystroke and every second → when time runs out you get final WPM/CPM/accuracy and your best score is saved.
