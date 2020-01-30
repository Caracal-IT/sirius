import { HttpVerb } from "./HttpVerb";
export class Url {
    apiKey: string;

    constructor(public rawUrl: string, public method: HttpVerb) { }

    get url() {
        return this.rawUrl;
    }

    get headers() {
        return {
            'Content-Type': 'application/json',
            'api-key': this.apiKey
        };
    }
}
