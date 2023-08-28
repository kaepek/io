import { InputOutputDeviceControllerBase } from "./model";
import UDP from "dgram";
import TCP from "net";
import { ControlWordEvent } from "../control-words/handlers/model";
interface NetworkControlWordSinkOptions {
    host: string,
    port: number,
    protocol: "udp" | "tcp"
}

export class NetworkControlWordSink extends InputOutputDeviceControllerBase {
    options: NetworkControlWordSinkOptions;
    // client
    client: UDP.Socket | undefined;

    async ready(): Promise<void> {

    }

    handle_input_control_word(event: ControlWordEvent): void {
        // we are just sending to the correct host/port/protocol the following "${word}|${value}" or just "${word}"
        if (this.options.protocol === "udp") {
            const client = this.client as UDP.Socket;
            let packet = null;
            // if (event.word.data_type)
            //const packet = Buffer.from("word");
            
            client.send(packet, this.options.port, this.options.host, (err) => {
                if (err) {
                    console.error('Failed to send packet !!')
                } else {
                    console.log('Packet send !!')
                }
            })
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
            console.error(`WARNING Error bad NetworkControlWordSinkOptions parameters ${JSON.stringify(options)}. No control words will be outputted to this sink.`);
        }
        this.options = options;
        if (options.protocol === "udp") {
            this.client = UDP.createSocket("udp4");
        }
        else if (options.protocol === "tcp") {
            // this.server = TCP.createServer();
        }
        else {
            console.error(`WARNING NetworkControlWordSinkOptions unknown network protocol: ${options.protocol}, expected "upd" or "tcp". No control words will be outputted to this sink."`);
        }

    }
}