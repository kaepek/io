import { ConsoleOutputSink } from "./handlers/console"
import { FileOutputSink } from "./handlers/file"
import { NetworkOutputSink } from "./handlers/network"

export default {
    "console": ConsoleOutputSink,
    "file": FileOutputSink,
    "network": NetworkOutputSink
}