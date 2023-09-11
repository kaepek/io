import { DerivativeF32WordHandler } from "./handlers/derivativeF32"
import { DirectionUI8ControlWordHandler } from "./handlers/directionUI8"
import { IntegralF32WordHandler } from "./handlers/integralF32"
import { NullControlWordHandler } from "./handlers/null"
import { ProportionalF32WordHandler } from "./handlers/proportionalF32"
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
   "start": StartControlWordHandler,
   "proportional": ProportionalF32WordHandler,
   "derivative": DerivativeF32WordHandler,
   "integral": IntegralF32WordHandler
};

export default exports;