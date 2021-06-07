export class MenuComponent extends HTMLElement {
    async connectedCallback() {
        this.innerHTML = '<h1>Menu</h1>';
    }
}

customElements.define('demo-menu', MenuComponent);