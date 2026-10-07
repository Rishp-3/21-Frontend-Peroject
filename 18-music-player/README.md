# 18 - Music Player

## Description
A fully functional music player that generates its own audio with the **Web Audio API** — four short synthesized chiptune/synth loops, so there are zero external media files and nothing can 404. Includes playlist, seek, volume, shuffle and repeat.

## Features
- Play/pause, next/previous, shuffle and repeat-one modes
- Seek bar (drag to any position) + live time display
- Volume control wired to a master gain node
- Clickable playlist with active-track highlight
- Spinning vinyl animation while playing
- Responsive glassmorphism card layout (mobile → desktop)

## Technologies Used
HTML5, CSS3 (Flexbox, keyframes, backdrop-filter), Vanilla JavaScript, Web Audio API (oscillators + gain envelopes)

## How to Run
```bash
cd "18-music-player"
python3 -m http.server 8000   # or open index.html directly
```
Click ▶ to start (browsers require a user gesture before audio can play).

## Main Functionality
Press play → the app schedules oscillator notes per the track's BPM and note sequence → progress advances in real time → at track end it auto-advances (or repeats/shuffles per your settings). You can switch tracks from the playlist or drag the seek bar to jump within a track.
