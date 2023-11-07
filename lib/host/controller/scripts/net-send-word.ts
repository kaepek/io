#!/usr/bin/env node
import ControlWordsIndex from "../control-words/index.js";
import { CliArg, CliArgType, parse_args, ArgumentHandlers } from "../utils/cli-args.js";
import { SendWord } from "../utils/send-word.js";
import { console2 } from "../utils/log.js";

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