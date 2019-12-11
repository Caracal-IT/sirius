import { Page } from '../model/Page.model';
import { WebComponent } from '../model/WebComponent.model';
import { Activity } from '../model/activity';
import { Context } from '../model/Context.model';

export class PageActivity implements Activity, Page  {    
    components: WebComponent[];   
        
    static type = "page-activity"      
    static create(act: Activity) {
        return Object.assign(new PageActivity(), act);
    }
    
    type = PageActivity.type;

    execute = (context: Context) => {               
        context.container.page = {components: []};         
        setTimeout(() => context.container.page = {...this, context: context}, 0);
    }
}