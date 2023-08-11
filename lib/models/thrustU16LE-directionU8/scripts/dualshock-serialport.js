const { DualShockToThrustU16LEDirectionU8Model } = require("../inputs/dualshock");
const { ThrustU16LEDirectionU8ModelToSerialPort } = require("../outputs/serialport");
const { InputOutputController } = require("../../../core");

const ThrustDirectionController = new InputOutputController(new DualShockToThrustU16LEDirectionU8Model(), [new ThrustU16LEDirectionU8ModelToSerialPort()]);
ThrustDirectionController.start().then(console.log).catch(console.error);