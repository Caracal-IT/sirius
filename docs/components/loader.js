export class PageLoader extends HTMLElement {  
    async connectedCallback() {
        const container = document.createElement('div');
        this.appendChild(container);
    }
}

customElements.define('demo-loader', PageLoader);