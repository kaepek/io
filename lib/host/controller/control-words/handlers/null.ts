import { ControlInputSources } from "../../control-input-sources/sources";
import { ControlWords } from "../words";
import { ControlWordHandlerBase } from "../model";

export class NullControlWordHandler extends ControlWordHandlerBase {
    name = ControlWords.Null;
    handle_input(input: any) {
        super.handle_input(input); // deal with NetworkControlWord sources automatically.
        if (input.source == ControlInputSources.DualShock) {
            if (input.type === "button" && input.label === "pad" && input.value === false) 
            {
                this.subject.next({word:this});
            }
        }
    };
}