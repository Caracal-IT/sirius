import { Component, Prop, State, Listen, h } from "@stencil/core";

import "@stencil/redux";
import { Store, Unsubscribe } from "@stencil/redux";
import { configureStore } from "../../redux/index.store";

import { RootState } from "../../redux/model/RootState.model";
import { Page } from "../../redux/model/wf/Page.model";

import * as utils from "../../utils/utils";
import { setNextAction } from "../../redux/actions/wf.action";

@Component({
  tag: "sirius-wf",
  shadow: true
})
export class SiriusWf {
  storeUnsubscribe: Unsubscribe;
  setNextAction: typeof setNextAction;
  currAction: RootState["wf"]["currAction"];
  
  @State() page: Page;  
  @Prop({ context: "store" })store: Store;  

  wf: any;

  constructor(){
    this.wf = utils.wf;   
  }

  @Listen("gotoAct")
  gotoAct(event: CustomEvent){
    this.setNextAction(event.detail);
  }

  async componentWillLoad() {
    this.store.setStore(configureStore({})); 
    this.store.mapDispatchToProps(this, { setNextAction }); 
    
    this.storeUnsubscribe = this.store.mapStateToProps(this, (state: RootState) => {
      const {wf:{ currAction: currAction }} = state;
      const pg = this.wf.activities.find((p: any) => p.name === currAction);

      if(pg && pg.components) 
        this.page = pg;
      
      return { currAction };
    });  
  }

  render() {
    return <sirius-page page={this.page} />;
  }
}