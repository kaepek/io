import { Subject } from "rxjs";
import { ControlWordDataTypes } from "../words";

export class ControlWordHandlerBase {
    name: number = 0;
    state_alias: string | null = null;
    data_type: string = ControlWordDataTypes.None;
    subject = new Subject();
    state: any = null;
    $ = this.subject.asObservable();
    handle_input(input: any, state: any) {
        // handler the network word input here.
        throw "Not implemented";
    };
}

export interface ControlWordEvent {
    word: ControlWordHandlerBase;
    value?: any;
}