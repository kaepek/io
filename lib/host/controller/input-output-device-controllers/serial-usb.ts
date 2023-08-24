import { InputOutputDeviceControllerBase } from "./model";
import { SerialPort, ReadlineParser } from "serialport";
import Struct from "typed-struct";
import { ControlWords } from "../control-words/words";
import { Subject } from "rxjs";

// hack Struct
const _Struct = ((Struct as any).default) as any;

export class SerialUSBDeviceController extends InputOutputDeviceControllerBase {

    serialOptions: any | null = null;
    serialport: any = null;
    serialparser: any = null;

    async ready() {
        const serialOptions = { baudRate: 5000000, path: null };

        const serialPorts = await SerialPort.list();

        let successfulPortObj: any = false;
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

        // init serial port
        this.serialport = new SerialPort(this.serialOptions);

        // bind events
        this.serialport.on("close", () => {
            console.log("Serial port closed");
            process.exit();
        });

        this.serialparser = this.serialport.pipe(new ReadlineParser({ delimiter: '\n' }));
        this.serialparser.on("data", (line: string) => {
            (this.device_output_subject as Subject<any>).next(line);
        });
    }

    handle_input_control_word(event: any) {

        console.log(_Struct);

        const a = new _Struct("daasadsads")
        .UInt16LE("thrust")
        .UInt8("direction")
        .compile();

        // deal with word event
        let bytes = null;
        if (event.hasOwnProperty("value")) {
            // build word with buffer
            const emitStructure = (new Struct(event.word.name) as any).UInt8("word")[event.word.data_type]("buffer").compile();
            const word_value = (ControlWords as any)[event.word.name];
            emitStructure.word = word_value;
            emitStructure.buffer = event.value;
            bytes = emitStructure.raw;
        }
        else {
            // just build a word without a buffer
            const emitStructure2 = (new Struct(event.word.name) as any).UInt8("word").compile() as any;
            const word_value = (ControlWords as any)[event.word.name];
            emitStructure2.word = word_value;
            bytes = emitStructure2.raw;
        }
        if (bytes !== null) {
            this.serialport.write(bytes);
        }
    }

    constructor(serialOptions?: any | undefined) {
        super();
        this.serialOptions = serialOptions || {};
    }

}