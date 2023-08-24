declare module 'dualshock';

async function ah() {
   const ds = await import("dualshock");
   console.log("ds", ds);
}

ah().then(console.log).catch(console.error);