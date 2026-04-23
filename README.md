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

This project is configured for automatic GitHub Pages deployment using GitHub Actions.

1. In GitHub repository settings, open `Pages` and set source to `GitHub Actions`.
2. In GitHub repository settings, open `Secrets and variables` > `Actions` and add:
	- `VITE_SUPABASE_URL`
	- `VITE_SUPABASE_ANON_KEY`
	- `VITE_SUPABASE_BUCKET` (example: `trip-memories`)
3. Push to `main` branch.
4. GitHub Actions will build and deploy automatically.
5. Your site URL will be:
	`https://<your-username>.github.io/<your-repo-name>/`

## Base Path Notes

- Default production base path uses your repo name automatically.
- You can override it if needed:
  `VITE_BASE_PATH=/custom-path/ npm run build`

## Image Storage Notes

- Memory photos are stored in `localStorage` in the user's browser.
- This works on GitHub Pages (no backend required).
- Photos are device/browser specific and are not shared across devices.

## Cloud Sync Across Devices (Supabase)

You can keep hosting on GitHub Pages and still use cloud storage for shared photos.

1. Create a Supabase project.
2. Create a Storage bucket named `trip-memories`.
3. Set the bucket to public for simple public gallery usage.
4. In your project root, create `.env` from `.env.example` and fill:
	- `VITE_SUPABASE_URL`
	- `VITE_SUPABASE_ANON_KEY`
	- `VITE_SUPABASE_BUCKET=trip-memories`
5. Run locally and verify uploads.
6. For GitHub Pages, add the same values as repository secrets or build-time environment variables before deploy.

When Supabase variables are present, uploads are stored in cloud and visible across devices. Without them, the app automatically falls back to local browser storage.
