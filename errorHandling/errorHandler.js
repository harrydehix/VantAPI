/* -------------------------------------------------------------------------- */
/*                                ERROR HANDLER                               */
/* -------------------------------------------------------------------------- */

/* --------------------------------- IMPORTS -------------------------------- */

const util = require("util");
const AppError = require("./AppError");

/* ------------------------ THE ERROR HANDLER ITSELF ------------------------ */

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    // Check the current node env
    if (process.env.NODE_ENV === "development") {
        // dev mode
        sendErrorDevelopment(err, res);
    } else {
        // prod mode
        let error = { ...err, message: err.message };

        // Handle particular errors differently
        if (err.name === "CastError") {
            error = handleDBCastError(err);
        } else if (err.name === "MongoError" && err.code === 11000) {
            error = handleDBDuplicateError(err);
        } else if (err.name === "ValidationError") {
            error = handleDBValidationError(err);
        } else if (err.name === "JsonWebTokenError") {
            error = handleJWTError();
        } else if (err.name === "TokenExpiredError") {
            error = handleJWTExpiredError();
        }
        sendErrorProduction(error, res);
    }
};

/* --------------------- SENDING THE ERROR TO THE CLIENT -------------------- */

/**
 * Sends an error to the client in full detail.
 * @param {* extends Error} err the error to send
 * @param {*} res the express response object
 */
function sendErrorDevelopment(err, res) {
    console.error(err);
    // All errors are sent in full detail
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
    });
}

/**
 * Sends an error to the client in less detail, to don't leak details on unknown errors.
 * @param {* extends Error} err the error to send
 * @param {*} res the express response object
 */
function sendErrorProduction(err, res) {
    if (err.isOperational) {
        // Operational, trusted errors are sent to the client in full detail
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        // Programming/unknown errors are hidden
        console.error(`[ERROR]:\t ${util.inspect(err)}`);
        res.status(500).json({
            status: "error",
            message: "Something went wrong...",
        });
    }
}

/* -------- HANDLING/REFRACTORING PARTICULAR ERRORS (PRODUCTION ONLY) ------- */

function handleDBCastError(err) {
    const message = `Invalid ${err.path}: '${err.value}'`;
    return new AppError(message, 400);
}

function handleDBDuplicateError(err) {
    const values = Object.values(err.keyValue).join(", ");
    const message = `Duplicate field value(s): ${values}. Please try different value(s)!`;
    return new AppError(message, 400);
}

function handleDBValidationError(err) {
    const errors = Object.values(err.errors)
        .map((error) => error.message)
        .join(". ");
    const message = `Invalid input data: ${errors}`;
    return new AppError(message, 400);
}

function handleJWTError() {
    return new AppError("Invalid token. Please log in again!", 401);
}

function handleJWTExpiredError() {
    return new AppError("Token expired. Please log in again!", 401);
}
