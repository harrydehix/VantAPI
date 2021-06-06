const Unit = require("./Unit");

module.exports = function (data, type) {
    if (type === "model") {
        return { model: data.Model };
    }
    if (type === "time") {
        return { time: data.DavisTime };
    }
    if (type === "realtime") {
        return {
            nextArchiveRecord: data.rtNextArchiveRecord,
            pressure: {
                current: [Unit.TYPE.PRESSURE, data.rtBaroCurr],
                trend: data.rtBaroTrend,
                image: data.rtBaroTrendImg,
            },
            wind: {
                speed: {
                    current: [Unit.TYPE.WIND, data.rtWindSpeed],
                    avg: {
                        short: [Unit.TYPE.WIND, data.rtWindAvgSpeed],
                        long: [Unit.TYPE.WIND, data.rtWind2mAvgSpeed],
                    },
                },
                direction: {
                    degrees: data.rtWindDir,
                    rose: data.rtWindDirRose,
                },
                gust: {
                    speed: [Unit.TYPE.WIND, data.rtWind10mGustMaxSpeed],
                    direction: {
                        degrees: data.rtWind10mGustMaxDir,
                        rose: data.rtWind10mGustMaxDirRose,
                    },
                },
                chill: [Unit.TYPE.TEMPERATURE, data.rtWindChill],
            },
            humidity: {
                outside: data.rtOutsideHum,
                inside: data.rtInsideHum,
            },
            temperature: {
                outside: [Unit.TYPE.TEMPERATURE, data.rtOutsideTemp],
                inside: [Unit.TYPE.TEMPERATURE, data.rtInsideTemp],
            },
            rain: {
                rate: [Unit.TYPE.RAIN, data.rtRainRate],
                isRaining: data.rtIsRaining,
                quarter: [Unit.TYPE.RAIN, data.rt15mRain],
                hour: [Unit.TYPE.RAIN, data.rtHourRain],
                day: [Unit.TYPE.RAIN, data.rtDayRain],
                month: [Unit.TYPE.RAIN, data.rtMonthRain],
                year: [Unit.TYPE.RAIN, data.rtYearRain],
            },
            storm: {
                rain: [Unit.TYPE.RAIN, data.rtRainStorm],
                startDate: data.rtStormStartDate,
            },
            sun: {
                rise: data.rtSunrise,
                set: data.rtSunset,
                uvLevel: data.rtUVLevel,
                solarRadiation: [Unit.TYPE.SOLAR_RADIATION, data.rtSolarRad],
                et: {
                    day: data.rtDayET,
                    month: data.rtMonthET,
                },
            },
            forecast: {
                text: data.rtForecast,
                icon: data.rtForeIcon,
                rule: data.rtForeRule,
            },
            batteries: {
                consoleVoltageLevel: data.rtBattVoltage,
                transmitterVoltageLevel: data.rtXmitBattt,
            },
            thswIndex: data.rtSolarRad === "n/a" ? data.rtThswIndex : null,
        };
    }
    if (type === "highlow") {
        return {
            pressure: {
                day: {
                    low: {
                        value: [Unit.TYPE.PRESSURE, data.hlBaroLoDay],
                        time: data.hlBaroLoTime,
                    },
                    high: {
                        value: [Unit.TYPE.PRESSURE, data.hlBaroHiDay],
                        time: data.hlBaroHiTime,
                    },
                },
                month: {
                    low: [Unit.TYPE.PRESSURE, data.hlBaroLoMonth],
                    high: [Unit.TYPE.PRESSURE, data.hlBaroHiMonth],
                },
                year: {
                    low: [Unit.TYPE.PRESSURE, data.hlBaroLoYear],
                    high: [Unit.TYPE.PRESSURE, data.hlBaroHiYear],
                },
            },
            wind: {
                day: {
                    value: [Unit.TYPE.WIND, data.hlWindHiDay],
                    time: data.hlWindHiTime,
                },
                month: [Unit.TYPE.WIND, data.hlWindHiMonth],
                year: [Unit.TYPE.WIND, data.hlWindHiYear],
            },
            windChill: {
                day: {
                    value: [Unit.TYPE.TEMPERATURE, data.hlChillLoDay],
                    time: data.hlChillLoTime,
                },
                month: [Unit.TYPE.TEMPERATURE, data.hlChillLoMonth],
                year: [Unit.TYPE.TEMPERATURE, data.hlChillLoYear],
            },
            dewpoint: {
                day: {
                    low: {
                        value: [Unit.TYPE.TEMPERATURE, data.hlDewLoDay],
                        time: data.hlDewLoTime,
                    },
                    high: {
                        value: [Unit.TYPE.TEMPERATURE, data.hlDewHiDay],
                        time: data.hlDewHiTime,
                    },
                },
                month: {
                    low: [Unit.TYPE.TEMPERATURE, data.hlDewLoMonth],
                    high: [Unit.TYPE.TEMPERATURE, data.hlDewHiMonth],
                },
                year: {
                    low: [Unit.TYPE.TEMPERATURE, data.hlDewLoYear],
                    high: [Unit.TYPE.TEMPERATURE, data.hlDewHiYear],
                },
            },
            heatIndex: {
                day: {
                    value: data.hlHeatHiDay,
                    time: data.hlHeatHiTime,
                },
                month: data.hlHeatHiMonth,
                year: data.hlHeatHiYear,
            },
            solarRadiation: {
                day: {
                    value: [Unit.TYPE.SOLAR_RADIATION, data.hlSolarHiDay],
                    time: data.hlSolarHiTime,
                },
                month: [Unit.TYPE.SOLAR_RADIATION, data.hlSolarHiMonth],
                year: [Unit.TYPE.SOLAR_RADIATION, data.hlSolarHiYear],
            },
            uvLevel: {
                day: {
                    value: data.hlUVHiDay,
                    time: data.hlUVHiTime,
                },
                month: data.hlUVHiMonth,
                year: data.hlUVHiYear,
            },
            rainRate: {
                day: {
                    value: [Unit.TYPE.RAIN, data.hlRainRateHiDay],
                    time: data.hlRainRateHiTime,
                },
                month: [Unit.TYPE.RAIN, data.hlRainRateHiMonth],
                year: [Unit.TYPE.RAIN, data.hlRainRateHiYear],
            },
            temperature: {
                inside: {
                    day: {
                        low: {
                            value: [Unit.TYPE.TEMPERATURE, data.hlInTempLoDay],
                            time: data.hlInTempLoTime,
                        },
                        high: {
                            value: [Unit.TYPE.TEMPERATURE, data.hlInTempHiDay],
                            time: data.hlInTempHiTime,
                        },
                    },
                    month: {
                        low: [Unit.TYPE.TEMPERATURE, data.hlInTempLoMonth],
                        high: [Unit.TYPE.TEMPERATURE, data.hlInTempHiMonth],
                    },
                    year: {
                        low: [Unit.TYPE.TEMPERATURE, data.hlInTempLoYear],
                        high: [Unit.TYPE.TEMPERATURE, data.hlInTempHiYear],
                    },
                },
                outside: {
                    day: {
                        low: {
                            value: [Unit.TYPE.TEMPERATURE, data.hlOutTempLoDay],
                            time: data.hlOutTempLoTime,
                        },
                        high: {
                            value: [Unit.TYPE.TEMPERATURE, data.hlOutTempHiDay],
                            time: data.hlOutTempHiTime,
                        },
                    },
                    month: {
                        low: [Unit.TYPE.TEMPERATURE, data.hlOutTempLoMonth],
                        high: [Unit.TYPE.TEMPERATURE, data.hlOutTempHiMonth],
                    },
                    year: {
                        low: [Unit.TYPE.TEMPERATURE, data.hlOutTempLoYear],
                        high: [Unit.TYPE.TEMPERATURE, data.hlOutTempHiYear],
                    },
                },
            },
            humidity: {
                inside: {
                    day: {
                        low: {
                            value: data.hlInHumLoDay,
                            time: data.hlInHumLoTime,
                        },
                        high: {
                            value: data.hlInHumHiDay,
                            time: data.hlInHumHiTime,
                        },
                    },
                    month: {
                        low: data.hlInHumLoMonth,
                        high: data.hlInHumHiMonth,
                    },
                    year: {
                        low: data.hlInHumLoYear,
                        high: data.hlInHumHiYear,
                    },
                },
            },
        };
    }
};
