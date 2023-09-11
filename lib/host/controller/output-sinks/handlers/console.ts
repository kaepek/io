import { console2 } from "../../utils/log";
import { OutputSinkBase } from "../model";
import { DeviceOutputSinks } from "../sinks";

export class ConsoleOutputSink extends OutputSinkBase {
    type = DeviceOutputSinks.Console;
    async ready() {
        console2.success("INFO OutputSink: ConsoleOutputSink ready.");
    }
    output_handler(output: any) {
        console2.log("Console output sink: ", output);
    }
}