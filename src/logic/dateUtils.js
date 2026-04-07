export function toISODate(value) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export function isToday(dateStr) {
  return toISODate(dateStr) === toISODate(new Date());
}

export function isOverdue(task) {
  if (task.completed) return false;
  if (!task.dueDate) return false;
  return toISODate(task.dueDate) < toISODate(new Date());
}

export function startOfDayISO(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export function weekKey(dateLike) {
  const date = new Date(dateLike);
  const firstDay = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const dayOfYear = Math.floor((date - firstDay) / 86400000) + 1;
  const week = Math.ceil(dayOfYear / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}
