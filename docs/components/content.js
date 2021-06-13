export class ContentComponent extends HTMLElement {  

    async connectedCallback() {
        this.loadCount  = 0;

        this.historyListener = this.onHashChange.bind(this);
        this.workflowListener = this.onWorkflowChanged.bind(this);

        this.loader = document.createElement('demo-loader');
        this.loader.className = 'hidden';
        this.appendChild(this.loader);

        this.wf = document.createElement('sirius-wf');
        this.wf.setAttribute('url', this.ctx.getAttribute('url'));
        this.wf.setAttribute('shadow', this.ctx.getAttribute('shadow'));
        this.wf.setAttribute('styleUrl', this.ctx.getAttribute('styleUrl'));
        
        this.onHashChange();
        this.appendChild(this.wf);

        window.addEventListener('hashchange', this.historyListener);
        this.wf.addEventListener('workflow_changed', this.workflowListener);
    }

    disconnectedCallback(){
        window.removeEventListener('hashchange', this.historyListener);
        this.wf.removeEventListener('workflow_changed', this.workflowListener);
    }

    onHashChange() {
        const act = window.location.hash.replace('#', '');

        if(act === 'home' || act === 'account')
            this.wf.setAttribute('process', act);        
    }

    onWorkflowChanged(e) {
        switch (e.detail.type) {
            case 'START_LOADING': return this.toggleLoader(true);
            case 'END_LOADING': return this.toggleLoader(false);
            default: return;
        }
    }

    toggleLoader(display) {
        if(display) {
            this.loadCount++;

            setTimeout(() => {
                if(this.loadCount > 0)
                    this.loader.className = '';
            }, 500);
        }
        else {
            this.loadCount--;

            if(this.loadCount < 0)
                this.loadCount = 0;

            if(this.loadCount === 0)
                this.loader.className = 'hidden';
        }
    }
}

customElements.define('demo-content', ContentComponent);