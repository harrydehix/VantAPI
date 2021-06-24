const mongoose = require("mongoose");

const realtimeRecordSchema = new mongoose.Schema(
    {
        pressure: {
            current: {
                type: Number,
                default: null,
            },
            trend: { type: String, default: null },
            image: { type: String, default: null },
        },
        wind: {
            speed: {
                current: { type: Number, default: null },
                avg: {
                    short: { type: Number, default: null },
                    long: { type: Number, default: null },
                },
            },
            direction: {
                degrees: { type: Number, default: null },
                rose: { type: String, default: null },
            },
            gust: {
                speed: { type: Number, default: null },
                direction: {
                    degrees: { type: Number, default: null },
                    rose: { type: String, default: null },
                },
            },
            chill: { type: Number, default: null },
        },
        humidity: {
            outside: { type: Number, default: null },
            inside: { type: Number, default: null },
        },
        temperature: {
            outside: { type: Number, default: null },
            inside: { type: Number, default: null },
        },
        rain: {
            rate: { type: Number, default: null },
            isRaining: Boolean,
            quarter: { type: Number, default: null },
            hour: { type: Number, default: null },
            day: { type: Number, default: null },
            month: { type: Number, default: null },
            year: { type: Number, default: null },
        },
        storm: {
            rain: { type: Number, default: null },
            startDate: Date,
        },
        sun: {
            rise: { type: Date, default: null },
            set: { type: Date, default: null },
            uvLevel: { type: Number, default: null },
            solarRadiation: { type: Number, default: null },
            et: {
                day: { type: Number, default: null },
                month: { type: Number, default: null },
            },
        },
        forecast: {
            text: { type: String, default: null },
            icon: { type: Number, default: null },
            rule: { type: Number, default: null },
        },
        batteries: {
            consoleVoltageLevel: { type: Number, default: null },
            transmitterVoltageLevel: { type: Number, default: null },
        },
        thswIndex: { type: Number, default: null },
        time: { type: Date, required: true },
    },
    {
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
        id: false,
    }
);

module.exports = mongoose.model("Record", realtimeRecordSchema);
