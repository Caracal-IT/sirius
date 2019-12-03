import { Store } from "@stencil/redux";
import { setModelValue } from "../store/actions/wf";

export class ModelService {
  store: Store;
  setModelValue: typeof setModelValue;

  constructor(store: Store) {
    this.store = store;
    this.store.mapDispatchToProps(this, { setModelValue });
  }

  onInput = this.inputHandler.bind(this);

  getModelValue(id: string) {
      const model = this.store.getState()["wf"]["model"];

      if(id && model) 
        return id.split(".").reduce((total, currentElement) => total ? total[currentElement]: null, model);
            
      return null;
  }
  
  inputHandler(event: Event) {    
    const target = event.currentTarget as HTMLElement;    
    const wfElement = target.closest("[wf-element]");    

    this.setModelValue(wfElement.id, wfElement["value"]);
  }  
}