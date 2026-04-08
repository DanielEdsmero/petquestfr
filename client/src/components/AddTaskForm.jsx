import { useState } from 'react';

export default function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, priority, due_date: dueDate || null });
    setTitle('');
    setPriority('Medium');
    setDueDate('');
  };

  return (
    <form onSubmit={submit} className="card p-4 space-y-3">
      <input className="input" placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <div className="grid grid-cols-2 gap-3">
        <select className="input" value={priority} onChange={(e) => setPriority(e.target.value)}>
          {['Low', 'Medium', 'High'].map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <input className="input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </div>
      <button className="btn w-full" type="submit">
        Add Task
      </button>
    </form>
  );
}
