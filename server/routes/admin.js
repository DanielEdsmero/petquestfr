import express from 'express';
import db from '../db.js';
import { adminOnly, authRequired } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', authRequired, adminOnly, (req, res) => {
  const totalUsers = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
  const totalTasks = db.prepare('SELECT COUNT(*) AS count FROM tasks').get().count;
  const completedTasks = db.prepare('SELECT COUNT(*) AS count FROM tasks WHERE completed = 1').get().count;
  const mostActive = db
    .prepare(
      `SELECT u.username
       FROM users u
       LEFT JOIN tasks t ON t.user_id = u.id AND t.completed = 1
       GROUP BY u.id
       ORDER BY COUNT(t.id) DESC
       LIMIT 1`
    )
    .get();

  const completionRate = totalTasks ? ((completedTasks / totalTasks) * 100).toFixed(1) : '0.0';

  res.json({
    totalUsers,
    totalTasks,
    completionRate,
    mostActiveUser: mostActive?.username || null
  });
});

router.get('/users', authRequired, adminOnly, (req, res) => {
  const users = db
    .prepare(
      `SELECT u.id, u.username, u.pet_type, u.level, u.xp, u.streak,
              COUNT(CASE WHEN t.completed = 1 THEN 1 END) AS completed_tasks
       FROM users u
       LEFT JOIN tasks t ON t.user_id = u.id
       GROUP BY u.id
       ORDER BY u.username ASC`
    )
    .all();
  res.json({ users });
});

export default router;
