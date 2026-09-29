const API_KEY = "d520f768218a1d892023c6d16b46bde5";
const cityInp = document.querySelector(".cityInp");
const submit = document.querySelector(".submit");
const city = document.querySelector(".city");
const dayTime = document.querySelector(".dayTime");
const temp = document.querySelector(".temp");
const description = document.querySelector(".description");
const icon = document.querySelector(".icon");
const humidity = document.querySelector(".humidity");
const windSpeed = document.querySelector(".windSpeed");
const pressure = document.querySelector(".pressure");
const hfData = document.querySelector(".hfData");
const wfData = document.querySelector(".wfData");

let cityV = "pune";
submit.addEventListener("click", function () {
  cityV = cityInp.value;
  get();
});
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let data = null;
let data2 = null;

async function get2() {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityV}&appid=${API_KEY}&units=metric`,
  );

  data2 = await response.json();

  if (!response.ok) {
    console.log(data2.message);
    return;
  }

  setAll2();
}
async function get() {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityV}&appid=${API_KEY}&units=metric`,
  );

  data = await response.json();

  if (!response.ok) {
    console.log(data.message);
    return;
  }

  setAll();
  await get2();
}

get();
function setAll(a) {
  city.innerText = data.name;

  temp.innerText = data.main.temp;

  description.innerText = data.weather[0].description;

  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  document.querySelector("#weatherIcon").src = iconUrl;
  document.querySelector(".feels").innerText = data.main.feels_like;

  humidity.innerText = data.main.humidity;
  windSpeed.innerText = data.wind.speed;
  pressure.innerText = data.main.pressure;
}
setAll2();
function setAll2() {
  hfData.innerHTML = "";
  wfData.innerHTML = "";

  for (let i = 0; i < 8; i++) {
    const date = new Date(data2.list[i].dt * 1000);
    const span = document.createElement("div");
    span.className="rp"
    span.innerHTML = `<div>${date.getHours() + ":" + date.getMinutes()}</div>
    <div> <img src="https://openweathermap.org/img/wn/${data2.list[i].weather[0].icon}@2x.png"></div>
    <div>${data2.list[i].main.temp}</div>`;
    hfData.appendChild(span);
  }

  for (let i = 0; i < 40; i = i + 8) {
    const date = new Date(data2.list[i].dt * 1000);
    const table = document.createElement("table");
    table.innerHTML = `<tr>
    <td>${days[date.getDay()]}</td>
    <td>
    <img src="https://openweathermap.org/img/wn/${data2.list[i].weather[0].icon}@2x.png">
    <p>${data2.list[i].weather[0].description}</p>
    </td>
    <td>${data2.list[i].main.temp}</td>
    </tr>`;
    wfData.appendChild(table);
  }
}
