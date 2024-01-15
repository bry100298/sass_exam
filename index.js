const express = require("express");
const morgan = require("morgan");
const nunjucks = require("nunjucks");
const path = require("path");
const bodyParser = require('body-parser');

const PORT = 3000;

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add support for JSON-encoded bodies

// Static assets.
app.use(express.static(path.join(__dirname, "public")));

// Logger.
app.use(
  morgan(":method :url :status :response-time ms", {
    stream: {
      write: (message) => console.log(message.trim()),
    },
  })
);

// Configure templating engine.
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "njk");
nunjucks.configure(app.get("views"), {
  autoescape: true,
  express: app,
});

// Placeholder for storing submissions
let submissions = [];

// Home route
app.get("/", (request, response) => {
  const options = { pageTitle: "Homepage", comments: submissions };
  return response.render("home", options);
});

// Form submission route
app.post("/submit", (request, response) => {
  const { username, comment } = request.body;

  // Perform any necessary logic (e.g., save to a database)
  submissions.push({ username, comment });

  // Send the updated submissions back to the client
  response.json({ successMessage: "Form submitted successfully!", comments: submissions });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
