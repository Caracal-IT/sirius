import { Context } from '../models/context.model';
import { Activity } from './activity';

export class PageActivity extends Activity {
    type = 'page-activity';
    controls = [];

    async execute(ctx: Context) {
        ctx.container.innerHTML = '';
        this.controls.forEach(this.createElement.bind(this, ctx, ctx.container));
    }

    async exit(ctx: Context) {
        Array.from(ctx.container.querySelectorAll("[id]"))
             .forEach((i: any) => ctx.model.setValue(i.id, i.value));

        return true; 
    }

    private createElement(ctx: Context, parent: any, control: any): any {
        const newEl = Object.assign(document.createElement(control.tag), control, { ctx });
        
        if(control.id)
            newEl.value = ctx.model.getValue(control.id)??'';

        this.bindCaption(ctx, newEl, control);
        this.bindEvent(ctx, newEl, control);
        parent.appendChild(newEl);
        control.controls?.forEach(this.createElement.bind(this, ctx, newEl));
    }

    private bindCaption(ctx: Context,newEl: HTMLElement, control: any) {
        this.interpolate(ctx, 'caption', newEl, control);
        this.interpolate(ctx, 'textContent', newEl, control);
        this.interpolate(ctx, 'innerHTML', newEl, control);
    }

    private interpolate(ctx: Context, prop: string, newEl: any, control: any) {
        if(!newEl[prop])
            return;

        newEl[prop] = ctx.model.getInterpolatedValue(control[prop]||newEl[prop]);
    }

    private bindEvent(ctx: any, el: any, control: any) {
        Object.keys(control)
              .filter(k => k.startsWith('on'))
              .forEach(k => el[k.toLowerCase()] = (e:Event) => {
                    e.preventDefault();
                    new Function('ctx', control[k])(ctx);
              });
    }
}