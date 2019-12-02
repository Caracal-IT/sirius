import { ActionTypes } from "./../actions/wf";
import { WFState } from "../model/WFState";

const getInitialState = (): WFState => {
  return {
    name: "Sirius Workflow"
  };
};

const wf = (state = getInitialState(), action: ActionTypes): WFState => {
  switch (action.type) {
    default:
      return state;
  }
};

export default wf;
