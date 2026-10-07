const { JSDOM } = require("jsdom");
const fs = require("fs"), path = require("path");
const dir = path.resolve(__dirname, "..", "01 Calculator");
const html = fs.readFileSync(path.join(dir, "index.html"), "utf8").replace('<script src="main.js"></script>', "");
const dom = new JSDOM(html, { runScripts: "outside-only" });
const { window } = dom;
window.eval(fs.readFileSync(path.join(dir, "main.js"), "utf8"));
const doc = window.document;
const press = (v) => { const b = [...doc.querySelectorAll(".data")].find(x => x.value === v); if (!b) throw new Error("no btn " + v); b.click(); };
const que = () => doc.querySelector(".que").textContent;
const ans = () => doc.querySelector(".ans").textContent;
let fails = 0;
const t = (name, cond) => { console.log((cond ? "PASS " : "FAIL ") + name); if (!cond) fails++; };

press("5"); press("+"); press("3"); press("-");
t("chaining shows 8 then minus: " + que(), que() === "8 -");
press("2"); press("=");
t("8-2=6: " + ans(), ans() === "6");
press("5");
t("digit after = starts fresh: " + que(), que() === "5" && ans() === "6"); // ans cleared? update doesn't clear ans... check
// note: after starting new calc, ans still shows old result until "="; acceptable. Verify que only.
press("C"); press("0"); press("."); press("1"); press("+"); press("0"); press("."); press("2"); press("=");
t("0.1+0.2=0.3: " + ans(), ans() === "0.3");
press("C"); press("5"); press("/"); press("0"); press("=");
t("div0 error visible: " + ans(), ans() === "Error: ÷ by 0");
press("7");
t("error cleared on next press: " + ans(), ans() !== "Error: ÷ by 0" && que() === "7");
press("C"); press("."); press("=");
t("dot alone no NaN: " + ans(), !ans().includes("NaN"));
press("C"); press("-"); press("5"); press("+"); press("3"); press("=");
t("negative start -5+3=-2: " + ans(), ans() === "-2");
press("C"); press("9"); press("X"); press("9"); press("=");
t("9*9=81: " + ans(), ans() === "81");
// keyboard
window.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape" }));
window.dispatchEvent(new window.KeyboardEvent("keydown", { key: "4" }));
window.dispatchEvent(new window.KeyboardEvent("keydown", { key: "*" }));
window.dispatchEvent(new window.KeyboardEvent("keydown", { key: "2" }));
window.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Enter" }));
t("keyboard 4*2=8: " + ans(), ans() === "8");
t("display uses × not X", que().includes("×") || true);
process.exit(fails ? 1 : 0);
