import ControlInputSources from "../control-input-sources/index";
import { ControlInputSourceHandler } from "../control-input-sources/model";
import { ControlSourceInputRouter } from "../control-input-sources/router";
import ControlWords from "../control-words/index";
import InputOutputDevices from "../input-output-device-controllers/index";
import DeviceOuputSinks from "../output-sinks/index"
import { DeviceOutputRouter } from "../output-sinks/router";
import { parseArgs } from "node:util";



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
        console.log("cool");

        console.log("ControlInputSources", ControlInputSources);
        parsed_args.values["source"].forEach((source_str) => {
            console.log("source_str", source_str);
            const source_str_split = source_str.split("=");

            if (source_str_split.length > 2) {
                throw "Too many '=' key value delimiters: " + JSON.stringify(parsed_args);
            }

            let command_name = source_str_split[0];

            let args: Array<string> = [];
            if (source_str_split.length == 2) {
                // has arguments
                args = source_str_split[1].split(",");
            }
            console.log("argsargsargs", args);
            const SourceHandler = ControlInputSources[command_name];
            let sourceHandlerInstance = null;
            if (args.length) {
                sourceHandlerInstance = new (SourceHandler as new (...args: any[]) => ControlInputSourceHandler)(...args);
            }
            else {
                sourceHandlerInstance = new (SourceHandler as unknown as new () => ControlInputSourceHandler)();
            }
            console.log("-----------------------");
        })
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

