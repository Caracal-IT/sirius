import { r as registerInstance, c as getContext, h } from './core-c2ec3f06.js';
import { s as setAppName } from './app-93d25773.js';

const MyComponent = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.store = getContext(this, "store");
    }
    componentWillLoad() {
        this.store.mapDispatchToProps(this, { setAppName });
        this.storeUnsubscribe = this.store.mapStateToProps(this, (state) => {
            const { app: { name } } = state;
            return {
                name
            };
        });
    }
    componentDidUnload() {
        this.storeUnsubscribe();
    }
    render() {
        return h("div", null, h("p", null, this.name), h("input", { value: this.name, onInput: e => this.setAppName(e.target.value) }));
    }
    static get style() { return ""; }
};

export { MyComponent as my_component };
