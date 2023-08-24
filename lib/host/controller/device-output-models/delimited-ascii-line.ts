import { DeviceOutputModelBase } from "./model";
import { DeviceOutputs } from "./outputs";

export class DelimitedASCIILine extends DeviceOutputModelBase {
    type = DeviceOutputs.DelimitedASCIILine;
    process_output(output: any) {
        return output;
    }
};