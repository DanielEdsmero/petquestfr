import { PET_STAGES } from "../constants/schema.js";

export function pointsForTask(priority) {
  if (priority === "high") return 25;
  if (priority === "medium") return 15;
  return 10;
}

export function computeLevel(xp) {
  return Math.floor(xp / 100) + 1;
}

export function computeStage(level) {
  let stage = PET_STAGES[0].name;
  for (const candidate of PET_STAGES) {
    if (level >= candidate.minLevel) stage = candidate.name;
  }
  return stage;
}

export function petFeedback(pet) {
  if (pet.energy < 35) return "Your pet is tired. Finish a task to help it recover!";
  if (pet.mood < 35) return "Your pet needs encouragement. Small wins count!";
  if (pet.stage === "Champion") return "Amazing consistency. Your pet is thriving!";
  return "Keep your streak alive. Your pet is counting on you!";
}

export function applyTaskCompletion(state, task) {
  const gained = pointsForTask(task.priority);
  const xp = state.pet.xp + gained;
  const level = computeLevel(xp);
  return {
    gained,
    pet: {
      ...state.pet,
      xp,
      level,
      stage: computeStage(level),
      mood: Math.min(100, state.pet.mood + 8),
      energy: Math.min(100, state.pet.energy + 5)
    }
  };
}

export function applyTaskUndo(state, task) {
  const lost = pointsForTask(task.priority);
  const xp = Math.max(0, state.pet.xp - lost);
  const level = computeLevel(xp);
  return {
    lost,
    pet: {
      ...state.pet,
      xp,
      level,
      stage: computeStage(level),
      mood: Math.max(20, state.pet.mood - 5),
      energy: Math.max(20, state.pet.energy - 4)
    }
  };
}
