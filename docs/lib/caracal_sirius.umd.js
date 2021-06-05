!function(t){"function"==typeof define&&define.amd?define(t):t()}((function(){"use strict";class t{constructor(){this.type=""}async execute(t){}async exit(t){return!0}}class e extends t{constructor(t){super(),this.activity=t,this.type="not-found-activity"}async execute(t){console.error(`The ${this.activity} was not found!!`)}}class i extends t{constructor(){super(...arguments),this.type="page-activity",this.controls=[]}async execute(t){t.container.innerHTML="",this.controls.forEach(this.createElement.bind(this,t,t.container))}createElement(t,e,i){var s;const n=Object.assign(document.createElement(i.tag),i,{ctx:t});this.bindEvent(t,n,i),e.appendChild(n),null==(s=i.controls)||s.forEach(this.createElement.bind(this,t,n))}bindEvent(t,e,i){Object.keys(i).filter((t=>t.startsWith("on"))).forEach((s=>e[s.toLowerCase()]=e=>{e.preventDefault(),new Function("ctx",i[s])(t)}))}}class s{constructor(){this.settings=new Map}getSetting(t){return this.settings.get(t)}addSetting(t,e){-1===t.indexOf("[")&&(t=`[${t}]`),this.settings.set(t,e)}}class n{constructor(t){this.config=t}async fetch(t){var e;const i=await fetch(this.resolveSetting(t.url),this.getConfig(t));if(i.status>=400){const e=await i.json();throw i.status>=401&&console.dir({type:"UN_AUTHORIZED",metadata:{endpoint:t,error:e}}),{code:i.status,message:i.statusText,error:e}}return(null==(e=i.headers.get("content-type"))?void 0:e.indexOf("json"))?await i.json():await i.text()}getConfig(t){return{method:t.method,mode:"cors",headers:Object.apply({"Content-Type":"application/json"},t.headers),redirect:"follow",referrer:"no-referrer",body:t.body?JSON.stringify(t.body):null}}resolveSetting(t,e=0){if(e>2)return t;const i=t.match(/\[[\w|_]+\]/g);if(!i)return t;let s=i.reduce(this.replace.bind(this),t);return s.indexOf("[")>-1&&(s=this.resolveSetting(s,e++)),s}replace(t,e){let i=this.config.getSetting(e);return i&&i.indexOf("[SELF]")>-1?i.replace("[SELF]",t.replace(e,"")):t.replace(e,i)}}class c{constructor(t){this.ctx=t}async load(t){return await this.ctx.http.fetch({method:"GET",url:`[WF]${t}`})}async loadSettings(t){if(t){this.ctx.config.addSetting("[settingsUrl]",t);const e=await this.ctx.http.fetch({method:"GET",url:t});Object.keys(e).forEach((t=>this.ctx.config.addSetting(t,e[t])))}}}class a extends HTMLElement{constructor(){super(),this.config=new s,this.http=new n(this.config),this.activities=[new i],this.wfLoader=new c(this);const t=this.attachShadow({mode:"open"});t.innerHTML=`<style>@import '${this.getAttribute("styleUrl")}'</style>`,this.container=document.createElement("div"),t.appendChild(this.container)}async connectedCallback(){await this.wfLoader.loadSettings(this.getAttribute("url")),this.wf=await this.wfLoader.load("default"),await this.goto()}async goto(t="start"){var i,s,n;if(null!=this.act&&!this.act.exit(this))return;const c=null==(s=null==(i=this.wf)?void 0:i.activities)?void 0:s.find((e=>e.name===t)),a=null!=(n=this.activities.find((t=>t.type===(null==c?void 0:c.type))))?n:new e(t);this.act=Object.assign(a,c),await this.act.execute(this)}}customElements.define("sirius-wf",a)}));
