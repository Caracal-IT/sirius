import { ModelService } from "./model.service";
import { Mapping } from "./http/Mapping";
import { Url } from "./http/Url";
import { HttpVerb } from "./http/HttpVerb";
import { MappingDirection } from "./http/MappingDirection";

export class HttpService {
    constructor(private modelService: ModelService){ }

    async fetch(url: Url, mappings: Array<Mapping>): Promise<any> {
        const response = await fetch(url.url, this.getConfig(url, mappings));
        const data = await response.json();
        return this.setModelValues(data, mappings);
    }

    private getConfig(url: Url, mappings: Array<Mapping>): object{
        return  {
            method: url.method,
            mode: 'cors',
            headers: url.headers,
            redirect: 'follow',
            referrer: 'no-referrer',
            body: this.getBody(url, mappings)
        };
    }

    private getBody(url: Url, mappings: Array<Mapping>){
        if(url.method === HttpVerb.GET || url.method === HttpVerb.DELETE)
            return null;

        let body = {};
        const model =  this.modelService.getModel();       
        mappings
            .filter(m => m.direction === MappingDirection.Out || m.direction === MappingDirection.InOut)
            .forEach(m => Object.assign(body, {[m.client]: this.modelService.getValue(m.client, model)}));

        return JSON.stringify(body);
    }

    private setModelValues(data: any, mappings: Array<Mapping>){
        if(!mappings || mappings.length === 0) 
            return Object.keys(data).forEach(k => this.modelService.setModelValue(k, data[k]));  

        mappings
            .filter(m => m.direction === MappingDirection.Out || m.direction === MappingDirection.InOut)
            .forEach(m => this.modelService.setModelValue(m.client, this.modelService.getValue(m.remote, data)));
    }
}