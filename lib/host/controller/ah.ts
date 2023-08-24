import { StreamJunctionDirector } from "./stream-junction-director";
// declare module 'dualshock';
// @ts-ignore
import * as dualshock from "dualshock";


console.log("dualshock", dualshock);
/*

declare module 'dualshock';

async function ah() {
   const ds = await import("dualshock");
   console.log("ds", ds);
}

ah().then(console.log).catch(console.error);*/