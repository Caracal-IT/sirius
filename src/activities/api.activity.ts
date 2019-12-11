import { Context } from "../model/Context.model";
import { HttpVerb } from "../model/http/HttpVerb";
import { ModelUrl } from "../model/http/ModelUrl";
import { Mapping } from "../model/http/Mapping";

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