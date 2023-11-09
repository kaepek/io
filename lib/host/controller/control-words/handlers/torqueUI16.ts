import { ControlInputSources } from "../../control-input-sources/sources.js";
import { ControlWordDataTypes, ControlWords } from "../words.js";
import { ControlWordHandlerBase } from "../model.js";

/*
{ source: 'DualShock', type: 'button', label: 'left', value: true }
{ source: 'DualShock', type: 'button', label: 'left', value: false }
{ source: 'DualShock', type: 'button', label: 'right', value: true }
{ source: 'DualShock', type: 'button', label: 'right', value: false }
{ source: 'DualShock', type: 'button', label: 'up', value: true }
{ source: 'DualShock', type: 'button', label: 'up', value: false }
{ source: 'DualShock', type: 'button', label: 'down', value: true }
{ source: 'DualShock', type: 'button', label: 'down', value: false }

*/

export class Torque1UI16ControlWordHandler extends ControlWordHandlerBase {
    name = ControlWords.Torque1UI16;
    state_alias = "torque1";
    scale = 1.0;
    data_type = ControlWordDataTypes.UInt16LE;
    keyboard_key_held_timeout: {[key_name: string] :any} = {};
    dualshock_key_held_timeout: {[key_name: string] :any} = {};
    value_magnitude: {[key_name: string]: any} = {};

    min_value = 0;
    max_value = 65536 - 1;
    increment_speed_milliseconds = 55;
    default_change_increment = 10;

    handle_input(input: any) {
        super.handle_input(input); // deal with NetworkControlWord sources automatically.
        if (input.source === ControlInputSources.DualShock) { // #fixme
            if (input.type === "button" && input.label == "up") {
                if (input.value === true) { // pressed / depressed
                    this.value_magnitude[input.label] = 1;
                    let new_state_value = (this.state + 1);
                    if (new_state_value > this.max_value) new_state_value = this.max_value;
                    this.subject.next({word:this, value: new_state_value});
                    this.dualshock_key_held_timeout[input.label] = setInterval(()=>{
                        let new_state_value = this.state + this.value_magnitude[input.label];
                        if (new_state_value > this.max_value) new_state_value = this.max_value;
                        this.subject.next({word:this, value: new_state_value});
                        this.value_magnitude[input.label] = this.value_magnitude[input.label] + this.default_change_increment;
                    }, this.increment_speed_milliseconds);
                }
                else { // released
                    if (this.dualshock_key_held_timeout[input.label]) {
                        clearInterval(this.dualshock_key_held_timeout[input.label]);
                        this.value_magnitude[input.label] = 1;
                    }
                }
            }
            if (input.type === "button" && input.label == "down") {
                if (input.value === true) { // pressed / depressed
                    this.value_magnitude[input.label] = -1;
                    let new_state_value = this.state - 1;
                    if (new_state_value < this.min_value) new_state_value = this.min_value;
                    this.subject.next({word:this, value: new_state_value});
                    this.dualshock_key_held_timeout[input.label] = setInterval(()=>{
                        let new_state_value = this.state + this.value_magnitude[input.label];
                        if (new_state_value < this.min_value) new_state_value = this.min_value;
                        this.subject.next({word:this, value: new_state_value});
                        this.value_magnitude[input.label] = this.value_magnitude[input.label] - this.default_change_increment;
                    }, this.increment_speed_milliseconds);
                }
                else { // released
                    if (this.dualshock_key_held_timeout[input.label]) {
                        clearInterval(this.dualshock_key_held_timeout[input.label]);
                        this.value_magnitude[input.label] = -1;
                    }
                }
            }

        }
        else if (input.source === ControlInputSources.Keyboard) {
            if (input.label === "u") {
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
            if (input.label === "j") {
               if (input.value === "pressed") {
                    this.value_magnitude[input.label] = -1;
                    let new_state_value = this.state - 1;
                    if (new_state_value < this.min_value) new_state_value = this.min_value;
                    this.subject.next({word:this, value: new_state_value});
                }
                else if (input.value === "depressed") {
                    this.keyboard_key_held_timeout[input.label] = setInterval(()=>{
                        let new_state_value = this.state + this.value_magnitude[input.label];
                        if (new_state_value < this.min_value) new_state_value = this.min_value;
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