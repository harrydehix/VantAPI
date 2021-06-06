const Unit = require("./Unit");

class VPData {
    constructor(data) {
        Object.assign(this, data);
        this.units = Unit.preset();
    }

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

// example
// const data = new VPData({
//     temperature: [Unit.TYPE.TEMPERATURE, 23.4],
//     pressure: {
//         current: [Unit.TYPE.PRESSURE, 21.2],
//     },
// });

// data.applyUnits({
//     [Unit.TYPE.PRESSURE]: Unit.PRESSURE.hpa,
//     [Unit.TYPE.TEMPERATURE]: Unit.TEMPERATURE.celsius,
// });

// console.log(data);

// data.applyUnits({
//     [Unit.TYPE.PRESSURE]: Unit.PRESSURE.inhg,
//     [Unit.TYPE.TEMPERATURE]: Unit.TEMPERATURE.fahrenheit,
// });

// console.log(data);
