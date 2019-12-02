import { combineReducers } from "redux";

import app from "./app";
import wf from "./wf";

export const rootReducer = combineReducers({
  app,
  wf
});

export default rootReducer;
