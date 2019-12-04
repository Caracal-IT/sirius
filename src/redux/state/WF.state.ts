import { Process } from "../model/Process.model";

export interface WFState {
  model?: any;
  currAction?: string;
  currProcess?: Process;
}
