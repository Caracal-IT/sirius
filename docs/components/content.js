export class ContentComponent extends HTMLElement {
    async connectedCallback() {
        const wf = document.createElement('sirius-wf');
        wf.setAttribute('url', this.ctx.getAttribute('url'));
        wf.setAttribute('shadow', this.ctx.getAttribute('shadow'));
        wf.setAttribute('styleUrl', this.ctx.getAttribute('styleUrl'));
        wf.setAttribute('process', 'home');
        
        this.appendChild(wf);
    }
}

customElements.define('demo-content', ContentComponent);