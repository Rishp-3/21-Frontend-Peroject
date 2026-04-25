let ans = document.querySelector(".ans");
let increment = document.querySelector(".increment");
let reset = document.querySelector(".reset");
let decrement = document.querySelector(".decrement");
let incBy10 = document.querySelector(".incres10");
let decBy10 = document.querySelector(".decres10");
let total = document.querySelector(".total");
let highest = document.querySelector(".highest");
let num = 0;
let totalClick = 0;
let highestNum = 0;
increment.addEventListener("click", () => {
  num = num + 1;
  ans.innerText = num;
  clickUpdate();
  highestUpdate();
});
reset.addEventListener("click", () => {
  num = 0;
  ans.innerText = num;
  clickUpdate();
});
decrement.addEventListener("click", () => {
  num = num - 1;
  ans.innerText = num;
  clickUpdate();
});
incBy10.addEventListener("click", () => {
  num = num + 10;
  ans.innerText = num;
  clickUpdate();
  highestUpdate();
});
decBy10.addEventListener("click", () => {
  num = num - 10;
  ans.innerText = num;
  clickUpdate();
});

function highestUpdate() {
  highestNum = highestNum > num ? highestNum : num;
  highest.innerText = highestNum;
}
function clickUpdate() {
  totalClick = totalClick + 1;
  total.innerText = totalClick;
}
