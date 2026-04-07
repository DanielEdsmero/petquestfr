import { DEFAULT_STATE, STORAGE_KEY } from "../constants/schema.js";

function deepClone(data) {
  return JSON.parse(JSON.stringify(data));
}

function mergeDefaults(raw) {
  return {
    ...deepClone(DEFAULT_STATE),
    ...raw,
    profile: { ...DEFAULT_STATE.profile, ...(raw?.profile || {}) },
    pet: { ...DEFAULT_STATE.pet, ...(raw?.pet || {}) },
    surveys: { ...DEFAULT_STATE.surveys, ...(raw?.surveys || {}) }
  };
}

export const localStore = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return deepClone(DEFAULT_STATE);
      return mergeDefaults(JSON.parse(raw));
    } catch (error) {
      console.error("Failed to parse saved app data", error);
      return deepClone(DEFAULT_STATE);
    }
  },

  save(state) {
    const payload = {
      ...state,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return payload;
  },

  reset() {
    localStorage.removeItem(STORAGE_KEY);
    return deepClone(DEFAULT_STATE);
  }
};

// Replace this adapter later with an API/DB adapter that exposes load/save/reset.
