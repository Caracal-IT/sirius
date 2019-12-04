import { NullAction } from "./app.action";

export enum TypeKeys {
  NULL = "NULL", // Won't match anything
  SET_MODEL_VALUE = "SET_MODEL_VALUE",
  SET_NEXT_ACTION = "SET_NEXT_ACTION"
}

export interface SetModelValue {
  type: TypeKeys.SET_MODEL_VALUE;
  name: string;
  value: any;
}

export interface SetNextAction {
  type: TypeKeys.SET_NEXT_ACTION;
  name: string;  
}

export type ActionTypes = 
  NullAction | 
  SetModelValue |
  SetNextAction;

export const setModelValue = (name: string, value: any) => (dispatch, _getState) => {
  const action: SetModelValue = {
    type: TypeKeys.SET_MODEL_VALUE,
    name,
    value
  };

  dispatch(action);
};

export const setNextAction = (name: string) => (dispatch, _getState) => {
  const action: SetNextAction = {
    type: TypeKeys.SET_NEXT_ACTION,
    name    
  };

  dispatch(action);
};