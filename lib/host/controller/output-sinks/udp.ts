import { OutputSinkBase } from "./model";
import { DeviceOutputSinks } from "./sinks";
import UDP from "dgram";

interface UDPOptions {
    port: number;
    host: string;
}

export class UDPOutputSink extends OutputSinkBase {
    type = DeviceOutputSinks.UPD;
    options: UDPOptions;
    udp_client: UDP.Socket;

    async ready() {
        
    }

    output_handler(output: any) {
        const packet = Buffer.from(output.toString());
        this.udp_client.send(packet, this.options.port, this.options.host, (err) => {
            if (err) console.error('Failed to send UPD packet in UDPOutputSink: ', err);
        });
    }

    constructor(options: UDPOptions) {
        super();
        this.options = options;
        this.udp_client = UDP.createSocket('udp4');
    }

}