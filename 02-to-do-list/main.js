const input = document.getElementById("taskInput");
const form = document.getElementById("taskForm");
const list = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

// Safe load: corrupted JSON in localStorage must not crash the app.
let tasks = [];
try {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
} catch (err) {
  tasks = [];
}

function renderTasks() {
  list.textContent = ""; // clear without innerHTML
  emptyState.hidden = tasks.length > 0;

  tasks.forEach((t, index) => {
    const li = document.createElement("li");
    if (t.done) li.classList.add("done");

    // Build nodes with textContent only (XSS fix: raw ${t.text} used to go into innerHTML).
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = !!t.done;
    checkbox.id = "task-" + index;
    checkbox.setAttribute("aria-label", "Mark task as done: " + t.text);

    const label = document.createElement("label");
    label.htmlFor = "task-" + index;
    label.className = "task-text";
    label.textContent = t.text;

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "del";
    delBtn.textContent = "🗑️";
    delBtn.setAttribute("aria-label", "Delete task: " + t.text);

    li.append(checkbox, label, delBtn);
    list.appendChild(li);

    delBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveAndRender();
    });
    checkbox.addEventListener("change", () => {
      tasks[index].done = checkbox.checked;
      saveAndRender();
    });
  });
}

function saveAndRender() {
  try {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (err) {
    /* storage full/blocked - keep working in memory */
  }
  renderTasks();
}

function addTask() {
  const text = input.value.trim();
  if (text === "") return;
  tasks.push({ text, done: false });
  input.value = "";
  input.focus();
  saveAndRender();
}

// Submitting the form covers both the Add button and the Enter key.
form.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask();
});

renderTasks();
