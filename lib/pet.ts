import { PetMood } from '@/lib/types';

export function getMoodFromEnergy(energy: number): PetMood {
  if (energy > 70) return 'happy';
  if (energy > 40) return 'focused';
  return 'sleepy';
}

export function energyAfterTask(currentEnergy: number): number {
  return Math.max(0, Math.min(100, currentEnergy - 5));
}
