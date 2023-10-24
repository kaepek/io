import { ControlWordDataTypes, ControlWords } from "../words.js";
import { ControlWordHandlerBase } from "../model.js";

export class LinearBiasCWF32WordHandler extends ControlWordHandlerBase {
    name = ControlWords.LinearBiasCW;
    data_type = ControlWordDataTypes.Float32LE;
    min_value = Number.NEGATIVE_INFINITY;
    max_value = Number.POSITIVE_INFINITY;
    handle_input(input: any) {
        super.handle_input(input); // deal with NetworkControlWord sources automatically.
    };
}