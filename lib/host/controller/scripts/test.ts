import { DualShockControlInputSourceHandler } from "../control-input-sources/handlers/dualshock";
import { ControlSourceInputRouter } from "../control-input-sources/router";
import { DirectionUI8ControlWordHandler } from "../control-words/handlers/directionUI8";
import { DelimitedASCIILine } from "../device-output-models/delimited-ascii-line";
import { SerialUSBDeviceController } from "../input-output-device-controllers/serial-usb";
import { ConsoleOutputSink } from "../output-sinks/console";
import { DeviceOutputRouter } from "../output-sinks/router";
import { StreamJunctionDirector } from "../stream-junction-director";


const dualshock = new DualShockControlInputSourceHandler();
const inputRouter = new ControlSourceInputRouter([dualshock]);

const directionWordControlHandler = new DirectionUI8ControlWordHandler();
const controlWordHandlers = [directionWordControlHandler];

const inputOutputDevice = new SerialUSBDeviceController();
const inputOuputDevices = [inputOutputDevice];

const inputOutputDeviceOutputHandler = new DelimitedASCIILine();

const consoleOutputSink = new ConsoleOutputSink();

const outputRouter = new DeviceOutputRouter([consoleOutputSink]);

const director = new StreamJunctionDirector(inputRouter, controlWordHandlers, inputOuputDevices, inputOutputDeviceOutputHandler, outputRouter);

director.ready().then(console.log).catch((error) => {
    console.log(error);
    process.exit(1);
});