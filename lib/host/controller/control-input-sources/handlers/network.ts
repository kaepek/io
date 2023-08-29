import { ControlInputSourceHandler } from "../model";
import UDP from "dgram";
import TCP from "net";
import { ControlWords } from "../../control-words/words";
import { ControlInputSources } from "../sources";

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
                    console.log(`INFO ControlInputSourceHandler: NetworkControlWordSourceHandler ready. Listening to Address: ${this.options?.address} Port: ${this.options?.port}`);
                    resolve();
                });
                server.on("error", (err) => {
                    console.error(`WARNING ${this.options?.protocol} server error: ${JSON.stringify(err)}, ${JSON.stringify(err.stack)}. No input will come from this source.`);
                    server.close();
                });
                server.on("message", (message, info) => {
                    // messages are like word|value
                    const message_str = message.toString();
                    const message_split = message_str.split("|");
                    if (!message_split) return console.warn("WARNING NetworkControlWordSourceHandler falsy message recieved");
                    const word = message_split[0] as any as number;
                    if (!ControlWords[word]) return console.warn(`WARNING NetworkControlWordSourceHandler word not recognised recieved word value: ${word}`);
                    if (message_split.length === 1) {
                        this.subject.next({ source: this.type, word });
                    }
                    else if (message_split.length === 2) {
                        const value = message_split[1];
                        this.subject.next({ source: this.type, word, value });
                    }
                    else {
                        return console.warn(`WARNING NetworkControlWordSourceHandler word had more than one provided value`);
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
            console.error(`WARNING Error bad NetworkControlWordSourceHandlerOptions parameters ${JSON.stringify(arguments)}. No input will come from this source.`);
        }
        port = parseFloat(port as string);
        this.options = {address, port, protocol};
        if (this.options.protocol === "udp") {
            this.server = UDP.createSocket("udp4");
        }
        else if (this.options.protocol === "tcp") {
            console.error(`WARNING NetworkControlWordSourceHandlerOptions unsupported network protocol: ${this.options.protocol}, expected "upd" or "tcp". No input will come from this source."`);
            // this.server = TCP.createServer(); // todo
        }
        else {
            console.error(`WARNING NetworkControlWordSourceHandlerOptions unknown network protocol: ${this.options.protocol}, expected "upd" or "tcp". No input will come from this source."`);
        }
    }
}