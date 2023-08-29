#!/bin/sh 
":" //# https://sambal.org/?p=1014; NODE_OPTIONS=--experimental-vm-modules NODE_NO_WARNINGS=1 exec /usr/bin/env node --experimental-loader=extensionless "$0" "$@"
import { ParseArgsConfig, parseArgs } from "node:util";
import UDP from "dgram";
import { ControlWordDataTypes, ControlWords } from "../control-words/words";
import ControlWordsIndex from "../control-words/index";

const parse_options: ParseArgsConfig = {
    options: {
        host: {
            type: "string",
            short: "h"
        },
        port: {
            type: "string",
            short: "p",
        },
        protocol: {
            type: "string",
            short: "n"
        },
        word: {
            type: "string",
            short: "w",
        },
        data: {
            type: "string",
            short: "d"
        }
    }
};

let parsed_options: {
    values: {
        [longOption: string]: string | boolean | (string | boolean)[] | undefined;
    },
    positionals: string[],
    tokens?: any[] | undefined
} = { values: {}, positionals: [] };

try {
    parsed_options = parseArgs(parse_options);
}
catch (e: any) {
    console.error(`NetSendWord: ${e.message}`);
    process.exit(1);
}

const missing_options: Array<string> = [];
Object.keys(parse_options.options as any).forEach((option_name) => {
    if (!parsed_options.values[option_name] && option_name !== "data") {
        missing_options.push(option_name);
    }
});

if (missing_options.length !== 0) {
    console.error(`NetSendWord: Missing the following arguments ${missing_options.map(option_str => {
        const option = (parse_options.options as any)[option_str];
        return `--${option_str} or -${option.short}`
    }).join(", ")}`);
    process.exit(1);
}

// we have some correct args now.
const values = parsed_options.values;

// construct and validate transmission

const word_short_name = values.word as string; // ControlWords[]
// find if word exists in index
const possibleWordHandler = ControlWordsIndex[word_short_name];

if (!possibleWordHandler) {
    console.log(`NetSendWord: No word handler found for '${word_short_name}', possible values are: ${Object.keys(ControlWordsIndex)}. Aborting.`);
    process.exit(1);
}

const wordHandlerInstance = new possibleWordHandler();

// validate whether or not we need the data argument

if (wordHandlerInstance.data_type === ControlWordDataTypes.None) {
    if (values["data"]) {
        console.error("NetSendWord: --data or -d argument provided but this control word validates that there is no data for this command. Aborting.");
        process.exit(1);
    }
}
else {
    if (!values["data"]) {
        console.error("NetSendWord: --data or -d required argument missing. Aborting.");
        process.exit(1);
    }
    else {
        // we have data validate it
        const data_number = parseFloat(values["data"] as string) as number;
        const max_value = wordHandlerInstance.max_value;
        const min_value = wordHandlerInstance.min_value;
        if (max_value === null || min_value === null) {
            console.error(`WordHandler for ${word_short_name} does not specify a min_value or a max_value cannot safely validate this control word. Aborting.`);
            process.exit(1);
        }
        if (data_number > max_value) {
            console.error(`Word handler validation for word ${word_short_name} with value ${data_number} exceeded max_value ${max_value}. Aborting.`);
            process.exit(1);
        }
        else if (data_number < min_value) {
            console.error(`Word handler validation for word ${word_short_name} with value ${data_number} was below min_value ${max_value}. Aborting.`);
            process.exit(1);
        }
    }
}

const data = parseFloat(values.data as string);

if (Number.isNaN(data)) {
    console.error(`NetSendWord: --data or -d bad argument value. Aborting.`);
    process.exit(1);
}

let packet_str = `${wordHandlerInstance.name}`;

if (wordHandlerInstance.data_type !== ControlWordDataTypes.None) {
    packet_str = `${wordHandlerInstance.name}|${data}`
}

const packet = Buffer.from(packet_str.toString());


if (values.protocol === "udp") {
    const client = UDP.createSocket("udp4");
    client.send(packet, parseFloat(values.port as string), values.host as string, (err) => {
        if (err) {
            console.error('NetSendWord: Failed to send UPD packet: ', err);
            process.exit(1);
        }
        console.log(`NetSendWord: Sent packet to host: ${values.host}, port: ${values.port}, protocol: ${values.protocol}, packet: '${packet_str}'`);
        process.exit(0);
    });
}
else {
    console.error(`NetSendWord Unsupported protocol: ${parsed_options.values["protocol"]}. Aborting.`);
    process.exit(1);
}