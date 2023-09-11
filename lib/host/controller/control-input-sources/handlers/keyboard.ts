import { console2 } from "../../utils/log";
import { ControlInputSourceHandler } from "../model";
import { ControlInputSources } from "../sources";
import readline from "readline";
import { Subject } from "rxjs";

export const keyboard_debounce_time = 500;

export class KeyboardInputSourceHandler extends ControlInputSourceHandler {
    type = ControlInputSources.Keyboard;
    key_subject = new Subject();
    key$ = this.key_subject.asObservable();
    key_state: any = {};
    interval: number = keyboard_debounce_time;

    key_debounce: any = {}
    key_depressed: any = {};

    async ready() {
        readline.emitKeypressEvents(process.stdin);

        if (process.stdin.setRawMode != null) {
            process.stdin.setRawMode(true);
        }

        // so we get lots of events if the key is held down... use this to know 
        // value: false should mean up! // true should mean pressed

        process.stdin.on('keypress', (_, key) => {
            if (key) {
                const key_name = key.name;
                const key_event_data = {
                    source: this.type,
                    type: "button",
                    label: key_name,
                    ...key,
                };
                if (key.ctrl && key.name === "c") process.exit(0);
                if (!this.key_state[key_name]) {
                    this.key_state[key_name] = true;
                    this.key_subject.next({
                        ...key_event_data,
                        value: "pressed"
                    });
                    this.key_debounce[key_name] = setTimeout(() => {
                        this.key_state[key_name] = false;
                        this.key_depressed[key_name] = false;
                        this.key_subject.next({
                            ...key_event_data,
                            value: "released"
                        });
                    }, this.interval);
                }
                else {
                    clearTimeout(this.key_debounce[key_name]);
                    if (!this.key_depressed[key_name]) {
                        this.key_depressed[key_name] = true;
                        this.key_subject.next({
                            ...key_event_data,
                            value: "depressed"
                        });
                    }
                    this.key_debounce[key_name] = setTimeout(() => {
                        this.key_state[key_name] = false;
                        this.key_depressed[key_name] = false;
                        this.key_subject.next({
                            ...key_event_data,
                            value: "released"
                        });
                    }, 100);
                }
            }
        });


        this.key$.subscribe(data => {
            this.subject.next(data);
        });

        console2.success("INFO ControlInputSourceHandler: KeyboardInputSourceHandler ready.");
    }
}