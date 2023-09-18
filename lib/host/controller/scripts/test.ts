import { DualShockControlInputSourceHandler } from "../control-input-sources/handlers/dualshock.js";
import { KeyboardInputSourceHandler } from "../control-input-sources/handlers/keyboard.js";
import { ControlSourceInputRouter } from "../control-input-sources/router.js";
import { Direction1UI8ControlWordHandler } from "../control-words/handlers/directionUI8.js";
import { NullControlWordHandler } from "../control-words/handlers/null.js";
import { ResetControlWordHandler } from "../control-words/handlers/reset.js";
import { StartControlWordHandler } from "../control-words/handlers/start.js";
import { StopControlWordHandler } from "../control-words/handlers/stop.js";
import { Thrust1UI16ControlWordHandler } from "../control-words/handlers/thrustUI16.js";
import { DelimitedASCIILine } from "../device-output-models/handlers/delimited-ascii-line.js";
import { ConsoleDeviceController } from "../input-output-device-controllers/handlers/console.js";
import { SerialUSBDeviceController } from "../input-output-device-controllers/handlers/serial-usb.js";
import { ConsoleOutputSink } from "../output-sinks/handlers/console.js";
import { DeviceOutputRouter } from "../output-sinks/router.js";
import { NetworkOutputSink } from "../output-sinks/handlers/network.js";
import { StreamJunctionDirector } from "../stream-junction-director.js";
import { NetworkControlWordSink } from "../input-output-device-controllers/handlers/network-control-word-sink.js";


const dualshock = new DualShockControlInputSourceHandler();
const keyboard = new KeyboardInputSourceHandler();
const input_router = new ControlSourceInputRouter([dualshock, keyboard]);

const directionUI8_word_control_handler = new Direction1UI8ControlWordHandler();
const null_control_word_handler = new NullControlWordHandler();
const start_control_word_handler = new StartControlWordHandler();
const stop_control_word_handler = new StopControlWordHandler();
const reset_control_word_handler = new ResetControlWordHandler();
const thrustUI16_word_control_handler = new Thrust1UI16ControlWordHandler();

const control_word_handlers = [directionUI8_word_control_handler, start_control_word_handler, stop_control_word_handler, reset_control_word_handler, thrustUI16_word_control_handler];

const input_output_device = new SerialUSBDeviceController();
const console_output_device = new ConsoleDeviceController();
const network_control_word_sink_output_device = new NetworkControlWordSink("localhost", 5002, "udp");

const peripheral_devices = [input_output_device, console_output_device, network_control_word_sink_output_device];

const peripheral_device_output_model = new DelimitedASCIILine();

const console_output_sink = new ConsoleOutputSink();
const net_device_output_sink = new NetworkOutputSink("127.0.0.1",5001,"udp");

const output_router = new DeviceOutputRouter([console_output_sink, net_device_output_sink]);

const director = new StreamJunctionDirector(input_router, control_word_handlers, peripheral_devices, peripheral_device_output_model, output_router);

director.ready().then(console.log).catch((error) => {
    console.error(error);
    process.exit(1);
});