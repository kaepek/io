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
            console.warn("WARNING DualShockControlInputSourceHandler could not find a controller! No input will come from this source.");
        }
        else {
            this.device = devices[0];
            this.gamepad = this.ds.open(this.device, this.gamepadArgs);
            this.gamepad.onmotion = true; this.gamepad.onstatus = true;
            this.gamepad.ondigital = async (label: string, value: any) => this.subject.next({ source: this.type, type: "button", label, value });
            this.gamepad.onanalog = async (label: string, value: any) => this.subject.next({ source: this.type, type: (this.input_types as any)[label], label, value });
            console.info("INFO DualShockControlInputSourceHandler ready.");
        }
    }

    constructor(smoothAnalog?: number, smoothMotion?: number, joyDeadband?: number, moveDeadband?: number) {
        super();
        const gamepadArgs = { smoothAnalog: 10, smoothMotion: 15, joyDeadband: 4, moveDeadband: 4 };
        if (smoothAnalog !== undefined) gamepadArgs.smoothAnalog = smoothAnalog;
        if (smoothMotion !== undefined) gamepadArgs.smoothMotion = smoothMotion;
        if (joyDeadband !== undefined) gamepadArgs.joyDeadband = joyDeadband;
        if (moveDeadband !== undefined) gamepadArgs.moveDeadband = moveDeadband;
        this.gamepadArgs = gamepadArgs;
    }
}