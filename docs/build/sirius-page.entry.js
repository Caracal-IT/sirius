import { r as registerInstance, d as getContext, h } from './core-b48d769a.js';
import { M as ModelService } from './model.service-dded3035.js';

const SiriusPage = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.store = getContext(this, "store");
    }
    async componentWillLoad() {
        this.modelService = new ModelService(this.store);
    }
    inputHandler(event) {
        this.modelService.setModelValue(event.target["id"], event.target["value"]);
    }
    render() {
        const renderItem = (item) => h(item.tag, Object.assign({ "wf-element": true, onInput: this.inputHandler.bind(this) }, item, { context: this.page["context"], value: this.modelService.getModelValue(item) }));
        if (this.page && this.page.components)
            return this.page.components.map(renderItem);
    }
};

export { SiriusPage as sirius_page };
