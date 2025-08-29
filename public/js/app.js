// console.log("Client side JavaScript file is loaded!");

// fetch("https://puzzle.mead.io/puzzle").then((response) => {
//   // getting data w/ response
//   response.json().then((data) => {
//     // this runs when JSON data arrive and parsed
//     console.log(data);
//   });
// });

// Goal: Fetch weather!
// 1. Setup a call to fetch to fetch weather for Boston
// 2. Get the parse JSON response
//      - If error property, print error
//      - If no error property, print location and forecast
// 3. Refresh the browser and test your work

const weatherForm = document.querySelector("form");
const search = document.querySelector("input");
const messageOne = document.querySelector("#message-1");
const messageTwo = document.querySelector("#message-2");

weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const location = search.value;

  messageOne.textContent = "Loading...";
  messageTwo.textContent = "";

  // Goal: Use input value to get weather
  // 1. Migrate fetch into the submit callback
  // 2. Use the search text as the address query string value
  // 3. Submit the form w/ a valid and invalid value to test
  fetch(`http://localhost:3000/weather?address=${location}`).then(
    (response) => {
      response.json().then((data) => {
        if (data.error) {
          messageOne.textContent = data.error;
        } else {
          messageOne.textContent = data.location;
          messageTwo.textContent = data.forecast;
        }
      });
    }
  );
});
