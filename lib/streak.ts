export function nextStreak(lastActiveDate: string | null, now = new Date()): number {
  if (!lastActiveDate) return 1;

  const last = new Date(lastActiveDate);
  const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 1;
  if (diffDays === 1) return 2;
  return 1;
}
