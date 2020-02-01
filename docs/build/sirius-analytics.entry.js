import { r as registerInstance } from './core-9e6a015e.js';

class AnalyticsService {
    constructor() {
        this.instanceId = this.UUID();
    }
    sendMessage(event) {
        this.sendPostMessage(event.detail);
    }
    send(type, event) {
        const wfElement = event.path.find((i) => i.hasAttribute && i.hasAttribute("wf-element"));
        if (!wfElement)
            return;
        const payload = this.createPayload(type, wfElement, event.path);
        if (payload) {
            this.sendPostMessage({
                type: payload.type,
                page: payload.page,
                control: payload.control,
                value: payload.value,
                path: payload.wfPath.map(this.getName)
            });
        }
    }
    sendPostMessage(message) {
        const msg = Object.assign(Object.assign({}, message), { sessionId: this.instanceId, timestamp: Date.now() });
        console.log("ANALYTICS", msg);
        window.postMessage(msg, "*");
    }
    getName(item) {
        if (item.id)
            return item.id;
        if (item.page && item.page.name)
            return item.page.name;
        return "";
    }
    createPayload(type, wfElement, path) {
        const p = path.filter((i) => i.nodeName && i.nodeName.indexOf("document-fragment") === -1);
        const wfPage = p.find((i) => i.localName === "sirius-page");
        if (!wfPage)
            return null;
        const activity = Object.assign({}, wfPage.page);
        const wfPath = p.slice(0, p.indexOf(wfPage) + 1);
        if (!activity.name)
            return null;
        const page = activity.name;
        const control = wfElement.id;
        const value = wfElement.value;
        return { type, page, control, value, wfPath };
    }
    UUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

const SiriusAnalytics = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    async analyticsHandler(event) {
        const wfElement = event.path.find((i) => i.hasAttribute && i.hasAttribute("wf-element"));
        if (!wfElement)
            return;
        event.path[0].addEventListener("blur", this.onBlur);
        SiriusAnalytics.analyticsService.send("click", event);
    }
    wfMessage(event) {
        SiriusAnalytics.analyticsService.sendMessage(event);
    }
    onBlur(event) {
        event.target.removeEventListener("blur", this.onBlur);
        SiriusAnalytics.analyticsService.send("blur", event);
    }
};
SiriusAnalytics.analyticsService = new AnalyticsService();

export { SiriusAnalytics as sirius_analytics };
