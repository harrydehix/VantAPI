module.exports = function (type, data) {
    if (type === "model") {
        return { model: data.Model };
    }
    if (type === "time") {
        return { time: data.DavisTime };
    }
    if (type === "realtime") {
        return {
            nextArchiveRecord: data.rtNextArchiveRecord,
            pessure: {
                current: data.rtBaroCurr,
                trend: data.rtBaroTrend,
                image: data.rtBaroTrendImg,
            },
            wind: {
                speed: {
                    current: data.rtWindSpeed,
                    avg: {
                        short: data.rtWindAvgSpeed,
                        long: data.rtWind2mAvgSpeed,
                    },
                },
                direction: {
                    degrees: data.rtWindDir,
                    rose: data.rtWindDirRose,
                },
                gust: {
                    speed: data.rtWind10mGustMaxSpeed,
                    direction: {
                        degrees: data.rtWind10mGustMaxDir,
                        rose: data.rtWind10mGustMaxDirRose,
                    },
                },
                chill: data.rtWindChill,
            },
            humidity: {
                outside: data.rtOutsideHum,
                inside: data.rtInsideHum,
            },
            temperature: {
                outside: data.rtOutsideTemp,
                inside: data.rtInsideTemp,
            },
            rain: {
                rate: data.rtRainRate,
                isRaining: data.rtIsRaining,
                quarter: data.rt15mRain,
                hour: data.rtHourRain,
                day: data.rtDayRain,
                month: data.rtMonthRain,
                year: data.rtYearRain,
            },
            storm: {
                rain: data.rtRainStorm,
                startDate: data.rtStormStartDate,
            },
            sun: {
                rise: data.rtSunrise,
                set: data.rtSunset,
                uvLevel: data.rtUVLevel,
                solarRadiation: data.rtSolarRad,
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
        };
    }
    if (type === "highlow") {
        return {
            pressure: {
                day: {
                    low: {
                        value: data.hlBaroLoDay,
                        time: data.hlBaroLoTime,
                    },
                    high: {
                        value: data.hlBaroHiDay,
                        time: data.hlBaroHiTime,
                    },
                },
                month: {
                    low: data.hlBaroLoMonth,
                    high: data.hlBaroHiMonth,
                },
                year: {
                    low: data.hlBaroLoYear,
                    high: data.hlBaroHiYear,
                },
            },
            wind: {
                day: {
                    value: data.hlWindHiDay,
                    time: data.hlWindHiTime,
                },
                month: data.hlWindHiMonth,
                year: data.hlWindHiYear,
            },
            windChill: {
                day: {
                    value: data.hlChillLoDay,
                    time: data.hlChillLoTime,
                },
                month: data.hlChillLoMonth,
                year: data.hlChillLoYear,
            },
            dewpoint: {
                day: {
                    low: {
                        value: data.hlDewLoDay,
                        time: data.hlDewLoTime,
                    },
                    high: {
                        value: data.hlDewHiDay,
                        time: data.hlDewHiTime,
                    },
                },
                month: {
                    low: data.hlDewLoMonth,
                    high: data.hlDewHiMonth,
                },
                year: {
                    low: data.hlDewLoYear,
                    high: data.hlDewHiYear,
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
                    value: data.hlSolarHiDay,
                    time: data.hlSolarHiTime,
                },
                month: data.hlSolarHiMonth,
                year: data.hlSolarHiYear,
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
                    value: data.hlRainRateHiDay,
                    time: data.hlRainRateHiTime,
                },
                month: data.hlRainRateHiMonth,
                year: data.hlRainRateHiYear,
            },
            temperature: {
                inside: {
                    day: {
                        low: {
                            value: data.hlInTempLoDay,
                            time: data.hlInTempLoTime,
                        },
                        high: {
                            value: data.hlInTempHiDay,
                            time: data.hlInTempHiTime,
                        },
                    },
                    month: {
                        low: data.hlInTempLoMonth,
                        high: data.hlInTempHiMonth,
                    },
                    year: {
                        low: data.hlInTempLoYear,
                        high: data.hlInTempHiYear,
                    },
                },
                outside: {
                    day: {
                        low: {
                            value: data.hlOutTempLoDay,
                            time: data.hlOutTempLoTime,
                        },
                        high: {
                            value: data.hlOutTempHiDay,
                            time: data.hlOutTempHiTime,
                        },
                    },
                    month: {
                        low: data.hlOutTempLoMonth,
                        high: data.hlOutTempHiMonth,
                    },
                    year: {
                        low: data.hlOutTempLoYear,
                        high: data.hlOutTempHiYear,
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
