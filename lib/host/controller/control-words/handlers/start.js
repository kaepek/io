import { ControlInputSources } from "../../control-input-sources/sources";
import { ControlWords } from "../words";
import { ControlWordHandlerBase } from "./model";

export class StartControlWordHandler extends ControlWordHandlerBase {
    name = ControlWords.Start;
    handle_input(input, state) {
        if (input.source == ControlInputSources.DualShock) {
            if (input.type === "button" && input.label === "square" && input.value === false) 
            {
                return true;
            }
        }
        else if (input.source == ControlInputSources.UPD) {
            // todo
        }
    };
}