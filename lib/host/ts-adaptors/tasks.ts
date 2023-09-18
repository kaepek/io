import { Observable, Subscription } from "rxjs";


export class Task {

    tick(incoming_data: any) {
        throw "Not implemented yet";
    }

    private return_promise_resolver: ((value: void | PromiseLike<void>) => void) | null = null;
    private return_promise_rejector: ((reason?: any) => void) | null = null;

    async run() {
        return this.return_promise;
    }

    return_promise: Promise<void> | null;
    input_subscription: Subscription;

    constructor(input$: Observable<any>) {
        this.input_subscription = input$.subscribe((data) => this.tick(data));
        this.return_promise = new Promise<void>((resolve, reject) => {
            this.return_promise_resolver = resolve;
            this.return_promise_rejector = reject;
        }).then((ret: any) => {
            this.input_subscription.unsubscribe();
            return ret;
        }).catch((err: any) => {
            this.input_subscription.unsubscribe();
            return err;
        });
    }
}