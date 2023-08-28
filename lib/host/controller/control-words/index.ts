import { DirectionUI8ControlWordHandler } from "./handlers/directionUI8"
import { NullControlWordHandler } from "./handlers/null"
import { ResetControlWordHandler } from "./handlers/reset"
import { StartControlWordHandler } from "./handlers/start"
import { StopControlWordHandler } from "./handlers/stop"
import { ThrustUI16ControlWordHandler } from "./handlers/thrustUI16"
import { ControlWordHandlerBase } from "./model"

const exports: {[key: string]: (typeof ControlWordHandlerBase)} = {
   "directionui8": DirectionUI8ControlWordHandler,
   "thrustui16": ThrustUI16ControlWordHandler,
   "null": NullControlWordHandler,
   "reset": ResetControlWordHandler,
   "stop": StopControlWordHandler,
   "start": StartControlWordHandler
};

export default exports;