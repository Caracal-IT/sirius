import { ModelService } from "../../services/model.service";
import { KeyValue } from "../KeyValue.model";
import { Url } from "./Url";
import { HttpVerb } from "./HttpVerb";
export class ModelUrl extends Url {
    constructor(rawUrl: string, method: HttpVerb, private modelService: ModelService) {
        super(rawUrl, method);
    }
    get url() {
        return this.getUrlWithValuesFromModel();
    }
    private getUrlWithValuesFromModel(): string {
        let newUrl = this.rawUrl;
        newUrl
            .match(/{[\w|\.]+}/g)
            .map(this.createValueItem.bind(this))
            .forEach((m: KeyValue) => newUrl = newUrl.replace(m.key, m.value || ''));
        return newUrl;
    }
    private createValueItem(key: string): KeyValue {        
        const name = key.substring(1, key.length - 1);
        const value = this.modelService.getValue(name, this.modelService.getModel());
        return { key, value };
    }
}
