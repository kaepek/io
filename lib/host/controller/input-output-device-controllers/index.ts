import { ConsoleDeviceController } from "./console"
import { NetworkControlWordSink } from "./handlers/network-control-word-sink"
import { SerialUSBDeviceController } from "./serial-usb"


export default {
    "console": ConsoleDeviceController,
    "serial-usb": SerialUSBDeviceController,
    "network": NetworkControlWordSink
}