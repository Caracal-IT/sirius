import { SiriusWf } from '../components/sirius-wf/sirius-wf';
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
    lastAction: string;
            
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
        this.context.model = model;

        if(this.currProcess === currProcess && this.currAction === currAction)                     
          return false;
                
        this.currProcess = currProcess;
        this.currAction = currAction;

        return true;
    }

    private executeActivity() {
        if(!this.hasActivities())
            return;
        
        const act = this.currProcess.activities.find((p: any) => p.name === this.currAction);    
        const model = this.context.model;  
        
        if(this.canExecute(act)){    
            this.tryExecute(act)
                .then(() => {  
                    if(act.components)            
                        this.lastAction = this.currAction;
                    else if(model !== this.context.model)               
                        this.wfService.setNextAction(this.lastAction);   
                    else                                                 
                        this.wfService.setNextAction(null);                
                });
        }             
    }

    private async tryExecute(act: any) {
        try {
            await act.execute(this.context);        
        }
        catch(ex) {            
            this.handleError(ex);
        }
    }

    private handleError(error: Error) {
        this.context.container.wfError.emit(error)
        console.log("ERROR OCCURED", error);
        console.dir(error);
    }
    
    private hasActivities() {
        return this.currProcess && this.currProcess.activities;
    }

    private canExecute(act: any) {
        return act && act.execute;
    }
}