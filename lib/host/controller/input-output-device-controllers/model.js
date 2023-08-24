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
    control_source_input_new_words_subscription = null;

    bind(output_subject, control_source_input_new_words$) { // device_output_subject
        this.device_output_subject = output_subject;
        this.control_source_input_new_words_subscription = control_source_input_new_words$.subscribe(handle_input_control_words);
    }
}