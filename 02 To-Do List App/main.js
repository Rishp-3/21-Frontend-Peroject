const input = document.querySelector("input");
const button = document.querySelector("button");
const table = document.querySelector("table");


let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


function renderTasks() {
  table.innerHTML = "";

  tasks.forEach((t, index) => {
    let row = document.createElement("tr");
    let task = document.createElement("td");
    let btn = document.createElement("td");

    task.innerHTML = `<input type="checkbox" ${
      t.done ? "checked" : ""
    }> ${t.text}`;

    if (t.done) task.classList.add("don");

    btn.innerHTML = `<button class="Btn">🗑️</button>`;

    row.appendChild(task);
    row.appendChild(btn);
    table.appendChild(row);

    // ✅ delete
    btn.querySelector("button").addEventListener("click", () => {
      tasks.splice(index, 1);
      saveAndRender();
    });

    // ✅ checkbox
    let checkbox = task.querySelector("input");
    checkbox.addEventListener("change", function () {
      tasks[index].done = this.checked;
      saveAndRender();
    });
  });
}

// 👉 Save + render
function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// 👉 Add new task
button.addEventListener("click", function () {
  if (input.value.trim() === "") return;

  tasks.push({
    text: input.value,
    done: false,
  });

  saveAndRender();
  input.value = "";
});

// 👉 First load
renderTasks();
