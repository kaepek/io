import { parseArgs, ParseArgsConfig } from "node:util";
import { console2 } from "./log.js";
import fs from "fs";

const cwd = process.cwd();

export enum CliArgType {
    String = "String",
    Number = "Number",
    Boolean = "Boolean",
    InputFilePath = "InputFilePath",
    InputJSONFile = "InputJSONFile",
    OutputFilePath = "OutputFilePath",
    StringOrNumber = "StringOrNumber",
}

export interface CliArg {
    name: string;
    short: string;
    type: CliArgType;
    required: boolean;
    help?: string;
    group?: string;
    default?: any;
}

export abstract class ArgumentHandler {
    static type: CliArgType;
    abstract handle (argument_data: string): any;
}

class StringOrNumberArgumentHandler extends ArgumentHandler {
    static type = CliArgType.StringOrNumber;
    handle(argument_data: string) {
        const possible_float = parseFloat(argument_data.toString());
        if (!isNaN(possible_float)) return possible_float;
        else return argument_data;
    }
}

class StringArgumentHandler extends ArgumentHandler {
    static type = CliArgType.String;
    handle(argument_data: string) {
        return argument_data;
    };
}

class NumberArgumentHandler extends ArgumentHandler {
    static type = CliArgType.Number;
    handle(argument_data: string) {
        const possible_float = parseFloat(argument_data.toString());
        if (isNaN(possible_float)) throw `Argument data ${argument_data} did not parse to a valid number.`;
        return possible_float;
    };
}

class BooleanArgumentHandler extends ArgumentHandler {
    static type = CliArgType.Boolean;
    handle(argument_data: string) {
        if (argument_data === "true" || argument_data === "True") {
            return true;
        }
        else if (argument_data === "false" || argument_data === "False") {
            return false;
        }
        else {
            throw `Argument data ${argument_data} did not conform to type boolean, expected 'true' or 'True' or 'false' or 'False'`;
        }
    }
}

class InputFilePathArgumentHandler extends ArgumentHandler {
    static type = CliArgType.InputFilePath;
    handle(argument_data: string) {
        // file must already exist
        // argument data is a releative path away from cwd
        const full_path = `${cwd}/${argument_data}`;
        if (!fs.existsSync(full_path)) throw `Argument data ${argument_data} did not correspond to an existing file.`;
        // read the data
        try {
            return argument_data
        }
        catch (e: any) {
            throw `Argument data ${full_path}, read file error ${e.message}`;
        }
    };
}


class InputJSONFileArgumentHandler extends ArgumentHandler {
    static type = CliArgType.InputJSONFile;
    handle(argument_data: string) {
        // file must already exist
        // argument data is a releative path away from cwd
        const full_path = `${cwd}/${argument_data}`;
        if (!fs.existsSync(full_path)) throw `Argument data ${full_path} did not correspond to an existing file.`;
        // read the data
        let data = null;
        try {
            data = fs.readFileSync(full_path, 'utf8');
        }
        catch (e: any) {
            throw `Argument data ${full_path}, read file error ${e.message}`;
        }
        // parse the data
        let json_data: any = null;
        try {
            json_data = JSON.parse(data);
        }
        catch (e: any) {
            throw `Argument data ${full_path}, parse json error ${e.message}`;
        }

        return json_data;
    };
}

class OutputFilePathArgumentHandler extends ArgumentHandler {
    static type = CliArgType.OutputFilePath;
    handle(argument_data: string) {
        // file must not already exist
        // argument data is a releative path away from cwd
        const full_path = `${cwd}/${argument_data}`;
        if (fs.existsSync(full_path)) throw `Argument data ${argument_data} corresponded to an existing file.`;
        return full_path;
    };
}

type ArgumentHandlerConstructor = { new(...args: any): ArgumentHandler, type:CliArgType };
const argument_handlers_arr: Array<ArgumentHandlerConstructor> = [StringArgumentHandler, NumberArgumentHandler, BooleanArgumentHandler, InputFilePathArgumentHandler, InputJSONFileArgumentHandler, OutputFilePathArgumentHandler, StringOrNumberArgumentHandler];
export const ArgumentHandlers: {[argument_handler_name: string]: ArgumentHandlerConstructor} = argument_handlers_arr.reduce((acc: any, handler: ArgumentHandlerConstructor ) => {
    acc[handler.type] = handler;
    return acc;
}, {});

function get_arg_help(cli_arg:CliArg, mutually_exclusive_groups? : Array<Array<string>>) {
    const help = [
        `-${cli_arg.short}, --${cli_arg.name}`,
        `Type:${cli_arg.type}, ${cli_arg.required === true ? "Required!" : "Optional."}`
    ];
    if (cli_arg.group !== undefined) {
        help.push(`Member of an attribute group '${cli_arg.group}'.`); // help
        // // mutually_exclusive_groups? : Array<Array<string>>
        if (mutually_exclusive_groups?.length) {
            const relevant_group_exclusions = mutually_exclusive_groups.filter((exclusion) => exclusion.includes(cli_arg.group as string));
            help.push(`${cli_arg.group} is part of a mutually exclusive argument set {${relevant_group_exclusions.join(",")}}`);
        }
    }
    if (cli_arg.help !== undefined) {
        help.push(cli_arg.help);
    }
    return help.join("\n");
}

function custom_parse_args(parse_options: ParseArgsConfig) {
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

    args.forEach((arg_str_segment: string) => {
        const possible_arg = command_words_short[arg_str_segment] || command_words_long[arg_str_segment];
        if (possible_arg) {
            const arg_name = possible_arg.option_name;
            if (!parsed_args.values.hasOwnProperty(arg_name)) {
                parsed_args.values[arg_name] = [];
            }
            current_arg_name = arg_name;
        }
        else {
            if (parsed_args.values.hasOwnProperty(current_arg_name as string)) { // what happens for the boolean case
                // we are already handling the word collect values
                parsed_args.values[current_arg_name as string].push(arg_str_segment);
            }
        }
    });

    return parsed_args;
}

export function parse_args(program_name: string, args: Array<CliArg>, argument_handlers: {[argument_handler_name: string]: ArgumentHandlerConstructor} = ArgumentHandlers, mutually_exclusive_groups? : Array<Array<string>>) {
    // args
    args.unshift({
        name: "help",
        short: "h",
        required: false,
        type: CliArgType.Boolean,
        help: `Shows the help information for program ${program_name}`
    });
    const get_help = (cli_arg:CliArg) => get_arg_help(cli_arg, mutually_exclusive_groups);;
    const args_map_short_name: {[arg_short_name: string]: CliArg} = {};
    const args_map: {[arg_name: string]: CliArg} = args.reduce((acc: any, cli_arg) => {
        if (acc.hasOwnProperty(cli_arg.name)) {
            console2.error(`${program_name} CliArg configuration error. Duplicate definition for argument name: ${cli_arg.name}`);
            process.exit(1);
        }
        if (args_map_short_name.hasOwnProperty(cli_arg.short)) {
            console2.error(`${program_name} CliArg configuration error. Duplicate definition for argument short name: ${cli_arg.short}`);
            process.exit(1);
        }
        acc[cli_arg.name] = cli_arg;
        args_map_short_name[cli_arg.short] = cli_arg;
        return acc;
    }, {});

    const parse_args_config = args.reduce((acc: any, arg) => {
        acc.options[arg.name] = {
            type: "string",
            short: arg.short
        };
        return acc;
    }, {options: {}});

    // parse the arguments
    let parsed_args = custom_parse_args(parse_args_config); // parseArgs(parse_args_config);

    // find if we have any required arguments that are missing.
    const missing_required_arguments = args.reduce((acc: Array<string>, arg) => {
        if (arg.required === true && !parsed_args.values.hasOwnProperty(arg.name)) { // has own property might not work
            acc.push(arg.name);
        }
        return acc;
    }, []);

    if (parsed_args.values.hasOwnProperty("help")) {
        console2.info(`Help information for program: ${program_name}`);
        Object.keys(args_map).forEach((arg_name) => {
            console2.info(`Argument name: ${arg_name} -----`);
            console2.info(get_help(args_map[arg_name]));
        });
        process.exit(1);
    }

    if (missing_required_arguments.length !== 0) {
        console2.error(`${program_name}: Missing the following arguments ${missing_required_arguments.map(arg_str => {
            const option = (parse_args_config.options)[arg_str];
            return `--${arg_str} or -${option.short}`
        }).join(", ")}`);
        process.exit(1);
    }

    /* Next check for common groups.
     A group is a collection of arguments where if one of these are provided by the user it necessitates that the other
     arguments are now required to also exist. 
     */
    // collect groups
    const arg_groups: {[group: string]: Array<CliArg>} = args.reduce((acc: any, arg) => {
        if (arg.group === undefined) return acc;
        if (acc.hasOwnProperty(arg.group)) {
            acc[arg.group].push(arg);
        }
        else {
            acc[arg.group] = [arg];
        }
        return acc;
    }, {});

    const group_errors = Object.keys(arg_groups).reduce((acc: any, group_name) => {
        const group_members = arg_groups[group_name];
        const group_member_argument_defined = group_members.some((arg) => parsed_args.values.hasOwnProperty(arg.name));
        if (!group_member_argument_defined) return acc; // no group members defined group is skipped.
        // Collect missing group members and print their help messages.
        const group_member_argument_present = group_members.filter((arg) => parsed_args.values.hasOwnProperty(arg.name));
        const group_member_argument_missing = group_members.filter((arg) => !parsed_args.values.hasOwnProperty(arg.name));
        if (group_member_argument_missing.length) {
            acc.push(`${program_name}: Argument group ${group_name} error, the following group members were provided ${group_member_argument_present.map((gm) => gm.name)}, but inclusion of these arguments requires that additional arguments are set: \n ${group_member_argument_missing.map((ma) => get_help(ma))}`);
    
        }
        return acc;
    }, []);

    if (group_errors.length) {
        group_errors.forEach((ge: string) => console2.error(ge));
        process.exit(1);
    }

    if (mutually_exclusive_groups !== undefined) {
        const group_exclusion_errors: Array<string> = [];
        mutually_exclusive_groups.forEach((group_exclusion) => {
            // group_exclusion like...
            // ["group1", "group2", "group3"]
            // if two or more are in the keys of arg_groups
            const counts = group_exclusion.reduce((acc:number, group_name) => {
                if (arg_groups.hasOwnProperty(group_name)) acc++;
                return acc;
            },0)

            if (counts > 1) {
                group_exclusion_errors.push(`Group exclusion violated [${group_exclusion.join(", ")}]:`);
                group_exclusion.forEach((ge) => {
                    group_exclusion_errors.push(`Group ${ge}:`);
                    arg_groups[ge].forEach((cli_arg) => {
                        group_exclusion_errors.push(get_help(cli_arg));
                    });
                });
            }
        });
        if (group_exclusion_errors.length) {
            group_exclusion_errors.forEach((ge: string) => console2.error(ge));
            process.exit(1);
        }
    }

    // Next parse the arguments using the argument handlers
    // ArgumentHandlers
    // parsed_args.values.hasOwnProperty
    // argument_handlers
    const inited_handlers: {[handler_name: string] : ArgumentHandler} = Object.keys(argument_handlers).reduce((acc: any, argument_handler_name)=>{
        const arg_handler_constructor = argument_handlers[argument_handler_name];
        acc[argument_handler_name] = new arg_handler_constructor();
        return acc;
    }, {});

    Object.keys(args_map).forEach((arg_name) => {
        if (!parsed_args.values.hasOwnProperty(arg_name)) {
            if (args_map[arg_name].hasOwnProperty("default")) {
                parsed_args.values[arg_name] = [args_map[arg_name].default.toString()];
            }
        }
    });

    const values_or_errors: Array<{value: any | Array<any>, name: string} | { error: any, name: string}> = Object.keys(parsed_args.values).map((provided_arg_name: string) => {
        const cli_arg = args_map[provided_arg_name];
        const handler = inited_handlers[cli_arg.type];
        let value: any | Array<any> | true;
        try {
            if (args_map[provided_arg_name].type === CliArgType.Boolean) { // booleans really should not be allowed to have required field ... fix me
                value = true;
            }
            else {
                value = parsed_args.values[provided_arg_name].map((pav) => handler.handle(pav)) as Array<any>;
                if (value.length === 1) {
                    value = value[0] as any;
                }
            }
            return {value, name: provided_arg_name};
        }
        catch (e: any) {
            return {error: e, name: provided_arg_name};
        }        
    });
    
    const errors = values_or_errors.filter((ve) => ve.hasOwnProperty("error")) as Array<{ error: any, name: string}>;
    if (errors.length) {
        errors.forEach((error) => {
            console2.error(`Error with argument ${error.name}:`);
            console2.error(error.error);
            console2.info("Usage:");
            console2.info(get_help(args_map[error.name]));
        });
        process.exit(1);
    }

    const values = (values_or_errors as Array<{value: any | Array<any>, name: string}> ).reduce((acc: any, kn) => {
        acc[kn.name] = kn.value;
        return acc;
    }, {})  as {[attribute_name: string]: {value: any | Array<any> | true}};

    return values;
}