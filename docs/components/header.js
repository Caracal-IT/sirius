export class HeaderComponent extends HTMLElement {
    
    async connectedCallback() {
        this.innerHTML = '<h1>Header</h1>';
    }
}

customElements.define('demo-header', HeaderComponent);