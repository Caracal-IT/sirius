!function(t){"function"==typeof define&&define.amd?define(t):t()}((function(){"use strict";class t{constructor(t){this.ctx=t}async load(t){return await this.ctx.http.fetch({method:"GET",url:`[WF]${t}`})}async loadSettings(t){if(t){this.ctx.config.addSetting("[settingsUrl]",t);const e=await this.ctx.http.fetch({method:"GET",url:t});Object.keys(e).forEach((t=>this.ctx.config.addSetting(t,e[t])))}}}class e{constructor(){this.settings=new Map}getSetting(t){return this.settings.get(t)}addSetting(t,e){-1===t.indexOf("[")&&(t=`[${t}]`),this.settings.set(t,e)}}class i{constructor(t){this.config=t}async fetch(t){var e;const i=await fetch(this.resolveSetting(t.url),this.getConfig(t));if(i.status>=400){const e=await i.json();throw i.status>=401&&console.dir({type:"UN_AUTHORIZED",metadata:{endpoint:t,error:e}}),{code:i.status,message:i.statusText,error:e}}return(null==(e=i.headers.get("content-type"))?void 0:e.indexOf("json"))?await i.json():await i.text()}getConfig(t){return{method:t.method,mode:"cors",headers:Object.apply({"Content-Type":"application/json"},t.headers),redirect:"follow",referrer:"no-referrer",body:t.body?JSON.stringify(t.body):null}}resolveSetting(t,e=0){if(e>2)return t;const i=t.match(/\[[\w|_]+\]/g);if(!i)return t;let s=i.reduce(this.replace.bind(this),t);return s.indexOf("[")>-1&&(s=this.resolveSetting(s,e++)),s}replace(t,e){let i=this.config.getSetting(e);return i&&i.indexOf("[SELF]")>-1?i.replace("[SELF]",t.replace(e,"")):t.replace(e,i)}}class s{constructor(){this.type=""}async execute(t){}async exit(t){return!0}}class n extends s{constructor(t){super(),this.activity=t,this.type="not-found-activity"}async execute(t){console.error(`The ${this.activity} was not found!!`)}}class a extends s{constructor(){super(...arguments),this.type="page-activity",this.controls=[]}async execute(t){t.container.innerHTML="",this.controls.forEach(this.createElement.bind(this,t,t.container))}createElement(t,e,i){var s;const n=Object.assign(document.createElement(i.tag),i,{ctx:t});this.bindEvent(t,n,i),e.appendChild(n),null==(s=i.controls)||s.forEach(this.createElement.bind(this,t,n))}bindEvent(t,e,i){Object.keys(i).filter((t=>t.startsWith("on"))).forEach((s=>e[s.toLowerCase()]=e=>{e.preventDefault(),new Function("ctx",i[s])(t)}))}}class r extends HTMLElement{constructor(){super(...arguments),this.config=new e,this.http=new i(this.config),this.activities=[new a],this.isInitialized=!1,this.wfLoader=new t(this)}static get observedAttributes(){return["process"]}async connectedCallback(){this.createContainer(),await this.wfLoader.loadSettings(this.getAttribute("url"));const t=this.getAttribute("process");t&&await this.goto("start",t),this.isInitialized=!0}attributeChangedCallback(t,e,i){this.isInitialized&&e!=i&&"process"==t&&i&&this.goto("start",i)}async goto(t,e=""){await this.loadProcess(e),await this.loadActivity(t)}async loadProcess(t){t.length>0&&(this.wf=await this.wfLoader.load(t))}async loadActivity(t){var e,i,s;if(void 0!==this.act&&!this.act.exit(this))return;const a=null==(i=null==(e=this.wf)?void 0:e.activities)?void 0:i.find((e=>e.name===t)),r=null!=(s=this.activities.find((t=>t.type===(null==a?void 0:a.type))))?s:new n(t);this.act=Object.assign(r,a),await this.act.execute(this)}createContainer(){const t=this.useShadow()?this.attachShadow({mode:"open"}):this;t.innerHTML=`<style>@import '${this.getAttribute("styleUrl")}'</style>`,this.container=document.createElement("div"),t.appendChild(this.container)}useShadow(){return!("false"===this.getAttribute("shadow"))}}customElements.define("sirius-wf",r)}));
