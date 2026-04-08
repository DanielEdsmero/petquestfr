import { Task } from '@/lib/types';

export const XP_PER_TASK = 20;

export function calculateXp(tasks: Task[]): number {
  return tasks.filter((task) => task.completed).length * XP_PER_TASK;
}

export function xpToLevel(experience: number): number {
  return Math.floor(experience / 100) + 1;
export type Priority = 'low' | 'medium' | 'high';

export interface PointsConfig {
  baseByPriority?: Record<Priority, number>;
  urgencyBonusMax?: number;
  urgencyWindowDays?: number;
}

export interface PointsInput {
  priority: Priority;
  dueDate?: string | Date | null;
  completedAt?: string | Date;
  config?: PointsConfig;
}

const DAY_MS = 24 * 60 * 60 * 1000;

const DEFAULT_BASE_BY_PRIORITY: Record<Priority, number> = {
  low: 10,
  medium: 20,
  high: 35,
};

const DEFAULT_URGENCY_BONUS_MAX = 15;
const DEFAULT_URGENCY_WINDOW_DAYS = 3;

function toDate(value?: string | Date | null): Date | null {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Priority points + optional urgency bonus when due date is close/overdue.
 */
export function calculateTaskPoints(input: PointsInput): number {
  const { priority, dueDate, completedAt = new Date(), config } = input;
  const baseByPriority = config?.baseByPriority ?? DEFAULT_BASE_BY_PRIORITY;
  const urgencyBonusMax = config?.urgencyBonusMax ?? DEFAULT_URGENCY_BONUS_MAX;
  const urgencyWindowDays = config?.urgencyWindowDays ?? DEFAULT_URGENCY_WINDOW_DAYS;

  const base = baseByPriority[priority] ?? DEFAULT_BASE_BY_PRIORITY.medium;
  const due = toDate(dueDate);
  if (!due || urgencyBonusMax <= 0 || urgencyWindowDays <= 0) {
    return base;
  }

  const done = toDate(completedAt) ?? new Date();
  const daysUntilDue = Math.floor((due.getTime() - done.getTime()) / DAY_MS);

  if (daysUntilDue > urgencyWindowDays) {
    return base;
  }

  if (daysUntilDue <= 0) {
    return base + urgencyBonusMax;
  }

  const ratio = (urgencyWindowDays - daysUntilDue) / urgencyWindowDays;
  const urgencyBonus = Math.round(urgencyBonusMax * Math.max(0, Math.min(1, ratio)));
  return base + urgencyBonus;
}
