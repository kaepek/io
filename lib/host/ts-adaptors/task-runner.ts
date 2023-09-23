import NetworkAdaptor from "./network.js";
import { Task } from "./task.js";

const merge = (o1: any, o2: any) => {
    const c1 = structuredClone(o1);
    const c2 = structuredClone(o2);
    Object.keys(c2).forEach((key) => {
        if (c2[key] instanceof Object && c1[key] instanceof Object) return c1[key] = merge(c1[key], c2[key]);
        c1[key] = c2[key];
    });
    return c1;
};

export async function run_tasks(tasks: Array<Task<any>>, adaptor: NetworkAdaptor) {
    let state = {};

    // should call run then call wait
    let resolver: Promise<any> = Promise.resolve();

    await adaptor.ready();

    tasks.forEach((task) => {
        resolver = resolver.then(async () => {
            const return_prom = task.completed().then((state_data_additions) => {
                state = merge(state, state_data_additions);
                return state;
            });
            await task.run(state);
            return return_prom;
        });
    });

    return resolver;
}