"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Package = void 0;
const react_1 = __importDefault(require("react"));
const Map_1 = require("./map/Map");
const Package = (props) => {
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Map_1.Map, { map: props.map }, props.children)));
};
exports.Package = Package;
