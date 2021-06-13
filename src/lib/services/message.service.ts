import {Message} from '../models/message.model';

export class MessageService {
    constructor(private element: HTMLElement) { }

    post(message: Message) {
        this.element.dispatchEvent(new CustomEvent('workflow_changed', {detail: message}))
    }
}