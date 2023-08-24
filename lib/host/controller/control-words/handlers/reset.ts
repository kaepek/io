import { ControlInputSources } from "../../control-input-sources/sources";
import { ControlWords } from "../words";
import { ControlWordHandlerBase } from "./model";

export class ResetControlWordHandler extends ControlWordHandlerBase {
    name = ControlWords.Reset;
    handle_input(input, state) {
        if (input.source == ControlInputSources.DualShock) {
            if (input.type === "button" && input.label === "square" && input.value === false) 
            {
                return this.subject.next({word:this});
            }
        }
        else if (input.source == ControlInputSources.UPD) {
            return this.subject.next({word:this});
        }
    };
}