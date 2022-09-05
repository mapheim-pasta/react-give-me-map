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
exports.Map = void 0;
const react_1 = __importStar(require("react"));
const react_map_gl_1 = __importDefault(require("react-map-gl"));
const WorldMarkers_1 = require("../components/WorldMarkers");
const actions_1 = require("../context/dynamic/actions");
const mapTypes_1 = require("../utils/map/mapTypes");
const Map = (props) => {
    var _a, _b, _c, _d;
    const actions = (0, actions_1.useActions)();
    const mapRef = (0, react_1.useRef)();
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(react_map_gl_1.default, Object.assign({}, props.map.viewport, { ref: mapRef, style: {
                width: '100%',
                height: '100%'
            }, onClick: props.map.onMapClick, onLoad: (e) => {
                var _a, _b;
                actions.setMapRef({ mapRef: mapRef.current });
                (_b = (_a = props.map).onMapLoad) === null || _b === void 0 ? void 0 : _b.call(_a, e, mapRef);
            }, reuseMaps: true, mapStyle: (_a = props.map.mapStyle) !== null && _a !== void 0 ? _a : mapTypes_1.EMapStyle.WORLD, onMove: props.map.onMapMove, onRender: (event) => event.target.resize(), dragRotate: false, boxZoom: false, interactiveLayerIds: props.map.interactiveLayerIds, dragPan: (_b = props.map.dragPan) !== null && _b !== void 0 ? _b : true, scrollZoom: (_c = props.map.scrollZoom) !== null && _c !== void 0 ? _c : true, doubleClickZoom: (_d = props.map.doubleClickZoom) !== null && _d !== void 0 ? _d : true, mapboxAccessToken: props.map.accessToken }),
            react_1.default.createElement(WorldMarkers_1.WorldMarkers, { markers: props.markers, viewport: props.map.viewport }),
            props.children)));
};
exports.Map = Map;
//# sourceMappingURL=Map.js.map