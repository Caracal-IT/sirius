var TypeKeys;
(function (TypeKeys) {
    TypeKeys["NULL"] = "NULL";
    TypeKeys["SET_APP_NAME"] = "SET_APP_NAME";
})(TypeKeys || (TypeKeys = {}));
const setAppName = (name) => (dispatch, _getState) => {
    const action = {
        type: TypeKeys.SET_APP_NAME,
        name
    };
    dispatch(action);
};

export { TypeKeys as T, setAppName as s };
