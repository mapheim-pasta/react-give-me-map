"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useActions = void 0;
const provider_1 = require("./provider");
const useActions = () => {
    const { dispatch } = (0, provider_1.useCtx)();
    function setMapRef(value) {
        dispatch({ type: 'SET_MAP_REF', value });
    }
    function setCallbacks(value) {
        dispatch({ type: 'SET_CALLBACKS', value });
    }
    return {
        setMapRef,
        setCallbacks
    };
};
exports.useActions = useActions;
