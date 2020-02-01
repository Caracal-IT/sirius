import { WebComponent } from "../model/WebComponent.model";

export class AnalyticsService {
    sendMessage(event: any) {
        this.sendPostMessage(event.detail);
    }

    send(type: string, event: any){
        const wfElement = event.path.find((i: HTMLElement) => i.hasAttribute && i.hasAttribute("wf-element"));

        if(!wfElement)
            return;

        const payload = this.createPayload(type, wfElement, event.path);

        if(payload) {
            this.sendPostMessage({
                type: payload.type, 
                page: payload.page, 
                control: payload.control, 
                value: payload.value,
                path: payload.wfPath.map(this.getName)
            });
        }
    }

    private sendPostMessage(message: any) {
        const msg = {...message, timestamp:Date.now()};

        console.log("ANALYTICS", msg);
        window.postMessage(msg, "*");
    }

    private getName(item: any): string {
        if(item.id)
            return item.id;

        if(item.page && item.page.name)
            return item.page.name;

        return "";
    }

    private createPayload(type: string, wfElement: WebComponent, path: any){
        const p = path.filter((i: HTMLElement) => i.nodeName && i.nodeName.indexOf("document-fragment") === -1);
        const wfPage = p.find((i: HTMLElement) => i.localName === "sirius-page");

        if(!wfPage)
            return null;
   
        const activity = {...wfPage.page}; 
        const wfPath = p.slice(0, p.indexOf(wfPage) + 1)

        if(!activity.name)
            return null;
    
        const page = activity.name;
        const control = wfElement.id;
        const value = wfElement.value;

        return { type, page, control, value, wfPath};        
    }
}