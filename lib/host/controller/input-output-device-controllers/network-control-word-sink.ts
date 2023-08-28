import { InputOutputDeviceControllerBase } from "./model";
import UDP from "dgram";
import TCP from "net";
import { ControlWordEvent } from "../control-words/handlers/model";
import { ControlWordDataTypes } from "../control-words/words";
interface NetworkControlWordSinkOptions {
    host: string,
    port: number,
    protocol: "udp" | "tcp"
}

export class NetworkControlWordSink extends InputOutputDeviceControllerBase {
    options: NetworkControlWordSinkOptions;
    client: UDP.Socket | undefined;

    async ready(): Promise<void> {

    }

    handle_input_control_word(event: ControlWordEvent): void {
        // we are just sending to the correct host/port/protocol the following "${word}|${value}" or just "${word}"
        if (this.options.protocol === "udp") {
            const client = this.client as UDP.Socket;
            let packet = null;
            if (event.word.data_type === ControlWordDataTypes.None) {
                packet = `${event.word.name}`;
            }
            else {
                packet = `${event.word.name}|${event.value}`;
            }
            const packet_bytes = Buffer.from(packet);            
            client.send(packet_bytes, this.options.port, this.options.host, (err) => {
                if (err) console.warn("NetworkControlWordSink failed to transmit to host");
            })
        }
        else {
            console.warn("NetworkControlWordSink to handle_input_control_word unknown protocol");
        }
    }

    constructor(options: NetworkControlWordSinkOptions) {
        super();
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