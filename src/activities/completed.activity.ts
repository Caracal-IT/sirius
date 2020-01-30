import { Context } from './../model/Context.model';
import { Activity } from "../model/activity.model";

export class CompletedActivity implements Activity {
    static type = "completed-activity" 
    
    static create(act: Activity) {        
        return Object.assign(new CompletedActivity(), act);
    }

    type = CompletedActivity.type;
        
    execute = (context: Context) => {             
        return context.container.completed(context.container.process);        
    }    
}