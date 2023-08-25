import { OutputSinkBase } from "./model";
import { DeviceOutputSinks } from "./sinks";

export class ConsoleOutputSink extends OutputSinkBase {
    type = DeviceOutputSinks.Console;
    async ready() {}
    output_handler(output: any) {
        console.log("Console output sink: ", output);
    }
}