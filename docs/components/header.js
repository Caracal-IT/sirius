export class HeaderComponent extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = '<h1>Header</h1>';
    }
}

customElements.define('demo-header', HeaderComponent);