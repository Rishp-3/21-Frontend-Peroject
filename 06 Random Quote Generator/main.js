let quot = document.querySelector(".quote");
let autho = document.querySelector(".author");
let button = document.querySelector(".button");

button.addEventListener("click", () => {
  quot.innerText = "Loading...";
  autho.innerText = "";

  fetch("https://dummyjson.com/quotes/random")
    .then((res) => {
      if (!res.ok) {
        throw new Error("API error");
      }
      return res.json();
    })
    .then((data) => {
      quot.innerText = data.quote;
      autho.innerText = "- " + data.author;
    })
    .catch((err) => {
      quot.innerText = "Failed to load quote 😢";
      console.log(err);
    });
});
