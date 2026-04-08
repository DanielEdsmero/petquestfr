export type TaskPriority = 'low' | 'medium' | 'high';

export interface PetQuestTask {
  id: string;
  title: string;
  description?: string;
  dueDate: string | null;
  priority: TaskPriority;
  completed: boolean;
  completedAt: string | null;
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

export type PetMood = 'idle' | 'happy' | 'energetic' | 'sleepy' | 'sad';
export type PetGrowthStage = 'egg' | 'baby' | 'teen' | 'adult' | 'legendary';

export interface PetQuestPet {
  mood: PetMood;
  energy: number;
  level: number;
  stage: PetGrowthStage;
}

export interface PetQuestAchievement {
  name: string;
  unlockedAt: string;
}

export interface PetQuestSettings {
  dailyGoal: number;
  theme: 'light' | 'dark' | 'system';
}

/**
 * Persisted application state for Pet Quest.
 */
export interface PetQuestState {
  tasks: PetQuestTask[];
  gamification: PetQuestGamification;
  pet: PetQuestPet;
  achievements: PetQuestAchievement[];
  settings: PetQuestSettings;
}
