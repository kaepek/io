export class DeviceOutputBase {
    type: string | null = null;
    process_output(output: any) {
        throw "Not implemented";
    }
}