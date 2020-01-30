import { Context } from './../model/Context.model';
import { Activity } from "../model/activity.model";

export class IPCActivity implements Activity {
    static type = "ipc-activity" 
    
    static create(act: Activity) {        
        return Object.assign(new IPCActivity(), act);
    }

    type = IPCActivity.type;
    process: string;    
    next: string;
    
    execute = (context: Context) => {             
        return context.container.ipc(this.process, this.next);        
    }    
}