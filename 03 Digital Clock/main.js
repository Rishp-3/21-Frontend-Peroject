let hd1 = document.querySelector(".hd1");
let hd2 = document.querySelector(".hd2");
let md1 = document.querySelector(".md1");
let md2 = document.querySelector(".md2");
let sd1 = document.querySelector(".sd1");
let sd2 = document.querySelector(".sd2");

setInterval(() => {
  let now = new Date();
  let h = now.getHours();
  let m = now.getMinutes();
  let s = now.getSeconds();
  let h1 = Math.floor(h / 10);
  num(h1, hd1);

  let h2 = h % 10;
  num(h2, hd2);

  let m1 = Math.floor(m / 10);
  num(m1, md1);

  let m2 = m % 10;
  num(m2, md2);

  let s1 = Math.floor(s / 10);
  num(s1, sd1);

  let s2 = s % 10;
  num(s2, sd2);
}, 1000);

function num(su, div) {
  switch (su) {
    case 1:
      one(div);
      break;
    case 2:
      two(div);
      break;
    case 3:
      three(div);
      break;
    case 4:
      four(div);
      break;
    case 5:
      five(div);
      break;
    case 6:
      six(div);
      break;
    case 7:
      seven(div);
      break;
    case 8:
      eight(div);
      break;
    case 9:
      nine(div);
      break;
    default:
      zero(div);
      break;
  }
}

function one(div) {
  let s1 = div.querySelector(".s1");
  let s2 = div.querySelector(".s2");
  let s3 = div.querySelector(".s3");
  let s4 = div.querySelector(".s4");
  let s5 = div.querySelector(".s5");
  let s6 = div.querySelector(".s6");
  let s7 = div.querySelector(".s7");
  s1.classList.remove("no-style");
  s2.classList.remove("no-style");
  s3.classList.remove("no-style");
  s4.classList.remove("no-style");
  s5.classList.remove("no-style");
  s6.classList.remove("no-style");
  s7.classList.remove("no-style");
  s1.classList.add("no-style");
  s2.classList.add("no-style");
  s4.classList.add("no-style");
  s5.classList.add("no-style");
  s7.classList.add("no-style");
}

function two(div) {
  let s1 = div.querySelector(".s1");
  let s2 = div.querySelector(".s2");
  let s3 = div.querySelector(".s3");
  let s4 = div.querySelector(".s4");
  let s5 = div.querySelector(".s5");
  let s6 = div.querySelector(".s6");
  let s7 = div.querySelector(".s7");
  s1.classList.remove("no-style");
  s2.classList.remove("no-style");
  s3.classList.remove("no-style");
  s4.classList.remove("no-style");
  s5.classList.remove("no-style");
  s6.classList.remove("no-style");
  s7.classList.remove("no-style");
  s1.classList.add("no-style");
  s6.classList.add("no-style");
}
function three(div) {
  let s1 = div.querySelector(".s1");
  let s2 = div.querySelector(".s2");
  let s3 = div.querySelector(".s3");
  let s4 = div.querySelector(".s4");
  let s5 = div.querySelector(".s5");
  let s6 = div.querySelector(".s6");
  let s7 = div.querySelector(".s7");
  s1.classList.remove("no-style");
  s2.classList.remove("no-style");
  s3.classList.remove("no-style");
  s4.classList.remove("no-style");
  s5.classList.remove("no-style");
  s6.classList.remove("no-style");
  s7.classList.remove("no-style");
  s1.classList.add("no-style");
  s4.classList.add("no-style");
}
function four(div) {
  let s1 = div.querySelector(".s1");
  let s2 = div.querySelector(".s2");
  let s3 = div.querySelector(".s3");
  let s4 = div.querySelector(".s4");
  let s5 = div.querySelector(".s5");
  let s6 = div.querySelector(".s6");
  let s7 = div.querySelector(".s7");
  s1.classList.remove("no-style");
  s2.classList.remove("no-style");
  s3.classList.remove("no-style");
  s4.classList.remove("no-style");
  s5.classList.remove("no-style");
  s6.classList.remove("no-style");
  s7.classList.remove("no-style");
  s2.classList.add("no-style");
  s4.classList.add("no-style");
  s7.classList.add("no-style");
}
function five(div) {
  let s1 = div.querySelector(".s1");
  let s2 = div.querySelector(".s2");
  let s3 = div.querySelector(".s3");
  let s4 = div.querySelector(".s4");
  let s5 = div.querySelector(".s5");
  let s6 = div.querySelector(".s6");
  let s7 = div.querySelector(".s7");
  s1.classList.remove("no-style");
  s2.classList.remove("no-style");
  s3.classList.remove("no-style");
  s4.classList.remove("no-style");
  s5.classList.remove("no-style");
  s6.classList.remove("no-style");
  s7.classList.remove("no-style");
  s3.classList.add("no-style");
  s4.classList.add("no-style");
}
function six(div) {
  let s1 = div.querySelector(".s1");
  let s2 = div.querySelector(".s2");
  let s3 = div.querySelector(".s3");
  let s4 = div.querySelector(".s4");
  let s5 = div.querySelector(".s5");
  let s6 = div.querySelector(".s6");
  let s7 = div.querySelector(".s7");
  s1.classList.remove("no-style");
  s2.classList.remove("no-style");
  s3.classList.remove("no-style");
  s4.classList.remove("no-style");
  s5.classList.remove("no-style");
  s6.classList.remove("no-style");
  s7.classList.remove("no-style");
  s3.classList.add("no-style");
}
function seven(div) {
  let s1 = div.querySelector(".s1");
  let s2 = div.querySelector(".s2");
  let s3 = div.querySelector(".s3");
  let s4 = div.querySelector(".s4");
  let s5 = div.querySelector(".s5");
  let s6 = div.querySelector(".s6");
  let s7 = div.querySelector(".s7");
  s1.classList.remove("no-style");
  s2.classList.remove("no-style");
  s3.classList.remove("no-style");
  s4.classList.remove("no-style");
  s5.classList.remove("no-style");
  s6.classList.remove("no-style");
  s7.classList.remove("no-style");
  s1.classList.add("no-style");
  s4.classList.add("no-style");
  s5.classList.add("no-style");
  s7.classList.add("no-style");
}
function eight(div) {
  let s1 = div.querySelector(".s1");
  let s2 = div.querySelector(".s2");
  let s3 = div.querySelector(".s3");
  let s4 = div.querySelector(".s4");
  let s5 = div.querySelector(".s5");
  let s6 = div.querySelector(".s6");
  let s7 = div.querySelector(".s7");
  s1.classList.remove("no-style");
  s2.classList.remove("no-style");
  s3.classList.remove("no-style");
  s4.classList.remove("no-style");
  s5.classList.remove("no-style");
  s6.classList.remove("no-style");
  s7.classList.remove("no-style");
}
function nine(div) {
  let s1 = div.querySelector(".s1");
  let s2 = div.querySelector(".s2");
  let s3 = div.querySelector(".s3");
  let s4 = div.querySelector(".s4");
  let s5 = div.querySelector(".s5");
  let s6 = div.querySelector(".s6");
  let s7 = div.querySelector(".s7");
  s1.classList.remove("no-style");
  s2.classList.remove("no-style");
  s3.classList.remove("no-style");
  s4.classList.remove("no-style");
  s5.classList.remove("no-style");
  s6.classList.remove("no-style");
  s7.classList.remove("no-style");
  s4.classList.add("no-style");
}
function zero(div) {
  let s1 = div.querySelector(".s1");
  let s2 = div.querySelector(".s2");
  let s3 = div.querySelector(".s3");
  let s4 = div.querySelector(".s4");
  let s5 = div.querySelector(".s5");
  let s6 = div.querySelector(".s6");
  let s7 = div.querySelector(".s7");
  s1.classList.remove("no-style");
  s2.classList.remove("no-style");
  s3.classList.remove("no-style");
  s4.classList.remove("no-style");
  s5.classList.remove("no-style");
  s6.classList.remove("no-style");
  s7.classList.remove("no-style");
  s5.classList.add("no-style");
}
