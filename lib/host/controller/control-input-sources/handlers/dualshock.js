import { ControlInputSourceHandler } from "./model";
import { ControlInputSources } from "../sources";

export class DualShockControlInputSourceHandler extends ControlInputSourceHandler {
    type = ControlInputSources.DualShock;
    ds = null;

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
        this.ds = await import("dualshock");
        const devices = this.ds.getDevices();
        if (devices.length < 1) throw "Could not find a controller!";
        this.device = devices[0];
        this.gamepad = this.ds.open(this.device, this.gamepadArgs);
        this.gamepad.onmotion = true; this.gamepad.onstatus = true;
        this.gamepad.ondigital = async (label, value) => this.subject.next({source:this.type, type: "button", label, value });
        this.gamepad.onanalog = async (label, value) => this.subject.next({source:this.type, type: this.input_types[label], label, value });
    }

    constructor(args) {
        super();
        const gamepadArgs = { smoothAnalog: 10, smoothMotion: 15, joyDeadband: 4, moveDeadband: 4 };
        if (args) {
            if (args.hasOwnProperty && args.hasOwnProperty("smoothAnalog")) gamepadArgs.smoothAnalog = args.smoothAnalog;
            if (args.hasOwnProperty && args.hasOwnProperty("smoothMotion")) gamepadArgs.smoothMotion = arg.smoothMotion;
            if (args.hasOwnProperty && args.hasOwnProperty("joyDeadband")) gamepadArgs.joyDeadband = arg.joyDeadband;
            if (args.hasOwnProperty && args.hasOwnProperty("moveDeadband")) gamepadArgs.moveDeadband = args.moveDeadband;
        }
        this.gamepadArgs = gamepadArgs;
    }
}