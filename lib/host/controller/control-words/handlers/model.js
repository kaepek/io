export class ControlWordHandlerBase {
    name = null;
    state_name = null;
    word_data_length = 0;
    async ready(stream_junction_director) {
        this.stream_junction_director = stream_junction_director;
    }
    handle_input(input, state) {
    };
}