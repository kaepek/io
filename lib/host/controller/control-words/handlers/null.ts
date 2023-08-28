import { ControlInputSources } from "../../control-input-sources/sources";
import { ControlWordsUI8 } from "../words";
import { ControlWordHandlerBase } from "./model";

export class NullControlWordHandler extends ControlWordHandlerBase {
    name = ControlWordsUI8.Null;
    handle_input(input: any) {
        if (input.source == ControlInputSources.DualShock) {
            if (input.type === "button" && input.label === "pad" && input.value === false) 
            {
                this.subject.next({word:this});
            }
        }
        else if (input.source == ControlInputSources.NetworkControlWord) {
            // todo
        }
    };
}