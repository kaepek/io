import { ControlInputSources } from "../../control-input-sources/sources";
import { ControlWordDataTypes, ControlWords } from "../words";
import { ControlWordHandlerBase } from "../model";

export class DirectionUI8ControlWordHandler extends ControlWordHandlerBase {
    name = ControlWords.SetDirectionUI8;
    scale = 1.0;
    data_type = ControlWordDataTypes.UInt8;
    handle_input(input: any, state: any) {
        // deal with NetworkControlWord sources manually within this class.
        if (input.source == ControlInputSources.DualShock) {
            // triangle up... we have a direction to reverse... only if thrust is zero otherwise risk breaking the hardware
            if (input.type === "button" && input.label === "triangle" && input.value === false ) {
                if (state.hasOwnProperty("thrust") && state["thrust"] !== 0) {
                    console.log("BLOCKING DIRECTION CHANGE AS HAS THRUST");
                    return;
                };
                if (state.hasOwnProperty(this.name)) {
                    this.subject.next({word:this, value: !state[this.name]}); // NOTE SHOULD BE CALLING NEXT!
                }
                else {
                    this.subject.next({word:this, value: false});
                }
            }
        }
        else if (input.source === ControlInputSources.Keyboard && input.label === "q" && input.value === "pressed") {
            if (state.hasOwnProperty("thrust") && state["thrust"] !== 0) {
                console.log("BLOCKING DIRECTION CHANGE AS HAS THRUST");
                return;
            };
            if (state.hasOwnProperty(this.name)) {
                this.subject.next({word:this, value: !state[this.name]}); // NOTE SHOULD BE CALLING NEXT!
            }
            else {
                this.subject.next({word:this, value: false});
            }
        }
        else if (input.source === ControlInputSources.NetworkControlWord && this.name === input.name) {
            if (state.hasOwnProperty("thrust") && state["thrust"] !== 0) {
                console.log("BLOCKING DIRECTION CHANGE AS HAS THRUST");
                return;
            }
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
