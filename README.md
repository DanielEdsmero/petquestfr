# Pet Quest (Local-First)

Pet Quest is a fully local-first, browser-based productivity app for students. It starts empty and persists all user data in the browser via `localStorage`.

## Stack
- JavaScript (ES Modules)
- CSS
- HTML
- No backend required

## Features
- Dashboard (today/overdue/upcoming, points, streak, pet status)
- Task CRUD with due dates, priority, category, notes
- Task search/filter/sort and status labels
- Gamification (points, streak, pet mood/energy/level/stage)
- Progress analytics (weekly/category/points summaries)
- Pretest/Posttest surveys with Likert 1-4 dimensions
- Profile/settings (student name, section, pet selection, theme, reset)

## Run locally
Because this app uses ES modules, serve it with a static local server.

### Option A: VS Code Live Server
1. Open this folder in VS Code.
2. Start Live Server on `index.html`.

### Option B: Python
```bash
python3 -m http.server 5173
```
Then open: `http://localhost:5173`

## Deploy to Vercel
This is a static app, so you can deploy directly:
1. Import the repository in Vercel.
2. Use default static settings (no server required).
3. Deploy.

## Local storage design
Storage adapter is in:
- `src/storage/localStore.js`

State schema is in:
- `src/constants/schema.js`

`localStore` exposes:
- `load()`
- `save(state)`
- `reset()`

## Replacing storage with a real backend later
When ready, swap `localStore` with a repository/API layer that has the same methods:
- Replace calls in `src/main.js` (`load/save/reset`) with async API calls.
- Keep logic modules unchanged (`src/logic/*`) and UI layer unchanged (`src/ui/*`).
- Good future targets: REST API, SQLite service, or Postgres service.

This keeps UI/business logic separated from persistence.
