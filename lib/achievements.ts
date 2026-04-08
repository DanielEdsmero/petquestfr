export type AchievementName =
  | 'First Task Completed'
  | '3-Day Streak'
  | 'Productivity Starter'
  | 'Task Master';

export interface Achievement {
  name: AchievementName;
  unlockedAt: string;
}

export interface AchievementCheckInput {
  completedTasks: number;
  streak: number;
  totalPoints: number;
  existing: Achievement[];
  now?: string | Date;
}

const PRODUCTIVITY_STARTER_POINTS = 100;
const TASK_MASTER_COMPLETIONS = 25;

const ALL_ACHIEVEMENTS: AchievementName[] = [
  'First Task Completed',
  '3-Day Streak',
  'Productivity Starter',
  'Task Master',
];

function toIso(value?: string | Date): string {
  const parsed = value ? (value instanceof Date ? value : new Date(value)) : new Date();
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

export function checkAchievementUnlocks(input: AchievementCheckInput): Achievement[] {
  const { completedTasks, streak, totalPoints, existing, now } = input;
  const unlockedNames = new Set(existing.map((item) => item.name));
  const unlockedAt = toIso(now);
  const additions: Achievement[] = [];

  for (const achievement of ALL_ACHIEVEMENTS) {
    if (unlockedNames.has(achievement)) continue;

    const meetsRule =
      (achievement === 'First Task Completed' && completedTasks >= 1) ||
      (achievement === '3-Day Streak' && streak >= 3) ||
      (achievement === 'Productivity Starter' && totalPoints >= PRODUCTIVITY_STARTER_POINTS) ||
      (achievement === 'Task Master' && completedTasks >= TASK_MASTER_COMPLETIONS);

    if (meetsRule) {
      additions.push({ name: achievement, unlockedAt });
      unlockedNames.add(achievement);
    }
  }

  return additions;
}
