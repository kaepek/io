import { ControlInputSources } from "../../control-input-sources/sources";
import { ControlWords } from "../words";
import { ControlWordHandlerBase } from "./model";

export class NullControlWordHandler extends ControlWordHandlerBase {
    name = ControlWords.Null;
    handle_input(input) {
        if (input.source == ControlInputSources.DualShock) {
            if (input.type === "button" && input.label === "square" && input.value === false) 
            {
                return true;
            }
        }
        else if (input.source == ControlInputSources.UPD) {
            return true;
        }
        return false;
    };
}