import { MessageType } from "./message-type.model";

export class Message {    
    constructor(public messageType: MessageType, public message?: string, public stack?: string){}
}