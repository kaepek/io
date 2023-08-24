import {merge} from 'rxjs';

export class DeviceOutputRouter {
    device_output_sink_handlers = [];

    async ready() {
        await Promise.all(this.device_output_sink_handlers.map((handler: any) => handler.ready()));
    }

    constructor(device_output_sink_handlers: any) {
        this.device_output_sink_handlers = device_output_sink_handlers;
    }

    bind(processed_device_output$: any) {
        this.device_output_sink_handlers.forEach((handler: any) => handler.bind(processed_device_output$));
    }
}