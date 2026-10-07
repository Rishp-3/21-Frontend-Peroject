# 21 - Rock Paper Scissors Game

## Description
A polished Rock-Paper-Scissors match against a slightly adaptive CPU. First to your chosen target (3/5/10) wins the match; lifetime games-won are saved between sessions.

## Features
- Animated "shake" reveal before each throw
- Scoreboard with configurable first-to-N target
- Win-streak counter & lifetime games-won (localStorage)
- Semi-adaptive CPU: 40% chance it counters your previous move
- Keyboard shortcuts: `R` / `P` / `S`
- Status messages color-coded for win/lose/draw
- Responsive card layout for mobile & desktop

## Technologies Used
HTML5, CSS3 (keyframe animations, gradients), Vanilla JavaScript (async/await, localStorage)

## How to Run
```bash
cd "21 Rock Paper Scissors Game"
python3 -m http.server 8000   # or open index.html directly
```

## Main Functionality
Click ✊ / 🖐 / ✌️ (or press R/P/S) → hands shake and reveal → outcome updates scores and streak → play continues until someone reaches the target → reset (or change target) to start a new match.
