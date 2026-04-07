import { PET_EMOJIS, PRIORITIES, SURVEY_DIMENSIONS } from "../constants/schema.js";
import {
  categoryProgress,
  classifyStatus,
  currentStreak,
  dashboardMetrics,
  weeklyProgress
} from "../logic/analytics.js";
import { petFeedback } from "../logic/gamification.js";

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function chartBars(items, keyLabel, keyValue) {
  if (!items.length) return `<p class="empty">No data yet.</p>`;
  const max = Math.max(...items.map((i) => i[keyValue]), 1);
  return `<div class="bars">${items
    .map(
      (item) => `<div class="bar-row">
      <span>${esc(item[keyLabel])}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${(item[keyValue] / max) * 100}%"></div></div>
      <strong>${item[keyValue]}</strong>
    </div>`
    )
    .join("")}</div>`;
}

export function renderApp(root, state, handlers) {
  const metrics = dashboardMetrics(state);
  const streak = currentStreak(state.taskHistory);
  const petEmoji = PET_EMOJIS[state.profile.petType] || "🐾";

  const taskRows = state.tasks
    .map((task) => {
      const status = classifyStatus(task);
      return `<tr>
          <td><input type="checkbox" data-action="toggleTask" data-id="${task.id}" ${
        task.completed ? "checked" : ""
      }/></td>
          <td>${esc(task.title)}</td>
          <td>${esc(task.dueDate || "-")}</td>
          <td>${esc(task.priority)}</td>
          <td>${esc(task.category || "-")}</td>
          <td><span class="status ${status}">${status}</span></td>
          <td>
            <button data-action="editTask" data-id="${task.id}">Edit</button>
            <button data-action="deleteTask" data-id="${task.id}" class="danger">Delete</button>
          </td>
        </tr>`;
    })
    .join("");

  const weekly = weeklyProgress(state.taskHistory);
  const byCategory = categoryProgress(state.taskHistory);

  root.innerHTML = `
    <header class="topbar">
      <h1>Pet Quest</h1>
      <nav>
        <button data-tab="dashboard">Dashboard</button>
        <button data-tab="tasks">Tasks</button>
        <button data-tab="progress">Progress</button>
        <button data-tab="surveys">Surveys</button>
        <button data-tab="profile">Profile</button>
      </nav>
    </header>

    <main>
      <section id="dashboard" class="tab active">
        <div class="cards grid-3">
          <article class="card"><h3>Hello ${esc(state.profile.studentName || "Student")}</h3><p>${petFeedback(
    state.pet
  )}</p></article>
          <article class="card"><h3>Total Points</h3><p>${metrics.totalPoints}</p></article>
          <article class="card"><h3>Current Streak</h3><p>${streak} day(s)</p></article>
        </div>
        <div class="cards grid-4">
          <article class="card"><h4>Today's Tasks</h4><p>${metrics.today.length}</p></article>
          <article class="card"><h4>Overdue</h4><p>${metrics.overdue.length}</p></article>
          <article class="card"><h4>Upcoming</h4><p>${metrics.upcoming.length}</p></article>
          <article class="card"><h4>Completed</h4><p>${metrics.completedCount}</p></article>
        </div>
        <article class="card pet-card">
          <h3>Pet Status</h3>
          <div class="pet">${petEmoji}</div>
          <p>Stage: <strong>${state.pet.stage}</strong> | Level: <strong>${state.pet.level}</strong></p>
          <p>Mood: ${state.pet.mood}% | Energy: ${state.pet.energy}%</p>
          <div class="xp-track"><div class="xp-fill" style="width:${state.pet.xp % 100}%"></div></div>
          <small>XP to next level: ${100 - (state.pet.xp % 100)}</small>
        </article>
      </section>

      <section id="tasks" class="tab">
        <article class="card">
          <h3>Add / Edit Task</h3>
          <form id="taskForm">
            <input type="hidden" id="taskId" />
            <label>Title <input id="taskTitle" required maxlength="100"/></label>
            <label>Due Date <input id="taskDueDate" type="date"/></label>
            <label>Priority
              <select id="taskPriority">${PRIORITIES.map((p) => `<option value="${p}">${p}</option>`).join("")}</select>
            </label>
            <label>Category <input id="taskCategory" maxlength="40"/></label>
            <label>Notes <textarea id="taskNotes" maxlength="400"></textarea></label>
            <button type="submit">Save Task</button>
          </form>
        </article>

        <article class="card">
          <h3>Task List</h3>
          <div class="toolbar">
            <input id="searchTask" placeholder="Search title/category" />
            <select id="filterStatus">
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="completed">Completed</option>
            </select>
            <select id="sortTasks">
              <option value="dueAsc">Due date ↑</option>
              <option value="dueDesc">Due date ↓</option>
              <option value="priority">Priority</option>
              <option value="createdDesc">Newest</option>
            </select>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Done</th><th>Task</th><th>Due</th><th>Priority</th><th>Category</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody id="taskRows">${
                taskRows || '<tr><td colspan="7" class="empty">No tasks yet. Add your first task.</td></tr>'
              }</tbody>
            </table>
          </div>
        </article>
      </section>

      <section id="progress" class="tab">
        <article class="card">
          <h3>Weekly Completion</h3>
          ${chartBars(weekly, "week", "count")}
        </article>
        <article class="card">
          <h3>Category Progress</h3>
          ${chartBars(byCategory, "category", "count")}
        </article>
        <article class="card">
          <h3>Points History</h3>
          ${chartBars(
            state.pointsHistory.slice(-8).map((p) => ({ date: p.date.slice(0, 10), points: p.delta })),
            "date",
            "points"
          )}
        </article>
      </section>

      <section id="surveys" class="tab">
        <article class="card">
          <h3>Pretest Survey</h3>
          ${surveyForm("pretest", state.surveys.pretest)}
        </article>
        <article class="card">
          <h3>Posttest Survey</h3>
          ${surveyForm("posttest", state.surveys.posttest)}
        </article>
      </section>

      <section id="profile" class="tab">
        <article class="card">
          <h3>Profile & Settings</h3>
          <form id="profileForm">
            <label>Student Name <input id="studentName" maxlength="80" value="${esc(state.profile.studentName)}" /></label>
            <label>Section <input id="section" maxlength="80" value="${esc(state.profile.section)}" /></label>
            <label>Pet Selection
              <select id="petType">
                ${Object.keys(PET_EMOJIS)
                  .map((k) => `<option value="${k}" ${state.profile.petType === k ? "selected" : ""}>${k}</option>`)
                  .join("")}
              </select>
            </label>
            <label>Theme
              <select id="theme">
                <option value="light" ${state.profile.theme === "light" ? "selected" : ""}>Light</option>
                <option value="dark" ${state.profile.theme === "dark" ? "selected" : ""}>Dark</option>
              </select>
            </label>
            <button type="submit">Save Profile</button>
          </form>
          <button id="resetData" class="danger">Reset All Data</button>
        </article>
      </section>
    </main>
  `;

  bindTabs(root);
  bindTaskFilters(root, state.tasks);

  root.querySelector("#taskForm").addEventListener("submit", handlers.onTaskSubmit);
  root.querySelector("#taskRows").addEventListener("click", handlers.onTaskAction);
  root.querySelector("#taskRows").addEventListener("change", handlers.onTaskAction);
  root.querySelector("#profileForm").addEventListener("submit", handlers.onProfileSubmit);
  root.querySelector("#resetData").addEventListener("click", handlers.onReset);

  root.querySelectorAll("form[data-survey-type]").forEach((form) => {
    form.addEventListener("submit", handlers.onSurveySubmit);
  });

  document.body.dataset.theme = state.profile.theme;
}

function surveyForm(type, existing) {
  return `<form data-survey-type="${type}">
      ${SURVEY_DIMENSIONS.map(
        (dimension) => `<label>${dimension.replaceAll("_", " ")}
            <select name="${dimension}" required>
              <option value="">Select 1-4</option>
              ${[1, 2, 3, 4]
                .map(
                  (n) => `<option value="${n}" ${existing?.answers?.[dimension] === n ? "selected" : ""}>${n}</option>`
                )
                .join("")}
            </select>
          </label>`
      ).join("")}
      <button type="submit">Save ${type}</button>
      ${existing ? `<small>Last saved: ${existing.savedAt}</small>` : ""}
    </form>`;
}

function bindTabs(root) {
  const tabs = [...root.querySelectorAll(".tab")];
  root.querySelector("nav").addEventListener("click", (event) => {
    const tab = event.target.dataset.tab;
    if (!tab) return;
    tabs.forEach((t) => t.classList.toggle("active", t.id === tab));
  });
}

function bindTaskFilters(root, allTasks) {
  const search = root.querySelector("#searchTask");
  const filter = root.querySelector("#filterStatus");
  const sort = root.querySelector("#sortTasks");
  const tbody = root.querySelector("#taskRows");

  const renderFiltered = () => {
    let tasks = [...allTasks];
    const query = search.value.toLowerCase().trim();
    if (query) {
      tasks = tasks.filter(
        (t) => t.title.toLowerCase().includes(query) || (t.category || "").toLowerCase().includes(query)
      );
    }

    if (filter.value !== "all") {
      tasks = tasks.filter((t) => classifyStatus(t) === filter.value);
    }

    if (sort.value === "dueAsc") {
      tasks.sort((a, b) => (a.dueDate || "9999").localeCompare(b.dueDate || "9999"));
    } else if (sort.value === "dueDesc") {
      tasks.sort((a, b) => (b.dueDate || "0000").localeCompare(a.dueDate || "0000"));
    } else if (sort.value === "priority") {
      const order = { high: 3, medium: 2, low: 1 };
      tasks.sort((a, b) => order[b.priority] - order[a.priority]);
    } else {
      tasks.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    tbody.innerHTML = tasks.length
      ? tasks
          .map((task) => {
            const status = classifyStatus(task);
            return `<tr>
            <td><input type="checkbox" data-action="toggleTask" data-id="${task.id}" ${
              task.completed ? "checked" : ""
            }/></td>
            <td>${esc(task.title)}</td>
            <td>${esc(task.dueDate || "-")}</td>
            <td>${esc(task.priority)}</td>
            <td>${esc(task.category || "-")}</td>
            <td><span class="status ${status}">${status}</span></td>
            <td>
              <button data-action="editTask" data-id="${task.id}">Edit</button>
              <button data-action="deleteTask" data-id="${task.id}" class="danger">Delete</button>
            </td>
          </tr>`;
          })
          .join("")
      : '<tr><td colspan="7" class="empty">No tasks match your filters.</td></tr>';
  };

  [search, filter, sort].forEach((el) => el.addEventListener("input", renderFiltered));
  sort.addEventListener("change", renderFiltered);
}
