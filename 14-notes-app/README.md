# 🗒️ Notes App

## Description

A sticky-note style notes application with full create / edit / delete lifecycle, live search with match highlighting, five color labels and automatic persistence to `localStorage`.

## Features

- ✅ Add notes with title, body and a color label (5 colors)
- ✅ Edit any note in place (composer switches to "Save Changes" mode)
- ✅ Delete with confirmation + shrink animation
- ✅ Live search across titles and bodies with `<mark>` highlighting
- ✅ Auto-save to `localStorage` — notes survive reloads
- ✅ Note count badge & smart empty states ("no notes" vs "no matches")
- ✅ Character counter (2000 max) and last-edited timestamps
- ✅ `Ctrl/Cmd + Enter` shortcut to save from the textarea
- ✅ Responsive masonry-like CSS grid (1/2/3 columns)
- ✅ XSS-safe rendering (all user input escaped)

## Technologies Used

- HTML5
- CSS3 (grid, keyframe animations, transitions, media queries)
- Vanilla JavaScript (`localStorage`, dynamic DOM, event delegation patterns)

## How to Run

```bash
# Option 1: just open the file
open "14-notes-app/index.html"        # macOS
start  "14-notes-app\index.html"      # Windows

# Option 2: local server
cd "14-notes-app"
python3 -m http.server 8000
# visit http://localhost:8000
```

## Main Functionality

Type a title/body, pick a swatch color and press **Add Note** — the note appears at the top of the grid and is stored locally. The search box instantly filters notes and highlights matching text. Each card has ✏️ (loads the note back into the composer for editing) and 🗑️ (asks to confirm, then animates the removal). Everything persists between sessions via `localStorage`.
