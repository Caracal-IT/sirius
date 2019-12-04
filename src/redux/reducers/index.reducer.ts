import { combineReducers } from "redux";

import app from "./app.reducer";
import wf from "./wf.reducer";

export const rootReducer = combineReducers({
  app,
  wf
});

export default rootReducer;
