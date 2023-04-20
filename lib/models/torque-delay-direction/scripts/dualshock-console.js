#! /usr/bin/env node

const args = process.argv;
const n_args = args.length - 2;

console.log("args", args, n_args);

if (n_args > 0) {
    
}
/*
            
            
            this.delayMin = DELAY_MIN; // keep
            this.delayMax = DELAY_MAX; // mod
            this.delayInc = DELAY_INC; // mod

            this.torqueMax = TORQUE_MAX; //mod
            this.torqueMin = TORQUE_MIN; // keep

            so these are the args
            delay_max delay_inc torque_max
*/


const { DualShockToTorqueDelayDirectionModel } = require("../inputs/dualshock");
const { TorqueDelayDirectionModelToConsole } = require("../outputs/console");
const { InputOutputController } = require("../../../core");

const TorqueDelayDirectionController = new InputOutputController(new DualShockToTorqueDelayDirectionModel(), [new TorqueDelayDirectionModelToConsole()]);
TorqueDelayDirectionController.start().then(console.log).catch(console.error);