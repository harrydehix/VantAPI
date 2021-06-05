const exec = require("await-exec");
const fs = require("fs/promises");
const parseData = require("./parseData");
const makePrettier = require("./makePrettier");
const createHandler = require("./createHandler");

/**
 * Basic interface to a vantage pro that is connected serially. The vproweather driver must be installed and globally adressable.
 */
class VPInterface {
    /**
     * @param {*} deviceUrl the url to the serial device
     * @param {*} config interface/driver settings
     */
    constructor(deviceUrl = "/dev/ttyUSB0", config) {
        this.config = Object.assign(
            {
                delay: 10,
                maxTries: 20,
                logErrors: false,
                pretty: true,
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
                        `vproweather --delay=${this.config.delay} --get-realtime ${this.deviceUrl}`
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

            // restructure object
            if (this.config.pretty) return makePrettier("realtime", data);
            return data;
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
                        `vproweather --delay=${this.config.delay} --get-highlow ${this.deviceUrl}`
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

            // restructure object
            if (this.config.pretty) return makePrettier("highlow", data);
            return data;
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

            // restructure object
            if (this.config.pretty) return makePrettier("time", data);
            return data;
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

            // restructure data
            if (this.config.pretty) return makePrettier("model", data);
            return data;
        },
    ]);
}

module.exports = VPInterface;
