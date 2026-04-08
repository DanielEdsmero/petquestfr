import express from 'express';
import db from '../db.js';
import { authRequired } from '../middleware/authMiddleware.js';

const router = express.Router();

const updateUserProgress = (userId) => {
  const completedToday = db
    .prepare(
      `SELECT COUNT(*) AS count FROM tasks
       WHERE user_id = ? AND completed = 1 AND DATE(completed_at) = DATE('now')`
    )
    .get(userId).count;

  const completedDays = db
    .prepare(
      `SELECT COUNT(DISTINCT DATE(completed_at)) AS count
       FROM tasks WHERE user_id = ? AND completed = 1`
    )
    .get(userId).count;

  const totalCompleted = db.prepare('SELECT COUNT(*) AS count FROM tasks WHERE user_id = ? AND completed = 1').get(userId).count;
  const level = Math.floor(totalCompleted / 10) + 1;
  const xp = (totalCompleted * 10) % 100;

  db.prepare('UPDATE users SET level = ?, xp = ?, streak = ?, last_active = DATE(\'now\') WHERE id = ?').run(
    level,
    xp,
    completedDays,
    userId
  );

  const mood = completedToday >= 2 ? 'Happy' : completedToday === 1 ? 'Neutral' : 'Sad';
  return { mood, level, xp, streak: completedDays };
};

router.get('/', authRequired, (req, res) => {
  const tasks = db
    .prepare('SELECT id, title, priority, due_date, completed, completed_at, created_at FROM tasks WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.user.id);
  res.json({ tasks });
});

router.post('/', authRequired, (req, res) => {
  const { title, priority = 'Medium', due_date = null } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });

  const info = db
    .prepare('INSERT INTO tasks (user_id, title, priority, due_date) VALUES (?, ?, ?, ?)')
    .run(req.user.id, title, priority, due_date);

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ task });
});

router.patch('/:id', authRequired, (req, res) => {
  const taskId = Number(req.params.id);
  const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(taskId, req.user.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const updates = {
    title: req.body.title ?? task.title,
    priority: req.body.priority ?? task.priority,
    due_date: req.body.due_date ?? task.due_date,
    completed: req.body.completed ?? task.completed
  };
  const completedAt = updates.completed ? "datetime('now')" : 'NULL';

  db.prepare(
    `UPDATE tasks
       SET title = ?, priority = ?, due_date = ?, completed = ?, completed_at = ${completedAt}
       WHERE id = ? AND user_id = ?`
  ).run(updates.title, updates.priority, updates.due_date, updates.completed, taskId, req.user.id);

  const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
  const progress = updateUserProgress(req.user.id);
  res.json({ task: updatedTask, progress });
});

router.delete('/:id', authRequired, (req, res) => {
  const taskId = Number(req.params.id);
  const info = db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?').run(taskId, req.user.id);
  if (!info.changes) return res.status(404).json({ error: 'Task not found' });

  const progress = updateUserProgress(req.user.id);
  res.json({ success: true, progress });
});

export default router;
