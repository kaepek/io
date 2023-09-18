import { OutputSinkBase } from "../model.js";
import { DeviceOutputSinks } from "../sinks.js";

export class FileOutputSink extends OutputSinkBase {
    type = DeviceOutputSinks.File;

    async ready() {
        throw "Not implemented"; // todo
    }

    output_handler(output: any) {
        throw "Not implemented"; // todo
    }

}