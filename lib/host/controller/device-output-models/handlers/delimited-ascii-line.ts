import { DeviceOutputModelBase } from "../model.js";
import { DeviceOutputs } from "../outputs.js";

export class DelimitedASCIILine extends DeviceOutputModelBase {
    type = DeviceOutputs.DelimitedASCIILine;
    process_output(output: any) {
        return output;
    }
};