import { WebComponent } from "./WebComponent.model";
import { Context } from "./Context.model";

export interface Page {
    components: Array<WebComponent>;
    context: Context;
    isDirty: boolean;
    
    validate(context: Context) : Promise<boolean>;
}
