import { ControlInputSources } from "../../control-input-sources/sources";
import { ControlWords } from "../words";
import { ControlWordHandlerBase } from "./model";

class ThrustUI16ControlWordHandler extends ControlWordHandlerBase {
    name = ControlWords.SetThrustUI16;
    state_name = "thrust";
    scale = 1.0;
    word_data_length = 2;

    handle_input(input) {
        if (input.source == ControlInputSources.DualShock) {
            if (input.type === "trigger" && input.label === "r2") {
                return {value: input.value};
            }
        }
        else if (input.source == ControlInputSources.UPD) {
            return {value: input.value};;
        }
        return false;
    };

    constructor() {

    }
}