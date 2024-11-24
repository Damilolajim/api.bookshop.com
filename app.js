require("dotenv").config({ path: "./config/config.env" });
require("express-async-errors");
const express = require("express");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const cors = require("cors");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const throwError = require("./utilities/throwError");
const errorHandler = require("./controllers/error");
const app = express();

const cartRoutes = require("./routes/cart");
const courseRoutes = require("./routes/courses");

app.set("trust proxy", 1);
app.use(helmet());
app.use(
  "/v1",
  rateLimit({
    max: 300,
    windowMs: 15 * 60 * 1000,
    legacyHeaders: false,
  })
);

app.use(express.json({ limit: "10Kb" }));
app.use(cors());
app.use(mongoSanitize());
app.use(xss());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Endpoints
app.get("/", (req, res) => res.send("Betuptip connected"));
app.use("/v1/courses", courseRoutes);
app.use("/v1/carts", cartRoutes);

// Handle undefined routes
app.all("*", (req, res, next) => {
  next(new throwError(`${req.originalUrl} does not exist`, 404));
});

app.use(errorHandler);

module.exports = app;
