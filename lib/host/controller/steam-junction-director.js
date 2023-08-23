export class StreamJunctionDirector {

    input_source_router = null;
    control_word_handlers = null;
    input_output_device = null;
    device_output_model = null;
    output_sink_router = null;

    constructor(
        input_source_router,
        control_word_handlers,
        input_output_device,
        device_output_model,
        output_sink_router
    ) {
        this.input_source_router = input_source_router;
        this.control_word_handlers = control_word_handlers;
        this.input_output_device = input_output_device;
        this.device_output_model = device_output_model;
        this.output_sink_router = output_sink_router;
    }

    state = {};

    handle_input (input) {
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
                        acc.push(word_details.control_word_handler);
                    }
                    else {
                        // no change censor the input.
                    }
                } 
                else {
                    // if its not in state then it is definitely new
                    this.state[word_details.name] = word_details.value;
                    acc.push(word_details.control_word_handler);
                }
            }
            else {
                // words without values are always sent as there is no state.
                acc.push(word_details.control_word_handler);
            }
            return acc;
        },[]);


    }


    async ready() {
        await this.control_word_handlers.forEach((control_word_handler) => control_word_handler.ready(this));
        await this.input_source_router.ready();
        
    }
}