export enum MessageType {
    START_LOADING = "START_LOADING",
    END_LOADING = "END_LOADING",
    UN_AUTHORIZED = "UN_AUTHORIZED"
}

export interface Message {
    type: MessageType;
    metadata?: any|undefined; 
}