import { MessageType } from "./message-type.model";

export class Message {    
    constructor(public messageType: MessageType, public description?: string, public stack?: string){}
}