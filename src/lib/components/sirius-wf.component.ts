import { Context } from '../models/context.model';
import { HttpWorkflowLoader } from "../utilities/http-workflow-loader.utility";

import { ConfigService } from '../services/config.service';
import { HttpService } from "../services/http.service";

import { Activity } from '../activities/activity';
import { NotFoundActivity } from '../activities/not-found.activity';
import { PageActivity } from '../activities/page.activity';

export class SiriusWf extends HTMLElement implements Context {
    container!: HTMLElement; 

    config = new ConfigService();
    http = new HttpService(this.config);

    activities = [
        new PageActivity()
    ];

    private wfLoader: WorkflowLoader = new HttpWorkflowLoader(this);
    private wf: any|undefined;
    private act: Activity|undefined;
    
    constructor() {
        super();
        this.createContainer();
    }

    async connectedCallback() {
        await this.wfLoader.loadSettings(this.getAttribute('url'));
        await this.goto('start', 'default');
    }

    async goto(activity: string, process: string = '') {
        await this.loadProcess(process);
        await this.loadActivity(activity);
    }

    private async loadProcess(process: string) {
        if(process.length > 0)
            this.wf = await this.wfLoader.load(process);
    }

    private async loadActivity(activity: string) {
        if(this.act !== undefined && !this.act.exit(this)) return;

        const actDef = this.wf?.activities?.find((a: any) => a.name === activity);
        const act = this.activities.find(a => a.type === actDef?.type)??new NotFoundActivity(activity); 
        this.act = <Activity> Object.assign(act, actDef);      
        
        await this.act.execute(this);
    }

    private createContainer() {
        const shadow = !this.useShadow() ? this : this.attachShadow({mode: 'open'});

        shadow.innerHTML = `<style>@import '${this.getAttribute('styleUrl')}'</style>`;
        this.container = document.createElement("div");
        shadow.appendChild(this.container);
    }

    private useShadow() {
        return !(this.getAttribute('shadow') === "false");
    }
}

customElements.define('sirius-wf', SiriusWf);