'use client';

import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePetQuestStore } from '../../hooks/usePetQuestStore';

const PET_FACE_BY_MOOD: Record<string, string> = {
  idle: '😐',
  happy: '😄',
  energetic: '🤩',
  sleepy: '😴',
  sad: '🥺',
};

export default function DashboardPage() {
  const router = useRouter();
  const {
    state,
    isHydrated,
    visibleTasks,
    addTask,
    completeTaskAndReward,
    resetAllData,
    setFilter,
    setSort,
    logout,
  } = usePetQuestStore();

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const summary = useMemo(
    () => ({
      total: state.tasks.length,
      completed: state.tasks.filter((task) => task.completed).length,
      active: state.tasks.filter((task) => !task.completed).length,
    }),
    [state.tasks],
  );

  if (!isHydrated) {
    return <main className="page-shell"><section className="glass-card panel"><p>Loading...</p></section></main>;
  }

  if (!state.user) {
    router.push('/login');
    return null;
  }

  if (!state.selectedPetType) {
    router.push('/pet-select');
    return null;
  }

  const petFace = PET_FACE_BY_MOOD[state.pet.mood] ?? '🙂';

  const onTaskSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTask({
      title: taskTitle,
      description: taskDescription,
      priority,
    });
    setTaskTitle('');
    setTaskDescription('');
    setPriority('medium');
  };

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

          <form className="task-form" onSubmit={onTaskSubmit}>
            <input
              placeholder="What task do you want to do?"
              value={taskTitle}
              onChange={(event) => setTaskTitle(event.target.value)}
              required
            />
            <input
              placeholder="Short description (optional)"
              value={taskDescription}
              onChange={(event) => setTaskDescription(event.target.value)}
            />
            <select value={priority} onChange={(event) => setPriority(event.target.value as 'high' | 'medium' | 'low')}>
              <option value="high">High priority</option>
              <option value="medium">Medium priority</option>
              <option value="low">Low priority</option>
            </select>
            <button className="btn btn-primary" type="submit">Add Task</button>
          </form>

          <ul className="task-list">
            {visibleTasks.map((task) => (
              <li key={task.id} className="task-item">
                <div>
                  <h4>{task.title}</h4>
                  <p>{task.priority.toUpperCase()} priority {task.description ? `• ${task.description}` : ''}</p>
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
                <p>Add your first custom task above.</p>
              </li>
            )}
          </ul>

          <div className="cta-row">
            <Link href="/summary" className="btn btn-secondary">Explore Features</Link>
            <Link href="/admin" className="btn btn-secondary">Admin Panel</Link>
            <button className="btn btn-secondary" onClick={resetAllData}>Reset Progress</button>
            <button className="btn btn-danger" onClick={logout}>Logout</button>
          </div>
        </article>

        <article className="glass-card panel">
          <h2>{state.selectedPetType} Companion</h2>
          <p className="pet-face" aria-label="pet mood face">{petFace}</p>
          <p className="muted">Mood: {state.pet.mood}</p>
          <p className="muted">Energy: {state.pet.energy}%</p>
          <p className="muted">Level: {state.pet.level}</p>
          <p className="muted">Stage: {state.pet.stage}</p>
        </article>
      </section>
    </main>
  );
}
