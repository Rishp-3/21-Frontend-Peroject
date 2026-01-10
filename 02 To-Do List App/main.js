let input = document.querySelector("input");
let but = document.querySelector("button");
let table = document.querySelector("tbody");

/* ---------- PAGE LOAD ---------- */
window.addEventListener("DOMContentLoaded", () => {
  let data = JSON.parse(localStorage.getItem("names")) || [];
  data.forEach((value) => addRow(value));
});

/* ---------- BUTTON CLICK ---------- */
but.addEventListener("click", () => {
  if (input.value.trim() === "") return;

  let data = JSON.parse(localStorage.getItem("names")) || [];
  data.push(input.value);
  localStorage.setItem("names", JSON.stringify(data));

  addRow(input.value);
  input.value = "";
});

/* ---------- FUNCTION ---------- */
function addRow(value) {
  let tr = document.createElement("tr");

  let td0 = document.createElement("td");
  let che = document.createElement("input");
  che.type = "radio";
  td0.appendChild(che);

  let td1 = document.createElement("td");
  td1.innerText = value;

  let td2 = document.createElement("td");
  let dbut = document.createElement("button");
  dbut.innerText = "Delete";
  td2.appendChild(dbut);

  tr.appendChild(td0);
  tr.appendChild(td1);
  tr.appendChild(td2);
  table.appendChild(tr);

  /* radio */
  che.addEventListener("change", () => {
    td1.style.textDecoration = che.checked ? "line-through" : "none";
  });

  /* delete */
  dbut.addEventListener("click", () => {
    tr.remove();

    let data = JSON.parse(localStorage.getItem("names")) || [];
    data = data.filter((n) => n !== value);
    localStorage.setItem("names", JSON.stringify(data));
  });
}
