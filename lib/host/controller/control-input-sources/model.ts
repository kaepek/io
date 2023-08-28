import { Subject } from "rxjs";

export class ControlInputSourceHandler {
    type: string | null = null;
    scale = null;
    subject = new Subject();
    $ = this.subject.asObservable();

    control_input_source_router = null;

    async ready() {
        throw "Not implemented";
    }
}