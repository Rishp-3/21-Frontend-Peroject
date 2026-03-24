const que = document.querySelector(".que");
const but = document.querySelectorAll(".data");
const ans = document.querySelector(".ans");
let num1 = "";
let num2 = "";
let operation = "";

but.forEach(function (btn) {
  btn.addEventListener("click", function () {
    let val = this.value;

    // CLEAR
    if (val == "C") {
      clearAll();
      return;
    }

    // BACKSPACE
    if (val == "⌫") {
      ans.innerText = "";

      if (num2 !== "") {
        num2 = num2.slice(0, -1);
      } else if (operation !== "") {
        operation = "";
      } else {
        num1 = num1.slice(0, -1);
      }

      update();
      return;
    }
    // PERCENT
    if (val == "%") {
      if (num2 !== "") {
        num2 = String(Number(num2) / 100);
      } else if (num1 !== "") {
        num1 = String(Number(num1) / 100);
      }
      update();
      return;
    }

    // EQUAL
    if (val == "=") {
      output();
      return;
    }

    // NUMBER / DECIMAL
    if (/^[0-9]$/.test(val) || val == ".") {
      if (operation == "") {
        if (val == "." && num1.includes(".")) return;
        num1 += val;
      } else {
        if (val == "." && num2.includes(".")) return;
        num2 += val;
      }
    } else {
      if (num1 !== "") operation = val;
    }

    update();
  });
});

function update() {
  que.innerText =
    num1 + (operation ? " " + operation : "") + (num2 ? " " + num2 : "");
}

function output() {
  if (num1 === "" || num2 === "" || operation === "") return;

  let result;
  if (operation == "+") result = Number(num1) + Number(num2);
  if (operation == "-") result = Number(num1) - Number(num2);
  if (operation == "X") result = Number(num1) * Number(num2);
  if (operation == "/") {
    if (Number(num2) === 0) {
      ans.innerText = "Error: ÷ by 0";
      clearAll();
      return;
    }
    result = Number(num1) / Number(num2);
  }

  ans.innerText = result;

  num1 = String(result);
  num2 = "";
  operation = "";
}

function clearAll() {
  num1 = "";
  num2 = "";
  operation = "";
  que.innerText = "";
  ans.innerText = "";
}
