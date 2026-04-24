const time = document.querySelector(".time");
const amPm = document.querySelector(".am-pm");
const day = document.querySelector(".day");
const date = document.querySelector(".date");
const year = document.querySelector(".year");
const timeZOne = document.querySelector("#timezone");
const formate = document.querySelector("#format");

let zones = {
  1: "Asia/Kolkata",
  2: "UTC",
  3: "America/New_York",
  4: "America/Los_Angeles",
  5: "Asia/Tokyo",
};
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
function set() {
  let now = new Date();

  now = new Date(
    now.toLocaleString("en-US", {
      timeZone: zones[Number(timeZOne.value)],
    }),
  );

  if (Number(formate.value) == 1) {
    let hour = now.getHours();

    hour = hour % 12;
    hour = hour ? hour : 12;

    time.innerText = hour + " : " + now.getMinutes() + " : " + now.getSeconds();
  } else {
    time.innerText =
      now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
  }
  if (now.getHours() < 12) {
    amPm.innerText = "AM";
  } else {
    amPm.innerText = "PM";
  }
  day.innerText = days[now.getDay()];

  date.innerText = month[now.getMonth()] + " " + now.getDate();
  year.innerText = now.getFullYear();
}

setInterval(set, 1000);
