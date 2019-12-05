import { Process } from "../redux/model/Process.model";
import { PageActivity } from "./page.activity";
import { DesisionActivity } from './desisionActivity.activity';

export class ActivityFactiory {    
    static activities = [
        { type: PageActivity.type, create: PageActivity.create },
        { type: DesisionActivity.type, create: DesisionActivity.create }
    ]

    static linkActivities(process: Process){              
        process
            .activities
            .forEach(p => {
                const act = ActivityFactiory.activities.find(a => a.type === p.type)

                if(act && act.create) 
                    Object.assign(p, act.create(p));                                    
            });

        }        
}