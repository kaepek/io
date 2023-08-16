const { InputTypes, ProfileTypes, InputToModelBase } = require("../../../core");

const map_value_range = (input, inMin, inMax, outMin, outMax) => (input - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;

class DualShockToThrustU16LEDirectionU8Model extends InputToModelBase {
    type = InputTypes.DualShock;
    profile = ProfileTypes.ThrustU16LEDirectionU8
    inputTypes = {
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
    ds = null;
    gamepad = null;
    gamepadArgs = null;
    pwmWriteResolution = 8;
    maxDuty = 0;
    state = { thrust: 0, direction: true, started: false }; //cw 0 false / ccw 1 true
    scale = 1;

    async handleInput(inputObj) {
        // r2 trigger... we have a thrust value to update
        // 
        if (inputObj.type === "trigger" && inputObj.label === "r2") {
            this.state.thrust = Math.round(map_value_range(inputObj.value, 0, 255, 0, this.maxDuty) * this.scale);
            this.state.thrust = this.state.thrust > this.maxDuty ? this.maxDuty : this.state.thrust;
            this.state.thrust = this.state.thrust < 0 ? 0 : this.state.thrust;
            this.state.started = true;
        }

        // triangle up... we have a direction to reverse... only if thrust is zero otherwise risk breaking the hardware
        else if (inputObj.type === "button" && inputObj.label === "triangle" && inputObj.value === false && this.state.thrust === 0) 
        {
            this.state.direction = !this.state.direction;
            this.state.started = true;
        }

        // emit state to controller
        if (this.state.started) await super.handleInput(this.state);
    }

    async ready() {
        this.ds = await import("dualshock");

        const devices = this.ds.getDevices();
        if (devices.length < 1) throw "Could not find a controller!";
        this.device = devices[0];

        this.gamepad = this.ds.open(this.device, this.gamepadArgs);
        this.gamepad.onmotion = true; this.gamepad.onstatus = true;
        this.gamepad.ondigital = async (label, value) => this.handleInput({ type: "button", label, value });
        this.gamepad.onanalog = async (label, value) => this.handleInput({ type: this.inputTypes[label], label, value });
    }

    constructor(args) {
        super();
        const gamepadArgs = { smoothAnalog: 10, smoothMotion: 15, joyDeadband: 4, moveDeadband: 4 };
        if (args) {
            if (args.hasOwnProperty && args.hasOwnProperty("scale")) this.scale = args.scale;
            if (args.hasOwnProperty && args.hasOwnProperty("pwmWriteResolution")) this.pwmWriteResolution = args.pwmWriteResolution;
            if (args.hasOwnProperty && args.hasOwnProperty("smoothAnalog")) gamepadArgs.smoothAnalog = args.smoothAnalog;
            if (args.hasOwnProperty && args.hasOwnProperty("smoothMotion")) gamepadArgs.smoothMotion = arg.smoothMotion;
            if (args.hasOwnProperty && args.hasOwnProperty("joyDeadband")) gamepadArgs.joyDeadband = arg.joyDeadband;
            if (args.hasOwnProperty && args.hasOwnProperty("moveDeadband")) gamepadArgs.moveDeadband = args.moveDeadband;
        }
        // no convert to max duty
        this.maxDuty = Math.pow(2, this.pwmWriteResolution) - 1;
        this.gamepadArgs = gamepadArgs;
    }
}

module.exports = { DualShockToThrustU16LEDirectionU8Model }