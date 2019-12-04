import { ActionTypes, TypeKeys } from "../actions/app.action";

import { AppState } from "../model/AppState";

const getInitialState = (): AppState => {
  return {
    name: "Sirius Workflow"
  };
};

const app = (state = getInitialState(), action: ActionTypes): AppState => {
  switch (action.type) {
    case TypeKeys.SET_APP_NAME: {
      return { ...state, name: action.name };
    }
  }
  return state;
};

export default app;
