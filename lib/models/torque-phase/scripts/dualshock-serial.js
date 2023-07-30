#! /usr/bin/env node
const { DualShockToTorquePhaseModel } = require("../inputs/dualshock");
const { TorquePhaseModelToSerialPort } = require("../outputs/serialport");
const { InputOutputController } = require("../../../core");

const TorqueDelayDirectionController = new InputOutputController(new DualShockToTorquePhaseModel(), [new TorquePhaseModelToSerialPort()]);
TorqueDelayDirectionController.start().then(console.log).catch(console.error);