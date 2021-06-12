var t=Object.defineProperty,e=Object.getOwnPropertySymbols,i=Object.prototype.hasOwnProperty,s=Object.prototype.propertyIsEnumerable,n=(e,i,s)=>i in e?t(e,i,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[i]=s,r=(t,r)=>{for(var o in r||(r={}))i.call(r,o)&&n(t,o,r[o]);if(e)for(var o of e(r))s.call(r,o)&&n(t,o,r[o]);return t};class o{constructor(t){this.ctx=t}async load(t){return await this.ctx.http.fetch({method:"GET",url:`[WF]${t}`})}async loadSettings(t){if(t){this.ctx.config.addSetting("[settingsUrl]",t);const e=await this.ctx.http.fetch({method:"GET",url:t});Object.keys(e).forEach((t=>this.ctx.config.addSetting(t,e[t])))}}}class a{constructor(){this.settings=new Map}getSetting(t){return this.settings.get(t)}addSetting(t,e){-1===t.indexOf("[")&&(t=`[${t}]`),this.settings.set(t,e)}}class c{constructor(t){this.config=t}async fetch(t){var e;const i=await fetch(this.resolveSetting(t.url),this.getConfig(t));if(i.status>=400){const e=await i.json();throw i.status>=401&&console.dir({type:"UN_AUTHORIZED",metadata:{endpoint:t,error:e}}),{code:i.status,message:i.statusText,error:e}}return(null==(e=i.headers.get("content-type"))?void 0:e.indexOf("json"))?await i.json():await i.text()}getConfig(t){return{method:t.method,mode:"cors",headers:Object.apply({"Content-Type":"application/json"},t.headers),redirect:"follow",referrer:"no-referrer",body:t.body?JSON.stringify(t.body):null}}resolveSetting(t,e=0){if(e>2)return t;const i=t.match(/\[[\w|_]+\]/g);if(!i)return t;let s=i.reduce(this.replace.bind(this),t);return s.indexOf("[")>-1&&(s=this.resolveSetting(s,e++)),s}replace(t,e){let i=this.config.getSetting(e);return i&&i.indexOf("[SELF]")>-1?i.replace("[SELF]",t.replace(e,"")):t.replace(e,i)}}class l{constructor(t,e){this.config=t,this.pipes=e,this.model={},this.sessionId=this.UUID()}getValue(t,e=this.model){if(0===t.indexOf("[")||t.indexOf("]")===t.length-1)return this.config.getSetting(t);const i=t.split(".").reduce(((t,e)=>t?t[e]:void 0),r({},e));return t.match(/([a-z|A-Z]+\.[a-z|A-Z]+)+/g)||void 0!==i?i:t}getInterpolatedValue(t){if(!t)return t;const e=t.match(/\{\{\[*(?:(\w|\.|\||-)+)\]*\}\}/g);return e&&0!==e.length?e.reduce(((t,e)=>this.replaceAll(t,e)),t):t}setValue(t,e){0===t.indexOf("[")||t.indexOf("]")===t.length-1?this.config.addSetting(t,e):this.model=this.merge(this.model,t,e)}save(){sessionStorage.setItem(this.sessionId,JSON.stringify(this.model))}load(){const t=sessionStorage.getItem(this.sessionId);this.clearCache(),t&&(this.model=JSON.parse(t))}clearCache(){sessionStorage.clear()}merge(t,e,i){if(!e)return;let s=r({},t);return e.split(".").reduce(((t,e,s,n)=>(t[e]=s==n.length-1?i:r({},t[e]),t[e])),s),s}UUID(){return"xxxxxxxxRxxxxR4xxxRyxxxRxxxxxxxxxxxx".replace(/[xy]/g,(function(t){var e=16*Math.random()|0;return("x"==t?e:3&e|8).toString(16)}))}replaceAll(t,e){const i=e.substring(2,e.length-2).split("|"),s=i.slice(2);let n=this.getValue(i[0]);return i&&i.length>1&&this.pipes[i[1]]&&(n=this.pipes[i[1]](n,s)),t.replace(e,n)}}class h{constructor(){this.type=""}async execute(t){}async exit(t){return!0}}class d extends h{constructor(t){super(),this.activity=t,this.type="not-found-activity"}async execute(t){console.error(`The ${this.activity} was not found!!`)}}class u{constructor(t,e,i){this.ctx=t,this.wfLoader=e,this.activities=i}async goto(t,e=""){await this.loadProcess(e),await this.loadActivity(t)}async loadProcess(t){t.length>0&&(this.wf=await this.wfLoader.load(t))}async loadActivity(t){var e,i,s;if(void 0!==this.act&&!this.act.exit(this.ctx))return;const n=null==(i=null==(e=this.wf)?void 0:e.activities)?void 0:i.find((e=>e.name===t)),r=null!=(s=this.activities.find((t=>t.type===(null==n?void 0:n.type))))?s:new d(t);this.act=Object.assign(r,n),await this.act.execute(this.ctx)}}class p extends h{constructor(){super(...arguments),this.type="page-activity",this.controls=[]}async execute(t){t.container.innerHTML="",this.controls.forEach(this.createElement.bind(this,t,t.container))}createElement(t,e,i){var s;const n=Object.assign(document.createElement(i.tag),i,{ctx:t});this.bindCaption(t,n,i),this.bindEvent(t,n,i),e.appendChild(n),null==(s=i.controls)||s.forEach(this.createElement.bind(this,t,n))}bindCaption(t,e,i){this.interpolate(t,"caption",e,i),this.interpolate(t,"textContent",e,i),this.interpolate(t,"innerHTML",e,i)}interpolate(t,e,i,s){i[e]&&(i[e]=t.model.getInterpolatedValue(s[e]||i[e]))}bindEvent(t,e,i){Object.keys(i).filter((t=>t.startsWith("on"))).forEach((s=>e[s.toLowerCase()]=e=>{e.preventDefault(),new Function("ctx",i[s])(t)}))}}class g extends h{constructor(){super(...arguments),this.type="api-activity"}async execute(t){await this.callEndpoints(t),this.next&&t.wf.goto(this.next)}async callEndpoints(t){if(!this.endpoints)return!1;for(const e of this.endpoints)e.body=this.getBody(t,e),await this.callEndpoint(t,e);return!0}getBody(t,e){if("GET"===e.method.toUpperCase()||"DELETE"===e.method.toUpperCase())return null;const i=e.mappings;let s={};return i.filter((t=>"out"===t.direction||"inout"===t.direction)).forEach((e=>Object.assign(s,{[e.remote]:t.model.getValue(e.client)}))),s}callEndpoint(t,e){return t.http.fetch(e).then((i=>this.setModel(t,e,i)))}setModel(t,e,i){const s=e.mappings;if(!s||0===s.length)return Object.keys(i).forEach((e=>t.model.setValue(e,i[e])));s.filter((t=>"in"===t.direction||"inout"===t.direction)).forEach((e=>t.model.setValue(e.client,t.model.getValue(e.remote,i))))}}class f{}class x extends HTMLElement{constructor(){super(...arguments),this.isInitialized=!1,this.ctx=this,this.wfLoader=new o(this),this.activities=[new p,new g],this.pipes=new f,this.config=new a,this.http=new c(this.config),this.model=new l(this.config,this.pipes),this.wf=new u(this.ctx,this.wfLoader,this.activities)}static get observedAttributes(){return["process"]}async connectedCallback(){this.createContainer(),await this.wfLoader.loadSettings(this.getAttribute("url"));const t=this.getAttribute("process");t&&await this.wf.goto("start",t),this.isInitialized=!0}attributeChangedCallback(t,e,i){this.isInitialized&&e!=i&&"process"==t&&i&&this.wf.goto("start",i)}createContainer(){const t=this.useShadow()?this.attachShadow({mode:"open"}):this;t.innerHTML=`<style>@import '${this.getAttribute("styleUrl")}'</style>`,this.container=document.createElement("div"),t.appendChild(this.container)}useShadow(){return!("false"===this.getAttribute("shadow"))}}customElements.define("sirius-wf",x);
