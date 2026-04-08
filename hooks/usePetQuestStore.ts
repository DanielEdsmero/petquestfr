import { useCallback, useMemo, useState } from 'react';
import { checkAchievementUnlocks, type Achievement } from '../lib/achievements';
import { calculateTaskPoints, type Priority } from '../lib/gamification';
import { getGrowthStage, getLevelFromPoints, updatePetState, type PetState } from '../lib/pet';
import { updateStreak } from '../lib/streak';

export type TaskFilter = 'all' | 'active' | 'completed';
export type TaskSort = 'createdAt' | 'dueDate' | 'priority';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string | null;
  completed: boolean;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PetQuestState {
  tasks: Task[];
  filter: TaskFilter;
  sort: TaskSort;
  points: number;
  streak: number;
  lastCompletedDate: string | null;
  achievements: Achievement[];
  pet: PetState;
}

export interface NewTaskInput {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string | null;
}

export interface EditTaskInput {
  title?: string;
  description?: string;
  priority?: Priority;
  dueDate?: string | null;
}

const INITIAL_STATE: PetQuestState = {
  tasks: [],
  filter: 'all',
  sort: 'createdAt',
  points: 0,
  streak: 0,
  lastCompletedDate: null,
  achievements: [],
  pet: {
    mood: 'idle',
    energy: 50,
    level: 1,
    stage: 'egg',
  },
};

function sortTasks(tasks: Task[], sort: TaskSort): Task[] {
  const sorted = [...tasks];
  if (sort === 'priority') {
    const order: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
    sorted.sort((a, b) => order[a.priority] - order[b.priority]);
    return sorted;
  }

  if (sort === 'dueDate') {
    sorted.sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
    return sorted;
  }

  sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return sorted;
}

export function usePetQuestStore(initialState?: Partial<PetQuestState>) {
  const [state, setState] = useState<PetQuestState>({
    ...INITIAL_STATE,
    ...initialState,
    pet: { ...INITIAL_STATE.pet, ...(initialState?.pet ?? {}) },
    tasks: initialState?.tasks ?? INITIAL_STATE.tasks,
    achievements: initialState?.achievements ?? INITIAL_STATE.achievements,
  });

  const addTask = useCallback((input: NewTaskInput) => {
    setState((prev) => {
      const now = new Date().toISOString();
      const nextTask: Task = {
        id: crypto.randomUUID(),
        title: input.title,
        description: input.description,
        priority: input.priority ?? 'medium',
        dueDate: input.dueDate ?? null,
        completed: false,
        completedAt: null,
        createdAt: now,
        updatedAt: now,
      };

      return {
        ...prev,
        tasks: [...prev.tasks, nextTask],
      };
    });
  }, []);

  const editTask = useCallback((taskId: string, updates: EditTaskInput) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    }));
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => task.id !== taskId),
    }));
  }, []);

  const toggleComplete = useCallback((taskId: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : null,
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    }));
  }, []);

  const setFilter = useCallback((filter: TaskFilter) => {
    setState((prev) => ({ ...prev, filter }));
  }, []);

  const setSort = useCallback((sort: TaskSort) => {
    setState((prev) => ({ ...prev, sort }));
  }, []);

  const completeTaskAndReward = useCallback((taskId: string) => {
    setState((prev) => {
      const now = new Date();
      const targetTask = prev.tasks.find((task) => task.id === taskId);
      if (!targetTask || targetTask.completed) return prev;

      const gainedPoints = calculateTaskPoints({
        priority: targetTask.priority,
        dueDate: targetTask.dueDate,
        completedAt: now,
      });

      const nextPoints = prev.points + gainedPoints;
      const nextLevel = getLevelFromPoints(nextPoints);
      const nextStreakState = updateStreak(prev.streak, prev.lastCompletedDate, now);

      const nextTasks = prev.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: true,
              completedAt: now.toISOString(),
              updatedAt: now.toISOString(),
            }
          : task,
      );

      const completedCount = nextTasks.filter((task) => task.completed).length;
      const unlocked = checkAchievementUnlocks({
        completedTasks: completedCount,
        streak: nextStreakState.streak,
        totalPoints: nextPoints,
        existing: prev.achievements,
        now,
      });

      const petAfterReward = updatePetState({
        current: prev.pet,
        pointsGained: gainedPoints,
        streak: nextStreakState.streak,
      });

      return {
        ...prev,
        tasks: nextTasks,
        points: nextPoints,
        streak: nextStreakState.streak,
        lastCompletedDate: nextStreakState.lastCompletedDate,
        achievements: [...prev.achievements, ...unlocked],
        pet: {
          ...petAfterReward,
          level: nextLevel,
          stage: getGrowthStage(nextLevel, nextPoints),
        },
      };
    });
  }, []);

  const resetAllData = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const visibleTasks = useMemo(() => {
    const filtered =
      state.filter === 'all'
        ? state.tasks
        : state.tasks.filter((task) => (state.filter === 'completed' ? task.completed : !task.completed));

    return sortTasks(filtered, state.sort);
  }, [state.filter, state.sort, state.tasks]);

  return {
    state,
    visibleTasks,
    addTask,
    editTask,
    deleteTask,
    toggleComplete,
    setFilter,
    setSort,
    completeTaskAndReward,
    resetAllData,
  };
}

export type UsePetQuestStore = ReturnType<typeof usePetQuestStore>;
