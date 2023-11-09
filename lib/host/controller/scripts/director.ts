#!/usr/bin/env node
import ControlInputSources from "../control-input-sources/index.js";
import { ControlInputSourceHandler } from "../control-input-sources/model.js";
import { ControlSourceInputRouter } from "../control-input-sources/router.js";
import ControlWords from "../control-words/index.js";
import { ControlWordHandlerBase } from "../control-words/model.js";
import InputOutputDevices from "../input-output-device-controllers/index.js";
import { InputOutputDeviceControllerBase } from "../input-output-device-controllers/model.js";
import DeviceOutputSinks from "../output-sinks/index.js"
import { OutputSinkBase } from "../output-sinks/model.js";
import { DeviceOutputRouter } from "../output-sinks/router.js";
import { StreamJunctionDirector } from "../stream-junction-director.js";
import { DelimitedASCIILine } from "../device-output-models/handlers/delimited-ascii-line.js";
import { console2 } from "../utils/log.js";
import { ArgumentHandlers, CliArg, CliArgType, parse_args } from "../utils/cli-args.js";
import ControlWordsIndex from "../control-words/index.js";

const program_description = `A program to allow for controlling IO from various devices.`;

const cli_args: Array<CliArg> = [
    {
        name: "source",
        type: CliArgType.String,
        short: "i",
        help: `Input control sources (one or more). Choose from one of ${Object.keys(ControlInputSources).join(",")}. Provide one of these by itself <input_source>, space seperated if you want multiple of them, or use multiple flags. If the control source takes arguments then you may configure each like this <input_source>=args1,arg2,arg3 for example: -i network=localhost,9000,udp`,
        required: true
    },
    {
        name: "control_word",
        type: CliArgType.String,
        short: "c",
        help: `Control words handlers (one or more). Defines which control words to detect from the input control sources and forward to the peripherals. Choose from the following: ${Object.keys(ControlWordsIndex).join(",")}.`,
        required: true
    },
    {
        name: "peripheral",
        type: CliArgType.String,
        short: "p",
        help: `Peripheral devices (one or more) to send the detected control words to. Choose one of the following: ${Object.keys(InputOutputDevices).join(",")}.`,
        required: true
    },
    {
        name: "sink",
        type: CliArgType.String,
        short: "o",
        help: `Output data sinks. Takes data emitted from the peripheral devices and forwards it to an output sink. Choose one of the following: ${Object.keys(DeviceOutputSinks).join(",")}. Provide one of these by itself <output_sink>, space seperated if you want multiple of them, or use multiple flags. If the output sink takes arguments then you may configure each like this <output_sink>=args1,arg2,arg3 for example: -o network=localhost,9000,udp`,
        required: true
    }
];


function parse_concept<T>(_parsed_args_concept_values: Array<string> | string, concept_name: string, concept_index: any) {
    const parsed_args_concept_values: Array<string> = Array.isArray(_parsed_args_concept_values) ? _parsed_args_concept_values : [_parsed_args_concept_values];
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


async function start_cli() {
    const parsed_args = parse_args("Director", program_description, cli_args, ArgumentHandlers) as any;
    // we need atleast a source, one control word and an IO device.
    // most we want is many sources, words, IOdevices and sinks. aka 4
    // parse source handlers
    const sources = parse_concept<ControlInputSourceHandler>(parsed_args.source, "source", ControlInputSources);
    // parse control words
    const words = parse_concept<ControlWordHandlerBase>(parsed_args.control_word, "control_word", ControlWords);
    // parse io devices
    const devices = parse_concept<InputOutputDeviceControllerBase>(parsed_args.peripheral, "peripheral", InputOutputDevices);
    // parse sinks
    const sinks = parse_concept<OutputSinkBase>(parsed_args.sink || [], "sink", DeviceOutputSinks);
    // fixed model atm
    const model = new DelimitedASCIILine();

    const inputSourceRouter = new ControlSourceInputRouter(sources);
    const outputRouter = new DeviceOutputRouter(sinks);
    const director_instance = new StreamJunctionDirector(inputSourceRouter, words, devices, model, outputRouter);

    return director_instance.ready();
}

start_cli().then(console2.success).catch((err) => {
    console2.error(err);
    process.exit(1);
});

