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
exports.RegisterCallbacks = void 0;
const react_1 = __importStar(require("react"));
const actions_1 = require("../context/actions");
const RegisterCallbacks = (props) => {
    const actions = (0, actions_1.useActions)();
    (0, react_1.useEffect)(() => {
        actions.setCallbacks({
            callbacks: {
                onMarkersSelected: props.onMarkersSelected
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return react_1.default.createElement(react_1.default.Fragment, null);
};
exports.RegisterCallbacks = RegisterCallbacks;
