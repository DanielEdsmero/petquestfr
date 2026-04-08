export type PetMood = 'idle' | 'happy' | 'energetic' | 'sleepy' | 'sad';
export type PetGrowthStage = 'egg' | 'baby' | 'teen' | 'adult' | 'legendary';

export interface PetState {
  mood: PetMood;
  energy: number;
  level: number;
  stage: PetGrowthStage;
}

export interface PetUpdateInput {
  current: PetState;
  pointsGained: number;
  streak: number;
}

const ENERGY_MIN = 0;
const ENERGY_MAX = 100;
const LEVEL_STEP = 100;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function getGrowthStage(level: number, totalPoints: number): PetGrowthStage {
  if (level >= 15 || totalPoints >= 2000) return 'legendary';
  if (level >= 10 || totalPoints >= 1000) return 'adult';
  if (level >= 5 || totalPoints >= 350) return 'teen';
  if (level >= 2 || totalPoints >= 100) return 'baby';
  return 'egg';
}

export function getLevelFromPoints(totalPoints: number): number {
  return Math.max(1, Math.floor(totalPoints / LEVEL_STEP) + 1);
}

export function deriveMood(energy: number, streak: number): PetMood {
  if (energy <= 15) return 'sleepy';
  if (energy < 35) return 'sad';
  if (energy >= 80 || streak >= 7) return 'energetic';
  if (energy >= 60 || streak >= 3) return 'happy';
  return 'idle';
}

/**
 * Basic pet transitions based on points and streak.
 */
export function updatePetState({ current, pointsGained, streak }: PetUpdateInput): PetState {
  const energyBoost = Math.round(pointsGained / 4);
  const streakBoost = Math.min(10, streak);
  const nextEnergy = clamp(current.energy + energyBoost + streakBoost, ENERGY_MIN, ENERGY_MAX);
  const nextMood = deriveMood(nextEnergy, streak);

  return {
    ...current,
    energy: nextEnergy,
    mood: nextMood,
  };
}
