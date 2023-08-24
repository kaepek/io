import {Observable, merge} from 'rxjs';

export class ControlSourceInputRouter {
    input_source_handlers: Array<any> = [];
    $: Observable<any> | null = null;

    async ready() {
        await Promise.all(this.input_source_handlers.map(handler => handler.ready()));
    }

    constructor(input_source_handlers: any) {
        this.input_source_handlers = input_source_handlers;
        this.$ = merge(...this.input_source_handlers.map(input_source_handler => input_source_handler.$));
    }
}