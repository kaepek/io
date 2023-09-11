import { ControlWordDataTypes, ControlWords } from "../words";
import { ControlWordHandlerBase } from "../model";

export class Offset2F32WordHandler extends ControlWordHandlerBase {
    name = ControlWords.Offset2F32;
    data_type = ControlWordDataTypes.Float32LE;
    min_value = Number.NEGATIVE_INFINITY;
    max_value = Number.POSITIVE_INFINITY;
    handle_input(input: any) {
        super.handle_input(input); // deal with NetworkControlWord sources automatically.
    };
}