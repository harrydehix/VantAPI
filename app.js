/* -------------------------------------------------------------------------- */
/*                       APP.JS: THE EXPRESS APPLICATION                      */
/* -------------------------------------------------------------------------- */

/* --------------------------------- IMPORTS -------------------------------- */

const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const hpp = require("hpp");
const globalErrorHandler = require("./errorHandling/errorHandler");
const AppError = require("./errorHandling/AppError");

const app = express();

/* ------------------------------- MIDDLEWARE ------------------------------- */

// Sets security http headers
app.use(helmet());

// Limits allowed requests per ip
const limiter = rateLimit({
    max: 25, // how many requests...
    windowMs: 1000 * 60, // ...per time in ms
    message: "Too many requests from your IP, please try again in some time",
});
app.use("/api", limiter);

// Logs requests information in development mode
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Parses incoming json data from the body
app.use(express.json({ limit: "10kb" }));

// (JSON) Data sanitization against NoSQL query injection (e.g. '{$gt: ""}' is converted to '{gt: ""}')
app.use(mongoSanitize());

// (JSON) Data sanitization against XSS (e.g. '<div>' is converted to '&lt;div>')
app.use(xssClean());

// Prevent parameter pollution (query arrays not supported)
// app.use(
//     hpp({
//         whitelist: [],
//     })
// );

/* --------------------------------- ROUTERS -------------------------------- */

//app.use("/api/v1/authentication", require("./routers/authRouter"));
app.use("/api/v1/records", require("./routers/recordRouter"));

/* ----------------------------- ERROR HANDLING ----------------------------- */

app.route("*").all((req, res, next) => {
    throw new AppError(`Invalid request url (${req.url})`, 404);
});
app.use(globalErrorHandler);

module.exports = app;
