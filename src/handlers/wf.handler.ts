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
    context: Context;    

    currProcess: Process; 
    currAction: string;
    lastAction: string;

    wfProcess: string;
    wfAction: string;
       
    hasError = false;
            
    constructor(      
        private http: HttpService,  
        private wfService: WFService, 
        private modelService: ModelService, 
        private container: SiriusWf){                    
        
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
        
        setTimeout(() => {
            this.setWorkflowStatus();
            this.sendMessage(new Message(MessageType.Workflow_Changing, this.getWorkflowStatus()));   
            this.executeActivity(source); 
        }, 10);  
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
        this.sendMessage(new Message(MessageType.Workflow_Changed, this.getWorkflowStatus())); 

        if(!this.hasError)
            this.lastAction = this.currAction;
    }

    private handleError(error: Error) {
        this.hasError = true;    
        this.sendMessage(new Message(MessageType.EndLoading)); 
        
        this.modelService.setModelValue("message", new Message(MessageType.EndLoading, error.message));

        if(error instanceof ValidationError)
            this.sendMessage(new Message(MessageType.ValidationError, error.message, error.stack));
        else
            this.sendMessage(new Message(MessageType.Error, error.message, error.stack));
            
        this.sendMessage(new Message(MessageType.Workflow_Changed, this.getWorkflowStatus()));
    }
    
    private hasActivities() {
        return this.currProcess && this.currProcess.activities;
    }

    private canExecute(act: any) {
        return act && act.execute;
    }

    private sendMessage(message: Message) {     
        const msg = {...message, process: this.wfProcess, activity: this.wfAction, wfSessionId: this.context.container.wfSessionId};

        this.modelService.setModelValue("message", msg);
        this.context.container.wfMessage.emit(msg);
    }

    private setWorkflowStatus() {
        this.wfAction = this.currAction;
        this.wfProcess = this.currProcess.name;
    }

    private getWorkflowStatus(): string {
        return JSON.stringify({
            process: this.wfProcess,
            activity: this.wfAction
        });
    }
}