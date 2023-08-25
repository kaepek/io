import { DualShockControlInputSourceHandler } from "../control-input-sources/handlers/dualshock";
import { ControlSourceInputRouter } from "../control-input-sources/router";
import { DirectionUI8ControlWordHandler } from "../control-words/handlers/directionUI8";
import { NullControlWordHandler } from "../control-words/handlers/null";
import { ResetControlWordHandler } from "../control-words/handlers/reset";
import { StartControlWordHandler } from "../control-words/handlers/start";
import { StopControlWordHandler } from "../control-words/handlers/stop";
import { ThrustUI16ControlWordHandler } from "../control-words/handlers/thrustUI16";
import { DelimitedASCIILine } from "../device-output-models/delimited-ascii-line";
import { SerialUSBDeviceController } from "../input-output-device-controllers/serial-usb";
import { ConsoleOutputSink } from "../output-sinks/console";
import { DeviceOutputRouter } from "../output-sinks/router";
import { StreamJunctionDirector } from "../stream-junction-director";


const dualshock = new DualShockControlInputSourceHandler();
const input_router = new ControlSourceInputRouter([dualshock]);

const directionUI8_word_control_handler = new DirectionUI8ControlWordHandler();
const null_control_word_handler = new NullControlWordHandler();
const start_control_word_handler = new StartControlWordHandler();
const stop_control_word_handler = new StopControlWordHandler();
const reset_control_word_handler = new ResetControlWordHandler();
const thrustUI16_word_control_handler = new ThrustUI16ControlWordHandler();

const control_word_handlers = [directionUI8_word_control_handler, start_control_word_handler, stop_control_word_handler, reset_control_word_handler, thrustUI16_word_control_handler];

const input_output_device = new SerialUSBDeviceController();
const peripheral_devices = [input_output_device];

const peripheral_device_output_model = new DelimitedASCIILine();

const console_output_sink = new ConsoleOutputSink();

const output_router = new DeviceOutputRouter([console_output_sink]);

const director = new StreamJunctionDirector(input_router, control_word_handlers, peripheral_devices, peripheral_device_output_model, output_router);

director.ready().then(console.log).catch((error) => {
    console.log(error);
    process.exit(1);
});