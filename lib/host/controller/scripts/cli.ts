import ControlInputSources from "../control-input-sources/index";
import { ControlInputSourceHandler } from "../control-input-sources/model";
import { ControlSourceInputRouter } from "../control-input-sources/router";
import ControlWords from "../control-words/index";
import { ControlWordHandlerBase } from "../control-words/model";
import InputOutputDevices from "../input-output-device-controllers/index";
import DeviceOuputSinks from "../output-sinks/index"
import { DeviceOutputRouter } from "../output-sinks/router";
import { parseArgs } from "node:util";

function parse_concept<T>(parsed_args_concept_values: Array<string>, concept_name: string, concept_index: any) {
    // parse control words
    const concept_items = [] as Array<T>;
    parsed_args_concept_values.forEach((source_str) => {
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
                short: "o"
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
        const sources = [] as Array<ControlInputSourceHandler>;
        parsed_args.values["source"].forEach((source_str) => {
            const source_str_split = source_str.split("=");
            if (source_str_split.length > 2) {
                throw "Too many '=' key value delimiters for source: " + JSON.stringify(parsed_args);
            }
            let command_name = source_str_split[0];
            let args: Array<string> = [];
            if (source_str_split.length == 2) { // has arguments
                args = source_str_split[1].split(",");
            }
            const SourceHandler = ControlInputSources[command_name];
            let sourceHandlerInstance = null;
            if (args.length) {
                sourceHandlerInstance = new (SourceHandler as new (...args: any[]) => ControlInputSourceHandler)(...args);
            }
            else {
                sourceHandlerInstance = new (SourceHandler as unknown as new () => ControlInputSourceHandler)();
            }
            sources.push(sourceHandlerInstance);
        });
        // parse control words
        const words = [] as Array<ControlWordHandlerBase>;
        parsed_args.values["control_word"].forEach((source_str) => {
            const source_str_split = source_str.split("=");
            if (source_str_split.length > 2) {
                throw "Too many '=' key value delimiters for control_word: " + JSON.stringify(parsed_args);
            }
            let word_name = source_str_split[0];
            let args: Array<string> = [];
            if (source_str_split.length == 2) { // has arguments
                args = source_str_split[1].split(",");
            }
            const WordHandler = ControlWords[word_name];
            let wordHandlerInstance = null;
            if (args.length) {
                wordHandlerInstance = new (WordHandler as new (...args: any[]) => ControlWordHandlerBase)(...args);
            }
            else {
                wordHandlerInstance = new (WordHandler as unknown as new () => ControlWordHandlerBase)();
            }
            words.push(wordHandlerInstance);
        });


        console.log("sources", sources);
        console.log("words", words);


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

