import { SiriusWf } from './../../components/sirius-wf/sirius-wf';
import { ModelService } from './../../services/model.service';
import { WFService } from './../../services/wf.service';
import { HttpService } from '../../services/http.service';

export class Context {
    constructor(
        public model: any,  
        public modelService: ModelService, 
        public wfService: WFService,
        public http: HttpService,
        public container: SiriusWf){}
}