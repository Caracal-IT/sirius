import { ConfigService } from './config.service';
import { MessageService } from './message.service';
import {MessageType} from '../models/message.model';

export class HttpService {
    constructor(private config: ConfigService, private message: MessageService) {}

    async fetch(endpoint: Endpoint) {
        try {
            this.message.post({type: MessageType.START_LOADING});

            const response = await fetch(this.resolveSetting(endpoint.url), this.getConfig(endpoint));

            if(response.status >= 400) {
                const error = await response.json();

                if(response.status >= 401)
                    this.message.post({type: MessageType.UN_AUTHORIZED, metadata: {endpoint, error}});
                
                throw {
                    code: response.status,
                    message: response.statusText,
                    error: error
                };
            }
            
            if(response.headers.get("content-type")?.indexOf('json'))
                return await response.json();
            
            return await response.text();
        }
        finally {
            setTimeout(() => this.message.post({type: MessageType.END_LOADING}));
        }
    }

    private getConfig(endpoint: Endpoint): object{
        const config =  {
            method: endpoint.method,
            mode: 'cors',
            headers: Object.apply({"Content-Type": "application/json"}, endpoint.headers),
            redirect: 'follow',
            referrer: 'no-referrer',
            body: endpoint.body ? JSON.stringify(endpoint.body) : null
        };
        
        return config;
    }

    private resolveSetting(val: string, counter = 0) {
        if(counter > 2)
            return val;
            
        const matches = val.match(/\[[\w|_]+\]/g);

        if(!matches)
            return val;

        let result = matches.reduce(this.replace.bind(this) , val);

        if(result.indexOf('[') > -1)
          result = this.resolveSetting(result, counter++);

        return result;
    }

    private replace(prev: string, next: string): string {
        let replacement:string = this.config.getSetting(next);
        
        if(replacement && replacement.indexOf('[SELF]') > -1) 
           return replacement.replace('[SELF]', prev.replace(next, ''));

        return prev.replace(next, replacement);
    }
}