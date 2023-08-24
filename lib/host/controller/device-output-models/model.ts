export class DeviceOutputBase {
    type: string | null = null;
    process_output(output) {
        throw "Not implemented";
    }
}