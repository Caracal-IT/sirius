import { Context } from "../models/context.model";

export class Activity {
    type = '';
    async execute(_ctx: Context){}
    async exit(_ctx: Context){ return true; }
}