import { SiriusWf } from './../components/sirius-wf/sirius-wf';
import { Store, Unsubscribe } from "@stencil/redux";
import { WFService } from "../services/wf.service";
import { ModelService } from "../services/model.service";
import { Context } from "../redux/model/Context.model";
import { HttpService } from "../services/http.service";
import { Process } from "../redux/model/Process.model";

export class StoreHandler {
    wfService: WFService;
    modelService: ModelService;
    http: HttpService;
    context: Context;    

    currProcess: Process; 
    currAction: string;
        
    constructor(private store: Store, private container: SiriusWf){
        this.wfService = new WFService(this.store);
        this.modelService = new ModelService(this.store);
        this.http = new HttpService(this.modelService);   

        this.context = new Context({}, this.modelService, this.wfService, this.http, this.container);
    }

    subscribe(): Unsubscribe {
        return this.store.getStore().subscribe(this.handle.bind(this));
    }

    private handle(){       
        if(!this.setWfState())
            return; 
    
        this.executeActivity();
    }

    private setWfState(): boolean {
        const state =  this.store.getState();
        const {wf:{ model: model, currProcess: currProcess, currAction: currAction }} = state;
          
        if(this.currProcess === currProcess && this.currAction === currAction)
          return false;

        this.context.model = model;
        this.currProcess = currProcess;
        this.currAction = currAction;

        return true;
    }

    private executeActivity() {
        if(!this.hasActivities())
            return;
        
        const act = this.currProcess.activities.find((p: any) => p.name === this.currAction);
      
        if(this.canExecute(act))        
            act.execute(this.context);        
    }
    
    private hasActivities() {
        return this.currProcess && this.currProcess.activities;
    }

    private canExecute(act: any) {
        return act && act.execute;
    }
}