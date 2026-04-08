import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import { authRequired, JWT_SECRET } from '../middleware/authMiddleware.js';

const router = express.Router();

const userSelect = 'id, username, role, pet_type, pet_name, level, xp, streak, last_active';

const enrichUser = (user) => {
  const completedToday = db
    .prepare(
      `SELECT COUNT(*) AS count FROM tasks
       WHERE user_id = ? AND completed = 1 AND DATE(completed_at) = DATE('now')`
    )
    .get(user.id).count;

  const mood = completedToday >= 2 ? 'Happy' : completedToday === 1 ? 'Neutral' : 'Sad';
  return { ...user, mood };
};

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) return res.status(409).json({ error: 'Username already exists' });

  const password_hash = await bcrypt.hash(password, 10);
  const info = db
    .prepare('INSERT INTO users (username, password_hash, role, last_active) VALUES (?, ?, ?, DATE(\'now\'))')
    .run(username, password_hash, 'user');
  const user = db.prepare(`SELECT ${userSelect} FROM users WHERE id = ?`).get(info.lastInsertRowid);
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

  res.json({ token, user: enrichUser(user) });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  let user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) {
    const password_hash = await bcrypt.hash(password, 10);
    const info = db
      .prepare('INSERT INTO users (username, password_hash, role, last_active) VALUES (?, ?, ?, DATE(\'now\'))')
      .run(username, password_hash, 'user');
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  db.prepare('UPDATE users SET last_active = DATE(\'now\') WHERE id = ?').run(user.id);
  const safeUser = db.prepare(`SELECT ${userSelect} FROM users WHERE id = ?`).get(user.id);
  const token = jwt.sign({ id: safeUser.id, username: safeUser.username, role: safeUser.role }, JWT_SECRET, { expiresIn: '7d' });

  res.json({ token, user: enrichUser(safeUser) });
});

router.get('/me', authRequired, (req, res) => {
  const user = db.prepare(`SELECT ${userSelect} FROM users WHERE id = ?`).get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: enrichUser(user) });
});

router.put('/pet', authRequired, (req, res) => {
  const { pet_type, pet_name } = req.body;
  if (!pet_type) return res.status(400).json({ error: 'pet_type is required' });

  db.prepare('UPDATE users SET pet_type = ?, pet_name = ? WHERE id = ?').run(pet_type, pet_name || null, req.user.id);
  const user = db.prepare(`SELECT ${userSelect} FROM users WHERE id = ?`).get(req.user.id);
  res.json({ user: enrichUser(user) });
});

export default router;
