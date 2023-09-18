import { DualShockControlInputSourceHandler } from "./handlers/dualshock.js";
import { KeyboardInputSourceHandler } from "./handlers/keyboard.js";
import { NetworkControlWordSourceHandler } from "./handlers/network.js";
import { ControlInputSourceHandler } from "./model.js";

const exports: {[source_name: string]: (typeof DualShockControlInputSourceHandler | typeof KeyboardInputSourceHandler  | typeof NetworkControlWordSourceHandler | typeof ControlInputSourceHandler)} = {
    "dualshock": DualShockControlInputSourceHandler,
    "keyboard": KeyboardInputSourceHandler,
    "network": NetworkControlWordSourceHandler
}
export default exports;
 