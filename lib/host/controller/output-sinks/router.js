import {merge} from 'rxjs';

export class DeviceOutputRouter {
    device_output_sink_handlers = [];

    async ready() {
        await Promise.all(this.device_output_sink_handlers.map(handler => handler.ready()));
    }

    constructor(device_output_sink_handlers) {
        this.device_output_sink_handlers = device_output_sink_handlers;
    }

    bind(processed_device_output$) {
        this.device_output_sink_handlers.forEach(handler => handler.bind(processed_device_output$));
    }
}