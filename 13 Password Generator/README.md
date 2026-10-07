# 🔐 Password Generator

## Description
A secure, configurable password generator using the Web Crypto API (`crypto.getRandomValues`) for randomness, with an entropy-based strength meter, one-click copy and an in-memory history of recent passwords.

## Features
- ✅ Adjustable length slider (4–64 characters)
- ✅ Toggle character types: uppercase, lowercase, numbers, symbols
- ✅ Guarantees at least one character from every selected type
- ✅ Fisher–Yates shuffle to avoid predictable positions
- ✅ Ambiguous characters (0/O/1/l/I) excluded for readability
- ✅ Cryptographic randomness via `crypto.getRandomValues` (with fallback)
- ✅ Entropy-based strength bar (Weak → Very Strong, shows bits)
- ✅ Copy to clipboard with Clipboard API + legacy fallback
- ✅ Recent-passwords history (last 5, click to re-copy, never persisted)
- ✅ Regenerates automatically when options change
- ✅ Fully responsive dark UI

## Technologies Used
- HTML5
- CSS3 (custom properties-free dark theme, transitions, media queries)
- Vanilla JavaScript (Web Crypto API, Clipboard API, Fisher–Yates)

## How to Run
```bash
# Option 1: just open the file
open "13 Password Generator/index.html"        # macOS
start  "13 Password Generator\index.html"      # Windows

# Option 2: local server
cd "13 Password Generator"
python3 -m http.server 8000
# visit http://localhost:8000
```

## Main Functionality
On load a 16-character password is generated instantly. Move the length slider or toggle character sets to regenerate. The strength bar reports estimated entropy in bits. Click the 📋 button (or any history entry) to copy a password; a confirmation message appears below the output field. History keeps only the five most recent passwords in memory — nothing is ever written to disk.
