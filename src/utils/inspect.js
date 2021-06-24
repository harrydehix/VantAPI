const util = require("util");

/**
 * Inspects an object. Only for development purposes.
 * @param {Object} obj object to inspect
 */
module.exports = (obj) =>
    console.log(
        util.inspect(obj, { showHidden: false, depth: null, colors: true })
    );
