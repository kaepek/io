import { ControlWordEvent } from "../control-words/handlers/model";
import { ControlWordsUI8 } from "../control-words/words";
import { InputOutputDeviceControllerBase } from "./model";

export class ConsoleDeviceController extends InputOutputDeviceControllerBase {

    async ready() {

    }

    handle_input_control_word(event: ControlWordEvent) {
        let text = `Input control word: ${ControlWordsUI8[event.word.name]}`;
        if (event.hasOwnProperty("value")) {
            text += `, value: ${event.value}`;
        }
        console.log(text);
    }

}