const que = document.querySelector(".que");
const ans = document.querySelector(".ans");
let num1 = "";
let num2 = "";
let operation = "";
let justEquals = false; // true right after "=" so the next digit starts fresh

// Round to 10 significant digits and trim trailing zeros (fixes 0.1+0.2 -> 0.30000000000000004)
function round(n) {
  if (!isFinite(n)) return n;
  return Number(n.toPrecision(10));
}

function press(val) {
  // Any key press after an error clears it first
  if (ans.textContent.startsWith("Error")) clearAll();

  if (val === "C") return clearAll();

  if (val === "⌫") {
    if (justEquals) return clearAll();
    if (num2 !== "") num2 = num2.slice(0, -1);
    else if (operation !== "") operation = "";
    else num1 = num1.slice(0, -1);
    return update();
  }

  if (val === "%") {
    if (justEquals) return;
    if (num2 !== "") num2 = String(round(Number(num2) / 100));
    else if (num1 !== "") num1 = String(round(Number(num1) / 100));
    return update();
  }

  if (val === "=") {
    justEquals = false;
    return output();
  }

  // Digit or decimal point
  if (/^[0-9.]$/.test(val)) {
    let target = operation === "" ? "num1" : "num2";
    // After "=", a digit starts a brand-new calculation; an operator chains from the result
    if (justEquals) {
      num1 = "";
      num2 = "";
      operation = "";
      target = "num1";
      justEquals = false;
    }
    const cur = target === "num1" ? num1 : num2;
    if (val === ".") {
      if (cur.includes(".")) return;
      // "." alone is invalid as a start -> treat as "0."
      if (cur === "" || cur === "-") {
        if (target === "num1") num1 = cur + "0.";
        else num2 = cur + "0.";
        return update();
      }
    }
    if (target === "num1") num1 += val;
    else num2 += val;
    return update();
  }

  // Operator (+ - X /): allow a leading minus for negative numbers
  if ((val === "-" || val === "+") && num1 === "" && !justEquals) {
    num1 = val;
    return update();
  }
  if (num1 === "" || num1 === "-") return; // no operand yet
  if (justEquals) {
    num2 = ""; // continue from the previous result
    justEquals = false;
  } else if (num2 !== "") {
    // operator chaining: "5 + 3 −" computes 8 first, then continues with −
    output();
    num2 = "";
    operation = "";
  }
  operation = val;
  justEquals = false;
  update();
}

function update() {
  const shownOp = operation === "X" ? "×" : operation;
  que.textContent = num1 + (shownOp ? " " + shownOp : "") + (num2 ? " " + num2 : "");
}

function output() {
  if (num1 === "" || num1 === "-" || num2 === "" || num2 === "-" || operation === "") return;

  const a = Number(num1), b = Number(num2);
  let result;
  if (operation === "+") result = a + b;
  if (operation === "-") result = a - b;
  if (operation === "X") result = a * b;
  if (operation === "/") {
    if (b === 0) {
      // Keep the message visible; the next key press clears it (handled in press())
      ans.textContent = "Error: ÷ by 0";
      update();
      return;
    }
    result = a / b;
  }

  result = round(result);
  ans.textContent = String(result);

  num1 = String(result);
  num2 = "";
  operation = "";
  justEquals = true;
}

function clearAll() {
  num1 = "";
  num2 = "";
  operation = "";
  justEquals = false;
  que.textContent = "";
  ans.textContent = "";
}

document.querySelectorAll(".data").forEach((btn) => {
  btn.addEventListener("click", () => press(btn.value));
});

// Keyboard support: digits, operators, . Enter, Backspace, Escape
window.addEventListener("keydown", (e) => {
  if (/^[0-9]$/.test(e.key)) return press(e.key);
  if (["+", "-", "/", "*", ".", "%"].includes(e.key)) {
    e.preventDefault();
    return press(e.key === "*" ? "X" : e.key);
  }
  if (e.key.toLowerCase() === "x") return press("X");
  if (e.key === "Enter" || e.key === "=") {
    e.preventDefault();
    return press("=");
  }
  if (e.key === "Backspace") return press("⌫");
  if (e.key === "Escape" || e.key === "c" || e.key === "C") return press("C");
});
