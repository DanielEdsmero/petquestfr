export type PetMood = 'happy' | 'focused' | 'sleepy';

export interface PetState {
  name: string;
  level: number;
  energy: number;
  mood: PetMood;
  experience: number;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

export interface Achievement {
  id: string;
  title: string;
  unlocked: boolean;
}

export interface PetQuestState {
  pet: PetState;
  streakDays: number;
  tasks: Task[];
  achievements: Achievement[];
}
