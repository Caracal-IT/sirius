import { Context } from './../model/Context.model';
import { Activity } from "../model/activity.model";

export class IPCActivity implements Activity {
    static type = "ipc-activity" 
    
    static create(act: Activity) {        
        return Object.assign(new IPCActivity(), act);
    }

    type = IPCActivity.type;
    process: string;
    activity: string;
    
    execute = (context: Context) => {     
        console.dir(context);              
        return context.container.loadUrl(this.process, this.activity||"start");        
    }    
}