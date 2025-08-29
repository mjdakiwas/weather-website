const path = require("path");
const express = require("express"); // express is a function which creates a new Express application
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

console.log(__dirname);
console.log(path.join(__dirname, "../public")); // manipulating path

const app = express();

// define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views"); // getting absolute path to custom-named views folder (in this case, 'templates' folder)
const partialsPath = path.join(__dirname, "../templates/partials");

// tells Express which templating engine we installed
app.set("view engine", "hbs"); // sets up Handlebars
app.set("views", viewsPath); // points Express to custom 'views' directory
hbs.registerPartials(partialsPath); // get Handlebars to the directory where the partials live

// serving up static directory
// .use() is a way to customize your server
app.use(express.static(publicDirectoryPath)); // configures Express app location
// visit the root of the site via localhost:3000. Can also search the explicit path (localhost:3000/index.html), but since index.html has a special meaning when related to web serves, we can leave the path off if we're going to the root of the site
// .get() routes below will no longer run because of app.use() above => .use() found matching file so will display

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Marlette Dakiwas",
  }); // first argument is the name of the view we wanna see. There's no need for file extension, just needs to match up w/ name of the template created in the views folder
  // .render() makes Express get the view (.hbs file) then converts it to HTML and make sure that HTML gets back to thhe requester
});
// NOTE: Had to delete static index.html file for .render() to find index.hbs since index.html was what's being found instead

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Marlette Dakiwas",
  });
});

// Goal: Create a template for help page
// 1. Setup a help template to render a help message to the screen
// 2. Setup the help rout and render the template w/ an example message
// 3. Visit the route in the browser and se your help message print
app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    name: "Marlette Dakiwas",
    message: "This is some helpful text.",
  });
});

// app.get("", (req, res) => {
//   //   res.send("Hello express!"); // NOTE: this message is gonna display in the browser
//   res.send("<h1>Weather</h1>"); // sending back HTML
// });

// Goal: Create two more HTML files
// 1. Create a html page for about w/ "About" title
// 2. Create a html page for help w/ "Help" title
// 3. Remove the old route handlers for both
// 4. Visit both in the browser to test your work (http://localhost:3000/about.html and http://localhost:3000/help.html)

// app.get("/help", (req, res) => {
//   //   res.send("Help page");
//   res.send([
//     {
//       name: "Marlette",
//       age: 22,
//     },
//     {
//       name: "Marian",
//       age: 21,
//     },
//   ]); // sending back JSON (an object) or an array of objects
// });

// Goal: Setup two new routes
// 1. Setup an about route and render a page title
// 2. Setup a weather route and render a page title
// 3. Test your work by visiting both in the browser

// Goal: Update routes
// 1. Setup about route to render a title w/ HTML
// 2. Setup a weather route to send back JSON
//         - Object w/ forecast and location strings
// 3. Test your work by visiting both in the browser
// app.get("/about", (req, res) => {
//   //   res.send("About page");
//   res.send("<h1>About</h1>");
// });

// app.get("/weather", (req, res) => {
//   //   res.send("Your weather");
//   res.send({
//     forecast: "84 degrees",
//     location: "North Carolina",
//   });
// });

// Goal: Update weather endpoint to accept address
// 1. No address? Send back an error mmessage
// 2. Address? Send back the static JSON
//      - Add address property onto JSON which returns the providedd address
// 3. Test /weather and /weather?address=philadelphia

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address",
    });
  }

  //   res.send({
  //     forecast: "84 degrees",
  //     location: "North Carolina",
  //     address: req.query.address,
  //   });

  // building a JSON HTTP endpoint
  // Goal: Wire up /weather
  // 1. Require geocode/forecast into app.js
  //     - NOTE: I hade to locally install postman-require since geocode and forecast needed it to work
  // 2. Use the address to geocode
  // 3. Use the coordinates to get forecast
  // 4. Send back the real forecast and location
  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) return res.send({ error });

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) return res.send(error);
        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    // only runs when no search term in query string
    // trying to respond to request twice, get an error because HTTP requests have a single request that goes to the server and a single response that comes back
    return res.send({
      error: "You must provide a search term",
    }); // return keyword stops function execution
  }

  console.log(req.query);
  res.send({
    products: [],
  });
});

// Goal: Create and render a 404 page w/ handlebars
// 1. Setup the template to render the header and footer
// 2. Setup the template to render an error message in a paragraph
// 3. Render the template for both 404 routes
//     - Page not found
//     - Help article not found
// 4. Test your workerData. Visit /what and /help/units

// matching requests that match a specific pattern
app.get("/help/*", (req, res) => {
  //   res.send("Help article not found");
  res.render("404", {
    title: "404",
    name: "Marlette Dakiwas",
    errorMessage: "Help article not found",
  });
});
// this .get() are for unsupported routes after /help (this case is for when /help serves as our help documentation)

// matching every request
app.get("*", (req, res) => {
  //   res.send("My 404 page");
  res.render("404", {
    title: "404",
    name: "Marlette Dakiwas",
    errorMessage: "Page not found",
  });
});
// this .get() needs to come last after all other routes because when Express gets an incoming request, it starts to look for a match in the public folder so

app.listen(3000, () => {
  console.log("Server is up on port 3000"); // NOTE: this message is never gonna display in the browser, but in the terminal
});
// '3000' is a common development port, however it's not the default port (for an HTTP based website, the default port is 80)
// callback function runs when the server is up and running

// since running the server on our local machine, can't access it off of our machine and from a real domain
// is only accessible on our machine, and we can do so at 'localhost' (in this case, `localhost:3000`)

// REMEMBER: Have to restart server for changes to server to take effect
//  - Can shut down server w/ CTRL + C and starting it up again (IS REPEATITIVE)
//  - Use nodemon (restarts server whenever we make changes and saves it) => `nodemon src/app.js`
