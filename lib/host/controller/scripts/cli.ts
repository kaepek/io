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
import { parseArgs } from "node:util";
import { StreamJunctionDirector } from "../stream-junction-director";
import { DelimitedASCIILine } from "../device-output-models/handlers/delimited-ascii-line";
import { DeviceOutputModelBase } from "../device-output-models/model";

function parse_concept<T>(parsed_args_concept_values: Array<string>, concept_name: string, concept_index: any) {
    // parse control words
    const concept_items = [] as Array<T>;
    parsed_args_concept_values.forEach((source_str) => {
        // maybe check for comma syntax so so split by this first in case of -c start,stop rather than -c start -c stop no do a pipe symbol instead
        const source_str_split = source_str.split("=");
        if (source_str_split.length > 2) {
            throw `Too many '=' key value delimiters for ${concept_name}: ${JSON.stringify(parsed_args_concept_values)}`;
        }
        let word_name = source_str_split[0];
        let args: Array<string> = [];
        if (source_str_split.length == 2) { // has arguments
            args = source_str_split[1].split(",");
        }
        const ConceptHandler = concept_index[word_name];
        console.log("ConceptHandler", concept_index, ConceptHandler, word_name);
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
    const parsed_args = parseArgs({
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
    });
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
        const words =  parse_concept<ControlWordHandlerBase>(parsed_args.values["control_word"], "control_word", ControlWords);
        // parse io devices
        const devices = parse_concept<InputOutputDeviceControllerBase>(parsed_args.values["peripheral"], "peripheral", InputOutputDevices);
        // parse sinks
        const sinks = parse_concept<OutputSinkBase>(parsed_args.values["sink"] || [], "sink", DeviceOuputSinks);
        // fixed model atm
        const model = new DelimitedASCIILine();

        const inputSourceRouter = new ControlSourceInputRouter(sources);
        const outputRouter = new DeviceOutputRouter(sinks);
        const director_instance = new StreamJunctionDirector(inputSourceRouter, words, devices, model, outputRouter);

        console.log("sources", sources);
        console.log("words", words);
        console.log("devices", devices);
        console.log("sinks", sinks);
        console.log("model", model);
        console.log(director_instance);

        return director_instance.ready();
    }
    else {
        throw "Not enough arguments: " + JSON.stringify(parsed_args);
    }

    console.log("parsed_args", parsed_args, Object.keys(parsed_args.values).length);
}

start_cli().then(console.log).catch((err) => {
    console.error(err);
    process.exit(1);
});

