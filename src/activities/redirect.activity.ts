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
        const sessionId = this.UUID();
        context.container.dehydrate(sessionId);        

        if(this.url.indexOf("?") === -1)
            document.location.href = `${this.url}?sessionId=${sessionId}`;
        else
            document.location.href = `${this.url}&sessionId=${sessionId}`;
    }  
    
    UUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    }
}