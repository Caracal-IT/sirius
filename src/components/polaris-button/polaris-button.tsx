import { Component, Prop, Event, EventEmitter, h } from "@stencil/core";

@Component({
    tag: "polaris-button",
    shadow: true
  })
  export class PolarisButton {
    @Event()
    gotoAct: EventEmitter
        
    @Prop() next: string;
    @Prop() caption: string;
    
    render(){
        return <button onClick={this.gotoAct.emit.bind(this, this.next)}>{this.caption}</button>
    }
  }