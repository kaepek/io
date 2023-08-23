import { OutputSinkBase } from "./model";
import { DeviceOutputSinks } from "./sinks";

export class UDPOutputSink extends OutputSinkBase {
    type = DeviceOutputSinks.UPD;

    async ready() {
        throw "Not implemented"; // todo
    }

    output_handler() {
        throw "Not implemented"; // todo
    }

}