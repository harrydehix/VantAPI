const exec = require("await-exec");
const fs = require("fs/promises");
const parseData = require("./parseData");
const Refractor = require("./refractorData");

/**
 * Fixes the vproweather's negative wind chill value bug by calculating the wind chill from outside temperature and gust speed.
 * @param {} data the realtime data set
 * @returns the fixed realtime data set
 */
const fixWindChill = (data) => {
    if (data.rtWindChill < 0) {
        data.rtWindChill =
            35.74 +
            0.6215 * data.rtOutsideTemp +
            (0.4275 * data.rtOutsideTemp - 35.75) *
                data.rtWind10mGustMaxSpeed ** 0.16;
        if (data.rtWindChill > data.rtOutsideTemp) {
            data.rtWindChill = data.rtOutsideTemp;
        }
    }
    return data;
};

/**
 * Basic interface to a vantage pro that is connected serially. The vproweather driver must be installed and globally adressable.
 */
class VPInterface {
    /**
     * @param {String} deviceUrl the url to the serial device
     * @param {Object} config additional interface/driver settings
     * @param {Number} config.delay time to wait for the answer of the weather station in 1/10s (default: 10)
     * @param {Number} config.maxTries maximum amount of request retries on connection error (default: 20)
     * @param {Boolean} config.logErrors whether to log errors (default: false)
     * @param {Boolean} config.useSamples whether to really connect to the weather station using vproweather or to simulate the connection (default: false)
     */
    constructor(deviceUrl = "/dev/ttyUSB0", config) {
        this.config = {
            delay: 10,
            maxTries: 20,
            logErrors: false,
            useSamples: false,
            ...config,
        };
        this.deviceUrl = deviceUrl;
    }

    createDriverFunction(fn) {
        return async (...args) => {
            for (let i = 0; i < this.config.maxTries; i++) {
                try {
                    const result = await fn.apply(this, ...args);
                    return result;
                } catch (err) {
                    if (this.config.logErrors) console.error(err);
                }
            }
            return undefined;
        };
    }

    /**
     * Get highs and lows.
     */
    getHighsAndLows = this.createDriverFunction(async () => {
        let data;

        // get data from driver or from sample files (if developing on another computer)
        if (!this.config.useSamples) {
            data = (
                await exec(
                    `vproweather --delay=${this.config.delay} -l ${this.deviceUrl}`
                )
            ).stdout;
        } else {
            data = await fs.readFile(`${__dirname}/samples/getHighLow.txt`, {
                encoding: "utf8",
            });
        }
        // parse data
        data = parseData(data);

        // refractor data into a common api structure
        return Refractor.refractorHighsAndLows(data);
    });

    /**
     * Get realtime weather data.
     */
    getRealtimeData = this.createDriverFunction(async () => {
        let data;
        // get data from driver or from sample files (if developing on another computer)
        if (!this.config.useSamples) {
            data = (
                await exec(
                    `vproweather --delay=${this.config.delay} -x ${this.deviceUrl}`
                )
            ).stdout;
        } else {
            data = await fs.readFile(`${__dirname}/samples/getRealtime.txt`, {
                encoding: "utf8",
            });
        }

        // parse data to object
        data = parseData(data);

        // calculate wind chill manually if driver returns invalid value
        data = fixWindChill(data);

        // refractor data into a common api structure
        return Refractor.refractorRealtime(data);
    });

    /**
     * Get the weather station time.
     */
    getConsoleTime = this.createDriverFunction(async () => {
        let data;

        // get data from driver or from sample files (if developing on another computer)
        if (!this.config.useSamples) {
            data = (
                await exec(
                    `vproweather --delay=${this.config.delay} --get-time ${this.deviceUrl}`
                )
            ).stdout;
        } else {
            data = await fs.readFile(`${__dirname}/samples/getTime.txt`, {
                encoding: "utf8",
            });
        }
        // parse data
        data = parseData(data);

        return Refractor.refractorHighsAndLows(data);
    });

    /**
     * Set the weather station time to system time.
     */
    syncConsoleTime = this.createDriverFunction(async () => {
        if (this.config.useSamples) return;
        await exec(
            `vproweather --delay=${this.config.delay} --set-time ${this.deviceUrl}`
        );
        return true;
    });

    /**
     * Turn the console's backlite on/off.
     */
    setBackliteEnabled = this.createDriverFunction(async (enabled) => {
        if (this.config.useSamples) return;

        enabled = enabled ? "on" : "off";
        await exec(`vproweather --bklite-${enabled} ${this.deviceUrl}`);
        return true;
    });

    /**
     * Get the stations model name.
     */
    getStationModel = this.createDriverFunction(async () => {
        let data;
        // get data from driver or from sample files (if developing on another computer)
        if (!this.config.useSamples)
            await exec(
                `vproweather --delay=${this.config.delay} --model ${this.deviceUrl}`
            );
        else {
            data = await fs.readFile(`${__dirname}/samples/model.txt`, {
                encoding: "utf8",
            });
        }
        // parse data
        data = parseData(data, true);

        return Refractor.refractorModel(data);
    });
}

module.exports = VPInterface;
