import { ControlInputSources } from "../../control-input-sources/sources";
import { ControlWordsUI8 } from "../words";
import { ControlWordHandlerBase } from "./model";

export class StopControlWordHandler extends ControlWordHandlerBase {
    name = ControlWordsUI8.Stop;
    handle_input(input: any, state: any) {
        if (input.source == ControlInputSources.DualShock) {
            if (input.type === "button" && input.label === "select" && input.value === false) 
            {
                this.subject.next({word:this});
            }
        }
        else if (input.source == ControlInputSources.UPD) {
            // todo
        }
    };
}