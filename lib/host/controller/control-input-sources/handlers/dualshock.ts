import { console2 } from "../../utils/log";
import { ControlInputSourceHandler } from "../model";
import { ControlInputSources } from "../sources";

// @ts-ignore
import * as dualshock from "dualshock";

export class DualShockControlInputSourceHandler extends ControlInputSourceHandler {
    type = ControlInputSources.DualShock;
    ds: any = null;
    device: any = null;
    gamepad: any = null;
    gamepadArgs: any = null;

    input_types = {
        "rStickX": "stick",
        "rStickY": "stick",
        "lStickX": "stick",
        "lStickY": "stick",
        "button": "button",
        "l2": "trigger",
        "r2": "trigger",
        "t1X": "track",
        "t1Y": "track"
    };

    async ready() {
        this.ds = dualshock;
        const devices = this.ds.getDevices();
        if (devices.length < 1) {
            console2.warn("WARNING DualShockControlInputSourceHandler could not find a controller! No input will come from this source.");
        }
        else {
            this.device = devices[0];
            this.gamepad = this.ds.open(this.device, this.gamepadArgs);
            this.gamepad.onmotion = true; this.gamepad.onstatus = true;
            this.gamepad.ondigital = async (label: string, value: any) => this.subject.next({ source: this.type, type: "button", label, value });
            this.gamepad.onanalog = async (label: string, value: any) => this.subject.next({ source: this.type, type: (this.input_types as any)[label], label, value });
            console2.success("INFO ControlInputSourceHandler: DualShockControlInputSourceHandler ready.");
        }
    }

    constructor(smooth_analog?: number|string, smooth_motion?: number|string, joy_deadband?: number|string, move_deadband?: number|string) {
        super();
        const gamepadArgs = { smoothAnalog: 10, smoothMotion: 15, joyDeadband: 4, moveDeadband: 4 };
        if (smooth_analog !== undefined) gamepadArgs.smoothAnalog = parseFloat(smooth_analog as string);
        if (smooth_motion !== undefined) gamepadArgs.smoothMotion = parseFloat(smooth_motion as string);
        if (joy_deadband !== undefined) gamepadArgs.joyDeadband = parseFloat(joy_deadband as string);
        if (move_deadband !== undefined) gamepadArgs.moveDeadband = parseFloat(move_deadband as string);
        this.gamepadArgs = gamepadArgs;
    }
}