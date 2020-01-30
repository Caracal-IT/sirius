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
        context.container.dehydrate();        

        document.location.href = this.url;
    }    
}