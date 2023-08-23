import { Subject } from "rxjs";
import { filter, map } from "rxjs/operators";

export class StreamJunctionDirector {

    control_source_input_router = null;
    control_word_handlers = null;
    input_output_devices = null;
    device_output_model = null;
    output_sink_router = null;
    control_source_input_router_subscription = null;
    control_source_input_new_words$ = null;
    device_output_subject = new Subject();
    device_output$ = this.device_output_subject.asObservable();

    processed_device_output$ =  device_output$.pipe(
        map(device_output => this.device_output_model.process_output(device_output)) // device_output_model process with the model
    );

    constructor(
        control_source_input_router,
        control_word_handlers,
        input_output_devices,
        device_output_model,
        output_sink_router
    ) {
        this.control_source_input_router = control_source_input_router;
        this.control_word_handlers = control_word_handlers;
        this.input_output_devices = input_output_devices;
        this.device_output_model = device_output_model;
        this.output_sink_router = output_sink_router;

        this.control_source_input_new_words$ = control_source_input_router.$.pipe(
            map(this.handler_control_input),
            filter((value) => value.length != 0)
        )
        //this.control_source_input_router_subscription = control_source_input_router.$.subscribe(this.handler_control_input);
        // give the input-output-devices-controllers the device_output_subject so they can call next
        this.input_output_devices.forEach((input_output_device) => {
            input_output_device.bind(this.device_output_subject, this.control_source_input_new_words$); 
        });

        // bind processed_device_output$ to output-sinks
        // this.output_sink_router bind output_sink_router
        this.output_sink_router.bind(processed_device_output$);
    }

    state = {};

    handler_control_input (input) {
        // pipe to control words
        let possibleWordUpdates = this.control_word_handlers.map(control_word_handler => control_word_handler.handle_input(input, this.state));
        // filter for words which actually had an output
        possibleWordUpdates = possibleWordUpdates.reduce((acc, has_word_output, idx) => {
            if (has_word_output == true) {
                acc.push({control_word_handler: control_word_handlers[idx]});
            }
            else if (has_word_output !== false) {
                acc.push({value:has_word_output.value, control_word_handler: control_word_handlers[idx]});
            }
            return acc;
        }, []);
        // check against states for change...
        const wordHandlersWithStateChangeOrNoState = possibleWordUpdates.reduce((acc, word_details) => {
            if (word_details.hasOwnProperty("value")) {
                if (this.state.hasOwnProperty(word_details.name)) {
                    const word_old_state = this.state[word_details.name];
                    if (word_old_state !== word_details.value)
                    {
                        // word state updated
                        this.state[word_details.name] = word_details.value;
                        acc.push({word_handler: word_details.control_word_handler, value: word_details.value});
                    }
                    else {
                        // no change censor the input.
                    }
                } 
                else {
                    // if its not in state then it is definitely new
                    this.state[word_details.name] = word_details.value;
                    acc.push({word_handler: word_details.control_word_handler, value: word_details.value});
                }
            }
            else {
                // words without values are always sent as there is no state.
                acc.push({word_handler: word_details.control_word_handler});
            }
            return acc;
        },[]);
        return wordHandlersWithStateChangeOrNoState;
    }

    async ready() {
        await this.control_source_input_router.ready();
        await Promise.all(input_output_devices.map(input_output_device => input_output_device.ready()));
    }
}