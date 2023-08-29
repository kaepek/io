#!/bin/bash
":" //# https://sambal.org/?p=1014; NODE_OPTIONS=--experimental-vm-modules NODE_NO_WARNINGS=1 exec /usr/bin/env node --experimental-loader=$(which extensionless) "$0" "$@"
;
import ControlInputSources from "../control-input-sources/index";
import { ControlInputSourceHandler } from "../control-input-sources/model";
import { ControlSourceInputRouter } from "../control-input-sources/router";
import ControlWords from "../control-words/index";
import { ControlWordHandlerBase } from "../control-words/model";
import InputOutputDevices from "../input-output-device-controllers/index";
import { InputOutputDeviceControllerBase } from "../input-output-device-controllers/model";
import DeviceOuputSinks from "../output-sinks/index"
import { OutputSinkBase } from "../output-sinks/model";
import { DeviceOutputRouter } from "../output-sinks/router";
import { ParseArgsConfig, parseArgs } from "node:util";
import { StreamJunctionDirector } from "../stream-junction-director";
import { DelimitedASCIILine } from "../device-output-models/handlers/delimited-ascii-line";

const parse_options: ParseArgsConfig = {
    options: {
        source: {
            type: "string",
            short: "i",
            multiple: true
        },
        control_word: {
            type: "string",
            short: "c",
            multiple: true
        },
        peripheral: {
            type: "string",
            short: "p",
            multiple: true
        },
        sink: {
            type: "string",
            short: "o",
            multiple: true
        }
    }
};

function parse_concept<T>(parsed_args_concept_values: Array<string>, concept_name: string, concept_index: any) {
    // parse control words
    const concept_items = [] as Array<T>;
    parsed_args_concept_values.forEach((source_str) => {
        // maybe check for comma syntax so so split by this first in case of -c start,stop rather than -c start -c stop no do a pipe symbol instead
        const source_str_split = source_str.split("=");
        if (source_str_split.length > 2) {
            throw `Director error: Too many '=' key value delimiters for ${concept_name}: ${JSON.stringify(parsed_args_concept_values)}`;
        }
        let concept_handler_name = source_str_split[0];
        let args: Array<string> = [];
        if (source_str_split.length == 2) { // has arguments
            args = source_str_split[1].split(",");
        }
        const ConceptHandler = concept_index[concept_handler_name];

        if (!ConceptHandler) {
            throw `Director error: ConceptHandler for concept ${concept_name} with name ${concept_handler_name} is missing. Options are ${Object.keys(concept_index)}`;
        }
        let wordHandlerInstance = null;
        if (args.length) {
            wordHandlerInstance = new (ConceptHandler as new (...args: any[]) => T)(...args);
        }
        else {
            wordHandlerInstance = new (ConceptHandler as unknown as new () => T)();
        }
        concept_items.push(wordHandlerInstance);
    });
    return concept_items;
}

function custom_parse_args() {
    const eg = [
        '/usr/local/bin/node',
        '/home/jonathan/code/kaepek/io/dist/host/controller/scripts/cli.js',
        '-i',
        'network=localhost,9090,udp',
        'keyboard',
        '-c',
        'start',
        '-c',
        'null',
        '-c',
        'stop',
        '-p',
        'serial-usb',
        '-p',
        'console',
        '-o',
        'console'
    ];

    const args = process.argv;
    args.splice(0, 2);
    const command_words_short: { [name: string]: any } = {};
    const command_words_long: { [name: string]: any } = {};

    if (parse_options.options) {
        const options = parse_options.options as any;
        Object.keys(options).forEach((option_name) => {
            command_words_long[`--${option_name}`] = { ...options[option_name], option_name };
            if (options[option_name].short) {
                command_words_short[`-${options[option_name].short}`] = { ...options[option_name], option_name };
            }
        });
    };

    const parsed_args: { values: { [key: string]: Array<string> } } = { values: {} };
    let current_arg_name: string | null = null;

    args.forEach((arg_str_segment) => {
        const possible_arg = command_words_short[arg_str_segment] || command_words_long[arg_str_segment];
        if (possible_arg) {
            const arg_name = possible_arg.option_name;
            if (!parsed_args.values.hasOwnProperty(arg_name)) {
                parsed_args.values[arg_name] = [];
            }
            current_arg_name = arg_name;
        }
        else {
            // we are already handling the word collect values
            parsed_args.values[current_arg_name as string].push(arg_str_segment);
        }
    });

    return parsed_args;
}


async function start_cli() {
    const parsed_args = custom_parse_args(); // parseArgs(parse_options) as any;
    // we need atleast a source, one control word and an IO device.
    // most we want is many sources, words, IOdevices and sinks. aka 4
    if (
        (parsed_args.values["source"] && parsed_args.values["source"].length) &&
        (parsed_args.values["control_word"] && parsed_args.values["control_word"].length) &&
        (parsed_args.values["peripheral"] && parsed_args.values["peripheral"].length)
    ) {
        // parse source handlers
        const sources = parse_concept<ControlInputSourceHandler>(parsed_args.values["source"], "source", ControlInputSources);
        // parse control words
        const words = parse_concept<ControlWordHandlerBase>(parsed_args.values["control_word"], "control_word", ControlWords);
        // parse io devices
        const devices = parse_concept<InputOutputDeviceControllerBase>(parsed_args.values["peripheral"], "peripheral", InputOutputDevices);
        // parse sinks
        const sinks = parse_concept<OutputSinkBase>(parsed_args.values["sink"] || [], "sink", DeviceOuputSinks);
        // fixed model atm
        const model = new DelimitedASCIILine();

        const inputSourceRouter = new ControlSourceInputRouter(sources);
        const outputRouter = new DeviceOutputRouter(sinks);
        const director_instance = new StreamJunctionDirector(inputSourceRouter, words, devices, model, outputRouter);

        /*console.log("sources", sources);
        console.log("words", words);
        console.log("devices", devices);
        console.log("sinks", sinks);
        console.log("model", model);
        console.log(director_instance);*/

        return director_instance.ready();
    }
    else {

        const missing_options: Array<string> = [];
        Object.keys(parse_options.options as any).forEach((option_name) => {
            if (!parsed_args.values[option_name] && option_name !== "sink") {
                missing_options.push(option_name);
            }
        });
        throw `Director error: Missing the following arguments. Need the following ${missing_options.map(option_str => {
            const option = (parse_options.options as any)[option_str];
            return `--${option_str} or -${option.short}`
        }).join(", ")}. --sink or -o argument is optional.`;
    }
}

start_cli().then(console.log).catch((err) => {
    console.error(err);
    process.exit(1);
});

