import { ActionTypes, TypeKeys } from "../actions/wf.action";
import { WFState } from "../state/WF.state";

const getInitialState = (): WFState => {
  return {
    currAction: "start",    
    model: {}    
  };
};

export default (state = getInitialState(), action: ActionTypes): WFState => {
  switch (action.type) {
    case TypeKeys.SET_MODEL_VALUE:      
      const model = merge(state.model, action.name, action.value);  
      return {...state, model: {...model}};
    case TypeKeys.SET_NEXT_ACTION:
      return {...state, currAction: action.name};
    case TypeKeys.SET_PROCESS:
      return {...state, currProcess: action.process, currAction: 'start'};
    default:
      return state;
  }
};

function merge(model: any, name: string, value: any) {
  let newModel = {...model};

  name
    .split(".")  
    .reduce((total, current, index, arr) =>{
      total[current] = index == arr.length - 1 ? value : {...total[current]};
      return total[current];
    }, newModel);

  return newModel;
}