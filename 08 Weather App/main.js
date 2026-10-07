// SECURITY NOTE: the previous OpenWeather API key was committed to this public
// repository and has been REVOKED. Generate your own free key at
// https://home.openweathermap.org/api_keys and set it below (or better, keep it
// out of source control entirely). The app shows a clear message if no key is set.
const API_KEY = ""; // <- put your OpenWeather API key here
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

// User-visible error banner (fixes: errors were only logged to console)
function showError(msg) {
  const box = document.querySelector(".error-box");
  if (box) {
    box.textContent = msg;
    box.style.display = "block";
  }
}
function hideError() {
  const box = document.querySelector(".error-box");
  if (box) box.style.display = "none";
}

function submitSearch() {
  const v = cityInp.value.trim();
  if (!v) {
    showError("Please enter a city name.");
    return;
  }
  hideError();
  cityV = v;
  get();
}
submit.addEventListener("click", submitSearch);
cityInp.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    submitSearch();
  }
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
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityV)}&appid=${API_KEY}&units=metric`;
  let response;
  try {
    response = await fetch(url);
  } catch (err) {
    showError("Network error – could not reach OpenWeather.");
    return;
  }
  data2 = await response.json();
  if (!response.ok) {
    showError(data2.message || "Forecast data not available for that city.");
    return;
  }
  setAll2();
}
async function get() {
  if (!API_KEY) {
    showError("No API key configured. Add your free OpenWeather API key to API_KEY in main.js.");
    return;
  }
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityV)}&appid=${API_KEY}&units=metric`;
  let response;
  try {
    response = await fetch(url);
  } catch (err) {
    showError("Network error – could not reach OpenWeather.");
    return;
  }
  data = await response.json();
  if (!response.ok) {
    showError(`City "${cityV}" not found. Check the spelling and try again.`);
    return;
  }
  hideError();
  setAll();
  await get2();
}

get();
function setAll(a) {
  city.innerText = data.name;

  temp.innerText = `${Math.round(data.main.temp)}\u00B0C`;

  description.innerText = data.weather[0].description;

  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  document.querySelector("#weatherIcon").src = iconUrl;
  document.querySelector(".feels").innerText = `${Math.round(data.main.feels_like)}\u00B0C`;
  humidity.innerText = `${data.main.humidity}%`;
  windSpeed.innerText = `${data.wind.speed} m/s`;
  pressure.innerText = `${data.main.pressure} hPa`;

  // Visibility card was never filled before
  const visEl = document.querySelector(".visiblity");
  if (visEl) visEl.innerText = `${((data.visibility || 10000) / 1000).toFixed(1)} km`;

  // dayTime was never set before
  if (dayTime) {
    const localH = new Date().getHours();
    dayTime.innerText = localH < 12 ? "Morning" : localH < 17 ? "Afternoon" : localH < 20 ? "Evening" : "Night";
  }

}
function setAll2() {
  hfData.innerHTML = "";
  wfData.innerHTML = "";

  for (let i = 0; i < 8; i++) {
    const date = new Date(data2.list[i].dt * 1000);
    const span = document.createElement("div");
    span.className="rp"
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    span.innerHTML = `<div>${hh}:${mm}</div>
    <div> <img src="https://openweathermap.org/img/wn/${data2.list[i].weather[0].icon}@2x.png"></div>
    <div>${Math.round(data2.list[i].main.temp)}\u00B0C</div>`;
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
    <td>${Math.round(data2.list[i].main.temp)}\u00B0C</td>
    </tr>`;
    wfData.appendChild(table);
  }
}
