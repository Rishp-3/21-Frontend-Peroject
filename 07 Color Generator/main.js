const colorShow = document.querySelector(".colorShow");
const colorText = document.querySelector(".colorText");
const button = document.querySelector(".button");
const hexValue = document.querySelector(".hexValue");
const rgbValue = document.querySelector(".rgbValue");
const hslValue = document.querySelector(".hslValue");
const cmykValue = document.querySelector(".cmykValue");
const recBox = document.querySelectorAll(".recBox");

const hexData = "1234567890ABCDEF";

const colorData = [
  "#000000",
  "#222222",
  "#444444",
  "#666666",
  "#888888",
  "#aaaaaa",
];
let hexCode = "000000";
function hexGen() {
  hexCode = "";
  for (let i = 0; i < 6; i++) {
    hexCode = hexCode + hexData[Math.floor(Math.random() * 16)];
  }
  console.log(hexCode);
}

async function getData() {
  const response = await fetch(`https://www.thecolorapi.com/id?hex=${hexCode}`);
  const data = await response.json();
  console.log(data);
  colorText.innerText = data.name.value;
  hexValue.innerText = data.hex.value;
  hslValue.innerText = data.hsl.value;
  cmykValue.innerText = data.cmyk.value;
  rgbValue.innerText = data.rgb.value;
  colorShow.style.backgroundColor = data.hex.value;
  colorData.unshift("#" + hexCode);
  colorData.pop();
  let i = 0;
  recBox.forEach((box) => {
    box.style.backgroundColor = colorData[i];
    i++;
  });
  i = 0;
}
getData();
button.addEventListener("click", function () {
  hexGen();
  getData();
});
