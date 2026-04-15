const apiBase = "/api/tasks";

const createTaskForm = document.getElementById("createTaskForm");
const createError = document.getElementById("createError");
const taskList = document.getElementById("taskList");
const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const pendingCount = document.getElementById("pendingCount");
const toast = document.getElementById("toast");

const editModal = document.getElementById("editModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const editTaskForm = document.getElementById("editTaskForm");
const editTaskId = document.getElementById("editTaskId");
const editTitle = document.getElementById("editTitle");
const editDescription = document.getElementById("editDescription");
const editDueDate = document.getElementById("editDueDate");
const editCategory = document.getElementById("editCategory");
const editError = document.getElementById("editError");

let tasks = [];
let toastTimer = null;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function toDateInputValue(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const timezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

function showToast(message, type = "success") {
  toast.textContent = message;
  toast.classList.remove("hidden", "error");

  if (type === "error") {
    toast.classList.add("error");
  }

  if (toastTimer) {
    clearTimeout(toastTimer);
  }

  toastTimer = setTimeout(() => {
    toast.classList.add("hidden");
  }, 2600);
}

async function request(endpoint, options = {}) {
  const response = await fetch(endpoint, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let payload = {};
  try {
    payload = await response.json();
  } catch (_error) {
    payload = {};
  }

  if (!response.ok) {
    throw new Error(payload.message || "Something went wrong.");
  }

  return payload;
}

function updateStats() {
  const completed = tasks.filter((task) => task.completed).length;
  totalCount.textContent = String(tasks.length);
  completedCount.textContent = String(completed);
  pendingCount.textContent = String(tasks.length - completed);
}

function renderTasks() {
  if (!tasks.length) {
    taskList.innerHTML = `
      <div class="empty-state">
        <p>No tasks</p>
      </div>
    `;
    updateStats();
    return;
  }

  taskList.innerHTML = tasks
    .map((task) => {
      const dueDateLabel = formatDate(task.dueDate);
      const categoryLabel = task.category ? task.category : "General";
      const description = task.description ? escapeHtml(task.description) : "";

      return `
        <article class="task-item ${task.completed ? "completed" : ""}" data-task-id="${task._id}">
          <div class="task-top">
            <h3 class="task-title">${escapeHtml(task.title)}</h3>
          </div>

          <div class="task-meta">
            <span class="meta-chip">Category: ${escapeHtml(categoryLabel)}</span>
            <span class="meta-chip">Due: ${escapeHtml(dueDateLabel)}</span>
          </div>

          ${description ? `<p class="task-description">${description}</p>` : ""}

          <div class="task-actions">
            <button class="action-btn complete" data-action="complete" ${task.completed ? "disabled" : ""}>
              ${task.completed ? "Done" : "Complete"}
            </button>
            <button class="action-btn edit" data-action="edit">Edit</button>
            <button class="action-btn delete" data-action="delete">Delete</button>
          </div>
        </article>
      `;
    })
    .join("");

  updateStats();
}

async function loadTasks() {
  try {
    const response = await request(apiBase, { method: "GET" });
    tasks = Array.isArray(response.data) ? response.data : [];
    renderTasks();
  } catch (error) {
    showToast(error.message, "error");
  }
}

function getCreatePayload() {
  const formData = new FormData(createTaskForm);
  const title = String(formData.get("title") || "").trim();

  if (!title) {
    throw new Error("Task title cannot be empty.");
  }

  return {
    title,
    description: String(formData.get("description") || "").trim(),
    dueDate: String(formData.get("dueDate") || ""),
    category: String(formData.get("category") || "General").trim() || "General",
  };
}

function openEditModal(task) {
  editTaskId.value = task._id;
  editTitle.value = task.title || "";
  editDescription.value = task.description || "";
  editDueDate.value = toDateInputValue(task.dueDate);
  editCategory.value = task.category || "General";
  editError.textContent = "";

  editModal.classList.remove("hidden");
  editModal.setAttribute("aria-hidden", "false");
  editTitle.focus();
}

function closeEditModal() {
  editModal.classList.add("hidden");
  editModal.setAttribute("aria-hidden", "true");
  editTaskForm.reset();
  editError.textContent = "";
}

async function handleCreateTask(event) {
  event.preventDefault();
  createError.textContent = "";

  try {
    const payload = getCreatePayload();
    await request(apiBase, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    createTaskForm.reset();
    showToast("Task created successfully.");
    await loadTasks();
  } catch (error) {
    createError.textContent = error.message;
  }
}

async function markTaskCompleted(taskId) {
  try {
    await request(`${apiBase}/${taskId}/complete`, { method: "PATCH" });
    showToast("Task marked as completed.");
    await loadTasks();
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function deleteTask(taskId) {
  const shouldDelete = window.confirm("Are you sure you want to delete this task?");
  if (!shouldDelete) {
    return;
  }

  try {
    await request(`${apiBase}/${taskId}`, { method: "DELETE" });
    showToast("Task deleted successfully.");
    await loadTasks();
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function handleEditTaskSubmit(event) {
  event.preventDefault();
  editError.textContent = "";

  const title = editTitle.value.trim();
  if (!title) {
    editError.textContent = "Task title cannot be empty.";
    return;
  }

  const payload = {
    title,
    description: editDescription.value.trim(),
    dueDate: editDueDate.value,
    category: editCategory.value.trim() || "General",
  };

  try {
    await request(`${apiBase}/${editTaskId.value}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    closeEditModal();
    showToast("Task updated successfully.");
    await loadTasks();
  } catch (error) {
    editError.textContent = error.message;
  }
}

function handleTaskActionClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const taskCard = button.closest("[data-task-id]");
  if (!taskCard) {
    return;
  }

  const taskId = taskCard.dataset.taskId;
  const task = tasks.find((item) => item._id === taskId);
  if (!task) {
    return;
  }

  const action = button.dataset.action;

  if (action === "complete") {
    markTaskCompleted(taskId);
    return;
  }

  if (action === "edit") {
    openEditModal(task);
    return;
  }

  if (action === "delete") {
    deleteTask(taskId);
  }
}

createTaskForm.addEventListener("submit", handleCreateTask);
editTaskForm.addEventListener("submit", handleEditTaskSubmit);
taskList.addEventListener("click", handleTaskActionClick);
closeModalBtn.addEventListener("click", closeEditModal);
cancelEditBtn.addEventListener("click", closeEditModal);

editModal.addEventListener("click", (event) => {
  if (event.target === editModal) {
    closeEditModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !editModal.classList.contains("hidden")) {
    closeEditModal();
  }
});

loadTasks();
