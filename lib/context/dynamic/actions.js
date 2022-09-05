"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useActions = exports.Actions = void 0;
const provider_1 = require("./provider");
var Actions;
(function (Actions) {
    Actions[Actions["SET_MAP_REF"] = 0] = "SET_MAP_REF";
    Actions[Actions["SET_CALLBACKS"] = 1] = "SET_CALLBACKS";
})(Actions = exports.Actions || (exports.Actions = {}));
const useActions = () => {
    const { dispatch } = (0, provider_1.useCtx)();
    function setMapRef(value) {
        dispatch({ type: Actions.SET_MAP_REF, value });
    }
    function setCallbacks(value) {
        dispatch({ type: Actions.SET_CALLBACKS, value });
    }
    return {
        setMapRef,
        setCallbacks
    };
};
exports.useActions = useActions;
//# sourceMappingURL=actions.js.map