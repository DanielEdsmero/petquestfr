'use client';

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

type TaskStatus = 'pending' | 'completed';

type Task = {
  id: number;
  title: string;
  priority: 'Low' | 'Medium' | 'High';
  due: string;
  points: number;
  status: TaskStatus;
};

const tasksSeed: Task[] = [
  { id: 1, title: 'Finish project outline', priority: 'High', due: 'Today', points: 20, status: 'pending' },
  { id: 2, title: 'Review class notes', priority: 'Medium', due: 'Tomorrow', points: 10, status: 'completed' },
  { id: 3, title: '30-minute deep work sprint', priority: 'High', due: 'Today', points: 15, status: 'pending' },
  { id: 4, title: 'Plan tomorrow priorities', priority: 'Low', due: 'Today', points: 8, status: 'completed' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

function ProgressBar({ label, value, tone }: { label: string; value: number; tone: 'pink' | 'cyan' | 'green' }) {
  return (
    <div className="progress-wrap">
      <div className="progress-header">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="progress-track">
        <div className={`progress-fill ${tone}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [filter, setFilter] = useState<'all' | TaskStatus>('all');
  const [sort, setSort] = useState<'priority' | 'points'>('priority');
  const [showReset, setShowReset] = useState(false);

  const filteredTasks = useMemo(() => {
    const filtered = filter === 'all' ? tasksSeed : tasksSeed.filter((task) => task.status === filter);

    return [...filtered].sort((a, b) => {
      if (sort === 'points') return b.points - a.points;
      const rank = { High: 0, Medium: 1, Low: 2 };
      return rank[a.priority] - rank[b.priority];
    });
  }, [filter, sort]);

  const stats = {
    total: tasksSeed.length,
    completed: tasksSeed.filter((t) => t.status === 'completed').length,
    pending: tasksSeed.filter((t) => t.status === 'pending').length,
    streak: 6,
    points: 1480,
    petStatus: 'Energetic',
  };

  return (
    <main className="page-shell dashboard">
      <motion.section className="stats-grid" variants={container} initial="hidden" animate="show">
        {[
          ['Total Tasks', stats.total],
          ['Completed', stats.completed],
          ['Pending', stats.pending],
          ['Streak', `${stats.streak} days`],
          ['Points', stats.points],
          ['Pet Status', stats.petStatus],
        ].map(([label, value]) => (
          <motion.article key={String(label)} className="glass-card stat-card" variants={item}>
            <p>{label}</p>
            <h3>{value}</h3>
          </motion.article>
        ))}
      </motion.section>

      <motion.section className="content-grid" variants={container} initial="hidden" animate="show">
        <motion.article className="glass-card panel task-panel" variants={item}>
          <div className="panel-head">
            <h2>Task Management</h2>
            <div className="controls">
              <select value={filter} onChange={(e) => setFilter(e.target.value as 'all' | TaskStatus)}>
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value as 'priority' | 'points')}>
                <option value="priority">Sort: Priority</option>
                <option value="points">Sort: Points</option>
              </select>
            </div>
          </div>

          <ul className="task-list">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <li key={task.id} className="task-item">
                  <div>
                    <h4>{task.title}</h4>
                    <p>
                      {task.priority} • {task.due}
                    </p>
                  </div>
                  <span className={`pill ${task.status}`}>{task.status}</span>
                </li>
              ))
            ) : (
              <li className="empty-state">
                <h4>No tasks matched this filter</h4>
                <p>Try changing status or sort options to see your queue.</p>
              </li>
            )}
          </ul>
        </motion.article>

        <motion.article className="glass-card panel" variants={item}>
          <h2>Pet Status</h2>
          <p className="muted">Nova the Fox • Level 12 • 2380 / 2600 XP</p>
          <ProgressBar label="XP" value={91} tone="cyan" />
          <ProgressBar label="Wellness" value={78} tone="green" />
          <ProgressBar label="Mood" value={84} tone="pink" />
        </motion.article>

        <motion.article className="glass-card panel" variants={item}>
          <h2>Weekly Progress + Daily Goal</h2>
          <div className="mini-chart">
            {[62, 76, 48, 88, 71, 95, 67].map((height, i) => (
              <span key={i} style={{ height: `${height}%` }} />
            ))}
          </div>
          <p className="muted">Today: 3 / 5 tasks complete (60%)</p>
          <div className="goal-pill">2 more tasks to maintain your streak</div>
        </motion.article>

        <motion.article className="glass-card panel" variants={item}>
          <h2>Achievements</h2>
          <div className="achievements-grid">
            {['7-Day Streak', '100 Tasks Done', 'Focus Master', 'Pet Guardian'].map((badge) => (
              <div key={badge} className="achievement">
                <strong>{badge}</strong>
                <span>Unlocked</span>
              </div>
            ))}
          </div>
        </motion.article>

        <motion.article className="glass-card panel" variants={item}>
          <h2>Loading Snapshot</h2>
          <div className="skeleton-row" />
          <div className="skeleton-row short" />
          <div className="skeleton-row" />
        </motion.article>

        <motion.article className="glass-card panel" variants={item}>
          <h2>Settings & Reset</h2>
          <p className="muted">Need a fresh start? Reset tasks, streak, points, and pet progression.</p>
          <button className="btn btn-danger" onClick={() => setShowReset(true)}>
            Reset Progress
          </button>
        </motion.article>
      </motion.section>

      {showReset && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <motion.div className="glass-card modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <h3>Confirm Reset</h3>
            <p>This action permanently clears local progress. Are you sure?</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowReset(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={() => setShowReset(false)}>
                Confirm Reset
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}
