const VPInterface = require("./vantageInterface/VPInterface");
const inspect = require("./utils/inspect");
const Unit = require("./vantageInterface/Unit");

async function test() {
    console.log("#########################");
    const interface = new VPInterface("/dev/ttyUSB0", { useSamples: true });

    // let data = await interface.getRealtimeData();
    // data.applyUnits({
    //     preset: "eu",
    // });
    // console.log("##### REALTIME DATA #####");
    // inspect(data.toObject());

    const highsAndLows = await interface.getHighsAndLows();
    highsAndLows.applyUnits({ preset: "eu" });
    console.log("##### HIGHS & LOWS #####");
    inspect(highsAndLows.toObject());

    // console.log("##### BACKLITE OFF #####");
    // await interface.turnBackliteOff();
    // setTimeout(async () => {
    //     console.log("##### BACKLITE ON  #####");
    //     await interface.turnBackliteOn();
    //     console.log("##### TEST FINISHED #####");
    //     console.log("#########################");
    // }, 5000);

    console.log("##### TEST FINISHED #####");
    console.log("#########################");
}

test();
