import { InputOutputDeviceControllerBase } from "./model";

export class SerialUSBDeviceController extends InputOutputDeviceControllerBase {
    async ready() {
    }
    handle_input_control_word(word) {
        // deal with word event
    }


    // handle_device_output fire this with device output or this.device_output_subject.next(raw_output);

}