const express = require("express");
const morgan = require("morgan");
const nunjucks = require("nunjucks");
const path = require("path");
const winston = require("winston");

const PORT = 3000;

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

const app = express();

// Body parser middleware
app.use(express.urlencoded({ extended: true }));

// Static assets.
app.use(express.static(path.join(__dirname, "public")));

// Logger.
app.use(
  morgan(":method :url :status :response-time ms", {
    stream: {
      write: (message) => logger.info(message.trim()),
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

// Home route
app.get("/", (request, response) => {
  const options = { pageTitle: "Homepage" };
  return response.render("home", options);
});

// Form submission route
app.post("/submit", (request, response) => {
  // Handle form submission, render success message, and update comments
  const { username, comment } = request.body;
  // Perform any necessary logic (e.g., save to a database)
  const successMessage = "Form submitted successfully!";
  const comments = ["Comment 1", "Comment 2"]; // Fetch comments or perform any necessary logic
  const options = { pageTitle: "Homepage", successMessage, comments };
  return response.render("home", options);
});

app.listen(PORT, () => {
  logger.log({ level: "info", message: `listening on ${PORT}` });
});
