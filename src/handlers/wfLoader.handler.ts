import { HttpService } from './../services/http.service';
import { Url } from '../model/http/Url';
import { HttpVerb } from '../model/http/HttpVerb';

export class WFLoaderHandler {
    baseUrl: string;
    apiKey: string;
  
    constructor(private http: HttpService){ }

    load(process: string): Promise<object> {
        const url = new Url(`${this.baseUrl}\\${process}`, HttpVerb.GET);
        url.apiKey = this.apiKey;

        return this.http
                   .fetchData(url);                         
    }
}