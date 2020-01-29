import { WebComponent } from './../model/WebComponent.model';
import { Context } from '../model/Context.model';

export abstract class Validator {
    constructor(public name: string) { }
    abstract validate(context: Context, component: WebComponent, config: any): boolean;
}
