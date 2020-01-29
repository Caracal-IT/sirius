import { Component, Event, EventEmitter, State, Method, h } from "@stencil/core";

import { Page } from "../../model/Page.model";
import { Process } from "../../model/Process.model";

import { WFService } from "../../services/wf.service";
import { WFHandler } from "../../handlers/wf.handler";
import { Context } from "../../model/Context.model";
import { ModelService } from "../../services/model.service";

@Component({
  tag: "sirius-wf",
  shadow: true
})
export class SiriusWf {    
  context: Context;
  wfService: WFService;
  modelService: ModelService;
  
  wfHandler: WFHandler;
  
  @Event()
  wfMessage: EventEmitter;

  @State() page: Page;  
    
  @Method()
  async addActivity(type: string, create: any){    
    this.wfService.addActivity(type, create);
  }

  @Method()
  async goto(activity: string){
    this.wfService.setNextAction(activity, this);
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

  @Method()
  async load(processDef: string|object) {
    if(typeof processDef === 'object')
      processDef = JSON.stringify(processDef);

      const process = this.wfService.parse(processDef)
        
      if(!process)
        return;

     return this.loadProcess(process);       
  }

  async componentWillLoad() {    
    this.wfService = new WFService(); 
    this.modelService = new ModelService();
    this.wfHandler = new WFHandler(this.wfService, this.modelService, this);

    this.wfHandler.handle();       
  }
  
  render() {
    return <sirius-page page={this.page} modelService={this.modelService}/>;
  }
}