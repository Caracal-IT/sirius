import { r as registerInstance, h } from './core-1968082f.js';

const SiriusPage = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    async inputHandler(event) {
        this.modelService.setModelValue(event.target["id"], event.target["value"]);
        if (!this.page.isDirty)
            return;
        try {
            await this.page.validate(this.page.context);
        }
        catch (Ex) { }
    }
    render() {
        const renderItem = (item) => [
            h(item.tag, Object.assign({ "wf-element": true, data: item, error: item["error"], onInput: this.inputHandler.bind(this) }, item, { context: this.page["context"], value: this.modelService.getComponentModelValue(item) })),
            h("span", null, item["errorMessage"])
        ];
        if (this.page && this.page.components)
            return this.page.components.map(renderItem);
    }
    static get style() { return "input[wf-element] {\n    border: 1px solid black;    \n}\n\n[wf-element] {\n    margin: 0 2px;\n}\n\ninput[wf-element][error=true] {\n    border: 1px solid var(--error-color, red);\n    background-color: var(--error-bg-color, pink);\n}\n\nspan {\n    display: inline-block;\n    color: var(--error-color, red);\n}"; }
};

export { SiriusPage as sirius_page };
