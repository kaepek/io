import { Subject } from "rxjs";
import { ControlWordEvent } from "../control-words/model";

export class InputOutputDeviceControllerBase {

    async ready() {
        throw "Not implemented";
    }

    handle_input_control_word(event: ControlWordEvent) {
        throw "Not implemented";
    }

    handle_device_output(raw_output: any) {
        (this.device_output_subject as Subject<any>).next(raw_output);
    }

    device_output_subject: Subject<any> | null = null;
    control_source_input_new_words_subscription = null;

    bind(output_subject: any, control_source_input_new_words$: any) { // device_output_subject
        this.device_output_subject = output_subject;
        this.control_source_input_new_words_subscription = control_source_input_new_words$.subscribe((word: any) => this.handle_input_control_word(word));
    }
}