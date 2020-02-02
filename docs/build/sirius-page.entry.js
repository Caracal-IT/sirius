import { r as registerInstance, h } from './core-9e6a015e.js';

const SiriusPage = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    async inputHandler(event) {
        this.modelService.setModelValue(event.target["id"], event.target["value"]);
        if (!this.page.isDirty)
            return;
        await this.page.validate(this.page.context);
    }
    renderItem(item) {
        return [
            h(item.tag, Object.assign({ "wf-element": true, id: item.id, data: item, error: item["error"], errorMsg: item["errorMessage"], onInput: this.inputHandler.bind(this) }, item, { context: this.page["context"], value: this.modelService.getComponentModelValue(item), caption: this.modelService.getInterpolatedValue(item["caption"]) })),
            item.validators ? h("span", null, item["errorMessage"]) : null
        ];
    }
    render() {
        if (this.page && this.page.components)
            return this.page.components.map(this.renderItem.bind(this));
    }
    static get style() { return "input[wf-element][data-error-style=true] {\n    border: 1px solid black;    \n}\n\n[wf-element] {\n    margin: 0 2px;\n}\n\ninput[wf-element][error=true][data-error-style=true] {\n    border: 1px solid var(--error-color, red);\n    background-color: var(--error-bg-color, pink);\n}\n\nspan {\n    display: inline-block;\n    color: var(--error-color, red);\n}"; }
};

export { SiriusPage as sirius_page };
