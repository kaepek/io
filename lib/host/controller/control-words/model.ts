import { Subject } from "rxjs";
import { ControlWordDataTypes } from "./words.js";
import { ControlInputSources } from "../control-input-sources/sources.js";

export class ControlWordHandlerBase {
    name: number = 0;
    state_alias: string | null = null;
    data_type: ControlWordDataTypes = ControlWordDataTypes.None;
    subject = new Subject();
    state: any = null;
    min_value: number | null = null;
    max_value: number | null = null;
    $ = this.subject.asObservable();
    handle_input(input: any, state?: any) {
        // handler the network word input here.
        if (input.source === ControlInputSources.NetworkControlWord && this.name === input.word) {
            if (this.data_type === ControlWordDataTypes.None) {
                // should have not data
                if (input.hasOwnProperty("value")) {
                    return console.warn("WARNING control word has a value when the ControlWord definition procludes this as the data_type parameter of the word is ControlWordDataTypes.None");
                }
                this.subject.next({word: this});
            }
            else {
                // should have data
                if (!input.hasOwnProperty("value")) {
                    return console.warn(`WARNING control word has a missing value when the ControlWord definition requires this as the data_type parameter of the word is ControlWordDataTypes.${this.data_type}`);
                }
                this.subject.next({word: this, value: input.value});
            }
        }
    };
}

export interface ControlWordEvent {
    word: ControlWordHandlerBase;
    value?: any;
}