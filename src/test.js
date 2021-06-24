const VPInterface = require("./vantageInterface/VPInterface");
const inspect = require("./utils/inspect");

async function test() {
    console.log("#########################");
    const interface = new VPInterface("/dev/ttyUSB0", {
        useSamples: true,
        pretty: false,
    });

    console.log("##### REALTIME DATA #####");
    const data = await interface.getHighsAndLows();
    inspect(data);

    // const highsAndLows = await interface.getHighsAndLows();
    // console.log("##### HIGHS & LOWS #####");
    // inspect(highsAndLows);

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
