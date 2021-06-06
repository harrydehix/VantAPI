const Unit = require("./Unit");

/**
 * Contains weather data including units.
 * @method applyUnits converts the weather data to match the desired units
 * @method toObject returns the plain weather data excluding units
 */
class VPData {
    constructor(data) {
        Object.assign(this, data);
        this.units = Unit.preset();
    }

    /**
     * Converts the weather data to match the desired units.
     * @param {Object} units object holding the desired units (also called 'unit preset')
     * @param {Object} data internal variable, don't change
     */
    applyUnits(units, data = this) {
        if (units.preset) units = Unit.preset(units.preset);
        else units = { ...this.units, ...units };

        const keys = Object.keys(data);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            let value = data[key];

            if (key === "units") continue;
            else if (value instanceof Array) {
                const unitType = value[0];
                let convertableValue = value[1];
                const currentUnit = this.units[unitType];
                const targetUnit = units[unitType];

                convertableValue = Unit.convert(
                    convertableValue,
                    currentUnit,
                    targetUnit
                );
                value[1] = convertableValue;
            } else if (value instanceof Object) {
                value = this.applyUnits(units, value);
            }
            data[key] = value;
        }
        if (data === this) this.units = units;
        else return data;
    }

    /**
     * Returns the plain weather data excluding the units.
     * @param {*} appendUnits whether to append the used unit preset
     * @param {*} data internal variable, don't use
     * @returns the plain weather data as object
     */
    toObject(appendUnits = false, data = this) {
        const obj = {};

        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = data[key];

            if (key === "units") continue;
            else if (value instanceof Array) obj[key] = value[1];
            else if (value instanceof Object)
                obj[key] = this.toObject(false, value);
            else obj[key] = value;
        }

        if (appendUnits) obj.units = this.units;
        return obj;
    }
}

module.exports = VPData;
