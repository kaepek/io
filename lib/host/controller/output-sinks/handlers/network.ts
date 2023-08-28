import { OutputSinkBase } from "../model";
import { DeviceOutputSinks } from "../sinks";
import UDP from "dgram";

interface NetworkOptions {
    port: number;
    host: string;
    protocol: "udp" | "tcp"
}

export class NetworkDeviceOutputSink extends OutputSinkBase {
    type = DeviceOutputSinks.Network;
    options: NetworkOptions;
    client: UDP.Socket | undefined;

    async ready() {

    }

    output_handler(output: any) {
        if (this.options.protocol === "udp") {
            const packet = Buffer.from(output.toString());
            const client = this.client as UDP.Socket;
            client.send(packet, this.options.port, this.options.host, (err) => {
                if (err) console.error('Failed to send UPD packet in NetworkDeviceOutputSink: ', err);
            });
        }
    }

    constructor(options: NetworkOptions) {
        super();
        this.options = options;
        if (
            !options ||
            !options.hasOwnProperty ||
            !options.hasOwnProperty("host") ||
            !options.hasOwnProperty("port") ||
            !options.hasOwnProperty("protocol") ||
            !["udp", "tcp"].includes(options.protocol)
        ) {
            console.warn(`WARNING bad NetworkControlWordSinkOptions parameters ${JSON.stringify(options)}. No control words will be outputted to this sink.`);
        }
        this.options = options;
        if (options.protocol === "udp") {
            this.client = UDP.createSocket("udp4");
        }
        else if (options.protocol === "tcp") {
            // this.server = TCP.createServer();
            console.warn("WARNING unsupported protocol tcp: NOT IMPLEMENTED YET");
        }
        else {
            console.warn(`WARNING NetworkControlWordSinkOptions unknown network protocol: ${options.protocol}, expected "upd" or "tcp". No control words will be outputted to this sink."`);
        }
    }

}