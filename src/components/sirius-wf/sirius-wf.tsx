import { Component, Event, EventEmitter, State, Method, h } from "@stencil/core";

import { Page } from "../../model/Page.model";
import { Process } from "../../model/Process.model";

import { WFService } from "../../services/wf.service";
import { StoreHandler } from "../../handlers/store.handler";
import { Context } from "../../model/Context.model";
import { ModelService } from "../../services/model.service";

@Component({
  tag: "sirius-wf",
  shadow: true
})
export class SiriusWf {    
  wfService: WFService;
  modelService: ModelService;
  
  @State() context: Context;
  storeHandler: StoreHandler;
  
  @Event()
  wfMessage: EventEmitter;

  @State() page: Page;  
    
  @Method()
  async addActivity(type: string, create: any){    
    this.wfService.addActivity(type, create);
  }

  @Method()
  async goto(activity: string){
    this.wfService.setNextAction(activity);
  }

  @Method()
  async loadProcess(process: Process) {
    this.page = null;
    this.wfService.setProcess(process);    
  }

  @Method()
  async parse(processDef: string) {
    return this.wfService.parse(processDef);
  }

  async componentWillLoad() {    
    this.wfService = new WFService(); 
    this.modelService = new ModelService();
    this.storeHandler = new StoreHandler(this.wfService, this.modelService, this);

    this.storeHandler.handle();       
  }
  
  render() {
    return <sirius-page page={this.page} modelService={this.modelService}/>;
  }
}