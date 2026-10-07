# 08 — Weather App

## Description
A weather dashboard powered by the OpenWeather API. Search any city to see current conditions plus a next-24-hours strip and a 5-day forecast, all shown in the *city's* local time.

## Features
- Current temperature, feels-like, description, humidity, wind, pressure and visibility (all with units)
- Day-part label (Morning/Afternoon/Evening/Night) computed from the city's UTC offset
- Next 24 hours (3-hour steps) and 5-day forecast (one entry per day, picked near noon)
- Enter-key / form-based search with input trimming and empty-input guard
- User-visible error banner (no key, network failure, city not found) — never just console logs
- Responsive layout, keyboard-accessible, visible focus styles

## Technologies used
HTML, CSS, vanilla JavaScript, OpenWeather Forecast API.

## How to run
1. Get a free key at https://home.openweathermap.org/api_keys
   ⚠️ **Important:** an earlier version of this project committed a real API key to git history. Regenerate/revoke that key before using this app.
2. `cp config.example.js config.js` and paste your key into `config.js` (gitignored, so it is never committed).
3. Open `index.html` via a local server: `python3 -m http.server 8000` → http://localhost:8000

## Main functionality
`main.js` reads the key from `window.WEATHER_CONFIG` (set by `config.js`), fetches current weather + 5-day/3-hour forecast, then renders both lists using the city timezone offset for all clock labels.
