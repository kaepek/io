import { ControlInputSources } from "../../control-input-sources/sources";
import { ControlWordDataTypes, ControlWords } from "../words";
import { ControlWordHandlerBase } from "./model";

export class DirectionUI8ControlWordHandler extends ControlWordHandlerBase {
    name = ControlWords.SetDirectionUI8;
    scale = 1.0;
    word_data_length = 1;
    data_type = ControlWordDataTypes.UInt8;
    handle_input(input: any, state: any) {
        if (input.source == ControlInputSources.DualShock) {
            // triangle up... we have a direction to reverse... only if thrust is zero otherwise risk breaking the hardware
            if (input.type === "button" && input.label === "triangle" && input.value === false ) {

                if (state.hasOwnProperty("thrust") && state["thrust"] !== 0) return;

                if (state.hasOwnProperty(this.name)) {
                    this.subject.next({word:this, value: !state[this.name]}); // NOTE SHOULD BE CALLING NEXT!
                }
                else {
                    this.subject.next({word:this, value: false});
                }
            }
        }
        else if (input.source == ControlInputSources.UPD) {
            // todo
        }
    };
}
