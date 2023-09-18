import UDP from "dgram";
import TCP from "net";
import ControlWordsIndex from "../controller/control-words/index.js";
import { ControlWordDataTypes, ControlWords } from "../controller/control-words/words.js";
import { console2 } from "../controller/utils/log.js";

export class SendWord {
    client: UDP.Socket;

    async send_word(word_short_name: string, data?: string | number) {
        return new Promise<void>((resolve, reject) => {
            // find if word exists in index
            const possibleWordHandler = ControlWordsIndex[word_short_name];
            if (!possibleWordHandler) {
                throw `SendWord: No word handler found for '${word_short_name}', possible values are: ${Object.keys(ControlWordsIndex)}. Aborting.`;
                process.exit(1);
            }

            const wordHandlerInstance = new possibleWordHandler();
            let data_number: number | null = null;

            // validate whether or not we need the data argument
            if (wordHandlerInstance.data_type === ControlWordDataTypes.None) {
                if (data !== undefined) {
                    throw "SendWord: data argument provided but this control word validates that there is no data for this command. Aborting.";
                }
            }
            else {
                if (data === undefined) {
                    throw "SendWord: data required argument missing. Aborting.";
                }
                else {
                    // we have data validate it
                    data_number = parseFloat(data as string) as number;
                    const max_value = wordHandlerInstance.max_value;
                    const min_value = wordHandlerInstance.min_value;
                    if (max_value === null || min_value === null) {
                        throw `WordHandler for ${word_short_name} does not specify a min_value or a max_value cannot safely validate this control word. Aborting.`;
                    }
                    if (data_number > max_value) {
                        throw `Word handler validation for word ${word_short_name} with value ${data_number} exceeded max_value ${max_value}. Aborting.`;
                    }
                    else if (data_number < min_value) {
                        throw `Word handler validation for word ${word_short_name} with value ${data_number} was below min_value ${min_value}. Aborting.`;
                    }
                }
            }
            let data_str = `${wordHandlerInstance.name}`;
            if (data !== undefined) {
                data_str = `${wordHandlerInstance.name}|${data_number}`;
            }
            const packet = Buffer.from(data_str.toString());

            this.client.send(packet, this.outgoing_port, this.outgoing_address, (err) => {
                if (err) return reject('Failed to send UPD packet in NetworkOutputSink: ' + err);
                resolve();
            });
        });
    }

    async ready() {

    }

    outgoing_address;
    outgoing_port;
    outgoing_protocol;

    constructor(outgoing_address: string, outgoing_port: number, outgoing_protocol: string) {
        if (outgoing_address === "udp") {
            this.client = UDP.createSocket("udp4");
        }
        else {
            console2.error(`WARNING NetworkAdaptor unsupported incoming network protocol: ${outgoing_protocol}, expected "upd". No input will come from this source."`);
            process.exit(1);
        }

        this.outgoing_address = outgoing_address;
        this.outgoing_port = outgoing_port;
        this.outgoing_protocol = outgoing_protocol;

    }
}