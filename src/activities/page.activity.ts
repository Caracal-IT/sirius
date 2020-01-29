import { Page } from '../model/Page.model';
import { WebComponent } from '../model/WebComponent.model';
import { Activity } from '../model/activity';
import { Context } from '../model/Context.model';
import { ValidationError } from '../model/ValidationError.model';
import { Validators } from '../validators/Validators';

export class PageActivity implements Activity, Page  {    
    components: WebComponent[];   
        
    static type = "page-activity"      
    static create(act: Activity) {
        return Object.assign(new PageActivity(), act);
    }
    
    type = PageActivity.type;

    execute = (context: Context) => {             
        // Clear the cache
        context.container.page = null;       
               
        this.components
            .filter(i => i.validators)
            .forEach(component => {
                component["error"] = "false";
                component["errorMessage"] = "";        
            });

        setTimeout(() => {
            context.container.page = {...this, context: context};        
        }, 0);
            
    }

    validate = (context: Context) => {               
        return new Promise((resolve, reject) => {
            const validatedComponents = this.components.filter(i => i.validators);
            let isValid = true;

            for(var component of validatedComponents) 
                isValid = isValid && Validators.validate(context, component);

            if(isValid)
                resolve(true);
            else
                reject(new ValidationError("Validation Failed"));
        });
    }
}    