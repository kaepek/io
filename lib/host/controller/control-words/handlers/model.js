export class ControlWordHandlerBase {
    name = null;
    state_name = null;
    word_data_length = 0;
    handle_input(input, state) {
        throw "Not implemented";
    };
}