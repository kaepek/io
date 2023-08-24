import { Subject } from "rxjs";

export class ControlWordHandlerBase {
    name = null;
    state_name = null;
    word_data_length = 0;
    subject = new Subject();
    $ = this.subject.asObservable();
    handle_input(input, state) {
        throw "Not implemented";
    };
}