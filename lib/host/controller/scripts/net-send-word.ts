#!/usr/bin/env node
import { ParseArgsConfig, parseArgs } from "node:util";
import UDP from "dgram";
import { ControlWordDataTypes } from "../control-words/words.js";
import ControlWordsIndex from "../control-words/index.js";
import { CliArg, CliArgType, parse_args, ArgumentHandlers } from "../utils/cli-args.js";
import { SendWord } from "../utils/send-word.js";
import { console2 } from "../utils/log.js";

// import { ArgumentHandlers, CliArg, CliArgType, parse_args } from "../../../external/kaepek-io/lib/host/controller/utils/cli-args.js";
// import { ASCIIParser } from "../../../external/kaepek-io/lib/host/controller/utils/ascii-parser.js"
// import { ACMap } from "../tasks/collect-acceleration-data";
// import fs from "fs";

const cli_args: Array<CliArg> = [
    {
        name: "host",
        type: CliArgType.String, // InputJSONFilePathArgumentHandler
        short: "a",
        help: "The command host address, indicates which host this program will send word commands to the kaepek-io-director program.",
        default: "localhost",
        required: false
    },
    {
        name: "port",
        type: CliArgType.String,
        short: "p",
        help: "The command host port, indicates which port this program will use to send word commands to the kaepek-io-director program.",
        default: 9000,
        required: false
    },
    {
        name: "protocol",
        type: CliArgType.String,
        short: "n",
        help: "The command host protocol, indicates which protocol this program will use to send word commands to the kaepek-io-director program.",
        default: "udp",
        required: false
    },
    {
        name: "word",
        type: CliArgType.String,
        short: "w",
        help: `The command word to send. Choose from the following: ${Object.keys(ControlWordsIndex).join(",")}`,
        required: true
    },
    {
        name: "data",
        type: CliArgType.Number,
        short: "d",
        help: "The data relevant to the command word. Only relevant if the word supports it.",
        required: false,
        default: undefined
    }
];

const parsed_args = parse_args("NetSend", cli_args, ArgumentHandlers) as any;
const word_sender = new SendWord(parsed_args.host, parsed_args.port, parsed_args.protocol);

word_sender.ready().then(()=>word_sender.send_word(parsed_args.word, parsed_args.data)).then(()=>process.exit(0)).catch((e)=>{
    console2.error(`An error occured when using NetSend: ${e}`);
    if (e.stack) console2.error(e.stack);
    console2.info(`For more information of how to use this program. Please try kaepek-io-netsend -h`);
    process.exit(1);
});


/*
// construct and validate transmission

const word_short_name = parsed_args.word as string;
// find if word exists in index
const possibleWordHandler = ControlWordsIndex[word_short_name];

if (!possibleWordHandler) {
    console.log(`NetSendWord: No word handler found for '${word_short_name}', possible values are: ${Object.keys(ControlWordsIndex)}. Aborting.`);
    process.exit(1);
}

const wordHandlerInstance = new possibleWordHandler();

// validate whether or not we need the data argument
if (wordHandlerInstance.data_type === ControlWordDataTypes.None) {
    if (parsed_args.data) {
        console.error("NetSendWord: --data or -d argument provided but this control word validates that there is no data for this command. Aborting.");
        process.exit(1);
    }
}
else {
    if (parsed_args.data === undefined) {
        console.error("NetSendWord: --data or -d required argument missing. Aborting.");
        process.exit(1);
    }
    else {
        // we have data validate it
        const data_number = parsed_args.data;
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
            console.error(`Word handler validation for word ${word_short_name} with value ${data_number} was below min_value ${min_value}. Aborting.`);
            process.exit(1);
        }
    }
}

let packet_str = `${wordHandlerInstance.name}`;

if (wordHandlerInstance.data_type !== ControlWordDataTypes.None) {
    const data = parsed_args.data;

    if (Number.isNaN(data)) {
        console.error(`NetSendWord: --data or -d bad argument value. Aborting.`);
        process.exit(1);
    }

    packet_str = `${wordHandlerInstance.name}|${data}`
}

const packet = Buffer.from(packet_str.toString());


if (parsed_args.protocol === "udp") {
    const client = UDP.createSocket("udp4");
    client.send(packet, parseFloat(parsed_args.port as string), parsed_args.host as string, (err) => {
        if (err) {
            console.error('NetSendWord: Failed to send UPD packet: ', err);
            process.exit(1);
        }
        console.log(`NetSendWord: Sent packet to host: ${parsed_args.host}, port: ${parsed_args.port}, protocol: ${parsed_args.protocol}, packet: '${packet_str}'`);
        process.exit(0);
    });
}
else {
    console.error(`NetSendWord Unsupported protocol: ${parsed_args.protocol}. Aborting.`);
    process.exit(1);
}*/