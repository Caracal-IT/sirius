import { AppState } from "./App.state";
import { WFState } from "./WF.state";

export interface RootState {
  app: AppState;
  wf: WFState;
}
