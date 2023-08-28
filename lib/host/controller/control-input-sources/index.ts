import { DualShockControlInputSourceHandler } from "./handlers/dualshock";
import { KeyboardInputSourceHandler } from "./handlers/keyboard";
import { NetworkControlWordSourceHandler } from "./handlers/network";
import { ControlInputSourceHandler } from "./model";

const exports: {[source_name: string]: (typeof DualShockControlInputSourceHandler | typeof KeyboardInputSourceHandler  | typeof NetworkControlWordSourceHandler | typeof ControlInputSourceHandler)} = {
    "dualshock": DualShockControlInputSourceHandler,
    "keyboard": KeyboardInputSourceHandler,
    "network": NetworkControlWordSourceHandler
}
export default exports;
 