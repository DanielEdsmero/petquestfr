'use client';

import { FormEvent, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';

interface TaskFormModalProps {
  onAddTask: (title: string) => void;
}

export function TaskFormModal({ onAddTask }: TaskFormModalProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;

    onAddTask(title.trim());
    setTitle('');
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 font-medium text-white hover:bg-brand-700"
      >
        <Plus size={16} />
        Add Task
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.form
              onSubmit={handleSubmit}
              className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-xl"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Create task</h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md p-1 text-slate-500 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Walk Luna for 20 minutes"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring"
              />

              <button
                type="submit"
                className="w-full rounded-lg bg-brand-500 px-4 py-2 font-medium text-white hover:bg-brand-700"
              >
                Save task
              </button>
            </motion.form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
