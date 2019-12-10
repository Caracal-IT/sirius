import { Process } from "../redux/model/Process.model";
import { Store } from "@stencil/redux";
import { setNextAction, setProcess } from "../redux/actions/wf.action";

import { ActivityFactory} from "../activities/factory.activity";

export class WFService {
    setNextAction: typeof setNextAction;
    setProcess: typeof setProcess;
    
    constructor(private store: Store) { 
        this.store.mapDispatchToProps(this, { setNextAction, setProcess });        
    }
    
    addActivity(type: string, create: any){
        const act = ActivityFactory.activities.find(a => a.type === type);

        if(!act)
            ActivityFactory.activities.push({type, create})
    }

    parse(processDef: string) {
        try {
            const process = JSON.parse(processDef) as Process;
            ActivityFactory.linkActivities(process);

            return process;
        }
        catch(ex) {
            console.log(ex);
            return null;
        }
    }
}