import { Process } from "../model/Process.model";
import { ActivityFactory} from "../activities/factory.activity";

export class WFService {    
    
    wfChangeHandler: (action: string, process: Process, source: any) => void;
    action: string;
    process: Process;
    
    setNextAction(name: string, source: any) {
        this.action = name;

        if(this.wfChangeHandler)
            this.wfChangeHandler(this.action, this.process, source);
    }

    setProcess(process: Process) {        
        this.process = process;

        if(this.wfChangeHandler)
            this.wfChangeHandler(this.action, this.process, null);
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