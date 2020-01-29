import { WebComponent } from './../model/WebComponent.model';
import { Context } from '../model/Context.model';
import { Validator } from './Validator';

export class RequiredValidator extends Validator {
    validate(context: Context, component: WebComponent): boolean {
        const value = context.modelService.getModelValue(component.id);

        if (value == null || value == undefined || value.toString().trim().length == 0) {
            component["error"] = "true";
            component["errorMessage"] = "The field is required!!";
            return false;
        }
        
        return true;
    }
}
