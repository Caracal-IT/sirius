import { Page } from '../model/Page.model';
import { WebComponent } from '../model/WebComponent.model';
import { Activity } from '../model/activity';
import { Context } from '../model/Context.model';
import { ValidationError } from '../model/ValidationError.model';

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
        
        setTimeout(() => {
            context.container.page = {...this, context: context};        
        }, 0);
            
    }

    validate = (context: Context) => {
        console.dir(context);

        return new Promise((resolve, reject) => {
            var rnd = Math.random();

            if(rnd > 0.5)
                resolve(true);
            else
                reject(new ValidationError("Validation Failed"));

        });
    }
}    