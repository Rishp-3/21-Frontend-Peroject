# 07 Color Generator

Generate random colors and copy their HEX / RGB / HSL / CMYK values instantly. All conversions are computed locally in JavaScript — no external APIs.

## Features
- One-click random color generation (a real random color loads on page open)
- Copy buttons for HEX, RGB, HSL and CMYK (`navigator.clipboard` with an `execCommand` fallback) plus "Copied!" feedback and a screen-reader live announcement
- Recent-color history (last 6), each swatch copyable; starts empty, no fake placeholders
- Friendly color name derived from HSL bands
- Responsive card layout, keyboard focus styles, accessible labels

## Technologies Used
HTML5, CSS3 (grid + clamp), vanilla JavaScript (local color-space math, Clipboard API).

## How to Run
Open `index.html` in a browser, or:
```bash
cd "07-color-generator" && python3 -m http.server 8000
```

## Main Functionality
Click **Generate New Color** → the preview, name and four format values update; click any copy icon (or a recent swatch) to place that value on your clipboard.
