const { DualShockToTorqueSpeedModel } = require("../inputs/dualshock");
const { TorqueSpeedModelToConsole } = require("../outputs/console");
const { InputOutputController } = require("../../../core");

const TorqueSpeedController = new InputOutputController(new DualShockToTorqueSpeedModel(), [new TorqueSpeedModelToConsole()]);
TorqueSpeedController.start().then(console.log).catch(console.error);