/**
 * Interface to all available units, their types, unit presets, and a conversion function.
 */
const Unit = {
    /**
     * Contains all available unit types.
     * A unit type is a string representing a group of units being convertible among themselves.
     */
    TYPE: {
        WIND: "wind",
        TEMPERATURE: "temp",
        PRESSURE: "pres",
        RAIN: "rain",
        SOLAR_RADIATION: "slra",
        SOIL_MOISTURE: "soil",
    },
    /**
     * Contains all available wind units.
     */
    WIND: {
        /**
         * wind unit, miles per hour
         */
        mph: "mp/h",
        /**
         * wind unit, kilometers per hour
         */
        kmh: "km/h",
        /**
         * wind unit, meters per second
         */
        ms: "m/s",
        /**
         * wind unit, knots
         */
        kt: "kt",
    },
    /**
     * Contains all available temperature units.
     */
    TEMPERATURE: {
        /**
         * temperature unit, fahrenheit
         */
        fahrenheit: "°F",
        /**
         * temperature unit, celsius
         */
        celsius: "°C",
    },
    /**
     * Contains all available pressure units.
     */
    PRESSURE: {
        /**
         * pressure unit, inches per mercury
         */
        inhg: "inHg",
        /**
         * pressure unit, hectopascal
         */
        hpa: "hPa",
        /**
         * pressure unit, bar
         */
        bar: "bar",
    },
    /**
     * Contains all available rain units.
     */
    RAIN: {
        /**
         * rain unit, cups
         */
        cups: "cups",
        /**
         * rain unit, millimeters
         */
        mm: "mm",
        /**
         * rain unit, inches
         */
        in: "in",
    },
    /**
     * Contains all available solar radiation units.
     */
    SOLAR_RADIATION: {
        /**
         * solar radiation unit, watt per m²
         */
        wm2: "W/m²",
    },
    /**
     * Contains all available soil moisture units.
     */
    SOIL_MOISTURE: {
        /**
         * soil moisture unit, cb
         */
        cb: "cb",
    },

    /**
     * Returns a unit preset. A unit presets assigns every available unit type a valid unit.
     * @param {String} presetName the name of the preset
     * @returns the desired unit preset
     */
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
                return {
                    preset: "us",
                    [Unit.TYPE.PRESSURE]: Unit.PRESSURE.inhg,
                    [Unit.TYPE.RAIN]: Unit.RAIN.in,
                    [Unit.TYPE.SOIL_MOISTURE]: Unit.SOIL_MOISTURE.cb,
                    [Unit.TYPE.SOLAR_RADIATION]: Unit.SOLAR_RADIATION.wm2,
                    [Unit.TYPE.TEMPERATURE]: Unit.TEMPERATURE.fahrenheit,
                    [Unit.TYPE.WIND]: Unit.WIND.mph,
                };
            case "default":
            default:
                return {
                    preset: "default",
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
     * Converts a value from one unit to another. The units must belong to the same type.
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
