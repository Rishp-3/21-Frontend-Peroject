let quot = document.querySelector(".quote");
let author = document.querySelector(".author");
let button = document.querySelector(".button");

button.addEventListener("click", () => {
  quot.innerText = "Loading...";
  author.innerText = "";

  fetch("https://dummyjson.com/quotes/random")
    .then((res) => {
      if (!res.ok) {
        throw new Error("API error");
      }
      return res.json();
    })
    .then((data) => {
      quot.innerText = data.quote;
      author.innerText = "- " + data.author;
    })
    .catch((err) => {
      quot.innerText = "Failed to load quote 😢";
      console.log(err);

    });

});
