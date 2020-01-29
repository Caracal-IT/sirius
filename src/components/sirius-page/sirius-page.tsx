import { Component, h, Prop } from "@stencil/core";

import { ModelService } from "../../services/model.service";
import { Page } from "../../model/Page.model";
import { WebComponent } from "../../model/WebComponent.model";

@Component({
  tag: "sirius-page",
  styleUrl: "sirius-page.css",
  shadow: true
})
export class SiriusPage {
  @Prop() page: Page;
  @Prop() modelService: ModelService;
      
  inputHandler(event: Event) {  
    this.modelService.setModelValue(event.target["id"], event.target["value"]);
  }

  render() {    
    const renderItem = (item: WebComponent) => [
        <item.tag wf-element error={item["error"]} onInput={this.inputHandler.bind(this)} {...item} context={this.page["context"]} value={this.modelService.getComponentModelValue(item)} />,
        <span>{item["errorMessage"]}</span>
    ]
    
    if(this.page && this.page.components)    
      return this.page.components.map(renderItem);        
  }
}