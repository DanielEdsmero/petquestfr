import { Trophy } from 'lucide-react';
import { Achievement } from '@/lib/types';

interface AchievementsPanelProps {
  achievements: Achievement[];
}

export function AchievementsPanel({ achievements }: AchievementsPanelProps) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h3 className="mb-3 inline-flex items-center gap-2 text-base font-semibold">
        <Trophy size={18} /> Achievements
      </h3>
      <ul className="space-y-2 text-sm">
        {achievements.map((achievement) => (
          <li key={achievement.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
            <span>{achievement.title}</span>
            <span className={achievement.unlocked ? 'text-emerald-600' : 'text-slate-400'}>
              {achievement.unlocked ? 'Unlocked' : 'Locked'}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
