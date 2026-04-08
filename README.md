# Pet Quest

Pet Quest is a local-first, gamified task management app where completing tasks earns points and helps a virtual pet grow.

## Stack
- Next.js (App Router)
- TypeScript
- Custom CSS (dark premium UI)
- localStorage persistence (no backend, no database)

## Features
- Landing page with CTA into dashboard
- Task management: add, complete, filter, sort
- Gamification: points, streak, achievements
- Virtual pet progression: mood, energy, level, stage
- Local persistence and reset controls

## Local development
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.

## Production build
```bash
npm run build
npm run start
```

## Vercel deployment
1. Push this repository to GitHub.
2. Import it in Vercel.
3. Set **Framework Preset** to `Next.js`.
4. Set **Root Directory** to repository root (where `package.json` exists).
5. Deploy.

No environment variables are required.

## Persistence model
All app data is saved in browser `localStorage` through `lib/storage.ts`.

Data includes:
- tasks
- points/streak
- pet status
- achievements
- settings

## Architecture notes
The app intentionally has no database setup. To add a backend later, keep UI/domain logic and replace the storage adapter with API calls.
