export class ControlInputSourceHandler {
    type = null;
    scale = null;
    control_input_source_router = null;
    async handle_input(input_obj) {
        await this?.control_input_source_router?.handle_input(input_obj);
    }
    async ready(control_input_source_router) {
        this.control_input_source_router = control_input_source_router;
    }
}