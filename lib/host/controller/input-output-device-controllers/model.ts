import { Subject } from "rxjs";

export class InputOutputDeviceControllerBase {

    async ready() {
        throw "Not implemented";
    }

    handle_input_control_word(word) {
        throw "Not implemented";
    }

    handle_device_output(raw_output) {
        (this.device_output_subject as Subject<any>).next(raw_output);
    }

    device_output_subject: Subject<any> | null = null;
    control_source_input_new_words_subscription = null;

    bind(output_subject, control_source_input_new_words$) { // device_output_subject
        this.device_output_subject = output_subject;
        this.control_source_input_new_words_subscription = control_source_input_new_words$.subscribe(this.handle_input_control_word);
    }
}