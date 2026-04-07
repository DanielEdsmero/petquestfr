import { isOverdue, isToday, weekKey } from "./dateUtils.js";

export function classifyStatus(task) {
  if (task.completed) return "completed";
  return isOverdue(task) ? "overdue" : "pending";
}

export function dashboardMetrics(state) {
  const tasks = state.tasks;
  const today = tasks.filter((t) => isToday(t.dueDate) && !t.completed);
  const overdue = tasks.filter((t) => isOverdue(t));
  const upcoming = tasks.filter(
    (t) => !t.completed && t.dueDate && !isToday(t.dueDate) && !isOverdue(t)
  );
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalPoints = state.pet.xp;

  return { today, overdue, upcoming, completedCount, totalPoints };
}

export function currentStreak(taskHistory) {
  const days = new Set(taskHistory.map((h) => h.completedOn.slice(0, 10)));
  let streak = 0;
  const cursor = new Date();

  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (days.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }

    if (streak === 0) {
      cursor.setDate(cursor.getDate() - 1);
      const yesterday = cursor.toISOString().slice(0, 10);
      if (days.has(yesterday)) {
        streak += 1;
        continue;
      }
    }

    break;
  }

  return streak;
}

export function weeklyProgress(taskHistory) {
  const map = new Map();
  taskHistory.forEach((h) => {
    const key = weekKey(h.completedOn);
    map.set(key, (map.get(key) || 0) + 1);
  });
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-8)
    .map(([week, count]) => ({ week, count }));
}

export function categoryProgress(taskHistory) {
  const map = new Map();
  taskHistory.forEach((h) => {
    const key = h.category || "Uncategorized";
    map.set(key, (map.get(key) || 0) + 1);
  });
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({ category, count }));
}
