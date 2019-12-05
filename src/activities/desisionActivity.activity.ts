import { Context } from './../redux/model/Context.model';
import { Activity } from "../redux/model/activity";

export class DesisionActivity implements Activity {
    static type = "desision-activity" 
    
    static create(act: Activity) {        
        return Object.assign(new DesisionActivity(), act);
    }

    type = DesisionActivity.type;
    left: string;
    equality: string;
    right: string;

    trueAction: string;
    falseAction: string;

    execute = (context: Context) => {                      
        const result = this.eval(this.left + " " + this.equality + " " + this.right, context);
        if(result)
            context.wfService.setNextAction(this.trueAction)             
        else
            context.wfService.setNextAction(this.falseAction)            
    }

    eval(expression: string, context: Context) {
        try {
            var f =  new Function('context', 'model', 'return ' + expression);
            return f(context, context.model);         
        }
        catch(ex){
            console.log(ex);
            return false;
        }
    }
}