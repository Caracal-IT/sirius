import { Activity } from "../activities/activity";
import { NotFoundActivity } from "../activities/not-found.activity";
import { Context } from "../models/context.model";

export class WorkflowService {
    private wf: any|undefined;
    private act: Activity|undefined;

    constructor(
        private ctx: Context, 
        private wfLoader: WorkflowLoader, 
        private activities: Array<Activity>) {}

    async goto(activity: string, process: string = '') {        
        await this.loadProcess(process);
        await this.loadActivity(activity);
    }

    private async loadProcess(process: string) {
        if(process.length > 0)
            this.wf = await this.wfLoader.load(process);
    }

    private async loadActivity(activity: string) {
        if(this.act !== undefined && !this.act.exit(this.ctx)) return;

        const actDef = this.wf?.activities?.find((a: any) => a.name === activity);
        const act = this.activities.find(a => a.type === actDef?.type)??new NotFoundActivity(activity); 
        this.act = <Activity> Object.assign(act, actDef);      
        
        await this.act.execute(this.ctx);
    }
}