const { SerialPort, ReadlineParser } = require('serialport');
const Struct = require('typed-struct').default;
const { OutputTypes, ProfileTypes, ModelToOutputBase } = require("../../../core");

class TorquePhaseModelToConsole extends ModelToOutputBase {
    type = OutputTypes.Serial
    profile = ProfileTypes.ThrustDirection
    lastSerialData = null;
    lastWordStr = null;

    async ready () {
    }

    async handleOutput(inputState) {
        console.log(inputState);
    }

    constructor () {
        super();
    }
}

module.exports = { TorquePhaseModelToConsole }