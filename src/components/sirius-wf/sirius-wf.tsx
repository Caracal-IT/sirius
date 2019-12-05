import { Component, Prop, State, Method, Listen, h } from "@stencil/core";

import "@stencil/redux";
import { Store, Unsubscribe } from "@stencil/redux";
import { configureStore } from "../../redux/index.store";

import { Page } from "../../redux/model/Page.model";
import { Process } from "../../redux/model/Process.model";

import { WFService } from "../../services/wf.service";
import { ModelService } from "../../services/model.service";
import { Context } from "../../redux/model/Context.model";

@Component({
  tag: "sirius-wf",
  shadow: true
})
export class SiriusWf {  
  storeUnsubscribe: Unsubscribe;
  wfService: WFService;

  currProcess: Process; 
  currAction: string;
  
  @State() page: Page;  
  @Prop({ context: "store" }) store: Store;  
  
  @Method()
  async goto(activity: string){
    this.wfService.setNextAction(activity);
  }

  @Method()
  async loadProcess(process: Process) {
    this.wfService.setProcess(process);    
  }

  @Method()
  async parse(processDef: string) {
    return this.wfService.parse(processDef);
  }

  @Listen("gotoAct")
  async gotoActHandler(event: CustomEvent){
    this.goto(event.detail);
  }

  @Listen("loadProcess")
  async loadProcessHandler(event: CustomEvent) {
    this.loadProcess(event.detail); 
  }

  async componentWillLoad() {
    this.store.setStore(configureStore({})); 
    this.wfService = new WFService(this.store); 
    const modelService = new ModelService(this.store);   

    this.store.getStore().subscribe(() => {
      const state =  this.store.getState();
      const {wf:{ model: model, currProcess: currProcess, currAction: currAction }} = state;

      const context = new Context(model, modelService, this.wfService, this);

      if(this.currProcess === currProcess && this.currAction == currAction)
        return;

      this.currProcess = currProcess;
      this.currAction = currAction;

      if(currProcess && currProcess.activities) {      
        const act = currProcess.activities.find((p: any) => p.name === currAction);

        if(act && act.execute)        
            act.execute(context);        
      }
    });       
  }

  render() {
    return <sirius-page page={this.page} />;
  }
}