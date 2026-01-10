let ans = document.querySelector(".ans");
let num = document.querySelectorAll(".num");
let f;
let nu1 = 0,
  nu2 = 0;
num.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (
      isNaN(btn.innerText) &&
      btn.innerText !== "c" &&
      btn.innerText !== "="
    ) {
      f = btn.innerText;
    } else if (f === undefined && !isNaN(btn.innerText)) {
      nu1 = nu1 * 10 + Number(btn.innerText);
    } else if (!isNaN(btn.innerText)) {
      nu2 = nu2 * 10 + Number(btn.innerText);
    }

    if (btn.innerText === "c" || btn.innerText === "=") {
      if (btn.innerText === "=") {
        nu1 = work(f);
        ans.innerText = nu1;
        f = undefined;
      } else {
        ans.innerText = " ";
        nu1 = 0;
        nu2 = 0;
        f = undefined;
      }
    } else {
      ans.innerText += btn.innerText;
    }
  });
});
function work(f) {
  let out = nu1;
  if (f === "+") {
    out = nu1 + nu2;
  } else if (f === "x") {
    out = nu1 * nu2;
  } else if (f === "/") {
    out = nu1 / nu2;
  } else if (f === "-") {
    out = nu1 - nu2;
  } 
  nu1 = 0;
  nu2 = 0;
  return out;
}