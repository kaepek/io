import { ConsoleDeviceController } from "./handlers/console"
import { NetworkControlWordSink } from "./handlers/network-control-word-sink"
import { SerialUSBDeviceController } from "./handlers/serial-usb"
import { InputOutputDeviceControllerBase } from "./model"

const exports: {[key: string]: typeof InputOutputDeviceControllerBase | typeof NetworkControlWordSink } = {
    "console": ConsoleDeviceController,
    "serial-usb": SerialUSBDeviceController,
    "network": NetworkControlWordSink
};

export default exports;