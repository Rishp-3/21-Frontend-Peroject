# 📋 Form Validation

## Description
A client-side registration form that validates every field in real time using vanilla JavaScript and regular expressions — no page reloads, no libraries. Includes a live password strength meter and an animated success panel.

## Features
- ✅ Real-time validation on input, blur and submit
- ✅ Regex rules for name, email and 10-digit phone number
- ✅ Date-of-birth check (no future dates, minimum age 10)
- ✅ Password rules checklist (length, upper, lower, digit, special)
- ✅ Live color-coded password strength bar
- ✅ Confirm-password matching (re-checked when password changes)
- ✅ Terms & conditions checkbox enforcement
- ✅ Green/red field states with inline error messages
- ✅ Success screen with summary + "Register Another User" reset
- ✅ Fully responsive (mobile / tablet / desktop)

## Technologies Used
- HTML5
- CSS3 (gradients, transitions, media queries)
- Vanilla JavaScript (RegExp, DOM events, `addEventListener`)

## How to Run
```bash
# Option 1: just open the file
open "10 Form Validation/index.html"        # macOS
start  "10 Form Validation\index.html"      # Windows

# Option 2: local server
cd "10 Form Validation"
python3 -m http.server 8000
# visit http://localhost:8000
```

## Main Functionality
Fill out the registration form; each field is validated as you type or on blur. Invalid fields turn red with an explanatory message, valid fields turn green. The password field shows a live strength bar and a rule checklist. On successful submission of all valid data, the form is replaced by a confirmation panel where the user can start a new registration.
