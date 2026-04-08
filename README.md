# Pet Quest Productivity App

A full-stack productivity app where completing tasks helps your virtual pet level up.

## Tech Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: SQLite (`better-sqlite3`)
- Auth: JWT stored in `localStorage`

## Project Structure
- `client/` - React UI
- `server/` - Express API + SQLite

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Seed database:
   ```bash
   npm run seed
   ```
3. Start frontend + backend in dev mode:
   ```bash
   npm run dev
   ```

- Client: http://localhost:5173
- Server: http://localhost:4000

## Demo Accounts
- Admin: `admin` / `admin123`
- User: `alex` / `alex123`
- User: `mila` / `mila123`

## API Routes
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/pet`
- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `GET /api/admin/stats` (admin)
- `GET /api/admin/users` (admin)

All API errors return JSON:
```json
{ "error": "message" }
```
