import { ControlInputSourceHandler } from "./model";
import { ControlInputSources } from "../sources";
import readline from "readline";
import { Subject, interval } from "rxjs";
import { takeUntil, buffer, filter, debounceTime, distinctUntilChanged } from "rxjs/operators";

export class KeyboardInputSourceHandler extends ControlInputSourceHandler {
    type = ControlInputSources.Keyboard;
    key_subject = new Subject();
    key$ = this.key_subject.asObservable();
    key_state: any = {};
    interval: number = 500;

    key_debounce: any = {}

    async ready() {
        readline.emitKeypressEvents(process.stdin);

        if (process.stdin.setRawMode != null) {
            process.stdin.setRawMode(true);
        }

        // so we get lots of events if the key is held down... use this to know 
        process.stdin.on('keypress', (_, key) => {
            if (key) {
                if (key.ctrl && key.name === "c") process.exit(0);
                const key_name = key.name;
                if (!this.key_state[key_name]) {
                    this.key_state[key_name] = true;
                    this.key_subject.next({
                        source: this.type,
                        type: "button",
                        ...key,
                        key_name,
                        value: true
                    });
                    this.key_debounce[key_name] = setTimeout(()=>{
                        this.key_state[key_name] = false;
                        this.key_subject.next({
                            source: this.type,
                            type: "button",
                            ...key,
                            key_name,
                            value: false
                        });
                    }, this.interval);
                }
                else {
                    clearTimeout(this.key_debounce[key_name]);
                    this.key_debounce[key_name] = setTimeout(()=>{
                        this.key_state[key_name] = false;
                        this.key_subject.next({
                            source: this.type,
                            type: "button",
                            ...key,
                            key_name,
                            value: false
                        });
                    }, 100);
                }
            }
        });


        this.key$.subscribe(data => {
            console.log("press", data);
        });

        // value: false should mean up! // true should mean pressed
    }

    constructor() {
        super();
    }
}