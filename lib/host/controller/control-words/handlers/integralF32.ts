import { ControlWordDataTypes, ControlWords } from "../words";
import { ControlWordHandlerBase } from "../model";

export class IntegralF32WordHandler extends ControlWordHandlerBase {
    name = ControlWords.IntegralF32;
    data_type = ControlWordDataTypes.Float32LE;
    min_value = Number.NEGATIVE_INFINITY;
    max_value = Number.POSITIVE_INFINITY;
    handle_input(input: any) {
        super.handle_input(input); // deal with NetworkControlWord sources automatically.
    };
}