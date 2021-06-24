const UnitError = require("./UnitError");

/**
 * Interface to all available units, their types, unit presets, and a conversion function.
 */
const Unit = {
    /**
     * Contains all available unit types.
     * A unit type is a string representing a group of units being convertible among themselves.
     */
    Type: {
        Wind: "wind",
        Temperature: "temp",
        Pressure: "pres",
        Rain: "rain",
        SolarRadiation: "slra",
        SoilMoisture: "soil",
    },
    /**
     * Contains all available wind units.
     */
    Wind: {
        /**
         * wind unit, miles per hour
         */
        mph: "mph",
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
    Temperature: {
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
    Pressure: {
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
    Rain: {
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
    SolarRadiation: {
        /**
         * solar radiation unit, watt per m²
         */
        wm2: "W/m²",
    },
    /**
     * Contains all available soil moisture units.
     */
    SoilMoisture: {
        /**
         * soil moisture unit, cb
         */
        cb: "cb",
    },

    toString(unitValue) {
        return `${unitValue[0]} ${unitValue[1]}`;
    },

    parse(unitString) {
        let number = "";
        let unit = "";
        let decimalDotAppended = false;
        let isParsingNumber = true;
        for (let i = 0; i < unitString.length; i++) {
            const char = unitString[i];
            if (char.match(/[0-9]/) && isParsingNumber) {
                number += char;
            } else if (char === ".") {
                if (decimalDotAppended)
                    throw new Error(
                        "Failed to parse string. Multiple dots are not valid."
                    );
                decimalDotAppended = true;
                number += char;
            } else {
                isParsingNumber = false;
                unit += char;
            }
        }
        unit = unit.trim();
        number = number.trim();
        if (Number.isNaN(number))
            throw new Error(
                "Failed to parse string. No valid number detected."
            );
        number = Number(number);
        if (!this.isUnit(unit))
            throw new Error("Failed to parse string. Invalid unit.");
        return [number, unit];
    },

    typeof(unit) {
        switch (unit) {
            case Unit.Pressure.bar:
            case Unit.Pressure.hpa:
            case Unit.Pressure.inhg:
                return Unit.Type.Pressure;
            case Unit.Rain.cups:
            case Unit.Rain.in:
            case Unit.Rain.mm:
                return Unit.Type.Rain;
            case Unit.SoilMoisture.cb:
                return Unit.Type.SoilMoisture;
            case Unit.SolarRadiation.wm2:
                return Unit.Type.SolarRadiation;
            case Unit.Temperature.celsius:
            case Unit.Temperature.fahrenheit:
                return Unit.Type.Temperature;
            case Unit.Wind.kmh:
            case Unit.Wind.kt:
            case Unit.Wind.mph:
            case Unit.Wind.ms:
                return Unit.Type.Wind;
            default:
                return false;
        }
    },

    isUnit(unit) {
        switch (unit) {
            case Unit.Pressure.bar:
            case Unit.Pressure.hpa:
            case Unit.Pressure.inhg:
            case Unit.Rain.cups:
            case Unit.Rain.in:
            case Unit.Rain.mm:
            case Unit.SoilMoisture.cb:
            case Unit.SolarRadiation.wm2:
            case Unit.Temperature.celsius:
            case Unit.Temperature.fahrenheit:
            case Unit.Wind.kmh:
            case Unit.Wind.kt:
            case Unit.Wind.mph:
            case Unit.Wind.ms:
                return true;
            default:
                return false;
        }
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
                    [Unit.Type.Pressure]: Unit.Pressure.hpa,
                    [Unit.Type.Rain]: Unit.Rain.mm,
                    [Unit.Type.SoilMoisture]: Unit.SoilMoisture.cb,
                    [Unit.Type.SolarRadiation]: Unit.SolarRadiation.wm2,
                    [Unit.Type.Temperature]: Unit.Temperature.celsius,
                    [Unit.Type.Wind]: Unit.Wind.kmh,
                };
            case "us":
                return {
                    preset: "us",
                    [Unit.Type.Pressure]: Unit.Pressure.inhg,
                    [Unit.Type.Rain]: Unit.Rain.in,
                    [Unit.Type.SoilMoisture]: Unit.SoilMoisture.cb,
                    [Unit.Type.SolarRadiation]: Unit.SolarRadiation.wm2,
                    [Unit.Type.Temperature]: Unit.Temperature.fahrenheit,
                    [Unit.Type.Wind]: Unit.Wind.mph,
                };
            case "default":
            default:
                return {
                    preset: "default",
                    [Unit.Type.Pressure]: Unit.Pressure.inhg,
                    [Unit.Type.Rain]: Unit.Rain.cups,
                    [Unit.Type.SoilMoisture]: Unit.SoilMoisture.cb,
                    [Unit.Type.SolarRadiation]: Unit.SolarRadiation.wm2,
                    [Unit.Type.Temperature]: Unit.Temperature.fahrenheit,
                    [Unit.Type.Wind]: Unit.Wind.mph,
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
            case Unit.Pressure.hpa:
                switch (targetUnit) {
                    case Unit.Pressure.inhg:
                        return value / 33.86389;
                    case Unit.Pressure.hpa:
                        return value;
                    case Unit.Pressure.bar:
                        return value / 1000;
                    default:
                        throw new UnitError(
                            `Cannot convert from ${currentUnit} to ${targetUnit}!`
                        );
                }
            case Unit.Pressure.inhg:
                switch (targetUnit) {
                    case Unit.Pressure.hpa:
                        return value * 33.86389;
                    case Unit.Pressure.inhg:
                        return value;
                    case Unit.Pressure.bar:
                        return value * 0.03386389;
                    default:
                        throw new UnitError(
                            `Cannot convert from ${currentUnit} to ${targetUnit}!`
                        );
                }
            case Unit.Pressure.bar:
                switch (targetUnit) {
                    case Unit.Pressure.hpa:
                        return value * 1000;
                    case Unit.Pressure.inhg:
                        return value / 0.03386389;
                    case Unit.Pressure.bar:
                        return value;
                    default:
                        throw new UnitError(
                            `Cannot convert from ${currentUnit} to ${targetUnit}!`
                        );
                }
            // TEMPERATURE CONVERSION
            case Unit.Temperature.fahrenheit:
                switch (targetUnit) {
                    case Unit.Temperature.fahrenheit:
                        return value;
                    case Unit.Temperature.celsius:
                        return (value - 32) * (5 / 9);
                    default:
                        throw new UnitError(
                            `Cannot convert from ${currentUnit} to ${targetUnit}!`
                        );
                }
            case Unit.Temperature.celsius:
                switch (targetUnit) {
                    case Unit.Temperature.fahrenheit:
                        return value * 1.8 + 32;
                    case Unit.Temperature.celsius:
                        return value;
                    default:
                        throw new UnitError(
                            `Cannot convert from ${currentUnit} to ${targetUnit}!`
                        );
                }
            // WIND CONVERSION
            case Unit.Wind.kmh:
                switch (targetUnit) {
                    case Unit.Wind.kmh:
                        return value;
                    case Unit.Wind.kt:
                        return value * 0.53996;
                    case Unit.Wind.mph:
                        return value / 1.609344;
                    case Unit.Wind.ms:
                        return value / 3.6;
                    default:
                        throw new UnitError(
                            `Cannot convert from ${currentUnit} to ${targetUnit}!`
                        );
                }
            case Unit.Wind.kt:
                switch (targetUnit) {
                    case Unit.Wind.kmh:
                        return value / 0.53996;
                    case Unit.Wind.kt:
                        return value;
                    case Unit.Wind.mph:
                        return value * 1.15078;
                    case Unit.Wind.ms:
                        return value * 0.514444444444;
                    default:
                        throw new UnitError(
                            `Cannot convert from ${currentUnit} to ${targetUnit}!`
                        );
                }
            case Unit.Wind.mph:
                switch (targetUnit) {
                    case Unit.Wind.kmh:
                        return value * 1.609344;
                    case Unit.Wind.kt:
                        return value / 1.15078;
                    case Unit.Wind.mph:
                        return value;
                    case Unit.Wind.ms:
                        return value * 0.44704;
                    default:
                        throw new UnitError(
                            `Cannot convert from ${currentUnit} to ${targetUnit}!`
                        );
                }
            case Unit.Wind.ms:
                switch (targetUnit) {
                    case Unit.Wind.kmh:
                        return value * 3.6;
                    case Unit.Wind.kt:
                        return value / 0.514444444444;
                    case Unit.Wind.mph:
                        return value / 0.44704;
                    case Unit.Wind.ms:
                        return value;
                    default:
                        throw new UnitError(
                            `Cannot convert from ${currentUnit} to ${targetUnit}!`
                        );
                }
            // RAIN CONVERSION
            case Unit.Rain.cups:
                switch (targetUnit) {
                    case Unit.Rain.cups:
                        return value;
                    case Unit.Rain.mm:
                        return value * 0.2;
                    case Unit.Rain.in:
                        return value / 127;
                    default:
                        throw new UnitError(
                            `Cannot convert from ${currentUnit} to ${targetUnit}!`
                        );
                }
            case Unit.Rain.mm:
                switch (targetUnit) {
                    case Unit.Rain.cups:
                        return value / 0.2;
                    case Unit.Rain.mm:
                        return value;
                    case Unit.Rain.in:
                        return value / 25.4;
                    default:
                        throw new UnitError(
                            `Cannot convert from ${currentUnit} to ${targetUnit}!`
                        );
                }
            case Unit.Rain.in:
                switch (targetUnit) {
                    case Unit.Rain.cups:
                        return value * 127;
                    case Unit.Rain.mm:
                        return value * 25.4;
                    case Unit.Rain.in:
                        return value;
                    default:
                        throw new UnitError(
                            `Cannot convert from ${currentUnit} to ${targetUnit}!`
                        );
                }
            // SOIL MOISTURE CONVERSION
            case Unit.SoilMoisture.cb:
                switch (targetUnit) {
                    case Unit.SoilMoisture.cb:
                        return value;
                    default:
                        throw new UnitError(
                            `Cannot convert from ${currentUnit} to ${targetUnit}!`
                        );
                }
            // SOLAR RADIATION CONVERSION
            case Unit.SolarRadiation.wm2:
                switch (targetUnit) {
                    case Unit.SolarRadiation.wm2:
                        return value;
                    default:
                        throw new UnitError(
                            `Cannot convert from ${currentUnit} to ${targetUnit}!`
                        );
                }
            default:
                throw new UnitError(
                    `Cannot convert from ${currentUnit} to ${targetUnit}!`
                );
        }
    },
};
Object.freeze(Unit);
module.exports = Unit;
