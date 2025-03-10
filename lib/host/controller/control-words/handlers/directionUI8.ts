import { ControlInputSources } from "../../control-input-sources/sources.js";
import { ControlWordDataTypes, ControlWords } from "../words.js";
import { ControlWordHandlerBase } from "../model.js";
import { console2 } from "../../utils/log.js";

export class Direction1UI8ControlWordHandler extends ControlWordHandlerBase {
    name = ControlWords.Direction1UI8;
    scale = 1.0;
    data_type = ControlWordDataTypes.UInt8;
    min_value = 0;
    max_value = 1;
    handle_input(input: any, state: any) {
        // deal with NetworkControlWord sources manually within this class.
        if (input.source == ControlInputSources.DualShock) {
            // triangle up... we have a direction to reverse... only if thrust is zero otherwise risk breaking the hardware
            if (input.type === "button" && input.label === "triangle" && input.value === false ) {
                if ((state.hasOwnProperty("thrust1") && state["thrust1"] !== 0) || (state.hasOwnProperty("torque1") && state["torque1"] !== 0)) {
                    console2.warn("BLOCKING direction1 change as thrust1 is non zero.");
                    return;
                };
                if (state.hasOwnProperty(this.name)) {
                    this.subject.next({word:this, value: !state[this.name]}); // NOTE SHOULD BE CALLING NEXT!
                }
                else {
                    this.subject.next({word:this, value: true});
                }
            }
        }
        else if (input.source === ControlInputSources.Keyboard && input.label === "q" && input.value === "pressed") {
            if ((state.hasOwnProperty("thrust1") && state["thrust1"] !== 0) || (state.hasOwnProperty("torque1") && state["torque1"] !== 0)) {
                console2.warn("BLOCKING direction1 change as thrust1 is non zero.");
                return;
            };
            if (state.hasOwnProperty(this.name)) {
                this.subject.next({word:this, value: !state[this.name]}); // NOTE SHOULD BE CALLING NEXT!
            }
            else {
                this.subject.next({word:this, value: true});
            }
        }
        else if (input.source === ControlInputSources.NetworkControlWord && this.name === input.word) {
            if ((state.hasOwnProperty("thrust1") && state["thrust1"] !== 0) || (state.hasOwnProperty("torque1") && state["torque1"] !== 0)) {
                console2.warn("BLOCKING direction1 change as thrust1 is non zero.");
                return;
            }
            if (this.data_type === ControlWordDataTypes.None) {
                // should have not data
                if (input.hasOwnProperty("value")) {
                    return console2.warn("WARNING control word has a value when the ControlWord definition procludes this as the data_type parameter of the word is ControlWordDataTypes.None");
                }
                this.subject.next({word: this});
            }
            else {
                // should have data
                if (!input.hasOwnProperty("value")) {
                    return console2.warn(`WARNING control word has a missing value when the ControlWord definition requires this as the data_type parameter of the word is ControlWordDataTypes.${this.data_type}`);
                }
                this.subject.next({word: this, value: input.value});
            }
        }
    };
}
