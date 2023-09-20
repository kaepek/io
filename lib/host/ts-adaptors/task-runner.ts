import NetworkAdaptor from "./network.js";
import { Task } from "./tasks.js";

export async function main(tasks: Array<Task>, adaptor: NetworkAdaptor) {
    let state = {};

    // should call run then call wait
    let resolver: Promise<any> = Promise.resolve();

    await adaptor.ready();

    tasks.forEach((task) => {
        resolver = resolver.then(async () => {
            const return_prom = task.completed().then((state_data_additions) => {
                state = { ...state_data_additions, ...state };
                return state_data_additions;
            });
            await task.run(state);
            return return_prom;
        });
    });

    return resolver;
}