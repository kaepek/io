import { InputOutputDeviceControllerBase } from "./model";

export class SerialUSBDeviceController extends InputOutputDeviceControllerBase {
    async ready() {
    }
    handle_input_control_words(words) {

    }
    handle_device_output(raw_output) {
    }
}