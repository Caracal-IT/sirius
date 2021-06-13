import { Context } from '../models/context.model';
import { HttpWorkflowLoader } from "../utilities/http-workflow-loader.utility";

import { ConfigService } from '../services/config.service';
import { HttpService } from "../services/http.service";
import { ModelService } from '../services/model.service';
import { WorkflowService } from '../services/workflow.service';

import { PageActivity } from '../activities/page.activity';
import { ApiActivity } from '../activities/api.activity';

import { PipeFactory } from '../pipes/factory.pipe';
import { MessageService } from '../services/message.service';

export class SiriusWf extends HTMLElement implements Context {
    static get observedAttributes() {
        return ['process'];
    }

    private isInitialized = false;
    private ctx: Context = this;
    private wfLoader: WorkflowLoader = new HttpWorkflowLoader(this);

    activities = [
        new PageActivity(),
        new ApiActivity()
    ];

    container!: HTMLElement;
    pipes = new PipeFactory(); 

    config = new ConfigService();
    message = new MessageService(this);
    http = new HttpService(this.config, this.message);
    model = new ModelService(this.config, this.pipes);
    wf = new WorkflowService(this.ctx, this.wfLoader, this.activities);

    async connectedCallback() {
        this.createContainer();
        
        await this.wfLoader.loadSettings(this.getAttribute('url'));

        const process = this.getAttribute('process');

        if(process)
            await this.wf.goto('start', process);

        this.isInitialized = true;
    }

    attributeChangedCallback(name: string, oldValue:string, newValue: string) {
        if(!this.isInitialized || oldValue == newValue)
            return;
            
        if(name == 'process' && newValue) 
            this.wf.goto('start', newValue);
    }

    private createContainer() {
        const shadow = !this.useShadow() ? this : this.attachShadow({mode: 'open'});
        const style = this.getAttribute('styleUrl');

        if(style != null && style != 'null')
            shadow.innerHTML = `<style>@import '${style}'</style>`;
        
        this.container = document.createElement("div");
        shadow.appendChild(this.container);
    }

    private useShadow() {
        return !(this.getAttribute('shadow') === "false");
    }
}

customElements.define('sirius-wf', SiriusWf);