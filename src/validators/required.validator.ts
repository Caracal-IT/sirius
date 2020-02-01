import { WebComponent } from '../model/WebComponent.model';
import { Context } from '../model/Context.model';
import { Validator } from './Validator';

export interface RequiredValidatorConfig {
    name: string;
    message: string;
}

export class RequiredValidator extends Validator {
    validate(context: Context, component: WebComponent, config: RequiredValidatorConfig): boolean {
        const value = context.modelService.getModelValue(component.id);

        if (value == null || value == undefined || value.toString().trim().length == 0) {
            component["error"] = "true";
            component["errorMessage"] = config.message;
            return false;
        }
        
        return true;
    }
}