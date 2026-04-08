import bcrypt from 'bcrypt';
import db from '../db.js';

const seed = async () => {
  db.prepare('DELETE FROM tasks').run();
  db.prepare('DELETE FROM users').run();

  const users = [
    { username: 'admin', password: 'admin123', role: 'admin', pet_type: '🐉', pet_name: 'Astra', level: 5, xp: 40, streak: 7 },
    { username: 'alex', password: 'alex123', role: 'user', pet_type: '🐶', pet_name: 'Bolt', level: 2, xp: 30, streak: 2 },
    { username: 'mila', password: 'mila123', role: 'user', pet_type: '🐱', pet_name: 'Luna', level: 3, xp: 70, streak: 4 }
  ];

  const insertUser = db.prepare(
    `INSERT INTO users (username, password_hash, role, pet_type, pet_name, level, xp, streak, last_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, DATE('now'))`
  );

  const ids = {};
  for (const user of users) {
    const hash = await bcrypt.hash(user.password, 10);
    const info = insertUser.run(
      user.username,
      hash,
      user.role,
      user.pet_type,
      user.pet_name,
      user.level,
      user.xp,
      user.streak
    );
    ids[user.username] = info.lastInsertRowid;
  }

  const insertTask = db.prepare(
    `INSERT INTO tasks (user_id, title, priority, due_date, completed, completed_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, datetime('now', '-' || ? || ' hours'))`
  );

  insertTask.run(ids.alex, 'Morning walk', 'High', '2026-04-09', 1, "2026-04-08 08:00:00", 12);
  insertTask.run(ids.alex, 'Clean inbox', 'Medium', '2026-04-10', 0, null, 4);
  insertTask.run(ids.mila, 'Write report', 'High', '2026-04-09', 1, "2026-04-08 09:00:00", 20);
  insertTask.run(ids.mila, 'Meditation', 'Low', '2026-04-11', 1, "2026-04-08 07:00:00", 2);

  console.log('Seed complete. Users: admin/admin123, alex/alex123, mila/mila123');
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
