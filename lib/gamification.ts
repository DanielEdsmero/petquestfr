import { Task } from '@/lib/types';

export const XP_PER_TASK = 20;

export function calculateXp(tasks: Task[]): number {
  return tasks.filter((task) => task.completed).length * XP_PER_TASK;
}

export function xpToLevel(experience: number): number {
  return Math.floor(experience / 100) + 1;
}
