# Pet Quest

Pet Quest is a **gamified task management app** where productivity directly supports a **virtual pet companion**. Users create and complete tasks, earn progress rewards, and keep their pet happy through consistent daily habits. The project is designed to be **local-first** and simple to run, with all app state persisted in the browser.

## Project Overview

Pet Quest combines two core experiences:

- **Task management**: create, organize, and complete personal tasks.
- **Virtual pet gameplay loop**: task completion fuels pet progression (mood, energy, level, and growth stages).

This creates a lightweight habit-building system where real-world consistency translates into in-app pet care and progression.

## Tech Stack

- **Next.js** for app framework and routing
- **TypeScript** for type-safe development
- **Tailwind CSS** for styling
- **localStorage** for client-side persistence

## Local Setup

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Then open the local URL shown in your terminal (typically `http://localhost:3000`).

## Production Build / Start

Create a production build and run the production server:

```bash
npm run build
npm run start
```

## Deploying to Vercel

No environment variables are required for the current local-first architecture.

1. Push your repository to GitHub/GitLab/Bitbucket.
2. In Vercel, click **Add New Project**.
3. Import this repository.
4. Keep the detected Next.js build settings (defaults are fine).
5. Leave Environment Variables empty.
6. Click **Deploy**.

## Data Model Summary

The app’s persisted state is organized around a small set of client-side entities, for example:

- **tasks**: task metadata (title, status, due date, priority, etc.)
- **pet**: virtual pet stats/progression (mood, energy, level, stage)
- **profile/settings**: user preferences and UI configuration
- **progress/gameplay metrics**: points, streaks, and summary counters

### localStorage Key Strategy

Use namespaced keys to keep data clear and versionable:

- `petquest:v1:tasks`
- `petquest:v1:pet`
- `petquest:v1:profile`
- `petquest:v1:stats`

Recommended approach:

- Prefix keys with `petquest` to avoid collisions.
- Include a schema version (for example `v1`) to support future migrations.
- Keep domain data in separate keys for safer partial resets and easier debugging.

## Architecture Constraint

**This project has no database and no backend dependencies.**

All persistence is handled in-browser via `localStorage`, and application behavior is client-driven.

## Future Extension: Replacing localStorage with a Real API/Database

When scaling beyond local persistence, swap the storage layer behind a stable interface:

1. Introduce a data access layer (repository/service) currently backed by `localStorage`.
2. Replace repository implementations with API calls (REST/GraphQL) or direct SDK access.
3. Connect that API to a real database (e.g., Postgres, MySQL, SQLite, MongoDB).
4. Keep UI components and game/task domain logic unchanged by preserving data contracts.

In short: the persistence boundary should be the only place that changes when moving to a backend architecture.
