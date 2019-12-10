import { Context } from '../redux/model/Context.model';
import { Activity } from "../redux/model/activity";
import { CodeActivity } from './code.activity';

export class DesisionActivity extends CodeActivity {
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
        const expression = `return ${this.left} ${this.equality} ${this.right};`
        const result = super.eval(expression, context);
        
        if(result)
            context.wfService.setNextAction(this.trueAction)             
        else
            context.wfService.setNextAction(this.falseAction)                    
    }    
}