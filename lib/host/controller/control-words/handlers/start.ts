import { ControlInputSources } from "../../control-input-sources/sources";
import { ControlWordsUI8 } from "../words";
import { ControlWordHandlerBase } from "./model";

export class StartControlWordHandler extends ControlWordHandlerBase {
    name = ControlWordsUI8.Start;
    handle_input(input: any, state: any) {
        if (input.source == ControlInputSources.DualShock) {
            if (input.type === "button" && input.label === "start" && input.value === false) 
            {
                this.subject.next({word:this});
            }
        }
        else if (input.source === ControlInputSources.Keyboard && input.label === "space" && input.value === "pressed") {
            this.subject.next({word:this});
        }
        else if (input.source == ControlInputSources.UPD) {
            // todo
        }
    };
}