import { Component, Event, EventEmitter, Prop, State, Method, h } from "@stencil/core";

import "@stencil/redux";
import { Store, Unsubscribe } from "@stencil/redux";
import { configureStore } from "../../redux/index.store";

import { Page } from "../../redux/model/Page.model";
import { Process } from "../../redux/model/Process.model";

import { WFService } from "../../services/wf.service";
import { StoreHandler } from "../../handlers/StoreHandler";

@Component({
  tag: "sirius-wf",
  shadow: true
})
export class SiriusWf {  
  storeUnsubscribe: Unsubscribe;
  wfService: WFService;
  storeHandler: StoreHandler;

  @Event()
  wfError: EventEmitter;

  @State() page: Page;  

  @Prop({ context: "store" }) store: Store;  
  
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
    this.store.setStore(configureStore({})); 
    this.wfService = new WFService(this.store); 
    this.storeHandler = new StoreHandler(this.store, this);

    this.storeUnsubscribe = this.storeHandler.subscribe();       
  }

  async componentDidUnload() {
    this.storeUnsubscribe();
  }

  render() {
    return <sirius-page page={this.page} />;
  }
}