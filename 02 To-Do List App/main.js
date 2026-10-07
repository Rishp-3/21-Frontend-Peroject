const input = document.querySelector("input");
const button = document.querySelector("button");
const table = document.querySelector("table");

// Safe load: corrupted JSON in localStorage used to crash the whole app.
let tasks = [];
try {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
} catch (err) {
  tasks = [];
}

function renderTasks() {
  table.innerHTML = "";

  tasks.forEach((t, index) => {
    const row = document.createElement("tr");
    const task = document.createElement("td");
    const btn = document.createElement("td");

    // Build nodes with textContent instead of innerHTML + raw interpolation.
    // (Previously `${t.text}` went straight into innerHTML -> stored XSS.)
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = !!t.done;
    checkbox.id = "task-" + index;
    checkbox.setAttribute("aria-label", "Mark task as done: " + t.text);
    const label = document.createElement("label");
    label.htmlFor = "task-" + index;
    label.textContent = " " + t.text;

    task.appendChild(checkbox);
    task.appendChild(label);
    if (t.done) task.classList.add("don");

    const delBtn = document.createElement("button");
    delBtn.className = "Btn";
    delBtn.textContent = "\u{1F5D1}\uFE0F";
    delBtn.setAttribute("aria-label", "Delete task: " + t.text);
    btn.appendChild(delBtn);

    row.appendChild(task);
    row.appendChild(btn);
    table.appendChild(row);

    delBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveAndRender();
    });

    checkbox.addEventListener("change", function () {
      tasks[index].done = this.checked;
      saveAndRender();
    });
  });
}

function saveAndRender() {
  try {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (err) {
    /* storage full/blocked - still render in-memory */
  }
  renderTasks();
}

function addTask() {
  const text = input.value.trim();
  if (text === "") return;
  tasks.push({ text, done: false });
  saveAndRender();
  input.value = "";
}

button.addEventListener("click", addTask);
// Enter key now adds a task too (was missing before).
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addTask();
  }
});

renderTasks();
