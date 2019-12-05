import { Process } from "../redux/model/Process.model";
import { Store } from "@stencil/redux";
import { setNextAction, setProcess } from "../redux/actions/wf.action";

import { ActivityFactiory } from "../activities/factory.activity";

export class WFService {
    setNextAction: typeof setNextAction;
    setProcess: typeof setProcess;
    
    constructor(private store: Store) { 
        this.store.mapDispatchToProps(this, { setNextAction, setProcess });        
    }
    
    addActivity(type: string, create: any){
        const act = ActivityFactiory.activities.find(a => a.type === type);

        if(!act)
            ActivityFactiory.activities.push({type, create})
    }

    parse(processDef: string) {
        try {
            const process = JSON.parse(processDef) as Process;
            ActivityFactiory.linkActivities(process);

            return process;
        }
        catch(ex) {
            console.log(ex);
            return null;
        }
    }
}