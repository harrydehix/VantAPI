/**
 * Wraps the given function into a loop to recall it on failure. This handler
 * is required because the vproweather driver is not stable. Only functions interacting
 * with the driver should use this wrapper.
 * @param {} fn the function to recall on failure
 * @returns the wrapped function
 */
module.exports = function (fn) {
    return async () => {
        for (let i = 0; i < this.config.maxTries; i++) {
            try {
                const result = await fn.apply(this);
                return result;
            } catch (err) {
                if (this.config.logErrors) console.error(err);
            }
        }
        return undefined;
    };
};
