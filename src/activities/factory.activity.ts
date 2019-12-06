import { Process } from "../redux/model/Process.model";
import { PageActivity } from "./page.activity";
import { DesisionActivity } from './desisionActivity.activity';
import { ApiActivity } from './api.activity';
import { CodeActivity } from "./code.activity";

export class ActivityFactiory {    
    static activities = [
        { type: PageActivity.type, create: PageActivity.create },
        { type: CodeActivity.type, create: CodeActivity.create },
        { type: DesisionActivity.type, create: DesisionActivity.create },
        { type: ApiActivity.type, create: ApiActivity.create }
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