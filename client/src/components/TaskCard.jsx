export default function TaskCard({ task, onToggleComplete, onDelete }) {
  return (
    <div className="card p-4 flex items-center justify-between">
      <div>
        <h4 className={`font-medium ${task.completed ? 'line-through text-muted' : ''}`}>{task.title}</h4>
        <p className="text-xs text-muted mt-1">
          {task.priority} • Due {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}
        </p>
      </div>
      <div className="flex gap-2">
        <button className="btn" onClick={() => onToggleComplete(task)}>
          {task.completed ? 'Undo' : 'Complete'}
        </button>
        <button className="px-3 py-2 rounded-xl border border-white/10 transition-all duration-200" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
