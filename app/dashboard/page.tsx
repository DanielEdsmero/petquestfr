'use client';

import { toast } from 'sonner';
import { AchievementsPanel } from '@/components/AchievementsPanel';
import { PetStatusCard } from '@/components/PetStatusCard';
import { SettingsPanel } from '@/components/SettingsPanel';
import { StatsOverview } from '@/components/StatsOverview';
import { TaskFormModal } from '@/components/TaskFormModal';
import { TaskList } from '@/components/TaskList';
import { usePetQuestStore } from '@/hooks/usePetQuestStore';

export default function DashboardPage() {
  const { state, addTask, toggleTask, completionRate } = usePetQuestStore();

  return (
    <main className="mx-auto min-h-screen max-w-6xl space-y-6 px-6 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">PetQuest Dashboard</h1>
          <p className="text-slate-600">Everything runs in your browser via localStorage.</p>
        </div>
        <TaskFormModal
          onAddTask={(title) => {
            addTask(title);
            toast.success('Task added!');
          }}
        />
      </header>

      <StatsOverview totalTasks={state.tasks.length} completionRate={completionRate} streakDays={state.streakDays} />

      <section className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <TaskList
            tasks={state.tasks}
            onToggleTask={(taskId) => {
              toggleTask(taskId);
              toast.info('Task updated');
            }}
          />
        </div>

        <aside className="space-y-4">
          <PetStatusCard pet={state.pet} />
          <AchievementsPanel achievements={state.achievements} />
          <SettingsPanel />
        </aside>
      </section>
    </main>
  );
}
