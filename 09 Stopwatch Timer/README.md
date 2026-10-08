# 09 Stopwatch Timer

A precision stopwatch with lap tracking and best/worst/average lap statistics.

## Features

- Start / Stop / Lap / Reset controls with live HH:MM:SS.CS display
- Lap table (newest first) with automatic **best** and **worst** lap highlighting (correct `sectionRowIndex` mapping — thead rows are not counted)
- Best / Worst / Average lap summary cards
- Status indicator, keyboard-friendly buttons, responsive layout

## Technologies Used

HTML5, CSS3 (flex/grid + media queries), vanilla JavaScript (`performance.now()` based timing).

## How to Run

Open `index.html` in a browser, or:

```bash
cd "09 Stopwatch Timer" && python3 -m http.server 8000
```

## Main Functionality

Press **Start**, hit **Lap** at any point to record splits; the summary shows fastest/slowest laps highlighted in the table. **Reset** clears everything back to idle.
