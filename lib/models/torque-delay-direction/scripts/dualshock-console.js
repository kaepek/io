const { DualShockToTorqueDelayDirectionModel } = require("../inputs/dualshock");
const { TorqueDelayDirectionModelToConsole } = require("../outputs/console");
const { InputOutputController } = require("../../../core");

const TorqueDelayDirectionController = new InputOutputController(new DualShockToTorqueDelayDirectionModel(), [new TorqueDelayDirectionModelToConsole()]);
TorqueDelayDirectionController.start().then(console.log).catch(console.error);