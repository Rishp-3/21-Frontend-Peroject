# Contributing to 21 Frontend Projects

Thanks for your interest in contributing! This repository is a collection of **21 frontend projects** built with **vanilla HTML, CSS, and JavaScript** (no frameworks). Contributions of all sizes are welcome: bug fixes, UI improvements, accessibility fixes, documentation, and new ideas.

## Ways to Contribute

- 🐛 **Report bugs**: open an issue describing what went wrong
- 💡 **Suggest features or improvements** for any of the projects
- 📝 **Improve documentation**: fix typos, clarify READMEs, add screenshots
- 🎨 **Improve UI/UX**: responsiveness, accessibility, visual polish
- 🔧 **Fix code issues**: bugs, edge cases, cleanup

## Before You Start

1. Check existing [issues](https://github.com/Rishp-3/21-Frontend-Peroject/issues) and [pull requests](https://github.com/Rishp-3/21-Frontend-Peroject/pulls) to avoid duplicate work.
2. For larger changes, open an issue first so we can discuss the idea.

## Getting Started

1. **Fork** the repository.
2. **Clone** your fork:
   ```bash
   git clone https://github.com/<your-username>/21-Frontend-Peroject.git
   cd 21-Frontend-Peroject
   ```
3. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/short-description
   ```
4. Open the project folder you want to work on and run its `index.html` in the browser (or use the VS Code **Live Server** extension).

No build step or dependencies are needed.

## Project Guidelines

- **Stay vanilla.** Use only HTML, CSS, and JavaScript. Please do not add frontend frameworks or libraries.
- **Keep projects self-contained.** Each project lives in its own folder with its own `index.html`, CSS, and JS files.
- **One project per change where possible.** Keep pull requests focused.
- **Responsive design.** Check your changes on mobile, tablet, and desktop widths.
- **Accessibility.** Use semantic HTML, meaningful labels, sufficient colour contrast, and keyboard-friendly controls.
- **Don't commit secrets.** Never commit API keys or tokens (see [SECURITY.md](SECURITY.md)). For projects that call external APIs (e.g. Weather, Movie Search), use placeholder keys and document how to add your own.

## Code Style

**HTML**
- Use semantic elements (`<header>`, `<main>`, `<section>`, `<button>`, etc.).
- Add `alt` text to images and labels to form fields.

**CSS**
- Prefer Flexbox/Grid for layout.
- Use meaningful class names (e.g. `.task-item`, not `.box1`).
- Keep styles organized and avoid unnecessary `!important`.

**JavaScript**
- Use modern ES6+ syntax (`const`/`let`, arrow functions, template literals).
- Use clear variable and function names.
- Avoid `innerHTML` with untrusted or user-provided input; prefer `textContent` or safe DOM methods to prevent XSS.
- Add short comments where the logic isn't obvious.

## Commit Messages

Write short, clear messages in the imperative mood:

```
Add dark mode toggle to Calculator
Fix timer reset bug in Stopwatch
Update README for Weather App
```

## Submitting a Pull Request

1. Make sure your changes work in the browser and don't break other projects.
2. Commit and push your branch:
   ```bash
   git add .
   git commit -m "Describe your change"
   git push origin feature/short-description
   ```
3. Open a **Pull Request** against the `main` branch and include:
   - What you changed and why
   - Which project(s) are affected
   - Screenshots or a short GIF for visual changes
   - Any related issue (e.g. `Closes #12`)
4. Be open to feedback. Reviews are meant to help improve the code.

## Reporting Bugs

When opening an issue, please include:

- The project name (e.g. "08 Weather App")
- Steps to reproduce
- Expected vs. actual behaviour
- Browser and OS
- Screenshots or console errors, if any

## Reporting Security Issues

Please **do not** open a public issue for security vulnerabilities. See [SECURITY.md](SECURITY.md) for how to report them privately.

## Be Respectful

Be kind, patient, and constructive. This is a learning-focused repository, and everyone is welcome regardless of experience level.

Happy coding! 🚀
