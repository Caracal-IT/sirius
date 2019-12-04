import { AppState } from "./AppState.model";
import { WFState } from "./WFState.model";

export interface RootState {
  app: AppState;
  wf: WFState;
}
