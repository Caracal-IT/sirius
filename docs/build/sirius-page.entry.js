import { r as registerInstance, h } from './core-d4843236.js';

const SiriusPage = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    inputHandler(event) {
        this.modelService.setModelValue(event.target["id"], event.target["value"]);
    }
    render() {
        const renderItem = (item) => [
            h(item.tag, Object.assign({ "wf-element": true, error: item["error"], onInput: this.inputHandler.bind(this) }, item, { context: this.page["context"], value: this.modelService.getComponentModelValue(item) })),
            h("span", null, item["errorMessage"])
        ];
        if (this.page && this.page.components)
            return this.page.components.map(renderItem);
    }
    static get style() { return "[wf-element] {\n    border: 1px solid black;\n}\n\n[wf-element][error=true] {\n    border: 1px solid red;\n    background-color: pink;\n}"; }
};

export { SiriusPage as sirius_page };
