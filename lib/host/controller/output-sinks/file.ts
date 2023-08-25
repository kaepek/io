import { OutputSinkBase } from "./model";
import { DeviceOutputSinks } from "./sinks";

export class FileOutputSink extends OutputSinkBase {
    type = DeviceOutputSinks.File;

    async ready() {
        throw "Not implemented"; // todo
    }

    output_handler(output: any) {
        throw "Not implemented"; // todo
    }

}