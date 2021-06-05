const VPInterface = require("./vantageInterface/VPInterface");
const inspect = require("./utils/inspect");

async function test() {
    const interface = new VPInterface("/dev/ttyUSB0", { useSamples: true });
    const data = await interface.getRealtimeData();
    await interface.turnBackliteOn();
    inspect(data);
}

test();
