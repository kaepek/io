import { ControlInputSources } from "../../control-input-sources/sources";
import { ControlWords } from "../words";
import { ControlWordHandlerBase } from "./model";

export class DirectionUI8ControlWordHandler extends ControlWordHandlerBase {
    name = ControlWords.SetDirectionUI8;
    scale = 1.0;
    word_data_length = 1;
    handle_input(input, state) {
        if (input.source == ControlInputSources.DualShock) {
            // triangle up... we have a direction to reverse... only if thrust is zero otherwise risk breaking the hardware
            if (inputObj.type === "button" && inputObj.label === "triangle" && inputObj.value === false && state["thrust"] === 0) {
                if (state.hasOwnProperty(this.name)) {
                    return {value: !state[this.name]}; // NOTE SHOULD BE CALLING NEXT!
                }
                else {
                    return {value: false};
                }
            }
        }
        else if (input.source == ControlInputSources.UPD) {
            // todo
        }
        return false;
    };

    constructor() { // args scale etc

    }
}
