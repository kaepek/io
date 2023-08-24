import { DeviceOutputBase } from "./model";
import { DeviceOutputs } from "./outputs";

export class DelimitedASCIILine extends DeviceOutputBase {
    type = DeviceOutputs.DelimitedASCIILine;
    process_output(output: any) {
        return output;
    }
};