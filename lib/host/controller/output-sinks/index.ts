import { ConsoleOutputSink } from "./handlers/console.js"
import { FileOutputSink } from "./handlers/file.js"
import { NetworkOutputSink } from "./handlers/network.js"

export default {
    "console": ConsoleOutputSink,
    "file": FileOutputSink,
    "network": NetworkOutputSink
}