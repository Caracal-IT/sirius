import { Context } from './../model/Context.model';
import { Activity } from "../model/activity.model";

export class RedirectActivity implements Activity {
    static type = "redirect-activity" 
    
    static create(act: Activity) {        
        return Object.assign(new RedirectActivity(), act);
    }

    type = RedirectActivity.type;        
    url: string;
    
    execute = (context: Context) => {             
        const sessionId = context.container.wfSessionId;
        context.container.dehydrate(sessionId);        

        if(this.url.indexOf("?") === -1)
            document.location.href = `${this.url}?sessionId=${sessionId}`;
        else
            document.location.href = `${this.url}&sessionId=${sessionId}`;
    }  
}