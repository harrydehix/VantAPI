module.exports = function (fn) {
    return async () => {
        for (let i = 0; i < this.config.maxTries; i++) {
            try {
                const result = await fn.apply(this, arguments);
                return result;
            } catch (err) {
                if (this.config.logErrors) console.error(err);
            }
        }
        return undefined;
    };
};
