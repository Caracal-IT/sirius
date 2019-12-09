import { Page } from '../redux/model/Page.model';
import { WebComponent } from '../redux/model/WebComponent.model';
import { Activity } from '../redux/model/activity';
import { Context } from '../redux/model/Context.model';

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