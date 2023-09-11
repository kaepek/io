import { ControlInputSources } from "../../control-input-sources/sources";
import { nmod } from "../../utils/mod";
import { ControlWordDataTypes, ControlWords } from "../words";
import { ControlWordHandlerBase } from "../model";

export class Thrust1UI16ControlWordHandler extends ControlWordHandlerBase {
    name = ControlWords.Thrust1UI16;
    state_alias = "thrust1";
    scale = 1.0;
    data_type = ControlWordDataTypes.UInt16LE;
    keyboard_key_held_timeout: {[key_name: string] :any} = {};
    value_magnitude: {[key_name: string]: any} = {};

    min_value = 0;
    max_value = 65536 - 1;
    increment_speed_milliseconds = 55;
    default_change_increment = 10;

    handle_input(input: any) {
        super.handle_input(input); // deal with NetworkControlWord sources automatically.
        if (input.source === ControlInputSources.DualShock) {
            if (input.type === "trigger" && input.label === "r2") {
                this.subject.next({word:this, value: input.value * 257}); // 257 maps 255 -> 65,536
            }
        }
        else if (input.source === ControlInputSources.Keyboard) {
            if (input.label === "up" || input.label === "w") {
                if (input.value === "pressed") {
                    this.value_magnitude[input.label] = 1;
                    let new_state_value = (this.state + 1);
                    if (new_state_value > this.max_value) new_state_value = this.max_value;
                    this.subject.next({word:this, value: new_state_value});
                }
                else if (input.value === "depressed") {
                    this.keyboard_key_held_timeout[input.label] = setInterval(()=>{
                        let new_state_value = this.state + this.value_magnitude[input.label];
                        if (new_state_value > this.max_value) new_state_value = this.max_value;
                        this.subject.next({word:this, value: new_state_value});
                        this.value_magnitude[input.label] = this.value_magnitude[input.label] + this.default_change_increment;
                    }, this.increment_speed_milliseconds);
                }
                else if (input.value === "released") {
                    if (this.keyboard_key_held_timeout[input.label]) {
                        clearInterval(this.keyboard_key_held_timeout[input.label]);
                        this.value_magnitude[input.label] = 1;
                    }
                }
            }
            if (input.label === "down" || input.label === "s") {
               if (input.value === "pressed") {
                    this.value_magnitude[input.label] = -1;
                    let new_state_value = this.state - 1;
                    if (new_state_value < 0) new_state_value = 0;
                    this.subject.next({word:this, value: new_state_value});
                }
                else if (input.value === "depressed") {
                    this.keyboard_key_held_timeout[input.label] = setInterval(()=>{
                        let new_state_value = this.state + this.value_magnitude[input.label];
                        if (new_state_value < 0) new_state_value = 0;
                        this.subject.next({word:this, value: new_state_value});
                        this.value_magnitude[input.label] = this.value_magnitude[input.label] - this.default_change_increment;
                    }, this.increment_speed_milliseconds);
                }
                else if (input.value === "released") {
                    if (this.keyboard_key_held_timeout[input.label]) {
                        clearInterval(this.keyboard_key_held_timeout[input.label]);
                        this.value_magnitude[input.label] = -1;
                    }
                }
            }
        }
    };
}