// SECURITY NOTE: the previous OpenWeather API key was committed to this public
// repo (it still exists in git history) — regenerate/revoke it at
// https://home.openweathermap.org/api_keys . Put your new key in config.js
// (gitignored; copy config.example.js to config.js). The app shows a clear
// message if no key is configured.
const RAW_KEY =
  (typeof WEATHER_CONFIG !== "undefined" && WEATHER_CONFIG.API_KEY) || "";
// Treat the placeholder from config.example.js as "no key configured".
const API_KEY = RAW_KEY.startsWith("PASTE_YOUR") ? "" : RAW_KEY.trim();
const cityInp = document.querySelector(".cityInp");
const submitBtn = document.querySelector(".submit");
const city = document.querySelector(".city");
const dayTime = document.querySelector(".dayTime");
const temp = document.querySelector(".temp");
const description = document.querySelector(".description");
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
// The search is a real <form>, so Enter and the button both fire "submit".
document.getElementById("searchForm").addEventListener("submit", function (e) {
  e.preventDefault();
  submitSearch();
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
    showError(
      "No API key configured. Copy config.example.js to config.js and paste your OpenWeather key there.",
    );
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
  if (!response.ok || !data.weather || !data.main) {
    showError(`City "${cityV}" not found. Check the spelling and try again.`);
    return;
  }
  hideError();
  setAll();
  await get2();
}

get();
function setAll() {
  city.innerText = data.name;

  temp.innerText = `${Math.round(data.main.temp)}\u00B0C`;

  description.innerText = data.weather[0].description;

  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  document.querySelector("#weatherIcon").src = iconUrl;
  document.querySelector(".feels").innerText =
    `${Math.round(data.main.feels_like)}\u00B0C`;
  humidity.innerText = `${data.main.humidity}%`;
  windSpeed.innerText = `${data.wind.speed} m/s`;
  pressure.innerText = `${data.main.pressure} hPa`;

  // Visibility card was never filled before
  const visEl = document.querySelector(".visibility");
  if (visEl)
    visEl.innerText = `${((data.visibility || 10000) / 1000).toFixed(1)} km`;

  // dayTime: use the CITY's local hour (UTC offset from API), not browser time.
  if (dayTime) {
    const cityHour = new Date(
      (Date.now() / 1000 + (data.timezone || 0)) * 1000,
    ).getUTCHours();
    dayTime.innerText =
      cityHour < 12
        ? "Morning"
        : cityHour < 17
          ? "Afternoon"
          : cityHour < 20
            ? "Evening"
            : "Night";
  }
}

// Format a UTC timestamp into HH:MM in the CITY's timezone (offset seconds).
function cityTime(dtSeconds, tzOffset) {
  const d = new Date((dtSeconds + tzOffset) * 1000);
  return (
    String(d.getUTCHours()).padStart(2, "0") +
    ":" +
    String(d.getUTCMinutes()).padStart(2, "0")
  );
}

function setAll2() {
  hfData.innerHTML = "";
  wfData.innerHTML = "";
  const tz = data && data.timezone ? data.timezone : 0;

  // "Next 24 Hours" = first 8 entries of the 3-hourly list.
  for (let i = 0; i < 8 && i < data2.list.length; i++) {
    const it = data2.list[i];
    const span = document.createElement("div");
    span.className = "rp";
    span.innerHTML = `<div>${cityTime(it.dt, tz)}</div>
    <div><img src="https://openweathermap.org/img/wn/${it.weather[0].icon}@2x.png" alt="${it.weather[0].description}" width="50" height="50"></div>
    <div>${Math.round(it.main.temp)}\u00B0C</div>`;
    hfData.appendChild(span);
  }

  // "5-Day Forecast": pick one entry per calendar day closest to 12:00 city time.
  const byDay = {};
  for (const it of data2.list) {
    const dayKey = new Date((it.dt + tz) * 1000).toISOString().slice(0, 10);
    const hour = new Date((it.dt + tz) * 1000).getUTCHours();
    if (
      !byDay[dayKey] ||
      Math.abs(hour - 12) < Math.abs(byDay[dayKey].hour - 12)
    ) {
      byDay[dayKey] = { it, hour };
    }
  }
  Object.keys(byDay)
    .sort()
    .forEach((dayKey) => {
      const it = byDay[dayKey].it;
      const weekday = days[new Date((it.dt + tz) * 1000).getUTCDay()];
      const card = document.createElement("div");
      card.className = "forecast-card";
      card.innerHTML = `<span class="fc-day">${weekday}</span>
      <img src="https://openweathermap.org/img/wn/${it.weather[0].icon}@2x.png" alt="${it.weather[0].description}" width="50" height="50">
      <p>${it.weather[0].description}</p>
      <strong>${Math.round(it.main.temp)}\u00B0C</strong>`;
      wfData.appendChild(card);
    });
}
