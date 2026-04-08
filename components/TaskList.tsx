'use client';

import { CheckCircle2, Circle } from 'lucide-react';
import { Task } from '@/lib/types';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
}

export function TaskList({ tasks, onToggleTask }: TaskListProps) {
  if (tasks.length === 0) {
    return <div className="rounded-xl border border-dashed border-slate-300 p-6 text-slate-500">No tasks yet.</div>;
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <li key={task.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
          <button
            onClick={() => onToggleTask(task.id)}
            className="flex items-center gap-3 text-left"
          >
            {task.completed ? (
              <CheckCircle2 className="text-emerald-500" size={20} />
            ) : (
              <Circle className="text-slate-400" size={20} />
            )}
            <span className={task.completed ? 'text-slate-400 line-through' : 'text-slate-900'}>{task.title}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
