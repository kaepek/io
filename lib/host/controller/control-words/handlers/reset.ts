import { ControlInputSources } from "../../control-input-sources/sources";
import { ControlWordsUI8 } from "../words";
import { ControlWordHandlerBase } from "./model";

export class ResetControlWordHandler extends ControlWordHandlerBase {
    name = ControlWordsUI8.Reset;
    handle_input(input: any) {
        super.handle_input(input); // deal with NetworkControlWord sources automatically.
        if (input.source == ControlInputSources.DualShock) {
            if (input.type === "button" && input.label === "ps" && input.value === false) 
            {
                this.subject.next({word:this});
            }
        }
        else if (input.source === ControlInputSources.Keyboard && input.label === "r" && input.value === "pressed") {
            this.subject.next({word:this});
        }
    };
}