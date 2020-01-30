import { Component, Event, EventEmitter, State, Method, h, Prop } from "@stencil/core";

import { Page } from "../../model/Page.model";
import { Process } from "../../model/Process.model";

import { WFService } from "../../services/wf.service";
import { WFHandler } from "../../handlers/wf.handler";
import { Context } from "../../model/Context.model";
import { ModelService } from "../../services/model.service";
import { WFLoaderHandler } from "../../handlers/wfLoader.handler";
import { HttpService } from "../../services/http.service";
import { PersistanceService } from "../../services/persistance.service";

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
  async loadProcess(process: Process, activity: string = "start") {
    this.page = null;    
    this.wfService.setProcess(process);  
    this.goto(activity);  
  }

  @Method()
  async parse(processDef: string) {
    return this.wfService.parse(processDef);
  }

  @Method()
  async load(processDef: string|object, activity: string = "start") {
    if(typeof processDef === 'object')
      processDef = JSON.stringify(processDef);

      const process = this.wfService.parse(processDef)
        
      if(!process)
        return;

     return this.loadProcess(process, activity);       
  }

  @Method()
  async loadUrl(process: string, activity: string = "start") {    
    try {  
      await this.load(await this.wfLoaderHandler.load(process), activity);
      this.process = process;
    }
    catch(Exception) { }
  }

  @Method()
  async hydrate(process: string, sessionId: string, activity: string = "start") {
    console.log(this.persistance.getItem(`${sessionId}_MODEL`));

    const ipc = this.persistance.getItem(`${sessionId}_IPC`)||[];
    const model = this.persistance.getItem(`${sessionId}_MODEL`)||this.modelService.getModel();

    this.loadUrl(process, activity);

    this.ipcHistory = ipc;
    this.modelService.setModel(model);   
  }

  @Method()
  async dehydrate(sessionId: string) {
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
  
  render() {
    return <sirius-page page={this.page} modelService={this.modelService}/>;
  }
}

class IPC {
  constructor(public parent: string, public process: string, public next: string){}
}