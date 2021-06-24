/* -------------------------------------------------------------------------- */
/*                              RECORD CONTROLLER                             */
/* -------------------------------------------------------------------------- */

/* --------------------------------- IMPORTS -------------------------------- */

const HandlerFactory = require("../utils/HandlerFactory");
const Record = require("../models/recordModel");

const recordHandlerFactory = new HandlerFactory(Record);

/* -------------------------- CONTROLLER FUNCTIONS -------------------------- */

/**
 * Gets a single record.
 * @function
 * @param {*} req express request object
 * @param {*} res express response object
 * @param {*} next express next method
 */
exports.getRecord = recordHandlerFactory.getOne();

/**
 * Creates a single record.
 * @function
 * @param {*} req express request object
 * @param {*} res express response object
 * @param {*} next express next method
 */
exports.createRecord = recordHandlerFactory.createOne({
    filterBody:
        "pressure wind humidity temperature rain storm sun forecast batteries thswIndex time",
});

/**
 * Gets all records from the database. Filtering is possible due to search params.
 * @function
 * @param {*} req express request object
 * @param {*} res express response object
 * @param {*} next express next method
 */
exports.getAllRecords = recordHandlerFactory.getMany({
    useAPIFeatures: true,
});

exports.deleteAllRecords = recordHandlerFactory.deleteMany();

/**
 * Updates a single record.
 * @function
 * @param {*} req express request object
 * @param {*} res express response object
 * @param {*} next express next method
 */
exports.updateRecord = recordHandlerFactory.updateOne({
    filterBody:
        "pressure wind humidity temperature rain storm sun forecast batteries thswIndex time",
});

/**
 * Deletes a single record.
 * @function
 * @param {*} req express request object
 * @param {*} res express response object
 * @param {*} next express next method
 */
exports.deleteRecord = recordHandlerFactory.deleteOne();

/**
 * Gets the most recent records stored in the database.
 * @function
 * @param {*} req express request object
 * @param {*} res express response object
 * @param {*} next express next method
 */
exports.getMostRecentRecords = recordHandlerFactory.getMany({
    beforeAwaitingQuery: (query) => query.sort("-time"),
    useAPIFeatures: true,
});
