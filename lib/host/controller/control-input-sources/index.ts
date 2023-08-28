import { DualShockControlInputSourceHandler } from "./handlers/dualshock";
import { KeyboardInputSourceHandler } from "./handlers/keyboard";
import { NetworkControlWordSourceHandler } from "./handlers/network";

export default {
    dualshock: DualShockControlInputSourceHandler,
    keyboard: KeyboardInputSourceHandler,
    network: NetworkControlWordSourceHandler
};
 