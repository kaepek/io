const { InputTypes, ProfileTypes, InputToModelBase } = require("../../../core");

const phase_max = 360;
const phase_inc = 50;

class DualShockToTorquePhaseModel extends InputToModelBase {
    type = InputTypes.DualShock;
    profile = ProfileTypes.ThrustDirection
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
    scale = 1;
    state = { torque: 0, phase: 0, direction: true }; //cw 0 false / ccw 1 true

    /*
    
    */

    async handleInput(inputObj) {
        if (inputObj.type === "button" && inputObj.label === "triangle" && inputObj.value == false) {
            this.state.phase = (((this.state.phase + phase_inc) % phase_max) + phase_max) % phase_max;
        }
        else if (inputObj.type === "button" && inputObj.label === "cross" && inputObj.value == false) {
            this.state.phase = (((this.state.phase - phase_inc) % phase_max) + phase_max) % phase_max;
        }
        else if (inputObj.type === "button" && inputObj.label == "up" && inputObj.value == false) {
            if (this.state.torque < 255) {
                this.state.torque += 1;
            }
        }
        else if (inputObj.type === "button" && inputObj.label == "down" && inputObj.value == false) {
            if (this.state.torque > 0) {
                this.state.torque -= 1;
            }
        }
        // r2 trigger... we have a thrust value to update
        // if (inputObj.type === "trigger" && inputObj.label === "r2") this.state.thrust = inputObj.value * this.scale;

        // circle up... we have a direction to reverse... only if torque is zero otherwise risk breaking the hardware
        else if (inputObj.type === "button" && inputObj.label === "circle" && inputObj.value === false && this.state.torque === 0) this.state.direction = !this.state.direction

        // emit state to controller
        await super.handleInput(this.state);
    }
    
    async ready() {
        this.ds = await import("dualshock");

        const devices = this.ds.getDevices();
        if (devices.length < 1) throw "Could not find a controller!";
        this.device = devices[0];

        this.gamepad= this.ds.open(this.device, this.gamepadArgs);
        this.gamepad.onmotion = true; this.gamepad.onstatus = true;
        this.gamepad.ondigital = async (label, value) => this.handleInput({ type: "button", label, value });
        this.gamepad.onanalog = async (label, value) => this.handleInput({ type: this.inputTypes[label], label, value});
    }

    constructor(args) {
        super();
        const gamepadArgs = { smoothAnalog: 10, smoothMotion: 15, joyDeadband: 4, moveDeadband: 4 };
        if (args) {
            if (args.hasOwnProperty && args.hasOwnProperty("scale")) this.scale = args.scale;
            if (args.hasOwnProperty && args.hasOwnProperty("smoothAnalog")) gamepadArgs.smoothAnalog = args.smoothAnalog;
            if (args.hasOwnProperty && args.hasOwnProperty("smoothMotion")) gamepadArgs.smoothMotion = arg.smoothMotion;
            if (args.hasOwnProperty && args.hasOwnProperty("joyDeadband"))  gamepadArgs.joyDeadband = arg.joyDeadband;
            if (args.hasOwnProperty && args.hasOwnProperty("moveDeadband")) gamepadArgs.moveDeadband = args.moveDeadband;
        }
        this.gamepadArgs = gamepadArgs;
    }
}

module.exports = { DualShockToTorquePhaseModel }