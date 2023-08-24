import { Subject } from "rxjs";

export class ControlWordHandlerBase {
    name: number | null = null;
    state_name: string | null = null;
    word_data_length = 0;
    data_type: string | null = null;
    subject = new Subject();
    $ = this.subject.asObservable();
    handle_input(input, state) {
        throw "Not implemented";
    };
}