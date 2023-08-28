import { ControlInputSources } from "../../control-input-sources/sources";
import { ControlWords } from "../words";
import { ControlWordHandlerBase } from "../model";

export class StopControlWordHandler extends ControlWordHandlerBase {
    name = ControlWords.Stop;
    handle_input(input: any) {
        super.handle_input(input); // deal with NetworkControlWord sources automatically.
        if (input.source == ControlInputSources.DualShock) {
            if (input.type === "button" && input.label === "select" && input.value === false) 
            {
                this.subject.next({word:this});
            }
        }
        else if (input.source === ControlInputSources.Keyboard && input.label === "x" && input.value === "pressed") {
            this.subject.next({word:this});
        }
    };
}