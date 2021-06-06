const exec = require("await-exec");
const fs = require("fs/promises");
const parseData = require("./parseData");
const createHandler = require("./createHandler");
const refractorData = require("./refractorData");
const VPData = require("./VPData");

const fixWindChill = (data) => {
    if (data.rtWindChill < 0) {
        data.rtWindChill =
            35.74 +
            0.6215 * data.rtOutsideTemp +
            (0.4275 * data.rtOutsideTemp - 35.75) *
                Math.pow(data.rtWind10mGustMaxSpeed, 0.16);
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
     * @param {Object} config interface/driver settings
     * @param {Number} config.delay time to wait for the answer of the weather station in 1/10s (default: 10)
     * @param {Number} config.maxTries maximum amount of request retries on connection error (default: 20)
     * @param {Boolean} config.logErrors whether to log errors (default: false)
     * @param {Boolean} config.pretty whether to use vproweather's original data structure or a prettier refractored one (default: true)
     * @param {Boolean} config.useSamples whether to really connect to the weather station using vproweather or to simulate the connection (default: false)
     * @param {Number} config.cupSize the weather stations cup size in mm (default: 0.2)
     */
    constructor(deviceUrl = "/dev/ttyUSB0", config) {
        this.config = Object.assign(
            {
                delay: 10,
                maxTries: 20,
                logErrors: false,
                useSamples: false,
            },
            config
        );
        this.deviceUrl = deviceUrl;
    }

    /**
     * Get realtime weather data.
     */
    getRealtimeData = createHandler.apply(this, [
        async () => {
            let data;
            // get data from driver or from sample files (if developing on another computer)
            if (!this.config.useSamples) {
                data = (
                    await exec(
                        `vproweather --delay=${this.config.delay} -x ${this.deviceUrl}`
                    )
                ).stdout;
            } else {
                data = await fs.readFile(
                    `${__dirname}/samples/getRealtime.txt`,
                    {
                        encoding: "utf8",
                    }
                );
            }

            // parse data to object
            data = parseData(data);

            // calculate wind chill manually if driver returns invalid value
            data = fixWindChill(data);

            // refractor data into a common api structure
            data = refractorData(data, "realtime");

            return new VPData(data);
        },
    ]);

    /**
     * Get highs and lows.
     */
    getHighsAndLows = createHandler.apply(this, [
        async () => {
            let data;

            // get data from driver or from sample files (if developing on another computer)
            if (!this.config.useSamples) {
                data = (
                    await exec(
                        `vproweather --delay=${this.config.delay} -l ${this.deviceUrl}`
                    )
                ).stdout;
            } else {
                data = await fs.readFile(
                    `${__dirname}/samples/getHighLow.txt`,
                    {
                        encoding: "utf8",
                    }
                );
            }
            // parse data
            data = parseData(data);

            // refractor data into a common api structure
            data = refractorData(data, "highlow");

            return new VPData(data);
        },
    ]);

    /**
     * Get the weather station time.
     */
    getConsoleTime = createHandler.apply(this, [
        async () => {
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

            return refractorData(data, "time");
        },
    ]);

    /**
     * Set the weather station time to system time.
     */
    syncConsoleTime = createHandler.apply(this, [
        async () => {
            if (this.config.useSamples) return;
            await exec(
                `vproweather --delay=${this.config.delay} --set-time ${this.deviceUrl}`
            );
            return true;
        },
    ]);

    /**
     * Turn the console's backlite off.
     */
    turnBackliteOff = createHandler.apply(this, [
        async () => {
            if (this.config.useSamples) return;
            await exec(`vproweather --bklite-off ${this.deviceUrl}`);
            return true;
        },
    ]);

    /**
     * Turn the console's backlite on.
     */
    turnBackliteOn = createHandler.apply(this, [
        async () => {
            if (this.config.useSamples) return;
            await exec(`vproweather --bklite-on ${this.deviceUrl}`);
            return true;
        },
    ]);

    /**
     * Get the stations model name.
     */
    getStationModel = createHandler.apply(this, [
        async () => {
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

            return refractorData(data, "model");
        },
    ]);
}

module.exports = VPInterface;
