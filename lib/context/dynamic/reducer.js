"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducer = void 0;
const reducer = (state, action) => {
    const value = action.value;
    switch (action.type) {
        case 'SET_MAP_REF':
            return Object.assign(Object.assign({}, state), { mapRef: value.mapRef });
        case 'SET_CALLBACKS':
            return Object.assign(Object.assign({}, state), { callbacks: value.callbacks });
        default:
            return state;
    }
};
exports.reducer = reducer;
