const { InputTypes, ProfileTypes, InputToModelBase } = require("../../../core");

const DELAY_MAX = 1000;
const DELAY_MIN = 1;
const DELAY_INC = 10;
const TORQUE_MIN = 0;
const TORQUE_MAX = 255;

class DualShockToTorqueDelayDirectionModel extends InputToModelBase {
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
    delayMax = null;
    delayMin = null;
    delayInc = null;
    torqueMax = null;
    torqueMin = null;

    state = { torque: 0, delay: DELAY_MAX, direction: true }; //cw 0 false / ccw 1 true

    async handleInput(inputObj) {
        if (inputObj.type === "button" && inputObj.label === "triangle" && inputObj.value == false) {
            if (this.state.delay + this.delayInc <= this.delayMax) {
                this.state.delay += this.delayInc;
            }
        }
        else if (inputObj.type === "button" && inputObj.label === "cross" && inputObj.value == false) {
            if (this.state.delay - this.delayInc >= this.delayMin) {
                this.state.delay -= this.delayInc;
            }
        }
        else if (inputObj.type === "button" && inputObj.label == "up" && inputObj.value == false) {
            if (this.state.torque <= this.torqueMax) {
                this.state.torque += 1;
            }
        }
        else if (inputObj.type === "button" && inputObj.label == "down" && inputObj.value == false) {
            if (this.state.torque > this.torqueMin) {
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

            if (args.hasOwnProperty && args.hasOwnProperty("modelArgs")) {
                // modelArgs
                this.delayMax = this.args.modelArgs.delay_max || DELAY_MAX;
                this.delayMin = this.args.modelArgs.delay_min || DELAY_MIN;
                this.delayInc = this.args.modelArgs.delay_inc || DELAY_INC;
                this.torqueMax = this.arg.modelArgs.torque_max || TORQUE_MAX;
                this.torqueMin = this.arg.modelArgs.torque_min || TORQUE_MIN;
            }
            else {
                this.delayInc = DELAY_INC;
                this.delayMax = DELAY_MAX;
                this.delayMin = DELAY_MIN;
                this.torqueMax = TORQUE_MAX;
                this.torqueMin = TORQUE_MIN;
            }
        }
        else {
            this.delayInc = DELAY_INC;
            this.delayMax = DELAY_MAX;
            this.delayMin = DELAY_MIN;
            this.torqueMax = TORQUE_MAX;
            this.torqueMin = TORQUE_MIN; 
        }
        this.gamepadArgs = gamepadArgs;
    }
}

module.exports = { DualShockToTorqueDelayDirectionModel }