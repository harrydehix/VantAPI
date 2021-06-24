exports.refractorModel = (data) => ({ model: data.Model });
exports.refractorTime = (data) => ({ time: data.DavisTime });

exports.refractorHighsAndLows = (data) => {
    const recordTime = new Date();
    const currentDate = recordTime.toLocaleDateString();
    return {
        time: recordTime,
        pressure: {
            day: {
                low: {
                    value: data.hlBaroLoDay,
                    time:
                        data.hlBaroLoTime === null
                            ? null
                            : new Date(`${currentDate}, ${data.hlBaroLoTime}`),
                },
                high: {
                    value: data.hlBaroHiDay,
                    time:
                        data.hlBaroHiTime === null
                            ? null
                            : new Date(`${currentDate}, ${data.hlBaroHiTime}`),
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
                time:
                    data.hlWindHiTime === null
                        ? null
                        : new Date(`${currentDate}, ${data.hlWindHiTime}`),
            },
            month: data.hlWindHiMonth,
            year: data.hlWindHiYear,
        },
        windChill: {
            day: {
                value: data.hlChillLoDay,
                time:
                    data.hlChillLoTime === null
                        ? null
                        : new Date(`${currentDate}, ${data.hlChillLoTime}`),
            },
            month: data.hlChillLoMonth,
            year: data.hlChillLoYear,
        },
        dewpoint: {
            day: {
                low: {
                    value: data.hlDewLoDay,
                    time:
                        data.hlDewLoTime === null
                            ? null
                            : new Date(`${currentDate}, ${data.hlDewLoTime}`),
                },
                high: {
                    value: data.hlDewHiDay,
                    time:
                        data.hlDewHiTime === null
                            ? null
                            : new Date(`${currentDate}, ${data.hlDewHiTime}`),
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
                time:
                    data.hlHeatHiTime === null
                        ? null
                        : new Date(`${currentDate}, ${data.hlHeatHiTime}`),
            },
            month: data.hlHeatHiMonth,
            year: data.hlHeatHiYear,
        },
        solarRadiation: {
            day: {
                value: data.hlSolarHiDay,
                time:
                    data.hlSolarHiTime === null
                        ? null
                        : new Date(`${currentDate}, ${data.hlSolarHiTime}`),
            },
            month: data.hlSolarHiMonth,
            year: data.hlSolarHiYear,
        },
        uvLevel: {
            day: {
                value: data.hlUVHiDay,
                time:
                    data.hlUVHiTime === null
                        ? null
                        : new Date(`${currentDate}, ${data.hlUVHiTime}`),
            },
            month: data.hlUVHiMonth,
            year: data.hlUVHiYear,
        },
        rainRate: {
            day: {
                value: data.hlRainRateHiDay,
                time:
                    data.hlRainRateHiTime === null
                        ? null
                        : new Date(`${currentDate}, ${data.hlRainRateHiTime}`),
            },
            month: data.hlRainRateHiMonth,
            year: data.hlRainRateHiYear,
        },
        temperature: {
            inside: {
                day: {
                    low: {
                        value: data.hlInTempLoDay,

                        time:
                            data.hlInTempLoTime === null
                                ? null
                                : new Date(
                                      `${currentDate}, ${data.hlInTempLoTime}`
                                  ),
                    },
                    high: {
                        value: data.hlInTempHiDay,
                        time:
                            data.hlInTempHiTime === null
                                ? null
                                : new Date(
                                      `${currentDate}, ${data.hlInTempHiTime}`
                                  ),
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
                        time:
                            data.hlOutTempLoTime === null
                                ? null
                                : new Date(
                                      `${currentDate}, ${data.hlOutTempLoTime}`
                                  ),
                    },
                    high: {
                        value: data.hlOutTempHiDay,
                        time:
                            data.hlOutTempHiTime === null
                                ? null
                                : new Date(
                                      `${currentDate}, ${data.hlOutTempHiTime}`
                                  ),
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
                        time:
                            data.hlInHumLoTime === null
                                ? null
                                : new Date(
                                      `${currentDate}, ${data.hlInHumLoTime}`
                                  ),
                    },
                    high: {
                        value: data.hlInHumHiDay,
                        time:
                            data.hlInHumHiTime === null
                                ? null
                                : new Date(
                                      `${currentDate}, ${data.hlInHumHiTime}`
                                  ),
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
};

exports.refractorRealtime = (data) => {
    // Add time and parse sunset/sunrise strings to dates (might not work perfectly with sample data cause it's not up to date)
    const recordTime = new Date();
    const currentDate = recordTime.toLocaleDateString();
    const sunrise = new Date(`${currentDate}, ${data.rtSunrise}`);
    const sunset = new Date(`${currentDate}, ${data.rtSunset}`);
    return {
        time: recordTime,
        nextArchiveRecord: data.rtNextArchiveRecord,
        pressure: {
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
            // TODO fix wrong date parsing
            startDate: new Date(data.rtStormStartDate),
        },
        sun: {
            rise: sunrise,
            set: sunset,
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
        thswIndex: data.rtSolarRad === "n/a" ? data.rtThswIndex : null,
    };
};
