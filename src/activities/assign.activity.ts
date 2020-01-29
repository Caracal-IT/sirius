import { Context } from './../model/Context.model';
import { Activity } from "../model/activity";

export class AssignActivity implements Activity {
    static type = "assign-activity" 
    
    static create(act: Activity) {        
        return Object.assign(new AssignActivity(), act);
    }

    type = AssignActivity.type;
    key: string;
    value: string;
    next: string;

    execute = (context: Context) => {           
        let value = this.value||"";

        if(this.value.startsWith("{") && this.value.endsWith("}"))            
            value = context.modelService.getValue(this.value.substring(1, this.value.length - 1), context.model);            
                
        context.modelService.setModelValue(this.key, value);         
        context.wfService.setNextAction(this.next, this);
    }    
}