export class OutputSinkBase {
    type = null;
    async ready() {
        throw "Not implemented";
    }

    output_handler(output) {

    }

    bind(processed_device_output$) {
        processed_device_output$.subscribe(this.output_handler);
    }
}