// Counter App — single change(delta) helper removes the repeated handlers.
const ans = document.querySelector(".ans");
const totalEl = document.querySelector(".total");
const highestEl = document.querySelector(".highest");

let num = 0;
let totalClicks = 0;
let highestNum = 0;

function render() {
  ans.innerText = num;
  totalEl.innerText = totalClicks;
  highestEl.innerText = highestNum;
}

function change(delta) {
  num += delta;
  totalClicks += 1;
  if (num > highestNum) highestNum = num; // "Highest" tracks max value reached
  render();
}

document
  .querySelector(".increment")
  .addEventListener("click", () => change(+1));
document
  .querySelector(".decrement")
  .addEventListener("click", () => change(-1));
document.querySelector(".inc-ten").addEventListener("click", () => change(+10));
document.querySelector(".dec-ten").addEventListener("click", () => change(-10));
// Reset zeroes the count but keeps Total Clicks / Highest stats (original behavior).
document.querySelector(".reset").addEventListener("click", () => {
  num = 0;
  totalClicks += 1;
  render();
});
