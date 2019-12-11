export class ModelService {
  modelChangedHandler: (arg0: {}) => void;
  model = {};

  setModelValue(name: string, value: any) {    
    this.model = this.merge(this.model, name, value);
    
    if(this.modelChangedHandler)
      this.modelChangedHandler(this.model);    
  }

  onInput = this.inputHandler.bind(this);

  getComponentModelValue(component: any) {
    const model = this.getModel();
    let value: any;

    if(component && component.id && model) 
      value = this.getModelValue(component.id);
          
    
    if(value === undefined && component.value)
      value = component.value;
      
    return value;
}

  getModelValue(key: any) {
      return this.getValue(key, this.getModel());
  }

  getModel(): any {
    return {...this.model};    
  }

  getValue(key: string, model: any) {    
    return key.split(".").reduce((total, currentElement) => total ? total[currentElement]: null, model);
  }

  private inputHandler(event: Event) {    
    const target = event.currentTarget as HTMLElement;    
    const wfElement = target.closest("[wf-element]");    

    this.setModelValue(wfElement.id, wfElement["value"]);
  } 
  
  private merge(model: any, name: string, value: any) {
    let newModel = {...model};
  
    name
      .split(".")  
      .reduce((total, current, index, arr) =>{
        total[current] = index == arr.length - 1 ? value : {...total[current]};
        return total[current];
      }, newModel);
  
    return newModel;
  }
}