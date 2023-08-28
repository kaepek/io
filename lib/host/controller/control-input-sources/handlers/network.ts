import { ControlInputSourceHandler } from "./model";
import UDP from "dgram";
import TCP from "net";
import { ControlWordsUI8Inverted } from "../../control-words/words";
import { ControlInputSources } from "../sources";

interface NetworkControlWordSourceOptions {
    address: string,
    port: number,
    protocol: "udp" | "tcp"
}
export class NetworkControlWordSource extends ControlInputSourceHandler {
    server: UDP.Socket | TCP.Server | undefined;
    options: NetworkControlWordSourceOptions | null = null;
    type = ControlInputSources.NetworkControlWord;
    async ready() {
        if (this.options?.protocol === "tcp") {

        }
        else if (this.options?.protocol === "udp") {
            const server = this.server as UDP.Socket;
            server.on("listening", () => {
                console.log(`INFO NetworkControlWordSource ready. Listening to Address: ${this.options?.address} Port: ${this.options?.port}`);
            });
            server.on("error", (err) => {
                console.error(`WARNING ${this.options?.protocol} server error: ${JSON.stringify(err)}, ${JSON.stringify(err.stack)}. No input will come from this source.`);
                server.close();
            });
            server.on("message", (message, info) => {
                // messages are like word|value
                const message_str = message.toString();
                const message_split = message_str.split("|");
                if (!message_split) return console.warn("WARNING NetworkControlWordSource falsy message recieved");
                const word = message_split[0];
                if (!ControlWordsUI8Inverted[word]) return console.warn(`WARNING network source control word not recognised recieved word value: ${word}`);
                if (message_split.length === 1) {
                    this.subject.next({source: this.type, word });
                }
                else if (message_split.length === 2) {
                    const value = message_split[1];
                    this.subject.next({source: this.type, word, value });
                }
                else {
                    return console.warn(`WARNING network source control word had more than one provided value`);
                }
            });
            server.bind({ port: this.options?.port, address: this.options?.address });
        }
    }

    constructor(options: NetworkControlWordSourceOptions) {
        super();
        if (
            !options ||
            !options.hasOwnProperty ||
            !options.hasOwnProperty("address") ||
            !options.hasOwnProperty("port") ||
            !options.hasOwnProperty("protocol") ||
            !["udp", "tcp"].includes(options.protocol)
        ) {
            console.error(`WARNING Error bad NetworkControlWordSourceOptions parameters ${JSON.stringify(options)}. No input will come from this source.`);
        }
        this.options = options;
        if (options.protocol === "udp") {
            this.server = UDP.createSocket("udp4");
        }
        else if (options.protocol === "tcp") {
            this.server = TCP.createServer();
        }
        else {
            console.error(`WARNING Unknown network protocol: ${options.protocol}, expected "upd" or "tcp". No input will come from this source."`);
        }
    }
}