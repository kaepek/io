import { InputOutputDeviceControllerBase } from "./controller";

export class SerialUSBDeviceController extends InputOutputDeviceControllerBase {
    async ready() {
    }
    handle_input_control_words(words) {

    }
    handle_device_output(raw_output) {
        this.device_output_subject.next(raw_output);
    }
}