import ControlInputSources from "../control-input-sources/index";
import { ControlSourceInputRouter } from "../control-input-sources/router";
import ControlWords from "../control-words/index";
import InputOutputDevices from "../input-output-device-controllers/index";
import DeviceOuputSinks from "../output-sinks/index"
import { DeviceOutputRouter  } from "../output-sinks/router";
import { parseArgs } from "node:util";

const parsedArgs = parseArgs({
    options: {
        source: {
            type: "string",
            short: "i",
            multiple: true
        },
        controlWord: {
            type: "string",
            short: "c",
            multiple: true
        },
        IODevice: {
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

async function start_cli() {
    const nParsedArgs = Object.keys(parsedArgs.values).length;
    // we need atleast a source, one control word and an IO device.
    // most we want is many sources, words, IOdevices and sinks. aka 4
    if (nParsedArgs === 3 || nParsedArgs === 4) {
    
    }
    else {
        console.error("Not enough arguments", JSON.stringify(parsedArgs));
        process.exit();
    }
    
    console.log("parsedArgs", parsedArgs, Object.keys(parsedArgs.values).length);    
}

start_cli().then(console.log).catch(console.error);

