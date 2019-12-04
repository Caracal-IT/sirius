import { Component, Prop, State, Method, Listen, h } from "@stencil/core";

import "@stencil/redux";
import { Store, Unsubscribe } from "@stencil/redux";
import { configureStore } from "../../redux/index.store";

import { Page } from "../../redux/model/Page.model";
import { Process } from "../../redux/model/Process.model";
import { RootState } from "../../redux/state/Root.state";

import { setNextAction, setProcess } from "../../redux/actions/wf.action";

@Component({
  tag: "sirius-wf",
  shadow: true
})
export class SiriusWf {  
  storeUnsubscribe: Unsubscribe;
  
  setProcess: typeof setProcess;
  setNextAction: typeof setNextAction;
  
  currAction: RootState["wf"]["currAction"];
  currProcess: RootState["wf"]["currProcess"];
  
  @State() page: Page;  
  @Prop({ context: "store" })store: Store;  
  
  @Method()
  async goto(activity: string){
    this.setNextAction(activity);
  }

  @Method()
  async loadProcess(process: Process) {
    this.setProcess(process);    
  }

  @Listen("gotoAct")
  async gotoActHandler(event: CustomEvent){
    this.goto(event.detail);
  }

  @Listen("loadProcess")
  async loadProcessHandler(event: CustomEvent) {
    this.setProcess(event.detail); 
  }

  async componentWillLoad() {
    this.store.setStore(configureStore({})); 
    this.store.mapDispatchToProps(this, { setNextAction, setProcess }); 
 
    this.storeUnsubscribe = this.store.mapStateToProps(this, (state: RootState) => {      
      const {wf:{ currProcess: currProcess, currAction: currAction }} = state;

      if(currProcess && currProcess.activities) {      
        const pg = currProcess.activities.find((p: any) => p.name === currAction);

        if(pg && pg.components) 
          this.page = pg;
      }
      
      return { currProcess, currAction };
    });      
  }

  render() {
    return <sirius-page page={this.page} />;
  }
}