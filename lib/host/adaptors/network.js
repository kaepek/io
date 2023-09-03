import UDP from "dgram";
import TCP from "net";
import fs from "fs";

class NetworkAdaptor {
    server = null;
    client = null;

    incoming_address = null;
    incoming_port = null;
    incoming_protocol = null;
    outgoing_address = null;
    outgoing_port = null;
    outgoing_protocol = null;
    incoming_data_config = null;
    outgoing_data_config = null;
    data_delimeter = null;

    incoming_data_parser(incoming_data_str) {
        const line_split = incoming_data_str.split(this.data_delimeter);
        const parsed_data = {};
        incoming_data_config.forEach(input_description => {
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

    outgoing_data_serialiser(outgoing_data_obj) {
        const outgoing_obj = {};
        this.outgoing_data_config.forEach((output_description) => {
            const name = output_description.name;
            const position = output_description.position;
            const value = outgoing_data_obj[name];
            outgoing_obj[position] = value;
        });
        const max_index = Math.max(Object.keys(outgoing_obj));
        const outgoing_array = [...Array(max_index + 1)].map((_, idx) => idx).forEach((idx) => outgoing_obj[idx]);
        return outgoing_array.join(this.data_delimeter);
    }

    transmit_outgoing_data(data_obj) {
        if (this.options.protocol === "udp") {
            const data_str = this.outgoing_data_serialiser(data_obj);
            const packet = Buffer.from(data_str.toString());
            this.client.send(packet, this.outgoing_port, this.outgoing_address, (err) => {    
                if (err) return console.error('Failed to send UPD packet in NetworkOutputSink: ', err);
            });
        }
    }

    incoming_data_callback(message_obj, info) {
        throw "Error incoming_data_callback not implemented";
    }

    async ready() {
        return new Promise((resolve, reject) => {
            if (this.incoming_protocol === "tcp") {
            }
            else if (this.incoming_protocol === "udp") {
                const server = this.server;
                server.on("listening", () => {
                    console.log(`INFO NetworkAdaptor ready. Listening to Address: ${this.incoming_address} Port: ${this.incoming_port}`);
                    resolve();
                });
                server.on("error", (err) => {
                    console.error(`WARNING ${this.incoming_protocol} server error: ${JSON.stringify(err)}, ${JSON.stringify(err.stack)}. No input will come from this source.`);
                    server.close();
                });
                server.on("message", (message, info) => {
                    // decode message based on config
                    this.incoming_data_callback(this.incoming_data_parser(message), info);
                });
                server.bind({ port: this.incoming_port, address: this.incoming_address });
            }
        });
    }

    constructor(incoming_address,
        incoming_port,
        incoming_protocol,
        outgoing_address,
        outgoing_port,
        outgoing_protocol,
        incoming_data_config_path,
        outgoing_data_config_extensions,
        data_delimeter
    ) {

        this.incoming_address = incoming_address;
        this.incoming_port = incoming_port;
        this.incoming_protocol = incoming_protocol;
        this.outgoing_address = outgoing_address;
        this.outgoing_port = outgoing_port;
        this.outgoing_protocol = outgoing_protocol;
        this.data_delimeter = data_delimeter || ",";

        const cwd = process.cwd();
        const full_incoming_data_config_path = `${cwd}/${incoming_data_config_path}`;
        const file_exists = fs.existsSync(full_incoming_data_config_path);

        if (!file_exists) {
            console.error(`WARNING NetworkAdaptor incoming_data_config_path does not specify a real file ${full_incoming_data_config_path}`);
            process.exit(1);
        }

        const file_data = fs.readFileSync(full_incoming_data_config_path);
        const file_json = JSON.parse(file_data);

        if (!file_json.hasOwnProperty || !file_json.hasOwnProperty("inputs")) {
            console.error(`WARNING NetworkAdaptor incoming_data_config_path file does not have an 'inputs' member`);
            process.exit(1);
        }
        this.incoming_data_config = file_json.inputs;

        this.outgoing_data_config = { ...this.incoming_data_config, ...outgoing_data_config_extensions };

        if (incoming_protocol === "udp") {
            this.server = UDP.createSocket("udp4");
        }
        else if (incoming_protocol === "tcp") {
            console.error(`WARNING NetworkAdaptor unsupported incoming network protocol: ${incoming_protocol}, expected "upd". No input will come from this source."`);
            process.exit(1);
        }
        else {
            console.error(`WARNING NetworkAdaptor unknown incoming network protocol: ${incoming_protocol}, expected "upd" or "tcp". No input will come from this source."`);
            process.exit(1);
        }

        if (outgoing_protocol === "udp") {
            this.client = UDP.createSocket("udp4");
        }
        else if (outgoing_protocol === "tcp") {
            console.error(`WARNING NetworkAdaptor unsupported outgoing network protocol: ${outgoing_protocol}, expected "upd. No input will come from this source."`);
            process.exit(1);
        }
        else {
            console.error(`WARNING NetworkAdaptor unknown outgoing network protocol: ${outgoing_protocol}, expected "upd" or "tcp". No input will come from this source."`);
            process.exit(1);
        }

    }
}

export default NetworkAdaptor;