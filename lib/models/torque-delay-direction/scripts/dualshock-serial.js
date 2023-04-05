#! /usr/bin/env node
const { DualShockToTorqueDelayDirectionModel } = require("../inputs/dualshock");
const { TorqueDelayDirectionModelToSerialPort } = require("../outputs/serialport");
const { InputOutputController } = require("../../../core");

const TorqueDelayDirectionController = new InputOutputController(new DualShockToTorqueDelayDirectionModel(), [new TorqueDelayDirectionModelToSerialPort()]);
TorqueDelayDirectionController.start().then(console.log).catch(console.error);