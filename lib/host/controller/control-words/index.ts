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
import { PowerLawRootCCWF32WordHandler } from "./handlers/powerlawrootccwF32.js"
import { PowerLawRootCWF32WordHandler } from "./handlers/powerlawrootcwF32.js"
import { PowerLawSetPointDivisorCCWF32WordHandler } from "./handlers/powerlawsetpointdivisorccwF32.js"
import { PowerLawSetPointDivisorCWF32WordHandler } from "./handlers/powerlawsetpointdivisorcwF32.js"
import { LinearBiasCWF32WordHandler } from "./handlers/linearsbiascwF32.js"
import { LinearBiasCCWF32WordHandler } from "./handlers/linearsbiasccwF32.js"
import { LinearSetPointCoefficientCCWF32WordHandler } from "./handlers/linearsetpointcoefficientccwF32.js"
import { LinearSetPointCoefficientCWF32WordHandler } from "./handlers/linearsetpointcoefficientcwF32.js"
import { Torque1UI16ControlWordHandler } from "./handlers/torqueUI16.js"
import { Delay1UI16ControlWordHandler } from "./handlers/delayUI16.js"

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
   "setpointf32": SetPointF32WordHandler,
   "powerlawrootccwf32": PowerLawRootCCWF32WordHandler,
   "powerlawrootcwf32": PowerLawRootCWF32WordHandler,
   "powerlawsetpointdivisorccwf32": PowerLawSetPointDivisorCCWF32WordHandler,
   "powerlawsetpointdivisorcwf32": PowerLawSetPointDivisorCWF32WordHandler,
   "linearbiascwf32": LinearBiasCWF32WordHandler,
   "linearbiasccwf32": LinearBiasCCWF32WordHandler,
   "linearsetpointcoefficientcwF32": LinearSetPointCoefficientCWF32WordHandler,
   "linearsetpointcoefficientccwF32": LinearSetPointCoefficientCCWF32WordHandler,
   "torqueui16": Torque1UI16ControlWordHandler,
   "delayui16": Delay1UI16ControlWordHandler
};

export default exports;