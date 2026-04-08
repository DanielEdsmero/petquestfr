const DAY_MS = 24 * 60 * 60 * 1000;

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function toDate(value?: string | Date | null): Date | null {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export interface StreakState {
  streak: number;
  lastCompletedDate: string | null;
}

/**
 * Safely updates streak by calendar day (UTC):
 * - same day completion: unchanged
 * - next day completion: +1
 * - gap > 1 day: reset to 1
 */
export function updateStreak(
  currentStreak: number,
  lastCompletedDate: string | Date | null,
  completedAt: string | Date = new Date(),
): StreakState {
  const doneAt = toDate(completedAt) ?? new Date();
  const doneDay = startOfUtcDay(doneAt);
  const previous = toDate(lastCompletedDate);

  if (!previous) {
    return { streak: Math.max(1, currentStreak || 0), lastCompletedDate: doneDay.toISOString() };
  }

  const previousDay = startOfUtcDay(previous);
  const dayDiff = Math.floor((doneDay.getTime() - previousDay.getTime()) / DAY_MS);

  if (dayDiff <= 0) {
    return {
      streak: Math.max(currentStreak, 1),
      lastCompletedDate: previousDay.toISOString(),
    };
  }

  if (dayDiff === 1) {
    return {
      streak: Math.max(1, currentStreak) + 1,
      lastCompletedDate: doneDay.toISOString(),
    };
  }

  return {
    streak: 1,
    lastCompletedDate: doneDay.toISOString(),
  };
}
