import { console2 } from "../../utils/log";
import { OutputSinkBase } from "../model";
import { DeviceOutputSinks } from "../sinks";
import UDP from "dgram";

interface NetworkOptions {
    port: number;
    host: string;
    protocol: "udp" | "tcp"
}

export class NetworkOutputSink extends OutputSinkBase {
    type = DeviceOutputSinks.Network;
    options: NetworkOptions;
    client: UDP.Socket | undefined;

    async ready() {
        console2.success("INFO OutputSink: NetworkOutputSink ready.");
    }

    output_handler(output: any) {
        if (this.options.protocol === "udp") {
            const packet = Buffer.from(output.toString());
            const client = this.client as UDP.Socket;
            client.send(packet, this.options.port, this.options.host, (err) => {
                
                if (err) return console2.error('Failed to send UPD packet in NetworkOutputSink: ', err);
            });
        }
    }

    constructor(host: string,
        port: number|string,
        protocol: "udp" | "tcp") {
        super();
        if (
            !host ||
            !port ||
            !protocol ||
            !["udp", "tcp"].includes(protocol)
        ) {
            console2.warn(`WARNING bad NetworkControlWordSinkOptions parameters ${JSON.stringify(arguments)}. No control words will be outputted to this sink.`);
        }
        port = parseFloat(port as string);
        this.options = {host, port, protocol};
        if (this.options.protocol === "udp") {
            this.client = UDP.createSocket("udp4");
        }
        else if (this.options.protocol === "tcp") {
            // this.server = TCP.createServer();
            console2.warn("WARNING unsupported protocol tcp: NOT IMPLEMENTED YET");
        }
        else {
            console2.warn(`WARNING NetworkControlWordSinkOptions unknown network protocol: ${this.options.protocol}, expected "upd" or "tcp". No control words will be outputted to this sink."`);
        }
    }

}