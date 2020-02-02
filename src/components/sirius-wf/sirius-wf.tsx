import { Component, Event, EventEmitter, State, Method, h, Prop } from "@stencil/core";

import { IPC } from "../../model/ipc.model";
import { Page } from "../../model/Page.model";
import { Context } from "../../model/Context.model";

import { WFService } from "../../services/wf.service";
import { HttpService } from "../../services/http.service";
import { ModelService } from "../../services/model.service";
import { PersistanceService } from "../../services/persistance.service";

import { WFHandler } from "../../handlers/wf.handler";
import { WFLoaderHandler } from "../../handlers/wfLoader.handler";

@Component({
  tag: "sirius-wf",
  shadow: true
})
export class SiriusWf {   
  private ipcHistory: any = [];
  
  http: HttpService;
  context: Context;
  wfService: WFService;
  modelService: ModelService;
  persistance: PersistanceService;
  
  wfHandler: WFHandler;
  wfLoaderHandler: WFLoaderHandler;
  
  @Event()
  wfMessage: EventEmitter;

  @State() page: Page; 
  
  @Prop({mutable: true, reflectToAttr: true}) wfSessionId: string;
  @Prop() baseUrl: string;
  @Prop() apiKey: string;
  @Prop({mutable: true, reflectToAttr: true}) process: string; 
    
  @Method()
  async addActivity(type: string, create: any){    
    this.wfService.addActivity(type, create);
  }

  @Method()
  async goto(activity: string){
    this.wfService.setNextAction(activity, this);
  }

  @Method()
  async loadProcess(processDef: string|object, activity: string = "start") {
    if(typeof processDef === 'object')
      processDef = JSON.stringify(processDef);

      const process = this.wfService.parse(processDef)
        
      if(!process)
        return;

      this.page = null;    
      this.wfService.setProcess(process);  
      this.goto(activity);      
  }

  @Method()
  async loadUrl(process: string, activity: string = "start") {    
    try {  
      await this.loadProcess(await this.wfLoaderHandler.load(process), activity);
      this.process = process;

      return this.wfService.getProcess();
    }
    catch(Exception) { }
  }

  @Method()
  async hydrate(process: string, sessionId: string, activity: string = "start") {
    this.wfSessionId = sessionId;

    const ipc = this.persistance.getItem(`${sessionId}_IPC`)||[];
    const model = this.persistance.getItem(`${sessionId}_MODEL`)||this.modelService.getModel();

    this.loadUrl(process, activity);

    this.ipcHistory = ipc;
    this.modelService.setModel(model);   
  }

  @Method()
  async dehydrate(sessionId: string) {
    this.persistance.clear();
    this.persistance.setItem(`${sessionId}_IPC`, this.ipcHistory);
    this.persistance.setItem(`${sessionId}_MODEL`, this.modelService.getModel());
  }

  async ipc(process: string, next: string = null) {    
    try {  
      this.ipcHistory.push(new IPC(this.process, process, next));

      this.persistance.setItem("WF_SIRIUS_IPC", this.ipcHistory);

      await this.loadUrl(process, "start");           
    }
    catch(Exception) { }
  }

  async completed(process: string) {
    const lastProcess = this.ipcHistory.pop();

    this.persistance.setItem("WF_SIRIUS_IPC", this.ipcHistory);

    if(!lastProcess || lastProcess.process !== process) {
      this.ipcHistory = [];

      this.persistance.setItem("WF_SIRIUS_IPC", this.ipcHistory);
      return;
    }
    
    try {
      await this.loadUrl(lastProcess.parent, lastProcess.next||"start");
    }
    catch(Exception) { }
  }

  async componentWillLoad() {    
    this.persistance = new PersistanceService();
    this.wfSessionId = this.wfSessionId||this.UUID();

    this.wfService = new WFService(); 
    this.modelService = new ModelService();
    this.http = new HttpService(this.modelService);

    this.wfHandler = new WFHandler(this.http, this.wfService, this.modelService, this);
    this.wfHandler.handle();       
    
    this.wfLoaderHandler = new WFLoaderHandler(this.http);
    this.wfLoaderHandler.apiKey = this.apiKey;
    this.wfLoaderHandler.baseUrl = this.baseUrl;

    if(this.process)
      this.loadUrl(this.process);
  }

  private UUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  render() {
    return <sirius-page page={this.page} modelService={this.modelService}/>;
  }
}