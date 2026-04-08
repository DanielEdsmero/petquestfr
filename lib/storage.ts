import type { PetQuestState } from './types';

const STORAGE_VERSION = 1;
const STORAGE_KEY = `petquest:v${STORAGE_VERSION}`;

interface VersionedStoredState {
  version: number;
  state: PetQuestState;
}

const DEFAULT_STATE: PetQuestState = {
  tasks: [],
  gamification: {
    points: 0,
    level: 1,
    xp: 0,
    streak: 0,
    lastCompletionDate: null,
  },
  pet: {
    mood: 'idle',
    energy: 50,
    level: 1,
    stage: 'egg',
  },
  achievements: [],
  settings: {
    dailyGoal: 3,
    theme: 'system',
  },
};

function cloneDefaultState(): PetQuestState {
  return JSON.parse(JSON.stringify(DEFAULT_STATE)) as PetQuestState;
}

function isBrowserStorageAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function migrateToCurrentVersion(rawValue: string): PetQuestState {
  try {
    const parsed = JSON.parse(rawValue) as Partial<VersionedStoredState>;
    if (parsed.version === STORAGE_VERSION && parsed.state) {
      return parsed.state;
    }
    return cloneDefaultState();
  } catch {
    return cloneDefaultState();
  }
}

export function loadState(): PetQuestState {
  if (!isBrowserStorageAvailable()) {
    return cloneDefaultState();
  }

  const persisted = window.localStorage.getItem(STORAGE_KEY);
  if (!persisted) {
    return cloneDefaultState();
  }

  return migrateToCurrentVersion(persisted);
}

export function saveState(state: PetQuestState): void {
  if (!isBrowserStorageAvailable()) {
    return;
  }

  const payload: VersionedStoredState = {
    version: STORAGE_VERSION,
    state,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function resetState(): void {
  if (!isBrowserStorageAvailable()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
