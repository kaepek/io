export class DeviceOutputModelBase {
    type: string | null = null;
    process_output(output: any) {
        throw "Not implemented";
    }
}