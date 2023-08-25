export class OutputSinkBase {
    type: string | null = null;
    async ready() {
        throw "Not implemented";
    }

    output_handler(output: any) {
        throw "Not implemented";
    }

    bind(processed_device_output$: any) {
        processed_device_output$.subscribe((output: any) => this.output_handler(output));
    }
}