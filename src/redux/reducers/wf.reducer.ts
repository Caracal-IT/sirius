import { ActionTypes, TypeKeys } from "../actions/wf.action";
import { WFState } from "../model/WFState.model";

const getInitialState = (): WFState => {
  return {
    currAction: "start",
    model: {
      registration: {
        numberSelect2: "2",
        firstName: "Ettiene"
      }
    }
  };
};

export default (state = getInitialState(), action: ActionTypes): WFState => {
  switch (action.type) {
    case TypeKeys.SET_MODEL_VALUE:      
      const model = merge(state.model, action.name, action.value);  
      return {...state, model: {...model}};
    case TypeKeys.SET_NEXT_ACTION:
      return {...state, currAction: action.name};
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