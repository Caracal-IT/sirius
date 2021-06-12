import { ApiEndpoint } from '../models/api-endpoint.model';
import { Context } from '../models/context.model';
import { Activity } from './activity';

export class ApiActivity extends Activity {
    type = 'api-activity';

    endpoints: Array<ApiEndpoint> | undefined;
    next:string | undefined;

    async execute(ctx: Context) {
        await this.callEndpoints(ctx);

        if(this.next)
            ctx.wf.goto(this.next);
    }

    private async callEndpoints(ctx: Context): Promise<boolean> {
       if(!this.endpoints) return false;

        for(const endpoint of this.endpoints) {
            endpoint.body = this.getBody(ctx, endpoint);
            
            await this.callEndpoint(ctx, endpoint);
        };

        return true;
    }

    private getBody(ctx: Context, endpoint: ApiEndpoint) {
        if(endpoint.method.toUpperCase() === "GET" || endpoint.method.toUpperCase() === "DELETE")
            return null;

        const mappings = endpoint.mappings;

        let body = {};
        mappings
            .filter(m => m.direction === 'out' || m.direction === 'inout')
            .forEach(m => Object.assign(body, {[m.remote]: ctx.model.getValue(m.client)}));
        
        return body;
    }

    private callEndpoint(ctx: Context, endpoint: ApiEndpoint) {
        return ctx.http
                  .fetch(endpoint)
                  .then(data => this.setModel(ctx, endpoint, data));
    }

    private setModel(ctx: Context, endpoint: ApiEndpoint, data: any) {
        const mappings = endpoint.mappings;

        if(!mappings || mappings.length === 0)             
            return Object.keys(data).forEach(k => ctx.model.setValue(k, data[k]));  
        
        mappings
            .filter(m => m.direction === 'in' || m.direction === 'inout')
            .forEach(m => ctx.model.setValue(m.client, ctx.model.getValue(m.remote, data)));
    }
}