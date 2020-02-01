import { WebComponent } from './../model/WebComponent.model';
import { Context } from '../model/Context.model';
import { Validator } from './Validator';
import { RequiredValidator } from './required.validator';

export class Validators {
    static RegisteredValidators: Array<Validator> = [
        new RequiredValidator("Required")
    ]

    static validate(context: Context, component: WebComponent): boolean {               
        const validators = new Validators(context, component);
        const isValid = validators.validate();
       
        context.container.page = {...context.container.page};

        return isValid;
    }

    constructor(private context: Context, private component: WebComponent) { }

    private validate(){
        this.setErrorState(null);

        if(this.hasValidators())
            return this.executeValidators();
    
        return true;
    }

    private hasValidators(): boolean{
        return this.component 
            && this.component.validators 
            && this.component.validators.length > 0
    }

    private executeValidators() : boolean {
        for (const config of this.component.validators) {
            const v = Validators.RegisteredValidators.find(v => v.name === config.name)
            
            if(v && !v.validate(this.context, this.component, config))
                return false;          
        }

        return true;
    }    

    private setErrorState(errorMessage: string) {
        this.component["error"] = errorMessage && errorMessage.length > 0;
        this.component["errorMessage"] = errorMessage;
    }
}