/**
 * Interface to all available units, their types and a conversion function.
 */
const Unit = {
    TYPE: {
        WIND: "wind",
        TEMPERATURE: "temp",
        PRESSURE: "pres",
        RAIN: "rain",
        SOLAR_RADIATION: "slra",
        SOIL_MOISTURE: "soil",
    },
    WIND: {
        mph: "mp/h",
        kmh: "km/h",
        ms: "m/s",
        kt: "kt",
    },
    TEMPERATURE: {
        fahrenheit: "°F",
        celsius: "°C",
    },
    PRESSURE: {
        inhg: "inHg",
        hpa: "hPa",
        bar: "bar",
    },
    RAIN: {
        cups: "cups",
        mm: "mm",
        in: "in",
    },
    SOLAR_RADIATION: {
        wm2: "W/m²",
    },
    SOIL_MOISTURE: {
        cb: "cb",
    },

    preset(presetName) {
        switch (presetName) {
            case "eu":
                return {
                    preset: "eu",
                    [Unit.TYPE.PRESSURE]: Unit.PRESSURE.hpa,
                    [Unit.TYPE.RAIN]: Unit.RAIN.mm,
                    [Unit.TYPE.SOIL_MOISTURE]: Unit.SOIL_MOISTURE.cb,
                    [Unit.TYPE.SOLAR_RADIATION]: Unit.SOLAR_RADIATION.wm2,
                    [Unit.TYPE.TEMPERATURE]: Unit.TEMPERATURE.celsius,
                    [Unit.TYPE.WIND]: Unit.WIND.kmh,
                };
            case "us":
            default:
                return {
                    preset: "us",
                    [Unit.TYPE.PRESSURE]: Unit.PRESSURE.inhg,
                    [Unit.TYPE.RAIN]: Unit.RAIN.cups,
                    [Unit.TYPE.SOIL_MOISTURE]: Unit.SOIL_MOISTURE.cb,
                    [Unit.TYPE.SOLAR_RADIATION]: Unit.SOLAR_RADIATION.wm2,
                    [Unit.TYPE.TEMPERATURE]: Unit.TEMPERATURE.fahrenheit,
                    [Unit.TYPE.WIND]: Unit.WIND.mph,
                };
        }
    },

    /**
     * Converts a value from one unit to another.
     * @param {Number} value the value to convert
     * @param {String} currentUnit the value's current unit
     * @param {String} targetUnit the value's target unit
     * @returns the converted value
     */
    convert(value, currentUnit, targetUnit) {
        //console.log(`From ${currentUnit} to ${targetUnit} (${value})`);
        switch (currentUnit) {
            // PRESSURE CONVERSION
            case Unit.PRESSURE.hpa:
                switch (targetUnit) {
                    case Unit.PRESSURE.inhg:
                        return value / 33.86389;
                    case Unit.PRESSURE.hpa:
                        return value;
                    case Unit.PRESSURE.bar:
                        return value / 1000;
                    default:
                        throw new Error(
                            `Cannot convert from ${currentUnit} to ${targetUnit}!`
                        );
                }
            case Unit.PRESSURE.inhg:
                switch (targetUnit) {
                    case Unit.PRESSURE.hpa:
                        return value * 33.86389;
                    case Unit.PRESSURE.inhg:
                        return value;
                    case Unit.PRESSURE.bar:
                        return value * 0.03386389;
                    default:
                        throw new Error(
                            `Cannot convert from ${currentUnit} to ${targetUnit}!`
                        );
                }
            case Unit.PRESSURE.bar:
                switch (targetUnit) {
                    case Unit.PRESSURE.hpa:
                        return value * 1000;
                    case Unit.PRESSURE.inhg:
                        return value / 0.03386389;
                    case Unit.PRESSURE.bar:
                        return value;
                    default:
                        throw new Error(
                            `Cannot convert from ${currentUnit} to ${targetUnit}!`
                        );
                }
            // TEMPERATURE CONVERSION
            case Unit.TEMPERATURE.fahrenheit:
                switch (targetUnit) {
                    case Unit.TEMPERATURE.fahrenheit:
                        return value;
                    case Unit.TEMPERATURE.celsius:
                        return (value - 32) * (5 / 9);
                    default:
                        throw new Error(
                            `Cannot convert from ${currentUnit} to ${targetUnit}!`
                        );
                }
            case Unit.TEMPERATURE.celsius:
                switch (targetUnit) {
                    case Unit.TEMPERATURE.fahrenheit:
                        return value * 1.8 + 32;
                    case Unit.TEMPERATURE.celsius:
                        return value;
                    default:
                        throw new Error(
                            `Cannot convert from ${currentUnit} to ${targetUnit}!`
                        );
                }
            // WIND CONVERSION
            case Unit.WIND.kmh:
                switch (targetUnit) {
                    case Unit.WIND.kmh:
                        return value;
                    case Unit.WIND.kt:
                        return value * 0.53996;
                    case Unit.WIND.mph:
                        return value / 1.609344;
                    case Unit.WIND.ms:
                        return value / 3.6;
                    default:
                        throw new Error(
                            `Cannot convert from ${currentUnit} to ${targetUnit}!`
                        );
                }
            case Unit.WIND.kt:
                switch (targetUnit) {
                    case Unit.WIND.kmh:
                        return value / 0.53996;
                    case Unit.WIND.kt:
                        return value;
                    case Unit.WIND.mph:
                        return value * 1.15078;
                    case Unit.WIND.ms:
                        return value * 0.514444444444;
                    default:
                        throw new Error(
                            `Cannot convert from ${currentUnit} to ${targetUnit}!`
                        );
                }
            case Unit.WIND.mph:
                switch (targetUnit) {
                    case Unit.WIND.kmh:
                        return value * 1.609344;
                    case Unit.WIND.kt:
                        return value / 1.15078;
                    case Unit.WIND.mph:
                        return value;
                    case Unit.WIND.ms:
                        return value * 0.44704;
                    default:
                        throw new Error(
                            `Cannot convert from ${currentUnit} to ${targetUnit}!`
                        );
                }
            case Unit.WIND.ms:
                switch (targetUnit) {
                    case Unit.WIND.kmh:
                        return value * 3.6;
                    case Unit.WIND.kt:
                        return value / 0.514444444444;
                    case Unit.WIND.mph:
                        return value / 0.44704;
                    case Unit.WIND.ms:
                        return value;
                    default:
                        throw new Error(
                            `Cannot convert from ${currentUnit} to ${targetUnit}!`
                        );
                }
            // RAIN CONVERSION
            case Unit.RAIN.cups:
                switch (targetUnit) {
                    case Unit.RAIN.cups:
                        return value;
                    case Unit.RAIN.mm:
                        return value * 0.2;
                    case Unit.RAIN.in:
                        return value / 127;
                    default:
                        throw new Error(
                            `Cannot convert from ${currentUnit} to ${targetUnit}!`
                        );
                }
            case Unit.RAIN.mm:
                switch (targetUnit) {
                    case Unit.RAIN.cups:
                        return value / 0.2;
                    case Unit.RAIN.mm:
                        return value;
                    case Unit.RAIN.in:
                        return value / 25.4;
                    default:
                        throw new Error(
                            `Cannot convert from ${currentUnit} to ${targetUnit}!`
                        );
                }
            case Unit.RAIN.in:
                switch (targetUnit) {
                    case Unit.RAIN.cups:
                        return value * 127;
                    case Unit.RAIN.mm:
                        return value * 25.4;
                    case Unit.RAIN.in:
                        return value;
                    default:
                        throw new Error(
                            `Cannot convert from ${currentUnit} to ${targetUnit}!`
                        );
                }
            // SOIL MOISTURE CONVERSION
            case Unit.SOIL_MOISTURE.cb:
                switch (targetUnit) {
                    case Unit.SOIL_MOISTURE.cb:
                        return value;
                    default:
                        throw new Error(
                            `Cannot convert from ${currentUnit} to ${targetUnit}!`
                        );
                }
            // SOLAR RADIATION CONVERSION
            case Unit.SOLAR_RADIATION.wm2:
                switch (targetUnit) {
                    case Unit.SOLAR_RADIATION.wm2:
                        return value;
                    default:
                        throw new Error(
                            `Cannot convert from ${currentUnit} to ${targetUnit}!`
                        );
                }
            default:
                throw new Error(
                    `Cannot convert from ${currentUnit} to ${targetUnit}!`
                );
        }
    },
};
Object.freeze(Unit);
module.exports = Unit;
