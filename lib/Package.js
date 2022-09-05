"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Package = void 0;
const react_1 = __importStar(require("react"));
const provider_1 = require("./context/dynamic/provider");
const reducer_1 = require("./context/dynamic/reducer");
const state_1 = require("./context/dynamic/state");
const Map_1 = require("./map/Map");
const RegisterCallbacks_1 = require("./map/RegisterCallbacks");
const Package = (props) => {
    var _a;
    const [state, dispatch] = (0, react_1.useReducer)(reducer_1.reducer, state_1.initialState);
    const markers = (_a = props.markers) !== null && _a !== void 0 ? _a : [];
    for (const marker of markers) {
        marker.ref = react_1.default.createRef();
    }
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(provider_1.ContextProvider, { reducer: { state, dispatch } },
            react_1.default.createElement(RegisterCallbacks_1.RegisterCallbacks, Object.assign({}, props.callbacks)),
            react_1.default.createElement(Map_1.Map, { map: props.map, markers: markers }, props.children))));
};
exports.Package = Package;
//# sourceMappingURL=Package.js.map