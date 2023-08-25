import { ControlWordEvent, ControlWordHandlerBase } from "../control-words/handlers/model";
import { ControlWordsUI8Inverted } from "../control-words/words";
import { InputOutputDeviceControllerBase } from "./model";

export class ConsoleDeviceController extends InputOutputDeviceControllerBase {

    async ready() {

    }

    handle_input_control_word(event: ControlWordEvent) {
        let text = `Input control word: ${ControlWordsUI8Inverted[event.word.name]}`;
        if (event.hasOwnProperty("value")) {
            text += `, value: ${event.value}`;
        }
        console.log(text);
    }

}