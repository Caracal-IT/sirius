import { Context } from "../models/context.model";
import { Activity } from "./activity";

export class NotFoundActivity extends Activity {
    type = 'not-found-activity';
    
    constructor(private activity: string) { super();}

    async execute(_ctx: Context) {
        console.error(`The ${this.activity} was not found!!`);
    }
}