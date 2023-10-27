import chalk from "chalk";

function log(...args: Array<any>) {
    console.log(...args);
}

function warn(...args: Array<any>) {
    const colored_args = args.map(arg=>chalk.yellow(arg.toString()));
    console.warn(...colored_args);
}

function error(...args: Array<any>) {
    const colored_args = args.map(arg=>chalk.red(arg.toString()));
    console.error(...colored_args);
}

function success(...args: Array<any>) {
    const colored_args = args.map(arg=>chalk.green(arg.toString()));
    console.info(...colored_args); 
}

function info(...args: Array<any>) {
    const colored_args = args.map(arg=>chalk.blueBright(arg.toString()));
    console.info(...colored_args); 
}

export const console2 = {
    log, 
    warn,
    error,
    success,
    info
};

