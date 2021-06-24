const Unit = require("./Unit");
const UnitError = require("./UnitError");
const inspect = require("../utils/inspect");

function addUnitTypes(units) {
    const keys = Object.keys(units);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        let value = units[key];

        if (value instanceof Object) {
            value = addUnitTypes(value);
        } else {
            const type = Unit.typeof(value);
            if (!type) throw new Error(`Invalid unit detected (${value})!`);
            value = [type, value];
        }
        units[key] = value;
    }
    return units;
}

function parseMixedData(mixedData) {
    const data = {};
    const units = {};

    const keys = Object.keys(mixedData);
    let unitDetected = false;
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = mixedData[key];

        if (value instanceof Array) {
            const plainValue = value[0];
            const unit = value[1];
            if (!Unit.isUnit(unit)) continue;
            data[key] = plainValue;
            units[key] = [Unit.typeof(unit), unit];
            unitDetected = true;
        } else if (value instanceof Object && !(value instanceof Date)) {
            const parsedMixedNestedData = parseMixedData(value);
            if (parsedMixedNestedData.units) {
                unitDetected = true;
                units[key] = parsedMixedNestedData.units;
            }
            data[key] = parsedMixedNestedData.data;
        } else {
            data[key] = value;
        }
    }
    return {
        data: data,
        units: unitDetected ? units : undefined,
    };
}

function getRealtimeStructure() {
    return {
        pressure: {
            current: Unit.Pressure.inhg,
        },
        wind: {
            speed: {
                current: Unit.Wind.mph,
                avg: {
                    short: Unit.Wind.mph,
                    long: Unit.Wind.mph,
                },
            },
            gust: {
                speed: Unit.Wind.mph,
            },
            chill: Unit.Temperature.fahrenheit,
        },
        temperature: {
            outside: Unit.Temperature.fahrenheit,
            inside: Unit.Temperature.fahrenheit,
        },
        rain: {
            rate: Unit.Rain.cups,
            quarter: Unit.Rain.cups,
            hour: Unit.Rain.cups,
            day: Unit.Rain.cups,
            month: Unit.Rain.cups,
            year: Unit.Rain.cups,
        },
        storm: {
            rain: Unit.Rain.cups,
        },
        sun: {
            solarRadiation: Unit.SolarRadiation.wm2,
        },
    };
}

function getHighsAndLowsStructure() {
    return {
        pressure: {
            day: {
                low: {
                    value: Unit.Pressure.inhg,
                },
                high: {
                    value: Unit.Pressure.inhg,
                },
            },
            month: {
                low: Unit.Pressure.inhg,
                high: Unit.Pressure.inhg,
            },
            year: {
                low: Unit.Pressure.inhg,
                high: Unit.Pressure.inhg,
            },
        },
        wind: {
            day: {
                value: Unit.Wind.mph,
            },
            month: Unit.Wind.mph,
            year: Unit.Wind.mph,
        },
        windChill: {
            day: {
                value: Unit.Temperature.fahrenheit,
            },
            month: Unit.Temperature.fahrenheit,
            year: Unit.Temperature.fahrenheit,
        },
        dewpoint: {
            day: {
                low: {
                    value: Unit.Temperature.fahrenheit,
                },
                high: {
                    value: Unit.Temperature.fahrenheit,
                },
            },
            month: {
                low: Unit.Temperature.fahrenheit,
                high: Unit.Temperature.fahrenheit,
            },
            year: {
                low: Unit.Temperature.fahrenheit,
                high: Unit.Temperature.fahrenheit,
            },
        },
        solarRadiation: {
            day: {
                value: Unit.SolarRadiation.wm2,
            },
            month: Unit.SolarRadiation.wm2,
            year: Unit.SolarRadiation.wm2,
        },
        rainRate: {
            day: {
                value: Unit.Rain.cups,
            },
            month: Unit.Rain.cups,
            year: Unit.Rain.cups,
        },
        temperature: {
            inside: {
                day: {
                    low: {
                        value: Unit.Temperature.fahrenheit,
                    },
                    high: {
                        value: Unit.Temperature.fahrenheit,
                    },
                },
                month: {
                    low: Unit.Temperature.fahrenheit,
                    high: Unit.Temperature.fahrenheit,
                },
                year: {
                    low: Unit.Temperature.fahrenheit,
                    high: Unit.Temperature.fahrenheit,
                },
            },
            outside: {
                day: {
                    low: {
                        value: Unit.Temperature.fahrenheit,
                    },
                    high: {
                        value: Unit.Temperature.fahrenheit,
                    },
                },
                month: {
                    low: Unit.Temperature.fahrenheit,
                    high: Unit.Temperature.fahrenheit,
                },
                year: {
                    low: Unit.Temperature.fahrenheit,
                    high: Unit.Temperature.fahrenheit,
                },
            },
        },
    };
}

/**
 * An instance of this class contains unit flexible weather data.
 * @method _applyUnits_ converts the weather data to match the desired units
 * @property _this.data_ contains the plain weather data
 * @property _this.units_ contains the plain unit data
 */
class UnitFlexibleData {
    constructor(data, units) {
        if (!units) {
            const parsedMixedData = parseMixedData(data);
            this.data = parsedMixedData.data;
            this.units = parsedMixedData.units || {};
        } else {
            this.data = data;
            this.units = addUnitTypes(units);
        }
    }

    static createRealtime(data) {
        return new UnitFlexibleData(data, getRealtimeStructure());
    }

    static createHighsAndLows(data) {
        return new UnitFlexibleData(data, getHighsAndLowsStructure());
    }

    /**
     * Converts the weather data to match the desired units.
     * @param {Object} units object holding the desired units
     * @param {String} units.preset string to select a unit preset instead of creating a custom one
     */
    applyUnits(units) {
        const data = arguments[1] || this.data;
        const meta = arguments[2] || this.units;
        if (units.preset) units = Unit.preset(units.preset);

        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            let value = data[key];
            let metaValue = meta[key];

            if (metaValue) {
                if (metaValue instanceof Array) {
                    const unitType = metaValue[0];
                    const currentUnit = metaValue[1];
                    const targetUnit = units[unitType];
                    if (!targetUnit) continue;

                    value = Unit.convert(value, currentUnit, targetUnit);
                    metaValue[1] = targetUnit;
                } else if (metaValue instanceof Object) {
                    const obj = this.applyUnits(units, value, metaValue);
                    value = obj.data;
                    metaValue = obj.meta;
                }
                meta[key] = metaValue;
                data[key] = value;
            }
        }
        return {
            data: data,
            meta: meta,
        };
    }
}

module.exports = UnitFlexibleData;

const test = new UnitFlexibleData({
    temperature: [12, Unit.Temperature.celsius],
    memo: {
        a: 24,
        b: 12,
    },
    wind: {
        speed: [1, Unit.Wind.kmh],
        gustSpeed: [3, Unit.Wind.kmh],
    },
});
inspect(test);
test.applyUnits({ [Unit.Type.Temperature]: Unit.Temperature.fahrenheit });
inspect(test);
