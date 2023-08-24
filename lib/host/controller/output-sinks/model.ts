export class OutputSinkBase {
    type: string | null = null;
    async ready() {
        throw "Not implemented";
    }

    output_handler(output) {
        throw "Not implemented";
    }

    bind(processed_device_output$) {
        processed_device_output$.subscribe(this.output_handler);
    }
}