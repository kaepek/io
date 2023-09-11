import { DerivativeF32WordHandler } from "./handlers/derivativeF32"
import { Phase1F32WordHandler } from "./handlers/phase1F32"
import { DirectionUI8ControlWordHandler } from "./handlers/directionUI8"
import { IntegralF32WordHandler } from "./handlers/integralF32"
import { NullControlWordHandler } from "./handlers/null"
import { ProportionalF32WordHandler } from "./handlers/proportionalF32"
import { ResetControlWordHandler } from "./handlers/reset"
import { StartControlWordHandler } from "./handlers/start"
import { StopControlWordHandler } from "./handlers/stop"
import { ThrustUI16ControlWordHandler } from "./handlers/thrustUI16"
import { ControlWordHandlerBase } from "./model"
import { Phase2F32WordHandler } from "./handlers/phase2F32"
import { Offset1F32WordHandler } from "./handlers/offset1F32"
import { Offset2F32WordHandler } from "./handlers/offset2F32"
import { SetPointF32WordHandler } from "./handlers/setpointF32"

const exports: {[key: string]: (typeof ControlWordHandlerBase)} = {
   "directionui8": DirectionUI8ControlWordHandler,
   "thrustui16": ThrustUI16ControlWordHandler,
   "null": NullControlWordHandler,
   "reset": ResetControlWordHandler,
   "stop": StopControlWordHandler,
   "start": StartControlWordHandler,
   "proportionalf32": ProportionalF32WordHandler,
   "derivativef32": DerivativeF32WordHandler,
   "integralf32": IntegralF32WordHandler,
   "phase1f32": Phase1F32WordHandler,
   "phase2f32": Phase2F32WordHandler,
   "offset1f32": Offset1F32WordHandler,
   "offset2f32": Offset2F32WordHandler,
   "setpointf32": SetPointF32WordHandler
};

export default exports;