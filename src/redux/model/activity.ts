import { ModelService } from './../../services/model.service';
import { SiriusWf } from './../../components/sirius-wf/sirius-wf';
import { WFService } from '../../services/wf.service';
import { Context } from './Context.model';
export interface Activity {
    type: string;
    execute(model?: object, wfService?: WFService, wf?: SiriusWf, modelService?: ModelService, context?: Context): void;
}