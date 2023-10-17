import { ControlWordDataTypes, ControlWords } from "../words.js";
import { ControlWordHandlerBase } from "../model.js";

export class PowerLawRootCCWF32WordHandler extends ControlWordHandlerBase {
    name = ControlWords.PowerLawRootCCWF32;
    data_type = ControlWordDataTypes.Float32LE;
    min_value = Number.NEGATIVE_INFINITY;
    max_value = Number.POSITIVE_INFINITY;
    handle_input(input: any) {
        super.handle_input(input); // deal with NetworkControlWord sources automatically.
    };
}