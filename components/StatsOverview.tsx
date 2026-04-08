interface StatsOverviewProps {
  totalTasks: number;
  completionRate: number;
  streakDays: number;
}

export function StatsOverview({ totalTasks, completionRate, streakDays }: StatsOverviewProps) {
  return (
    <section className="grid gap-3 sm:grid-cols-3">
      <Stat title="Tasks" value={String(totalTasks)} />
      <Stat title="Completion" value={`${completionRate}%`} />
      <Stat title="Streak" value={`${streakDays} days`} />
    </section>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <article className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </article>
  );
}
