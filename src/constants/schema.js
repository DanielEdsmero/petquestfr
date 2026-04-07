export const STORAGE_KEY = "petquest.v1";

export const DEFAULT_STATE = {
  profile: {
    studentName: "",
    section: "",
    petType: "fox",
    theme: "light"
  },
  tasks: [],
  taskHistory: [],
  pointsHistory: [],
  streakHistory: [],
  surveys: {
    pretest: null,
    posttest: null
  },
  pet: {
    mood: 80,
    energy: 90,
    xp: 0,
    level: 1,
    stage: "Egg"
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const PRIORITIES = ["low", "medium", "high"];
export const TASK_STATUSES = ["pending", "completed", "overdue"];

export const SURVEY_DIMENSIONS = [
  "goal_setting",
  "planning_scheduling",
  "prioritization",
  "time_management"
];

export const PET_STAGES = [
  { minLevel: 1, name: "Egg" },
  { minLevel: 3, name: "Buddy" },
  { minLevel: 6, name: "Champion" }
];

export const PET_EMOJIS = {
  fox: "🦊",
  cat: "🐱",
  dog: "🐶",
  rabbit: "🐰"
};
