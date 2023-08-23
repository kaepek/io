export class InputOutputDeviceControllerBase {

    async ready() {
        throw "Not implemented";
    }

    handle_input_control_words(words) {
        throw "Not implemented";
    }

    handle_device_output(raw_output) {
        this.device_output_subject.next(raw_output);
    }

    device_output_subject = null;
    bind_device_output_subject(subject) { // device_output_subject
        this.device_output_subject = subject;
    }
}