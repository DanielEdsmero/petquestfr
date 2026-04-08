'use client';

import { useMemo } from 'react';
import { usePetQuestStore } from '../../hooks/usePetQuestStore';

export default function DashboardPage() {
  const {
    state,
    visibleTasks,
    addTask,
    completeTaskAndReward,
    resetAllData,
    setFilter,
    setSort,
  } = usePetQuestStore();

  const summary = useMemo(
    () => ({
      total: state.tasks.length,
      completed: state.tasks.filter((task) => task.completed).length,
      active: state.tasks.filter((task) => !task.completed).length,
    }),
    [state.tasks],
  );

  return (
    <main className="page-shell dashboard">
      <section className="stats-grid">
        <article className="glass-card stat-card">
          <p>Total Tasks</p>
          <h3>{summary.total}</h3>
        </article>
        <article className="glass-card stat-card">
          <p>Completed</p>
          <h3>{summary.completed}</h3>
        </article>
        <article className="glass-card stat-card">
          <p>Points</p>
          <h3>{state.points}</h3>
        </article>
      </section>

      <section className="content-grid">
        <article className="glass-card panel task-panel">
          <div className="panel-head">
            <h2>Task Queue</h2>
            <div className="controls">
              <select value={state.filter} onChange={(event) => setFilter(event.target.value as 'all' | 'active' | 'completed')}>
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
              <select value={state.sort} onChange={(event) => setSort(event.target.value as 'createdAt' | 'dueDate' | 'priority')}>
                <option value="createdAt">Newest</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
              </select>
            </div>
          </div>

          <ul className="task-list">
            {visibleTasks.map((task) => (
              <li key={task.id} className="task-item">
                <div>
                  <h4>{task.title}</h4>
                  <p>{task.priority.toUpperCase()} priority</p>
                </div>
                {task.completed ? (
                  <span className="pill completed">completed</span>
                ) : (
                  <button className="btn btn-primary" onClick={() => completeTaskAndReward(task.id)}>
                    Complete
                  </button>
                )}
              </li>
            ))}
            {visibleTasks.length === 0 && (
              <li className="empty-state">
                <h4>No tasks yet</h4>
                <p>Add your first task to start earning points.</p>
              </li>
            )}
          </ul>

          <div className="cta-row">
            <button
              className="btn btn-secondary"
              onClick={() =>
                addTask({
                  title: `Task ${summary.total + 1}`,
                  priority: summary.active > 2 ? 'medium' : 'high',
                })
              }
            >
              Add Sample Task
            </button>
            <button className="btn btn-danger" onClick={resetAllData}>
              Reset Local State
            </button>
          </div>
        </article>

        <article className="glass-card panel">
          <h2>Pet Status</h2>
          <p className="muted">Mood: {state.pet.mood}</p>
          <p className="muted">Energy: {state.pet.energy}%</p>
          <p className="muted">Level: {state.pet.level}</p>
          <p className="muted">Stage: {state.pet.stage}</p>
        </article>
      </section>
    </main>
  );
}
