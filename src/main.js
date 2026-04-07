import { DEFAULT_STATE, SURVEY_DIMENSIONS } from "./constants/schema.js";
import { applyTaskCompletion, applyTaskUndo } from "./logic/gamification.js";
import { localStore } from "./storage/localStore.js";
import { renderApp } from "./ui/appView.js";

const root = document.querySelector("#app");
let state = localStore.load();

function saveAndRender() {
  state = localStore.save(state);
  render();
}

function render() {
  renderApp(root, state, {
    onTaskSubmit,
    onTaskAction,
    onProfileSubmit,
    onSurveySubmit,
    onReset
  });
}

function onTaskSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const id = form.querySelector("#taskId").value;
  const title = form.querySelector("#taskTitle").value.trim();
  const dueDate = form.querySelector("#taskDueDate").value;
  const priority = form.querySelector("#taskPriority").value;
  const category = form.querySelector("#taskCategory").value.trim();
  const notes = form.querySelector("#taskNotes").value.trim();

  if (!title) return alert("Task title is required.");

  if (id) {
    const target = state.tasks.find((t) => t.id === id);
    if (!target) return;
    Object.assign(target, { title, dueDate, priority, category, notes, updatedAt: new Date().toISOString() });
  } else {
    state.tasks.push({
      id: crypto.randomUUID(),
      title,
      dueDate,
      priority,
      category,
      notes,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  form.reset();
  form.querySelector("#taskId").value = "";
  saveAndRender();
}

function onTaskAction(event) {
  const action = event.target.dataset.action;
  const id = event.target.dataset.id;
  if (!action || !id) return;

  const task = state.tasks.find((t) => t.id === id);
  if (!task) return;

  if (action === "deleteTask") {
    if (!confirm("Delete this task?")) return;
    state.tasks = state.tasks.filter((t) => t.id !== id);
  }

  if (action === "editTask") {
    document.querySelector("#taskId").value = task.id;
    document.querySelector("#taskTitle").value = task.title;
    document.querySelector("#taskDueDate").value = task.dueDate || "";
    document.querySelector("#taskPriority").value = task.priority;
    document.querySelector("#taskCategory").value = task.category || "";
    document.querySelector("#taskNotes").value = task.notes || "";
  }

  if (action === "toggleTask") {
    task.completed = event.target.checked;
    task.updatedAt = new Date().toISOString();
    if (task.completed) {
      const reward = applyTaskCompletion(state, task);
      state.pet = reward.pet;
      state.pointsHistory.push({ date: new Date().toISOString(), delta: reward.gained, reason: "task_completed" });
      state.taskHistory.push({ taskId: task.id, category: task.category, completedOn: new Date().toISOString() });
    } else {
      const rollback = applyTaskUndo(state, task);
      state.pet = rollback.pet;
      state.pointsHistory.push({ date: new Date().toISOString(), delta: -rollback.lost, reason: "task_unchecked" });
    }
  }

  saveAndRender();
}

function onProfileSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  state.profile.studentName = form.querySelector("#studentName").value.trim();
  state.profile.section = form.querySelector("#section").value.trim();
  state.profile.petType = form.querySelector("#petType").value;
  state.profile.theme = form.querySelector("#theme").value;
  saveAndRender();
}

function onSurveySubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const type = form.dataset.surveyType;
  const answers = {};

  for (const dimension of SURVEY_DIMENSIONS) {
    const raw = Number(form.elements[dimension].value);
    if (!raw || raw < 1 || raw > 4) return alert("Survey answers must be between 1 and 4.");
    answers[dimension] = raw;
  }

  state.surveys[type] = {
    answers,
    savedAt: new Date().toISOString()
  };

  saveAndRender();
}

function onReset() {
  if (!confirm("This will permanently erase local app data. Continue?")) return;
  state = localStore.reset();
  state = { ...DEFAULT_STATE, ...state };
  saveAndRender();
}

render();
