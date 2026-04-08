import { PetQuestState } from './types';

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
    mood: 'neutral',
    wellness: 'medium',
    energy: 'medium',
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

/**
 * Migration guard for future schema upgrades.
 *
 * - Current version is loaded directly.
 * - Unknown or newer versions are ignored safely and fallback to defaults.
 * - Legacy keys can be handled here later when new versions are introduced.
 */
function migrateToCurrentVersion(rawValue: string): PetQuestState {
  try {
    const parsed = JSON.parse(rawValue) as Partial<VersionedStoredState>;

    if (parsed.version === STORAGE_VERSION && parsed.state) {
      return parsed.state;
    }

    // Future-proof migration guard:
    // add explicit migrations, e.g. if (parsed.version === 0) { ... }
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
