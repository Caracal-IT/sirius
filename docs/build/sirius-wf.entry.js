import { r as registerInstance, c as createEvent, h } from './core-714f54fe.js';

class PageActivity {
    constructor() {
        this.type = PageActivity.type;
        this.execute = (context) => {
            context.container.page = Object.assign(Object.assign({}, this), { context: context });
        };
    }
    static create(act) {
        return Object.assign(new PageActivity(), act);
    }
}
PageActivity.type = "page-activity";

class CodeActivity {
    constructor() {
        this.type = CodeActivity.type;
        this.execute = (context) => {
            this.eval(this.expression, context);
            context.wfService.setNextAction(this.next);
        };
    }
    static create(act) {
        return Object.assign(new CodeActivity(), act);
    }
    eval(expression, context) {
        const f = new Function('context', 'model', expression);
        return f(context, context.model);
    }
}
CodeActivity.type = "code-activity";

class DecisionActivity extends CodeActivity {
    constructor() {
        super(...arguments);
        this.type = DecisionActivity.type;
        this.execute = (context) => {
            const expression = `return ${this.left} ${this.equality} ${this.right};`;
            const result = super.eval(expression, context);
            if (result)
                context.wfService.setNextAction(this.trueAction);
            else
                context.wfService.setNextAction(this.falseAction);
        };
    }
    static create(act) {
        return Object.assign(new DecisionActivity(), act);
    }
}
DecisionActivity.type = "decision-activity";

class Url {
    constructor(rawUrl, method) {
        this.rawUrl = rawUrl;
        this.method = method;
    }
    get url() {
        return this.rawUrl;
    }
    get headers() {
        return {
            'Content-Type': 'application/json'
        };
    }
}

class ModelUrl extends Url {
    constructor(rawUrl, method, modelService) {
        super(rawUrl, method);
        this.modelService = modelService;
    }
    get url() {
        return this.getUrlWithValuesFromModel();
    }
    getUrlWithValuesFromModel() {
        let newUrl = this.rawUrl;
        newUrl
            .match(/{[\w|\.]+}/g)
            .map(this.createValueItem.bind(this))
            .forEach((m) => newUrl = newUrl.replace(m.key, m.value || ''));
        return newUrl;
    }
    createValueItem(key) {
        const name = key.substring(1, key.length - 1);
        const value = this.modelService.getValue(name, this.modelService.getModel());
        return { key, value };
    }
}

class ApiActivity {
    constructor() {
        this.type = ApiActivity.type;
        this.execute = (context) => {
            const url = new ModelUrl(this.url, this.method, context.modelService);
            return context
                .http
                .fetch(url, this.mappings)
                .then(() => context.wfService.setNextAction(this.next));
        };
    }
    static create(act) {
        return Object.assign(new ApiActivity(), act);
    }
}
ApiActivity.type = "api-activity";

class AssignActivity {
    constructor() {
        this.type = AssignActivity.type;
        this.execute = (context) => {
            let value = this.value || "";
            if (this.value.startsWith("{") && this.value.endsWith("}"))
                value = context.modelService.getValue(this.value.substring(1, this.value.length - 1), context.model);
            context.modelService.setModelValue(this.key, value);
            context.wfService.setNextAction(this.next);
        };
    }
    static create(act) {
        return Object.assign(new AssignActivity(), act);
    }
}
AssignActivity.type = "assign-activity";

class ActivityFactory {
    static linkActivities(process) {
        process
            .activities
            .forEach(p => {
            const act = ActivityFactory.activities.find(a => a.type === p.type);
            if (act && act.create)
                Object.assign(p, act.create(p));
        });
    }
}
ActivityFactory.activities = [
    { type: PageActivity.type, create: PageActivity.create },
    { type: CodeActivity.type, create: CodeActivity.create },
    { type: DecisionActivity.type, create: DecisionActivity.create },
    { type: AssignActivity.type, create: AssignActivity.create },
    { type: ApiActivity.type, create: ApiActivity.create }
];

class WFService {
    setNextAction(name) {
        this.action = name;
        if (this.wfChangeHandler)
            this.wfChangeHandler(this.action, this.process);
    }
    setProcess(process) {
        this.process = process;
        if (this.wfChangeHandler)
            this.wfChangeHandler(this.action, this.process);
    }
    addActivity(type, create) {
        const act = ActivityFactory.activities.find(a => a.type === type);
        if (!act)
            ActivityFactory.activities.push({ type, create });
    }
    parse(processDef) {
        try {
            const process = JSON.parse(processDef);
            ActivityFactory.linkActivities(process);
            return process;
        }
        catch (ex) {
            console.log(ex);
            return null;
        }
    }
}

var MessageType;
(function (MessageType) {
    MessageType["StartLoading"] = "START_LOADING";
    MessageType["EndLoading"] = "END_LOADING";
    MessageType["Error"] = "ERROR";
})(MessageType || (MessageType = {}));

class Message {
    constructor(messageType, description, stack) {
        this.messageType = messageType;
        this.description = description;
        this.stack = stack;
    }
}

class Context {
    constructor(model, modelService, wfService, http, container) {
        this.model = model;
        this.modelService = modelService;
        this.wfService = wfService;
        this.http = http;
        this.container = container;
    }
}

var HttpVerb;
(function (HttpVerb) {
    HttpVerb["GET"] = "get";
    HttpVerb["POST"] = "post";
    HttpVerb["PUT"] = "put";
    HttpVerb["DELETE"] = "delete";
    HttpVerb["PATCH"] = "patch";
})(HttpVerb || (HttpVerb = {}));

var MappingDirection;
(function (MappingDirection) {
    MappingDirection["In"] = "in";
    MappingDirection["Out"] = "out";
    MappingDirection["InOut"] = "inout";
})(MappingDirection || (MappingDirection = {}));

class HttpService {
    constructor(modelService) {
        this.modelService = modelService;
    }
    async fetch(url, mappings) {
        const response = await fetch(url.url, this.getConfig(url, mappings));
        const data = await response.json();
        return this.setModelValues(data, mappings);
    }
    getConfig(url, mappings) {
        return {
            method: url.method,
            mode: 'cors',
            headers: url.headers,
            redirect: 'follow',
            referrer: 'no-referrer',
            body: this.getBody(url, mappings)
        };
    }
    getBody(url, mappings) {
        if (url.method === HttpVerb.GET || url.method === HttpVerb.DELETE)
            return null;
        let body = {};
        const model = this.modelService.getModel();
        mappings
            .filter(m => m.direction === MappingDirection.Out || m.direction === MappingDirection.InOut)
            .forEach(m => Object.assign(body, { [m.client]: this.modelService.getValue(m.client, model) }));
        return JSON.stringify(body);
    }
    setModelValues(data, mappings) {
        if (!mappings || mappings.length === 0)
            return Object.keys(data).forEach(k => this.modelService.setModelValue(k, data[k]));
        mappings
            .filter(m => m.direction === MappingDirection.Out || m.direction === MappingDirection.InOut)
            .forEach(m => this.modelService.setModelValue(m.client, this.modelService.getValue(m.remote, data)));
    }
}

class StoreHandler {
    constructor(wfService, modelService, container) {
        this.wfService = wfService;
        this.modelService = modelService;
        this.container = container;
        this.hasError = false;
        this.http = new HttpService(this.modelService);
        this.context = new Context({}, this.modelService, this.wfService, this.http, this.container);
    }
    handle() {
        this.wfService.wfChangeHandler = this.handleWfChange.bind(this);
        this.modelService.modelChangedHandler = this.handleModelChanged.bind(this);
    }
    handleWfChange(action, process) {
        this.currProcess = process;
        this.currAction = action || "start";
        this.executeActivity();
    }
    handleModelChanged(model) {
        this.context.model = model;
    }
    executeActivity() {
        if (!this.hasActivities())
            return;
        const act = this.currProcess.activities.find((p) => p.name === this.currAction);
        const model = this.context.model;
        if (this.canExecute(act)) {
            this.hasError = false;
            this.sendMessage(new Message(MessageType.StartLoading, "Loading..."));
            this.tryExecute(act)
                .then(() => {
                if (this.hasError)
                    return;
                this.sendMessage(new Message(MessageType.EndLoading));
                if (act.components)
                    this.lastAction = this.currAction;
                else if (model !== this.context.model)
                    this.wfService.setNextAction(this.lastAction);
                else
                    this.wfService.setNextAction(null);
            })
                .catch((error) => {
                this.modelService.setModelValue("message", new Message(MessageType.EndLoading));
                this.handleError(error);
            });
        }
    }
    async tryExecute(act) {
        try {
            await act.execute(this.context);
        }
        catch (ex) {
            this.handleError(ex);
        }
    }
    handleError(error) {
        this.hasError = true;
        this.sendMessage(new Message(MessageType.Error, error.message, error.stack));
        console.log("ERROR OCCURED", error);
        console.dir(error);
    }
    hasActivities() {
        return this.currProcess && this.currProcess.activities;
    }
    canExecute(act) {
        return act && act.execute;
    }
    sendMessage(msg) {
        this.modelService.setModelValue("message", msg);
        this.context.container.wfMessage.emit(msg);
    }
}

class ModelService {
    constructor() {
        this.model = {};
        this.onInput = this.inputHandler.bind(this);
    }
    setModelValue(name, value) {
        this.model = this.merge(this.model, name, value);
        if (this.modelChangedHandler)
            this.modelChangedHandler(this.model);
    }
    getComponentModelValue(component) {
        const model = this.getModel();
        let value;
        if (component && component.id && model)
            value = this.getModelValue(component.id);
        if (value === undefined && component.value)
            value = component.value;
        return value;
    }
    getModelValue(key) {
        return this.getValue(key, this.getModel());
    }
    getModel() {
        return Object.assign({}, this.model);
    }
    getValue(key, model) {
        return key.split(".").reduce((total, currentElement) => total ? total[currentElement] : null, model);
    }
    inputHandler(event) {
        const target = event.currentTarget;
        const wfElement = target.closest("[wf-element]");
        this.setModelValue(wfElement.id, wfElement["value"]);
    }
    merge(model, name, value) {
        let newModel = Object.assign({}, model);
        name
            .split(".")
            .reduce((total, current, index, arr) => {
            total[current] = index == arr.length - 1 ? value : Object.assign({}, total[current]);
            return total[current];
        }, newModel);
        return newModel;
    }
}

const SiriusWf = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.wfMessage = createEvent(this, "wfMessage", 7);
    }
    async addActivity(type, create) {
        this.wfService.addActivity(type, create);
    }
    async goto(activity) {
        this.wfService.setNextAction(activity);
    }
    async loadProcess(process) {
        this.page = null;
        this.wfService.setProcess(process);
    }
    async parse(processDef) {
        return this.wfService.parse(processDef);
    }
    async componentWillLoad() {
        this.wfService = new WFService();
        this.modelService = new ModelService();
        this.storeHandler = new StoreHandler(this.wfService, this.modelService, this);
        this.storeHandler.handle();
    }
    render() {
        return h("sirius-page", { page: this.page, modelService: this.modelService });
    }
};

export { SiriusWf as sirius_wf };
