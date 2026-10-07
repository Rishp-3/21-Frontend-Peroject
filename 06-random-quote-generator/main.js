const quote = document.querySelector(".quote");
const author = document.querySelector(".author");
const button = document.querySelector(".button");

async function fetchQuote() {
  quote.innerText = "Loading…";
  author.innerText = "";
  button.disabled = true; // loading state: disable while fetching
  try {
    const response = await fetch("https://dummyjson.com/quotes/random");
    if (!response.ok) throw new Error("HTTP " + response.status);
    const data = await response.json();
    quote.innerText = data.quote;
    author.innerText = "— " + data.author;
  } catch (err) {
    // Proper lazy arrow-function handler (was: .catch((quote.innerText = "Error"))
    // which ran the assignment immediately on every click).
    quote.innerText = "Could not load a quote. Please try again.";
    author.innerText = "";
  } finally {
    button.disabled = false;
  }
}

button.addEventListener("click", fetchQuote);
// Load one quote on page start (previously the page was empty until a click)
fetchQuote();
