import { ControlWordDataTypes, ControlWords } from "../words.js";
import { ControlWordHandlerBase } from "../model.js";
import { ControlInputSources } from "../../control-input-sources/sources.js";

/*

{ source: 'DualShock', type: 'stick', label: 'lStickY', value: 0 } -127
{ source: 'DualShock', type: 'stick', label: 'lStickY', value: 127 } 0
{ source: 'DualShock', type: 'stick', label: 'lStickX', value: 255 } 128

*/

export class Offset1F32WordHandler extends ControlWordHandlerBase {
    name = ControlWords.Offset1F32;
    data_type = ControlWordDataTypes.Float32LE;
    min_value = Number.NEGATIVE_INFINITY;
    max_value = Number.POSITIVE_INFINITY;
    increment_speed_milliseconds = 55;

    handle_input(input: any) {
        super.handle_input(input); // deal with NetworkControlWord sources automatically.
        if (input.source === ControlInputSources.DualShock) {
            if (input.type === "stick" && input.label === "lStickX") {
                // value is 0 -> 255
                // we want to convert this to -180 to 180
                const value_zero_center = (input.value - 127); // -127 ... 0 ... 128
                const mapped_value = value_zero_center < 0 ? (180 / 127) * value_zero_center : (180 / 128) * value_zero_center;
                
                this.subject.next({word:this, value: mapped_value}); // 257 maps 255 -> 65,536
            }
        }
    };
}