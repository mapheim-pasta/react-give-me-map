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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiveMeMap = void 0;
const mapbox_gl_1 = __importDefault(require("mapbox-gl"));
const react_1 = __importStar(require("react"));
// import ReactMapGL from 'react-map-gl';
const react_map_gl_1 = __importDefault(require("react-map-gl"));
const useTest_1 = require("./useTest");
mapbox_gl_1.default.accessToken =
    'pk.eyJ1Ijoia291ZGVsa2EiLCJhIjoiY2tzdGN6MHF2MTRvZjMyb2RvZDZ5bDdiayJ9.dEv0FPgOoGA_oOZwXNtWww';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
mapbox_gl_1.default.workerClass =
    require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;
const GiveMeMap = (props) => {
    const mapRef = (0, react_1.useRef)();
    const test = (0, useTest_1.useTest)();
    (0, react_1.useEffect)(() => {
        console.log('Test1', test.test);
    }, []);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(react_map_gl_1.default, Object.assign({}, props.viewport, { ref: mapRef, style: {
                width: '100%',
                height: '100%'
            }, onClick: props.onMapClick, onLoad: props.onMapLoad, reuseMaps: true, mapStyle: props.mapStyle, onMove: props.onMapMove, onRender: (event) => event.target.resize(), dragRotate: false, boxZoom: false, interactiveLayerIds: props.interactiveLayerIds, dragPan: props.dragPan, scrollZoom: props.scrollZoom, doubleClickZoom: props.doubleClickZoom }))));
};
exports.GiveMeMap = GiveMeMap;
