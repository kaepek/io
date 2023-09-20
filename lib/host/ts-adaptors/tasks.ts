import { Observable, Subscription } from "rxjs";


export class Task {

    tick(incoming_data: any) {
        throw "Not implemented yet";
    }

    public return_promise_resolver: ((value: void | PromiseLike<void>) => void) = null as any;
    public return_promise_rejector: ((reason?: any) => void) = null as any;

    async completed(): Promise<any> {
        return this.return_promise;
    }

    async run(state?: any) {
        this.input_subscription = this.input$.subscribe((data: any) => this.tick(data));
    }

    async done (ret: any): Promise<any> {};

    return_promise: Promise<any> | null;
    input_subscription: Subscription | null = null;

    input$: Observable<any>;

    constructor(input$: Observable<any>) {
        this.input$ = input$;
        this.return_promise = new Promise<any>((resolve, reject) => {
            this.return_promise_resolver = resolve;
            this.return_promise_rejector = reject;
        }).then(async (ret: any) => {
            if (this.input_subscription !== null) this.input_subscription.unsubscribe();
            return this.done(ret);
        }).catch((err: any) => {
            if (this.input_subscription !== null) this.input_subscription.unsubscribe();
            throw err;
        });
    }
}