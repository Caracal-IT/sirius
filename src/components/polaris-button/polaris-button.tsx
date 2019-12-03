import { Component, Prop, h } from "@stencil/core";

import { Store } from "@stencil/redux";
import { setNextAction } from "../../store/actions/wf";

@Component({
    tag: "polaris-button",
    shadow: true
  })
  export class PolarisButton {
    setNextAction: typeof setNextAction;
        
    @Prop() next: string;
    @Prop() title: string;
    @Prop({ context: "store" })store: Store;

    componentWillLoad(){
        this.store.mapDispatchToProps(this, { setNextAction });
    }

    render(){
        return <button onClick={() => this.setNextAction(this.next)}>{this.title}</button>
    }
  }