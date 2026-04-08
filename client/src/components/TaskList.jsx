import TaskCard from './TaskCard';

export default function TaskList({ tasks, filter, setFilter, onToggleComplete, onDelete }) {
  const filtered = tasks.filter((task) => {
    if (filter === 'Active') return !task.completed;
    if (filter === 'Completed') return !!task.completed;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {['All', 'Active', 'Completed'].map((name) => (
          <button
            key={name}
            className={`px-3 py-2 rounded-xl border border-white/10 transition-all duration-200 ${
              filter === name ? 'bg-accent' : 'bg-card'
            }`}
            onClick={() => setFilter(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map((task) => (
          <TaskCard key={task.id} task={task} onToggleComplete={onToggleComplete} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}
