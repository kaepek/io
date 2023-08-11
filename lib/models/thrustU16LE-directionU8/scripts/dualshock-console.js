#! /usr/bin/env node
const { DualShockToThrustU16LEDirectionU8Model } = require("../inputs/dualshock");
const { ThrustU16LEDirectionU8ModelToConsole } = require("../outputs/console");
const { InputOutputController } = require("../../../core");

const TorqueDelayDirectionController = new InputOutputController(new DualShockToThrustU16LEDirectionU8Model(), [new ThrustU16LEDirectionU8ModelToConsole()]);
TorqueDelayDirectionController.start().then(console.log).catch(console.error);