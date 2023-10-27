import UDP from "dgram";
import TCP from "net";
import fs from "fs";
import { console2 } from "./log.js";
import { Subject } from "rxjs";

class NetworkAdaptor {
    server: UDP.Socket;
    client: UDP.Socket | null = null;

    incoming_address: string;
    incoming_port: number;
    incoming_protocol: string;
    outgoing_address: string | null;
    outgoing_port: number | null;
    outgoing_protocol: string | null;
    incoming_data_config: Array<any>;
    outgoing_data_config: Array<any> = [];
    data_delimeter: string;

    incoming_data_subject: Subject<any> = new Subject<any>;
    public incoming_data$ = this.incoming_data_subject.asObservable();

    incoming_data_parser(incoming_data_str: any) {
        const message_str = incoming_data_str.toString();
        const line_split = message_str.split(this.data_delimeter);
        const parsed_data: any = {};
        this.incoming_data_config.forEach(input_description => {
            const name = input_description.name;
            const position = input_description.position;
            const float_element_data = parseFloat(line_split[position]);
            if (Number.isNaN(float_element_data) != true) {
                parsed_data[name] = float_element_data;
            }
            else {
                parsed_data[name] = 0;
            }
        });
        return parsed_data;
    }

    outgoing_data_serialiser(outgoing_data_obj: any) {
        const outgoing_obj: any = {};
        this.outgoing_data_config.forEach((output_description) => {
            const name = output_description.name;
            const position = output_description.position;
            const value = outgoing_data_obj[name];
            outgoing_obj[position] = value;
        });
        const int_keys = Object.keys(outgoing_obj).map((key)=>parseFloat(key));
        const max_index = Math.max(...int_keys);
        const outgoing_array = [...Array(max_index + 1)].map((_, idx) => idx).map((idx) => outgoing_obj[idx]);
        return outgoing_array.join(this.data_delimeter);
    }

    transmit_outgoing_data(data_obj: any) {
        if (this.outgoing_protocol === "udp") {
            const data_str = this.outgoing_data_serialiser(data_obj);
            const packet = Buffer.from(data_str.toString());
            (this.client as UDP.Socket).send(packet, this.outgoing_port as any, this.outgoing_address as any, (err) => {    
                if (err) return console2.error('Failed to send UPD packet in NetworkOutputSink: ', err);
            });
        }
    }

    incoming_data_callback(message_obj: any, info: any) {
        // throw "Error incoming_data_callback not implemented";
    }

    async ready() {
        return new Promise<void>((resolve, reject) => {
            if (this.incoming_protocol === "tcp") {
            }
            else if (this.incoming_protocol === "udp") {
                const server = this.server;
                server.on("listening", () => {
                    console2.success(`INFO NetworkAdaptor is now ready.`);
                    resolve();
                });
                server.on("error", (err: any) => {
                    console2.error(`WARNING ${this.incoming_protocol} server error: ${JSON.stringify(err)}, ${JSON.stringify(err.stack)}. No input will come from this source.`);
                    server.close();
                });
                server.on("message", (message: any, info: any) => {
                    // decode message based on config
                    const parsed_data = this.incoming_data_parser(message);
                    this.incoming_data_subject.next({parsed_data, info});
                    this.incoming_data_callback(parsed_data, info);
                });
                server.bind({ port: this.incoming_port, address: this.incoming_address });
            }
        });
    }

    constructor(incoming_address: string,
        incoming_port: number,
        incoming_protocol: string,
        incoming_data_config_path: string,
        data_delimeter: string,
        outgoing_address?: string | null,
        outgoing_port?: number | null,
        outgoing_protocol?: string | null,
    ) {

        this.incoming_address = incoming_address;
        this.incoming_port = incoming_port;
        this.incoming_protocol = incoming_protocol;
        this.outgoing_address = outgoing_address || null;
        this.outgoing_port = outgoing_port || null;
        this.outgoing_protocol = outgoing_protocol || null;
        this.data_delimeter = data_delimeter || ",";

        const cwd = process.cwd();
        const full_incoming_data_config_path = `${cwd}/${incoming_data_config_path}`;
        const file_exists = fs.existsSync(full_incoming_data_config_path);

        if (!file_exists) {
            console2.error(`WARNING NetworkAdaptor incoming_data_config_path does not specify a real file ${full_incoming_data_config_path}`);
            process.exit(1);
        }

        const file_data = fs.readFileSync(full_incoming_data_config_path);
        const file_json = JSON.parse(file_data.toString());

        if (!file_json.hasOwnProperty || !file_json.hasOwnProperty("inputs")) {
            console2.error(`WARNING NetworkAdaptor incoming_data_config_path file does not have an 'inputs' member`);
            process.exit(1);
        }
        this.incoming_data_config = file_json.inputs;

        if (incoming_protocol === "udp") {
            console2.success(`NetworkAdaptor successfully bound to incoming source, network protocol: ${incoming_protocol}, host: ${incoming_address}, port: ${incoming_port}`);
            this.server = UDP.createSocket("udp4");
        }
        else if (incoming_protocol === "tcp") {
            console2.error(`WARNING NetworkAdaptor fail to bind to incoming source, network protocol: ${incoming_protocol}, host: ${incoming_address}, port: ${incoming_port}. Unsupported incoming network protocol: ${incoming_protocol}, expected "upd". No input will come from this source.`);
            process.exit(1);
        }
        else {
            console2.error(`WARNING NetworkAdaptor fail to bind to incoming source, network protocol: ${incoming_protocol}, host: ${incoming_address}, port: ${incoming_port}. Unsupported incoming network protocol: ${incoming_protocol}, expected "upd". No input will come from this source.`);
            process.exit(1);
        }

        if (outgoing_protocol === "udp") {
            console2.success(`NetworkAdaptor successfully bound to outgoing sink, network protocol: ${outgoing_protocol}, host: ${outgoing_address}, port: ${outgoing_port}`);
            this.client = UDP.createSocket("udp4");
        }
        else if (outgoing_protocol === "tcp") {
            console2.warn(`WARNING NetworkAdaptor fail to bind to outgoing sink, network protocol: ${outgoing_protocol}, host: ${outgoing_address}, port: ${outgoing_port}. Unsupported outgoing network protocol: ${outgoing_protocol}, expected "upd". No output will be emitted to this sink.`);
        }
        else if (outgoing_protocol === undefined) {
            console2.warn(`WARNING NetworkAdaptor fail to bind to outgoing sink, network protocol: ${outgoing_protocol}, host: ${outgoing_address}, port: ${outgoing_port}. Unsupported outgoing network protocol: ${outgoing_protocol}, expected "upd". No output will be emitted to this sink.`);
        }
        else {
            console2.warn(`WARNING NetworkAdaptor fail to bind to outgoing sink, network protocol: ${outgoing_protocol}, host: ${outgoing_address}, port: ${outgoing_port}. Unsupported outgoing network protocol: ${outgoing_protocol}, expected "upd". No output will be emitted to this sink.`);
        }
    }
}

export default NetworkAdaptor;