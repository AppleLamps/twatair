# Repository Guidelines

## Project Structure & Module Organization
This is a static, multi-page site. Root HTML files (`index.html`, `about.html`, `book.html`, etc.) load the shared ES module entry at `js/modules/app.js`, which initializes shared UI (header/footer) and the page-specific module based on the current filename. Feature modules live in `js/modules/` (for example `hero.js`, `bookingWidget.js`, `feeCalculator.js`), shared helpers live in `js/modules/utils.js`, global styles are in `css/styles.css`, and static assets are under `assets/images/`.

## Build, Test, and Development Commands
There is no build step or package manager in this repo. For local development:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/index.html` in a browser. Directly opening the HTML files also works, but a simple server avoids module/CORS issues in some browsers.

## Coding Style & Naming Conventions
- Indentation is 4 spaces across HTML, CSS, and JS.
- ES modules use named exports; page modules expose an `init()` entry that the app calls.
- File naming: HTML files are lowercase; JS module files are camelCase (for example `cryptoTicker.js`), and CSS classes are kebab-case (`hero-headline`, `fee-card`).
- Prefer the DOM utilities in `js/modules/utils.js` (`dom.create`, `dom.get`) for consistent element creation.

## Testing Guidelines
There are no automated tests or test framework configured. Manually verify:
- Each page loads with header/footer injected.
- Navigation links and CTA buttons work.
- Console is free of errors.
- Layout holds at common breakpoints.

## Commit & Pull Request Guidelines
This folder does not include a `.git` history, so no commit message convention is established. If you start one, use short, imperative subjects (for example: `Add destinations carousel`). For PRs, include a brief summary, note manual testing performed, and attach screenshots for any UI changes.

## Security & Configuration Tips
There are no secrets or runtime configuration. External assets include Google Fonts; keep third-party links on `https` and avoid adding inline secrets or API keys in client-side code.
