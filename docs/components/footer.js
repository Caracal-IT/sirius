export class FooterComponent extends HTMLElement {
    
    async connectedCallback() {
        this.innerHTML = '<h6>&copy;&nbsp;Caracal - Sirius</h6>';
    }
}

customElements.define('demo-footer', FooterComponent);