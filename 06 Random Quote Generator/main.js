const quote = document.querySelector(".quote");
const author = document.querySelector(".author");
const button = document.querySelector(".button");
button.addEventListener("click", function () {
  fetch("https://dummyjson.com/quotes/random")
    .then((response) => response.json())
    .then((data) => {
      quote.innerText = data.quote;
      author.innerText = data.author;
    })
    .catch((quote.innerText = "Error"));
});
