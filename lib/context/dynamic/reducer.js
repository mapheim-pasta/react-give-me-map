"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducer = void 0;
const actions_1 = require("./actions");
const reducer = (state, action) => {
    const value = action.value;
    switch (action.type) {
        case actions_1.Actions.SET_MAP_REF:
            return Object.assign(Object.assign({}, state), { mapRef: value.mapRef });
        case actions_1.Actions.SET_CALLBACKS:
            return Object.assign(Object.assign({}, state), { callbacks: value.callbacks });
        default:
            return state;
    }
};
exports.reducer = reducer;
//# sourceMappingURL=reducer.js.map