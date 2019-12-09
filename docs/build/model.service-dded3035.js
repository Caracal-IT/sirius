var TypeKeys;
(function (TypeKeys) {
    TypeKeys["NULL"] = "NULL";
    TypeKeys["SET_MODEL_VALUE"] = "SET_MODEL_VALUE";
    TypeKeys["SET_NEXT_ACTION"] = "SET_NEXT_ACTION";
    TypeKeys["SET_PROCESS"] = "SET_PROCESS";
})(TypeKeys || (TypeKeys = {}));
const setModelValue = (name, value) => (dispatch, _getState) => {
    const action = {
        type: TypeKeys.SET_MODEL_VALUE,
        name,
        value
    };
    dispatch(action);
};
const setNextAction = (name) => (dispatch, _getState) => {
    const action = {
        type: TypeKeys.SET_NEXT_ACTION,
        name
    };
    dispatch(action);
};
const setProcess = (process) => (dispatch, _getState) => {
    const action = {
        type: TypeKeys.SET_PROCESS,
        process
    };
    dispatch(action);
};

class ModelService {
    constructor(store) {
        this.onInput = this.inputHandler.bind(this);
        this.store = store;
        this.store.mapDispatchToProps(this, { setModelValue });
    }
    getModelValue(component) {
        const model = this.getModel();
        let value;
        if (component && component.id && model)
            value = component.id.split(".").reduce((total, currentElement) => total ? total[currentElement] : null, model);
        if (value === undefined && component.value)
            value = component.value;
        return value;
    }
    getModel() {
        return this.store.getState()["wf"]["model"];
    }
    getValue(key, model) {
        return key.split(".").reduce((total, currentElement) => total ? total[currentElement] : null, model);
    }
    inputHandler(event) {
        const target = event.currentTarget;
        const wfElement = target.closest("[wf-element]");
        this.setModelValue(wfElement.id, wfElement["value"]);
    }
}

export { ModelService as M, TypeKeys as T, setProcess as a, setNextAction as s };
