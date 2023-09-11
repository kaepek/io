import { ControlInputSourceHandler } from "../model";
import UDP from "dgram";
import TCP from "net";
import { ControlWords } from "../../control-words/words";
import { ControlInputSources } from "../sources";
import { console2 } from "../../utils/log";

interface NetworkControlWordSourceHandlerOptions {
    address: string,
    port: number,
    protocol: "udp" | "tcp"
}
export class NetworkControlWordSourceHandler extends ControlInputSourceHandler {
    server: UDP.Socket | TCP.Server | undefined;
    options: NetworkControlWordSourceHandlerOptions | null = null;
    type = ControlInputSources.NetworkControlWord;
    async ready() {
        return new Promise<void>((resolve, reject) => {
            if (this.options?.protocol === "tcp") {
            }
            else if (this.options?.protocol === "udp") {
                const server = this.server as UDP.Socket;
                server.on("listening", () => {
                    console2.success(`INFO ControlInputSourceHandler: NetworkControlWordSourceHandler ready. Listening to Address: ${this.options?.address} Port: ${this.options?.port}`);
                    resolve();
                });
                server.on("error", (err) => {
                    console2.error(`ERROR ${this.options?.protocol} server error: ${JSON.stringify(err)}, ${JSON.stringify(err.stack)}. No input will come from this source.`);
                    server.close();
                });
                server.on("message", (message, info) => {
                    // messages are like word|value
                    const message_str = message.toString();
                    const message_split = message_str.split("|");
                    if (!message_split) return console2.warn("WARNING NetworkControlWordSourceHandler falsy message recieved");
                    const word = parseFloat(message_split[0]);
                    if (!ControlWords[word]) return console2.warn(`WARNING NetworkControlWordSourceHandler word not recognised recieved word value: ${word}`);
                    if (message_split.length === 1) {
                        this.subject.next({ source: this.type, word });
                    }
                    else if (message_split.length === 2) {
                        const value = parseFloat(message_split[1]);
                        this.subject.next({ source: this.type, word, value });
                    }
                    else {
                        return console2.warn(`WARNING NetworkControlWordSourceHandler word had more than one provided value`);
                    }
                });
                server.bind({ port: this.options?.port, address: this.options?.address });
            }
        });


    }

    constructor(address: string,
        port: number | string,
        protocol: "udp" | "tcp") {
        super();
        if (
            !address ||
            !port ||
            protocol === undefined ||
            !["udp", "tcp"].includes(protocol)
        ) {
            console2.warn(`WARNING Error bad NetworkControlWordSourceHandlerOptions parameters ${JSON.stringify(arguments)}. No input will come from this source.`);
        }
        port = parseFloat(port as string);
        this.options = {address, port, protocol};
        if (this.options.protocol === "udp") {
            this.server = UDP.createSocket("udp4");
        }
        else if (this.options.protocol === "tcp") {
            console2.warn(`WARNING NetworkControlWordSourceHandlerOptions unsupported network protocol: ${this.options.protocol}, expected "upd" or "tcp". No input will come from this source."`);
            // this.server = TCP.createServer(); // todo
        }
        else {
            console2.warn(`WARNING NetworkControlWordSourceHandlerOptions unknown network protocol: ${this.options.protocol}, expected "upd" or "tcp". No input will come from this source."`);
        }
    }
}