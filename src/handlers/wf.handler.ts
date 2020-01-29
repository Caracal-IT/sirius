import { MessageType } from '../model/messages/message-type.model';
import { Message } from '../model/messages/message.model';
import { SiriusWf } from '../components/sirius-wf/sirius-wf';
import { WFService } from "../services/wf.service";
import { ModelService } from "../services/model.service";
import { Context } from "../model/Context.model";
import { HttpService } from "../services/http.service";
import { Process } from "../model/Process.model";
import { ValidationError } from '../model/ValidationError.model';

export class WFHandler {        
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

    private handleWfChange(action: string, process: Process, source: any){  
        this.hasError = false;           
        this.currProcess = process;
        this.currAction = action||"start";               
        this.executeActivity(source);       
    }

    private handleModelChanged(model: any) {        
        this.context.model = model;
    }

    private executeActivity(source: any) {
        if(!this.hasActivities())
            return;
        
        const act = this.currProcess.activities.find((p: any) => p.name === this.currAction);    
               
        if(this.canExecute(act)){  
            this.hasError = false;                            
            this.sendMessage(new Message(MessageType.StartLoading, "Loading..."));

            this.validate(source)                
                .then(() => act.execute(this.context))
                .then(() => this.actionExecuted())
                .catch((error: Error) => this.handleError(error));
        }             
    }    

    private async validate(source: any): Promise<boolean> {           
        if(this.shouldSkipValidate(source))
            return true;
        
        const act = this.currProcess.activities.find((p: any) => p.name === this.lastAction);
        
        if(act && act.validate) 
            return act.validate(this.context);                   
    }

    private shouldSkipValidate(source: any): boolean {               
        return (source && source.data && source.data.noValidate) 
            || (this.currAction === this.lastAction);            
    }

    private actionExecuted() {          
        this.sendMessage(new Message(MessageType.EndLoading));                

        if(!this.hasError)
            this.lastAction = this.currAction;
    }

    private handleError(error: Error) {
        this.hasError = true;    
        
        this.modelService.setModelValue("message", new Message(MessageType.EndLoading, error.message));

        if(error instanceof ValidationError)
            this.sendMessage(new Message(MessageType.ValidationError, error.message, error.stack));
        else
            this.sendMessage(new Message(MessageType.Error, error.message, error.stack));        
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