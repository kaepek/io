import { Subject } from "rxjs";

export class ControlWordHandlerBase {
    name: number | null = null;
    state_alias: string | null = null;
    data_type: string | null = null;
    subject = new Subject();
    state: any = null;
    $ = this.subject.asObservable();
    handle_input(input: any, state: any) {
        throw "Not implemented";
    };
}