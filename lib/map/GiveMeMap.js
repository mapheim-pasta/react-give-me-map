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
exports.GiveMeMap = void 0;
const react_1 = __importStar(require("react"));
const react_map_gl_1 = __importStar(require("react-map-gl"));
const IWorld_1 = require("../interface/IWorld");
const GiveMeMap = (props) => {
    var _a;
    const mapRef = (0, react_1.useRef)();
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(react_map_gl_1.default, Object.assign({}, props.map.viewport, { ref: mapRef, style: {
                width: '100%',
                height: '100%'
            }, onClick: props.map.onMapClick, onLoad: props.map.onMapLoad, reuseMaps: true, mapStyle: (_a = props.map.mapStyle) !== null && _a !== void 0 ? _a : IWorld_1.EMapStyle.WORLD, onMove: props.map.onMapMove, onRender: (event) => event.target.resize(), dragRotate: false, boxZoom: false, interactiveLayerIds: props.map.interactiveLayerIds, dragPan: props.map.dragPan, scrollZoom: props.map.scrollZoom, doubleClickZoom: props.map.doubleClickZoom, mapboxAccessToken: props.map.accessToken }),
            props.children,
            react_1.default.createElement(react_map_gl_1.Marker, { latitude: 55.15, longitude: 15.02 },
                react_1.default.createElement("div", { style: {
                        width: 20,
                        height: 20,
                        backgroundColor: 'red',
                        borderRadius: 100
                    } })))));
};
exports.GiveMeMap = GiveMeMap;
