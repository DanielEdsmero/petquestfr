'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePetQuestStore } from '../../hooks/usePetQuestStore';

export default function AdminPage() {
  const router = useRouter();
  const { state, analytics, isHydrated } = usePetQuestStore();

  if (!isHydrated) {
    return <main className="page-shell"><section className="glass-card panel"><p>Loading...</p></section></main>;
  }

  if (!state.user) {
    router.push('/login');
    return null;
  }

  return (
    <main className="page-shell">
      <section className="glass-card panel">
        <p className="badge">Admin Panel</p>
        <h1>Analytics Overview</h1>
        <p className="subtitle">Local analytics only (no database).</p>

        <div className="stats-grid">
          <article className="glass-card stat-card"><p>Total Tasks</p><h3>{analytics.totalTasks}</h3></article>
          <article className="glass-card stat-card"><p>Completed Tasks</p><h3>{analytics.completedTasks}</h3></article>
          <article className="glass-card stat-card"><p>Completion Rate</p><h3>{analytics.completionRate}%</h3></article>
          <article className="glass-card stat-card"><p>Current Streak</p><h3>{analytics.currentStreak}</h3></article>
          <article className="glass-card stat-card"><p>Points</p><h3>{analytics.points}</h3></article>
          <article className="glass-card stat-card"><p>Achievements</p><h3>{analytics.achievements}</h3></article>
        </div>

        <article className="glass-card panel" style={{ marginTop: '1rem' }}>
          <h2>Tasks by Priority</h2>
          <p className="muted">High: {analytics.byPriority.high}</p>
          <p className="muted">Medium: {analytics.byPriority.medium}</p>
          <p className="muted">Low: {analytics.byPriority.low}</p>
        </article>

        <div className="cta-row">
          <Link href="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
        </div>
      </section>
    </main>
  );
}
