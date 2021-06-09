export class ContentComponent extends HTMLElement {  

    async connectedCallback() {
        this.historyListener = this.onHashChange.bind(this);

        this.wf = document.createElement('sirius-wf');
        this.wf.setAttribute('url', this.ctx.getAttribute('url'));
        this.wf.setAttribute('shadow', this.ctx.getAttribute('shadow'));
        this.wf.setAttribute('styleUrl', this.ctx.getAttribute('styleUrl'));
        
        this.onHashChange();
        this.appendChild(this.wf);

        window.addEventListener('hashchange', this.historyListener);
    }

    disconnectedCallback(){
        window.removeEventListener('hashchange', this.historyListener);
    }

    onHashChange() {
        const act = window.location.hash.replace('#', '');

        if(act === 'home' || act === 'account')
            this.wf.setAttribute('process', act);        
    }
}

customElements.define('demo-content', ContentComponent);