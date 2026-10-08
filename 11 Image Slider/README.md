# 🖼️ Image Slider

## Description

A responsive, accessible image carousel built with pure HTML, CSS and JavaScript. Slides transition smoothly with CSS transforms and are driven by a `requestAnimationFrame` autoplay engine with a live progress bar.

## Features

- ✅ Autoplay every 4 seconds with animated progress bar
- ✅ Prev / Next arrow buttons (wrap around infinitely)
- ✅ Clickable indicator dots with active state
- ✅ Keyboard navigation (`←` / `→` arrow keys)
- ✅ Touch swipe support for mobile devices
- ✅ Pause/Play toggle button
- ✅ Auto-pause while hovering the slider
- ✅ ARIA roles & labels for accessibility
- ✅ Self-contained SVG slide artwork (no external assets)
- ✅ Fully responsive (mobile / tablet / desktop)

## Technologies Used

- HTML5 (semantic markup, ARIA)
- CSS3 (flexbox, transitions, gradients, media queries)
- Vanilla JavaScript (`requestAnimationFrame`, touch events, keyboard events)

## How to Run

```bash
# Option 1: just open the file
open "11 Image Slider/index.html"        # macOS
start  "11 Image Slider\index.html"      # Windows

# Option 2: local server
cd "11 Image Slider"
python3 -m http.server 8000
# visit http://localhost:8000
```

## Main Functionality

Five gradient-art slides are displayed one at a time inside a track that translates horizontally. Users can navigate with the arrows, dots, keyboard or swipe gestures; otherwise the slider advances automatically. The yellow progress bar shows how long until the next auto-slide, autoplay pauses on hover and can be stopped entirely with the Play/Pause button.
