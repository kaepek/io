import { InputOutputDeviceControllerBase } from "../model";
import { SerialPort, ReadlineParser } from "serialport";
// import * as _Struct from "typed-struct";
import Struct from "typed-struct";
import { Subject } from "rxjs";
import { ControlWordEvent } from "../../control-words/model";

// _Struct.default

//console.log("Struct", Struct);
// hack Struct
const _Struct = ((Struct as any).default) as any;

export class SerialUSBDeviceController extends InputOutputDeviceControllerBase {

    serialOptions: any | null = null;
    serialport: SerialPort | null = null;
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

        console.info("INFO SerialUSBDeviceController ready.");
    }

    SingleWordStruct = new _Struct("solo-word").UInt8("word").compile();

    get_word_and_data_struct_fragment(name: string | number, data_type: string) {
        const word_name = name.toString();
        return new _Struct(word_name).UInt8("word")[data_type]("buffer").compile();
    }

    wordStructs: any = {
        SingleWordStruct: this.SingleWordStruct,
    };

    handle_input_control_word(event: ControlWordEvent) {
        // deal with word event
        let bytes = null;
        if (event.hasOwnProperty("value")) {
            // build word with buffer
            let wordStructTemplate = null;
            if (this.wordStructs.hasOwnProperty(event.word.name)) {
                wordStructTemplate = this.wordStructs[event.word.name];
            }
            else {
                wordStructTemplate = this.get_word_and_data_struct_fragment(event.word.name, event.word.data_type);
            }
            const wordStruct = new wordStructTemplate();
            wordStruct.word = event.word.name;
            wordStruct.buffer = event.value;
            bytes = wordStruct.$raw;
        }
        else {
            const wordStruct = new this.SingleWordStruct();
            wordStruct.word = event.word.name; // (ControlWords as any)[event.word.name];
            bytes = wordStruct.$raw;
        }
        if (bytes !== null) {
            // console.log("wrote bytes!", bytes);
            (this.serialport as SerialPort).write(bytes);
        }
    }

    constructor(baud_rate?: number|string, path?: string) {
        super();
        this.serialOptions = {};
        if (baud_rate) this.serialOptions.baud_rate = parseFloat(baud_rate as string);
        if (path) this.serialOptions.path = path;
    }

}