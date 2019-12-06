import { Context } from "../redux/model/Context.model";
import { HttpVerb } from "../services/http/HttpVerb";
import { ModelUrl } from "../services/http/ModelUrl";
import { Mapping } from "../services/http/Mapping";

export class ApiActivity {      
    static type = "api-activity";

    static create(act) {
        return Object.assign(new ApiActivity(), act);
    }

    url: string;
    method: HttpVerb;
    mappings: Array<Mapping>;    
    next: string;
    type = ApiActivity.type;

    execute = (context: Context) => {  
        const url = new ModelUrl(this.url, this.method, context.modelService);        
        
        return context
            .http
            .fetch(url, this.mappings)
            .then(() => context.wfService.setNextAction(this.next));            
    };
  }