import {merge} from 'rxjs';

export class ControlSourceInputRouter {
    input_source_handlers = [];
    stream_junction_director = null;

    $ = null;

    async ready(stream_junction_director) {
        this.stream_junction_director = stream_junction_director;
        await Promise.all(this.input_source_handlers.map(handler => handler.ready(this)));
    }

    handle_input (input) {
        this.stream_junction_director.handle_input(input);
    }

    constructor(input_source_handlers) {
        this.input_source_handlers = input_source_handlers;
        this.$ = merge(...this.input_source_handlers.map(input_source_handler => input_source_handler.$));
    }
}