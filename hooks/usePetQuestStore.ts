'use client';

import { useEffect, useMemo, useState } from 'react';
import { calculateXp, xpToLevel } from '@/lib/gamification';
import { getMoodFromEnergy } from '@/lib/pet';
import { loadFromStorage, saveToStorage } from '@/lib/storage';
import { PetQuestState, Task } from '@/lib/types';

const STORAGE_KEY = 'petquest-state';

const defaultState: PetQuestState = {
  pet: {
    name: 'Nova',
    level: 1,
    energy: 85,
    mood: 'happy',
    experience: 0
  },
  streakDays: 1,
  tasks: [],
  achievements: [
    { id: 'first-task', title: 'Complete your first task', unlocked: false },
    { id: 'streak-3', title: 'Reach a 3-day streak', unlocked: false }
  ]
};

export function usePetQuestStore() {
  const [state, setState] = useState<PetQuestState>(defaultState);

  useEffect(() => {
    setState(loadFromStorage(STORAGE_KEY, defaultState));
  }, []);

  useEffect(() => {
    saveToStorage(STORAGE_KEY, state);
  }, [state]);

  const addTask = (title: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: Date.now()
    };

    setState((prev) => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
  };

  const toggleTask = (taskId: string) => {
    setState((prev) => {
      const tasks = prev.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );

      const experience = calculateXp(tasks);
      const level = xpToLevel(experience);
      const mood = getMoodFromEnergy(prev.pet.energy);

      return {
        ...prev,
        tasks,
        pet: {
          ...prev.pet,
          mood,
          level,
          experience
        },
        achievements: prev.achievements.map((achievement) => {
          if (achievement.id === 'first-task') {
            return { ...achievement, unlocked: tasks.some((task) => task.completed) };
          }

          if (achievement.id === 'streak-3') {
            return { ...achievement, unlocked: prev.streakDays >= 3 };
          }

          return achievement;
        })
      };
    });
  };

  const completionRate = useMemo(() => {
    if (state.tasks.length === 0) return 0;
    return Math.round((state.tasks.filter((task) => task.completed).length / state.tasks.length) * 100);
  }, [state.tasks]);

  return {
    state,
    addTask,
    toggleTask,
    completionRate
  };
}
