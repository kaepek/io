import { ControlInputSources } from "../../control-input-sources/sources";
import { ControlWordDataTypes, ControlWordsUI8 } from "../words";
import { ControlWordHandlerBase } from "./model";

export class DirectionUI8ControlWordHandler extends ControlWordHandlerBase {
    name = ControlWordsUI8.SetDirectionUI8;
    scale = 1.0;
    data_type = ControlWordDataTypes.UInt8;
    handle_input(input: any, state: any) {
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
        else if (input.source == ControlInputSources.UPD) {
            // todo
        }
    };
}
