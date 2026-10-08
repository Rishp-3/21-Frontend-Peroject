# 05 · Counter App

A classic counter: +1 / −1 / ±10 buttons with reset, plus Total Clicks and Highest-value tracking.

## Features

- Single `change(delta)` handler (no duplicated listener code)
- 44px+ tap targets, hover/focus-visible states, aria-labels on every button
- `<output aria-live="polite">` for the count (screen-reader friendly)
- Responsive card layout with `clamp()` sizing and a mobile breakpoint
- Reset keeps lifetime stats (Total Clicks / Highest), matching original behavior

## Technologies

HTML5 · CSS3 · Vanilla JavaScript

## How to run

Open `index.html` in a browser, or:

```bash
cd "05-counter-app" && python3 -m http.server 8000
```

## Main functionality

Each button applies a delta to the current count and increments the click counter; the highest count ever reached is displayed. Reset sets the count back to 0 without clearing stats.
