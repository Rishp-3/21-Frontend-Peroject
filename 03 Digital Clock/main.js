const time = document.querySelector(".time");
const amPm = document.querySelector(".am-pm");
const day = document.querySelector(".day");
const date = document.querySelector(".date");
const year = document.querySelector(".year");
const timeZOne = document.querySelector("#timezone");
const formate = document.querySelector("#format");

// FIX: "PST" was mapped to America/New_York (that's EST) and "CST" to
// America/Los_Angeles (that's PST). Correct zones below; CST -> America/Chicago.
let zones = {
  1: "Asia/Kolkata",   // IST
  2: "UTC",
  3: "America/Los_Angeles", // PST
  4: "America/Chicago",     // CST
  5: "Asia/Tokyo",          // JST
};

// Intl.DateTimeFormat is far more reliable than the old
// new Date(now.toLocaleString(...)) round-trip hack.
function partsIn(tz, hour12) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
  return Object.fromEntries(fmt.formatToParts(new Date()));
}

const pad = (n) => String(n).padStart(2, "0");

function set() {
  const tz = zones[Number(timeZOne.value)];
  const is12 = Number(formate.value) === 1;
  const p = partsIn(tz, is12);

  let h = p.hour;
  if (is12) {
    // Intl gives "12".."11" with hour12 - keep as-is but strip leading zero of hour only
    h = String(Number(h));
    time.innerText = `${h} : ${p.minute} : ${p.second}`;
    amPm.innerText = p.dayPeriod; // AM or PM (correct per timezone)
    amPm.style.visibility = "visible";
  } else {
    // 24-hour clock: pad all units, hide AM/PM entirely
    const h24 = String(Number(p.hour) % 24).padStart(2, "0");
    time.innerText = `${h24}:${p.minute}:${p.second}`;
    amPm.innerText = "";
    amPm.style.visibility = "hidden";
  }

  day.innerText = p.weekday;
  date.innerText = `${p.month} ${Number(p.day)}`;
  year.innerText = p.year;
}

timeZOne.addEventListener("change", set);
formate.addEventListener("change", set);

set();            // render immediately (was missing -> blank for first second)
setInterval(set, 1000);
