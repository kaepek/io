import { ControlWordEvent } from "../../control-words/model";
import { ControlWords } from "../../control-words/words";
import { console2 } from "../../utils/log";
import { InputOutputDeviceControllerBase } from "../model";

export class ConsoleDeviceController extends InputOutputDeviceControllerBase {

    async ready() {
        console2.success("INFO InputOutputDeviceController: ConsoleDeviceController ready.");
    }

    handle_input_control_word(event: ControlWordEvent) {
        let text = `Input control word: ${ControlWords[event.word.name]}`;
        if (event.hasOwnProperty("value")) {
            text += `, value: ${event.value}`;
        }
        console2.log(text);
    }

}