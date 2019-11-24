import { ActionTypes, TypeKeys } from "./../actions/app";

import { AppState } from "../model/AppState";

const getInitialState = (): AppState => {
  return {
    name: "Polaris"
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