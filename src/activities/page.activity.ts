import { Page } from '../model/Page.model';
import { WebComponent } from '../model/WebComponent.model';
import { Activity } from '../model/activity.model';
import { Context } from '../model/Context.model';
import { ValidationError } from '../model/ValidationError.model';
import { Validators } from '../validators/Validators';

export class PageActivity implements Activity, Page  {    
    components: WebComponent[];   
    context: Context;
    isDirty: boolean;
        
    static type = "page-activity"      
    static create(act: Activity) {
        return Object.assign(new PageActivity(), act);
    }
    
    type = PageActivity.type;

    execute = (context: Context) => {  
        this.context = context;     
        this.isDirty = false;
               
        this.components
            .filter(i => i.validators)
            .forEach(component => {
                component["error"] = "false";
                component["errorMessage"] = "";    
            });

        setTimeout(this.reload.bind(this), 10);
    }

    reload() {
        this.context.container.page = null;
        setTimeout(() => this.context.container.page = this, 15);
    }

    validate = (context: Context): Promise<boolean> => {   
        return new Promise((resolve, reject) => {
            const validatedComponents = this.components.filter(i => i.validators);
            let isValid = true;
            this.isDirty = true;

            for(var component of validatedComponents) 
                isValid = isValid && Validators.validate(context, component);

            if(isValid) 
                resolve(true);
            else
                reject(new ValidationError("Validation Failed"));
        });
    }
}    