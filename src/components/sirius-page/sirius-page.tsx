import { Component, h, Prop } from "@stencil/core";
import { Store } from "@stencil/redux";

import { ModelService } from "../../services/model.service";

import { Page } from "../../redux/model/Page.model";
import { WebComponent } from "../../redux/model/WebComponent.model";

@Component({
  tag: "sirius-page",
  shadow: true
})
export class SiriusPage {
  private modelService: ModelService;

  @Prop() page: Page;
  @Prop({ context: "store" }) store: Store;  
  
  async componentWillLoad() {
    this.modelService = new ModelService(this.store);    
  }

  inputHandler(event: Event) {
    this.modelService.setModelValue(event.target["id"], event.target["value"]);
  }

  render() {
    const renderItem = (item: WebComponent) => <item.tag wf-element onInput={this.inputHandler.bind(this)} {...item} context={this.page["context"]} value={this.modelService.getModelValue(item)} />
        
    if(this.page && this.page.components)    
      return this.page.components.map(renderItem);        
  }
}