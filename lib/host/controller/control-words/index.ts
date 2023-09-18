import { DerivativeF32WordHandler } from "./handlers/derivativeF32.js"
import { Phase1F32WordHandler } from "./handlers/phase1F32.js"
import { Direction1UI8ControlWordHandler } from "./handlers/directionUI8.js"
import { IntegralF32WordHandler } from "./handlers/integralF32.js"
import { NullControlWordHandler } from "./handlers/null.js"
import { ProportionalF32WordHandler } from "./handlers/proportionalF32.js"
import { ResetControlWordHandler } from "./handlers/reset.js"
import { StartControlWordHandler } from "./handlers/start.js"
import { StopControlWordHandler } from "./handlers/stop.js"
import { Thrust1UI16ControlWordHandler } from "./handlers/thrustUI16.js"
import { ControlWordHandlerBase } from "./model.js"
import { Phase2F32WordHandler } from "./handlers/phase2F32.js"
import { Offset1F32WordHandler } from "./handlers/offset1F32.js"
import { Offset2F32WordHandler } from "./handlers/offset2F32.js"
import { SetPointF32WordHandler } from "./handlers/setpointF32.js"

const exports: {[key: string]: (typeof ControlWordHandlerBase)} = {
   "directionui8": Direction1UI8ControlWordHandler,
   "thrustui16": Thrust1UI16ControlWordHandler,
   "null": NullControlWordHandler,
   "reset": ResetControlWordHandler,
   "stop": StopControlWordHandler,
   "start": StartControlWordHandler,
   "proportionalf32": ProportionalF32WordHandler,
   "derivativef32": DerivativeF32WordHandler,
   "integralf32": IntegralF32WordHandler,
   "phasef32": Phase1F32WordHandler,
   "phase2f32": Phase2F32WordHandler,
   "offsetf32": Offset1F32WordHandler,
   "offset2f32": Offset2F32WordHandler,
   "setpointf32": SetPointF32WordHandler
};

export default exports;