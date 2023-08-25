import { Subject, Subscription, merge, pipe } from "rxjs";
import { filter, map } from "rxjs/operators";
import { ControlSourceInputRouter } from "./control-input-sources/router";
import { DeviceOutputRouter } from "./output-sinks/router";
import { ControlWordHandlerBase } from "./control-words/handlers/model";
import { InputOutputDeviceControllerBase } from "./input-output-device-controllers/model";
import { DeviceOutputModelBase } from "./device-output-models/model";

export class StreamJunctionDirector {

    control_source_input_router: ControlSourceInputRouter;
    control_word_handlers: Array<ControlWordHandlerBase>;
    control_word_handlers_map: { [wordName: string | number]: ControlWordHandlerBase } = {};
    input_output_devices: Array<InputOutputDeviceControllerBase>;
    device_output_model: DeviceOutputModelBase;
    output_sink_router: DeviceOutputRouter;
    control_source_input_router_subscription = null;
    control_source_input_new_words_subscription: Subscription;
    device_output_subject = new Subject();
    device_output$ = this.device_output_subject.asObservable();
    control_word_handlers_kept_event$: any | null = null;

    // deal with input/ouput device output data stream.
    processed_device_output$ = this.device_output$.pipe(
        map(device_output => this.device_output_model.process_output(device_output)) // device_output_model process with the model
    );

    constructor(
        control_source_input_router: ControlSourceInputRouter,
        control_word_handlers: Array<ControlWordHandlerBase>,
        input_output_devices: Array<InputOutputDeviceControllerBase>,
        device_output_model: DeviceOutputModelBase,
        output_sink_router: DeviceOutputRouter
    ) {
        this.control_source_input_router = control_source_input_router;
        this.control_word_handlers = control_word_handlers;
        this.input_output_devices = input_output_devices;
        this.device_output_model = device_output_model;
        this.output_sink_router = output_sink_router;

        // create control_word_handlers_map
        this.control_word_handlers_map = this.control_word_handlers.reduce((acc: { [wordName: string | number]: ControlWordHandlerBase }, word_handler) => {
            if (word_handler.name) acc[word_handler.name] = word_handler;
            return acc;
        }, {});

        // deal with control input... pipe to handlers
        this.control_source_input_new_words_subscription = control_source_input_router.$.pipe(
            map((it: any) => {
                console.log("control_source_input_new_words_subscription", it);
                return it;
            })
        ).subscribe((input: any) => this.handle_control_input(input));

        // next merge together the observables from the control handlers so when they emit we perform a state check before emitting.
        this.control_word_handlers_kept_event$ = merge(...this.control_word_handlers.map((handler: any) => handler.$)).pipe(
            map((kept_event) => this.filter_control_word_output_for_state_change(kept_event)),
            filter((event) => {
                // console.log("event", event, event !== null);
                return event !== null;
            })
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
        if (!event.hasOwnProperty("value")) return event; // we always emit control words without values as these are simply commands.
        // we have new control input emitted from one of the control word handlers.
        const word_name = event.word.state_alias || event.word.name;
        console.log("filter control word output state change....", word_name);
        // check state
        if (!this.state.hasOwnProperty(word_name)) {
            // words with no state are new! so emit them
            this.state[word_name] = event.value;
            this.control_word_handlers_map[word_name].state = event.value;
            return event;
        }
        // we have a word with state
        const old_state = this.state[word_name];
        if (old_state !== event.word.value) {
            // state has changed so emit
            this.state[word_name] = event.value;
            this.control_word_handlers_map[word_name].state = event.value;
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
        return "Ready!";
    }
}