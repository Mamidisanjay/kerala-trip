# Kerala Trip Site

Kerala journey landing page built with React + Vite.

## Local Run

1. Install dependencies:
	npm install
2. Start dev server:
	npm run dev
3. Build production bundle:
	npm run build

## Deploy To GitHub Pages

This project is configured for GitHub Pages deployment.

1. Push this project to a GitHub repository.
2. Run:
	npm run deploy
3. In GitHub repository settings, open `Pages` and set source to `gh-pages` branch.
4. Your site URL will be:
	`https://<your-username>.github.io/<your-repo-name>/`

## Base Path Notes

- Default production base path uses your repo name automatically.
- You can override it if needed:
  `VITE_BASE_PATH=/custom-path/ npm run build`

## Image Storage Notes

- Memory photos are stored in `localStorage` in the user's browser.
- This works on GitHub Pages (no backend required).
- Photos are device/browser specific and are not shared across devices.
