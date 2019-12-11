import { MessageType } from './../model/messages/message-type.model';
import { Message } from './../model/messages/message.model';
import { SiriusWf } from '../components/sirius-wf/sirius-wf';
import { WFService } from "../services/wf.service";
import { ModelService } from "../services/model.service";
import { Context } from "../model/Context.model";
import { HttpService } from "../services/http.service";
import { Process } from "../model/Process.model";

export class StoreHandler {        
    http: HttpService;
    context: Context;    

    currProcess: Process; 
    currAction: string;
    lastAction: string;

    hasError = false;
            
    constructor(        
        private wfService: WFService, 
        private modelService: ModelService, 
        private container: SiriusWf){        
            
        this.http = new HttpService(this.modelService);   
        this.context = new Context({}, this.modelService, this.wfService, this.http, this.container);
    }

    handle(): void {
        this.wfService.wfChangeHandler = this.handleWfChange.bind(this);
        this.modelService.modelChangedHandler = this.handleModelChanged.bind(this);
    }

    private handleWfChange(action: string, process: Process){            
        this.currProcess = process;
        this.currAction = action||"start";               
        this.executeActivity();
    }

    private handleModelChanged(model: any) {        
        this.context.model = model;
    }

    private executeActivity() {
        if(!this.hasActivities())
            return;
        
        const act = this.currProcess.activities.find((p: any) => p.name === this.currAction);    
        const model = this.context.model;  
        
        if(this.canExecute(act)){  
            this.hasError = false;                            
            this.sendMessage(new Message(MessageType.StartLoading, "Loading..."));

            this.tryExecute(act)
                .then(() => this.actionExecuted(act, model))
                .catch((error: Error) => {                    
                    this.modelService.setModelValue("message", new Message(MessageType.EndLoading));                    
                    this.handleError(error);
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

    private actionExecuted(act: any, model: any) {
        if(this.hasError)
            return;
        
        this.sendMessage(new Message(MessageType.EndLoading));
        this.goToNextAction(act, model);       
    }

    private goToNextAction(act: any, model: any) {
        if(act.components)            
            this.lastAction = this.currAction;
        else if(model !== this.context.model)               
            this.wfService.setNextAction(this.lastAction);   
        else                                                 
            this.wfService.setNextAction(null);   
    }

    private handleError(error: Error) {
        this.hasError = true;                 
        this.sendMessage(new Message(MessageType.Error, error.message, error.stack));
        
        console.log("ERROR OCCURED", error);
        console.dir(error);
    }
    
    private hasActivities() {
        return this.currProcess && this.currProcess.activities;
    }

    private canExecute(act: any) {
        return act && act.execute;
    }

    private sendMessage(msg: Message){
        this.modelService.setModelValue("message", msg);
        this.context.container.wfMessage.emit(msg);
    }
}