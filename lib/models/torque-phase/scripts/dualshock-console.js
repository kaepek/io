#! /usr/bin/env node
const { DualShockToTorquePhaseModel } = require("../inputs/dualshock");
const { TorquePhaseModelToConsole } = require("../outputs/console");
const { InputOutputController } = require("../../../core");

const TorqueDelayDirectionController = new InputOutputController(new DualShockToTorquePhaseModel(), [new TorquePhaseModelToConsole()]);
TorqueDelayDirectionController.start().then(console.log).catch(console.error);