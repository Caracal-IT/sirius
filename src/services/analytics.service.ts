import { WebComponent } from "../model/WebComponent.model";

export class AnalyticsService {
    send(type: string, event: any){
        const wfElement = event.path.find((i: HTMLElement) => i.hasAttribute && i.hasAttribute("wf-element"));

        if(!wfElement)
            return;

        const payload = this.createPayload(type, wfElement, event.path);

        if(payload) {
            console.log("ANALYTICS", payload);
            
            window.postMessage({
                type: payload.type, 
                page: payload.page, 
                control: payload.control, 
                value: payload.value,
                path: payload.wfPath.map(i => i.id)
            }, "*");
        }
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