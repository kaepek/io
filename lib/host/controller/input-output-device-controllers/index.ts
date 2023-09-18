import { ConsoleDeviceController } from "./handlers/console.js"
import { NetworkControlWordSink } from "./handlers/network-control-word-sink.js"
import { SerialUSBDeviceController } from "./handlers/serial-usb.js"
import { InputOutputDeviceControllerBase } from "./model.js"

const exports: {[key: string]: typeof InputOutputDeviceControllerBase | typeof NetworkControlWordSink } = {
    "console": ConsoleDeviceController,
    "serial": SerialUSBDeviceController,
    "network": NetworkControlWordSink
};

export default exports;