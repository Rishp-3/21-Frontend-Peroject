# 16 - Movie Search App

## Description
A movie search application powered by the free [OMDb API](https://www.omdbapi.com/). Search any title, filter by release year, browse paginated results, and open a detail modal with poster, plot, director, cast, and ratings.

## Features
- Debounced live search (starts after 2 characters, 500 ms delay)
- Year filter dropdown (1970 → current year)
- Responsive poster grid with skeleton loading state
- Pagination (Prev / Next with page & result count)
- Detail modal: full plot, runtime, genre, cast, ratings chips
- Accessible: keyboard-operable cards, `Esc` to close modal, ARIA live status line
- XSS-safe rendering of all API data

## Technologies Used
HTML5, CSS3 (Grid/Flexbox, custom properties), Vanilla JavaScript (`fetch`, async/await)

## How to Run
```bash
cd "16-movie-search-app"
# serve with any static server, e.g.:
python3 -m http.server 8000
# open http://localhost:8000
```
A shared demo API key is included. For production, get your own free key at omdbapi.com/apikey.aspx and update `API_KEY` in `main.js`.

## Main Functionality
Type a movie title → results load into a responsive grid → click a card to view full details in a modal → use Prev/Next to paginate or change the year filter to narrow results. Network/API errors are shown gracefully in the status line.
