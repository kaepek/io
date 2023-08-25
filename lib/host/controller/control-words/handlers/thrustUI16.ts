import { ControlInputSources } from "../../control-input-sources/sources";
import { ControlWordDataTypes, ControlWordsUI8 } from "../words";
import { ControlWordHandlerBase } from "./model";

export class ThrustUI16ControlWordHandler extends ControlWordHandlerBase {
    name = ControlWordsUI8.SetThrustUI16;
    state_alias = "thrust";
    scale = 1.0;
    data_type = ControlWordDataTypes.UInt16LE;

    handle_input(input: any) {
        if (input.source == ControlInputSources.DualShock) {
            if (input.type === "trigger" && input.label === "r2") {
                this.subject.next({word:this, value: input.value});
            }
        }
        else if (input.source == ControlInputSources.UPD) {
            // todo
        }
    };
}