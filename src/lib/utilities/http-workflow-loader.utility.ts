import { Context } from "../models/context.model";

export class HttpWorkflowLoader implements WorkflowLoader {
    constructor(private ctx: Context){}

    async load(processName: string) {
        return await this.ctx.http.fetch({
            method: 'GET',
            url: `[WF]${processName}`
        });
    }

    async loadSettings(url: string|null) {
        if(url) {
            this.ctx.config.addSetting("[settingsUrl]", url);
            const settings = await this.ctx.http.fetch({method: "GET", url: url});
            Object.keys(settings).forEach(k => this.ctx.config.addSetting(k, settings[k]));
        }
    }
}