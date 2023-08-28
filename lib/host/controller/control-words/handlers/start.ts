import { ControlInputSources } from "../../control-input-sources/sources";
import { ControlWords } from "../words";
import { ControlWordHandlerBase } from "../model";

export class StartControlWordHandler extends ControlWordHandlerBase {
    name = ControlWords.Start;
    handle_input(input: any) {
        super.handle_input(input); // deal with NetworkControlWord sources automatically.
        if (input.source == ControlInputSources.DualShock) {
            if (input.type === "button" && input.label === "start" && input.value === false) 
            {
                this.subject.next({word:this});
            }
        }
        else if (input.source === ControlInputSources.Keyboard && input.label === "space" && input.value === "pressed") {
            this.subject.next({word:this});
        }
    };
}