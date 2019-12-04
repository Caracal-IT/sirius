export interface NullAction {
    type: TypeKeys.NULL;
}
  
export interface SetUserName {
    type: TypeKeys.SET_APP_NAME;
    name: string;
  }

// Keep this type updated with each known action
export type ActionTypes = 
    NullAction |
    SetUserName;
  
export enum TypeKeys {
    NULL = "NULL",  // Won't match anything
    SET_APP_NAME = "SET_APP_NAME"
}

export const setAppName = (name: string) => (dispatch, _getState) => {
    const action: SetUserName = {
      type: TypeKeys.SET_APP_NAME,
      name
    };
    
    dispatch(action);
  };