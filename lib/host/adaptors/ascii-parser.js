export class ASCIIParser {
    config = null;
    delimiter = null;

    deserialise(incoming_data) {
        const incoming_data_str = incoming_data.toString();
        const line_split = incoming_data_str.split(this.delimeter);
        const parsed_data = {};
        this.config.forEach(input_description => {
            const name = input_description.name;
            const position = input_description.position;
            const float_element_data = parseFloat(line_split[position]);
            if (Number.isNaN(float_element_data) != true) {
                parsed_data[name] = float_element_data;
            }
            else {
                parsed_data[name] = 0;
            }
        });
        return parsed_data;
    }

    serialise(outgoing_data_obj) {
        const outgoing_obj = {};
        this.config.forEach((output_description) => {
            const name = output_description.name;
            const position = output_description.position;
            const value = outgoing_data_obj[name];
            outgoing_obj[position] = value;
        });
        const int_keys = Object.keys(outgoing_obj).map((key)=>parseFloat(key));
        const max_index = Math.max(...int_keys);
        const outgoing_array = [...Array(max_index + 1)].map((_, idx) => idx).map((idx) => outgoing_obj[idx]);
        return outgoing_array.join(this.delimeter);
    }

    constructor(config, delimeter) {
        this.config = config;
        this.delimeter = delimeter;
    }
}