/* -------------------------------------------------------------------------- */
/*                   SERVER.JS: THE CORE OF THE APPLICATION                   */
/* -------------------------------------------------------------------------- */

/* --------------------------------- IMPORTS -------------------------------- */

const mongoose = require("mongoose");
const app = require("./app");

/* ----------------------- HANDLE UNCAUGHT EXCEPTIONS ----------------------- */

process.on("uncaughtException", (err) => {
    console.error(err);
    console.log("[UNHANDLED EXCEPTION] 🤬: Shutting down...");
    process.exit(1);
});

/* --------------------------- LOAD ENV VARIABLES --------------------------- */

require("dotenv").config({ path: "./config.env" });

if (process.env.NODE_ENV === "development") {
    console.log("Starting node application in development mode...");
} else {
    console.log("Starting node application in production mode...");
}

/* --------------------------- CONNECT TO DATABASE -------------------------- */

const { DB_URL_LOCAL } = process.env;
let { DB_URL } = process.env;
DB_URL = DB_URL.replace("<PASSWORD>", process.env.DB_PASSWORD);

mongoose
    .connect(process.env.NODE_ENV === "production" ? DB_URL : DB_URL_LOCAL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log(
            `Successfully connected to ${process.env.NODE_ENV} database...`
        );
    })
    .catch(() => {
        console.error(
            `Failed to connect to  ${process.env.NODE_ENV} database...`
        );
    });

/* ------------------------ START HTTP EXPRESS SERVER ----------------------- */

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

/* ----------------------- HANDLE UNHANDLED REJECTIONS ---------------------- */

process.on("unhandledRejection", (err) => {
    console.error(err);
    console.log("[UNHANDLED REJECTION] 🤬: Shutting down...");
    server.close(() => process.exit(1));
});
