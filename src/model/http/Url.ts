import { HttpVerb } from "./HttpVerb";
export class Url {
    constructor(public rawUrl: string, public method: HttpVerb) { }
    get url() {
        return this.rawUrl;
    }
    get headers() {
        return {
            'Content-Type': 'application/json'
        };
    }
}
