import { Context } from './../model/Context.model';
import { Activity } from "../model/activity";

export class CodeActivity implements Activity {
    static type = "code-activity" 
    
    static create(act: Activity) {        
        return Object.assign(new CodeActivity(), act);
    }

    type = CodeActivity.type;
    expression: string;
    next: string;

    execute = (context: Context) => {   
        this.eval(this.expression, context);        
        context.wfService.setNextAction(this.next);
    }

    eval(expression: string, context: Context) {
        const f =  new Function('context', 'model', expression);        
        return f(context, context.model);                
    }
}