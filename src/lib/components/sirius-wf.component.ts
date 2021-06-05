import { Activity } from '../activities/activity';
import { NotFoundActivity } from '../activities/not-found.activity';
import { PageActivity } from '../activities/page.activity';
import { Context } from '../models/context.model';
import { ConfigService } from '../services/config.service';
import { HttpService } from "../services/http.service";
import { HttpWorkflowLoader } from "../utilities/http-workflow-loader.utility";

export class SiriusWf extends HTMLElement implements Context {
    container: HTMLElement; 
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
        
        const shadow = this.attachShadow({mode: 'open'});
        shadow.innerHTML = `<style>@import '${this.getAttribute('styleUrl')}'</style>`;
        this.container = document.createElement("div");
        shadow.appendChild(this.container);
    }

    async connectedCallback() {
        await this.wfLoader.loadSettings(this.getAttribute('url'));
        this.wf = await this.wfLoader.load('default');
        await this.goto();
    }

    async goto(activity: string = 'start') {
        if(this.act != undefined && !this.act.exit(this)) return;
        const actDef = this.wf?.activities?.find((a: any) => a.name === activity);
        const act = this.activities.find(a => a.type === actDef?.type)??new NotFoundActivity(activity); 
        this.act = <Activity> Object.assign(act, actDef);      
        await this.act.execute(this);
    }
}

customElements.define('sirius-wf', SiriusWf);