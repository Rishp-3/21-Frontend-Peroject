# 04 · Number Guessing Game

Guess the secret number (1–100). Includes hot/cold distance hints, attempt tracking and win statistics saved in your browser.

## Features

- 🔥 Hot/cold hints based on how close your guess is (Very hot / Warm / Cool / Cold)
- Color-coded messages via `.message.low` / `.message.high` CSS classes
- Guess history list, attempts counter
- Best score + games won persisted in `localStorage` (with corrupted-data guard)
- Responsive layout with media queries, keyboard accessible form

## Technologies

HTML5 · CSS3 · Vanilla JavaScript · localStorage

## How to run

Open `index.html` in a browser, or:

```bash
cd "04 Number Guessing Game" && python3 -m http.server 8000
```

## Main functionality

The app picks a random integer 1–100. Each submitted guess is validated (whole number, in range), counted, and answered with a high/low message plus a heat hint derived from `|guess − secret|`. Winning updates best-score/win stats in localStorage; "New Game" resets the round.
