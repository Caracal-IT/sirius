import { Component, Prop, State, h } from "@stencil/core";

import "@stencil/redux";
import { Store, Unsubscribe } from "@stencil/redux";
import { configureStore } from "../../store";

import { RootState } from "../../store/model/RootState";
import { Page } from "../../store/model/wf/Page";

import * as utils from "../../utils/utils";

@Component({
  tag: "sirius-wf",
  shadow: true
})
export class SiriusWf {
  storeUnsubscribe: Unsubscribe;
  currAction: RootState["wf"]["currAction"];
  
  @State() page: Page;  
  @Prop({ context: "store" })store: Store;  

  wf: any;

  constructor(){
    this.wf = utils.wf;   
  }

  async componentWillLoad() {
    this.store.setStore(configureStore({}));  
    
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