import { Subject, merge } from "rxjs";
import { filter, map } from "rxjs/operators";

export class StreamJunctionDirector {

    control_source_input_router: any | null = null;
    control_word_handlers: any | null = null;
    input_output_devices: any | null = null;
    device_output_model = null;
    output_sink_router: any | null = null;
    control_source_input_router_subscription = null;
    control_source_input_new_words_subscription = null;
    device_output_subject = new Subject();
    device_output$ = this.device_output_subject.asObservable();
    control_word_handlers_kept_event$: any | null = null;

    // deal with input/ouput device output data stream.
    processed_device_output$ = this.device_output$.pipe(
        map(device_output => (this.device_output_model as any).process_output(device_output)) // device_output_model process with the model
    );

    constructor(
        control_source_input_router: any,
        control_word_handlers: any,
        input_output_devices: any,
        device_output_model: any,
        output_sink_router: any
    ) {
        this.control_source_input_router = control_source_input_router;
        this.control_word_handlers = control_word_handlers;
        this.input_output_devices = input_output_devices;
        this.device_output_model = device_output_model;
        this.output_sink_router = output_sink_router;

        // deal with control input... pipe to handlers
        this.control_source_input_new_words_subscription = control_source_input_router.$.subscribe(this.handle_control_input);

        // next merge together the observables from the control handlers so when they emit we perform a state check before emitting.
        this.control_word_handlers_kept_event$ = merge(...this.control_word_handlers.map((handler: any) => handler.$)).pipe(
            map(this.filter_control_word_output_for_state_change),
            filter((event) => event !== null)
        );

        // give the input-output-devices-controllers the device_output_subject so they can call next when they
        // recieve output and also give them the control_word_handlers_kept_event$ so that they accept new
        // control input
        this.input_output_devices.forEach((input_output_device: any) => {
            input_output_device.bind(this.device_output_subject, this.control_word_handlers_kept_event$);
        });

        // bind processed_device_output$ to output-sinks
        this.output_sink_router.bind(this.processed_device_output$);
    }

    state: any = {};

    filter_control_word_output_for_state_change(event: any) {
        // we have new control input emitted from one of the control word handlers.
        if (event.hasOwnProperty("value")) {
            // check state
            if (this.state.hasOwnProperty(event.word.name)) {
                const old_state = this.state[event.word.name];
                // state is new so emit
                if (old_state !== event.word.value) {
                    this.state[event.word.name] = event.word.value;
                    return event;
                }
            }
            else {
                // words with no state are new! so emit them
                this.state[event.word.name] = event.word.value;
                return event;
            }
        }
        else {
            // we always emit control words without values.
            return event;
        }
        return null;
    }

    handle_control_input(input: any) {
        // pipe to control words handlers
        this.control_word_handlers.forEach((control_word_handler: any) => control_word_handler.handle_input(input, this.state));
    }

    async ready() {
        // make sure the input output devices are ready for input/outputting
        await Promise.all(this.input_output_devices.map((input_output_device: any) => input_output_device.ready()));
        // make sure the output router and output sinks are ready
        await this.output_sink_router.ready();
        // make sure the input router and input sources are ready
        await this.control_source_input_router.ready();
    }
}