# 💰 Expense Tracker

## Description
A personal finance tracker that records income and expenses with categories and dates, shows live balance summaries, supports filtering/sorting, and persists everything in `localStorage`. Amounts are stored as integer cents to avoid floating-point drift.

## Features
- ✅ Add income or expense transactions via a validated form
- ✅ 12 categories across income & expense optgroups
- ✅ Date picker (defaults to today) + Income/Expense radio toggle
- ✅ Live summary cards: Balance, Income, Expenses
- ✅ Filter by type and sort by date or amount (4 modes)
- ✅ Delete single transactions or clear all (with confirmation)
- ✅ Cent-based money math — exact currency totals
- ✅ `localStorage` persistence across sessions
- ✅ Slide-in animations, scrollable history, empty states
- ✅ Fully responsive (stacked layout on mobile)

## Technologies Used
- HTML5 (forms, `input[type=date]`, `select` with optgroups)
- CSS3 (grid, gradients, keyframes, media queries)
- Vanilla JavaScript (`Intl.NumberFormat` currency, `localStorage`)

## How to Run
```bash
# Option 1: just open the file
open "15-expense-tracker/index.html"        # macOS
start  "15-expense-tracker\index.html"      # Windows

# Option 2: local server
cd "15-expense-tracker"
python3 -m http.server 8000
# visit http://localhost:8000
```

## Main Functionality
Fill in description, amount, category, type and date, then submit — the transaction appears in the history list and the three summary cards update instantly. Use the dropdowns above the list to filter (all/income/expense) and sort (newest, oldest, highest, lowest). Each row has a ❌ delete button; **Clear All** wipes the ledger after confirmation. All data is saved locally in your browser.
