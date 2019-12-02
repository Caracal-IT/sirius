import { AppState } from "./AppState";
import { WFState } from "./WFState";

export interface RootState {
  app: AppState;
  wf: WFState;
}
