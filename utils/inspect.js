const util = require("util");

module.exports = (obj) =>
    console.log(
        util.inspect(obj, { showHidden: false, depth: null, colors: true })
    );
