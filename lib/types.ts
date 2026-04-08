export type TaskPriority = 'low' | 'medium' | 'high';

export interface PetQuestTask {
  title: string;
  description: string;
  dueDate: string | null;
  priority: TaskPriority;
  category: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PetQuestGamification {
  points: number;
  level: number;
  xp: number;
  streak: number;
  lastCompletionDate: string | null;
}

export type PetMood = 'sad' | 'neutral' | 'happy';
export type PetWellness = 'low' | 'medium' | 'high';
export type PetEnergy = 'low' | 'medium' | 'high';
export type PetStage = 'egg' | 'baby' | 'adult';

export interface PetQuestPet {
  mood: PetMood;
  wellness: PetWellness;
  energy: PetEnergy;
  stage: PetStage;
}

export interface PetQuestAchievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: string;
}

export interface PetQuestSettings {
  dailyGoal: number;
  theme: 'light' | 'dark' | 'system';
}

/**
 * Central application state for Pet Quest.
 */
export interface PetQuestState {
  tasks: PetQuestTask[];
  gamification: PetQuestGamification;
  pet: PetQuestPet;
  achievements: PetQuestAchievement[];
  settings: PetQuestSettings;
}
