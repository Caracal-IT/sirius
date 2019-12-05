import { Store } from "@stencil/redux";
import { setModelValue } from "../redux/actions/wf.action";

export class ModelService {
  store: Store;
  setModelValue: typeof setModelValue;

  constructor(store: Store) {
    this.store = store;
    this.store.mapDispatchToProps(this, { setModelValue });
  }

  onInput = this.inputHandler.bind(this);

  getModelValue(component: any) {
      const model = this.store.getState()["wf"]["model"];
      let value: any;

      if(component && component.id && model) 
        value = component.id.split(".").reduce((total, currentElement) => total ? total[currentElement]: null, model);
            
      if(value === undefined && component.value)
        value = component.value;

      return value;
  }

  private inputHandler(event: Event) {    
    const target = event.currentTarget as HTMLElement;    
    const wfElement = target.closest("[wf-element]");    

    this.setModelValue(wfElement.id, wfElement["value"]);
  }  
}