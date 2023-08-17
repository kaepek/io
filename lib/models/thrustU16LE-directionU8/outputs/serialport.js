const { SerialPort, ReadlineParser } = require('serialport');
const Struct = require('typed-struct').default;
const { OutputTypes, ProfileTypes, ModelToOutputBase } = require("../../../core");
const UDP = require('dgram');

class ThrustU16LEDirectionU8ModelToSerialPort extends ModelToOutputBase {
    type = OutputTypes.Serial
    profile = ProfileTypes.ThrustU16LEDirectionU8
    lastSerialData = null;
    lastWordStr = null;
    ThrustDirectionStructure = new Struct(this.profile)
        .UInt16LE("thrust")
        .UInt8("direction")
        .compile();

    udpHost = null;
    udpPort = null;
    udpClient = null;

    async ready() {
        const serialOptions = { baudRate: 5000000 };

        const serialPorts = await SerialPort.list();

        let successfulPortObj = false;
        if (this.serialOptions) {
            if (this.serialOptions.hasOwnProperty("path")) successfulPortObj = serialPorts.find((it) => it.path == this.serialOptions.path);
            if (this.serialOptions.hasOwnProperty("baudRate")) serialOptions.baudRate = this.serialOptions.baudRate;
        }

        if (!successfulPortObj) {
            // the user provided one failed... attempt to find one
            const relevantPorts = serialPorts.filter((it) => it.path.includes("/dev/ttyACM"));
            if (!relevantPorts.length) throw "Could not find any serial ports to write too!";
            successfulPortObj = relevantPorts[0];
        }

        /* successfulPortObj looks like:
            path: '/dev/ttyACM0',
            manufacturer: 'Teensyduino',
            serialNumber: '13059120',
            pnpId: 'usb-Teensyduino_USB_Serial_13059120-if00',
            locationId: undefined,
            vendorId: '16c0',
            productId: '0483'
        */

        // #TODO should validate its a teensy40

        // udpate options with new path
        if (successfulPortObj) serialOptions.path = successfulPortObj.path;
        this.serialOptions = serialOptions;

        // udp options

        if (this.udpHost && this.udpPort) {
            this.udpClient = UDP.createSocket('udp4');
            console.log("creating udp client");
        }

        // init serial port
        this.serialport = new SerialPort(this.serialOptions);

        // bind events
        this.serialport.on("close", () => {
            console.log("Serial port closed");
            process.exit();
        });
        this.serialparser = this.serialport.pipe(new ReadlineParser({ delimiter: '\n' }));
        this.serialparser.on("data", (line) => {
            if (line !== this.lastSerialData) {
                // console.log("got new serial data", line);
                this.lastSerialData = line;
                if (this.udpClient) {
                    const packet = Buffer.from(line);

                    this.udpClient.send(packet, this.udpPort, this.udpHost, (err) => {
                        if (err) {
                            console.error('Failed to send packet !!', err);
                        } else {
                            // console.log('Packet send !!');
                        }
                    });
                }

            }
        });
    }

    async handleOutput(inputState) {
        const word = new this.ThrustDirectionStructure();
        word.direction = inputState.direction === true ? 0 : 1;
        word.thrust = inputState.thrust;
        const newWordBytes = word.$raw;
        const newWordBytesCompare = JSON.stringify(newWordBytes);
        if (newWordBytesCompare !== this.lastWordStr) {
            // emit to serial device
            this.serialport.write(newWordBytes);
            this.lastWordStr = newWordBytesCompare;
            // console.log("sending data", inputState);
        }
    }

    constructor(serialOptions) {
        super();
        this.serialOptions = serialOptions || {};
        if (serialOptions.hasOwnProperty("udpHost")) this.udpHost = serialOptions.udpHost;
        if (serialOptions.hasOwnProperty("udpPort")) this.udpPort = serialOptions.udpPort;
    }
}

module.exports = { ThrustU16LEDirectionU8ModelToSerialPort }