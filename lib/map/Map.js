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
exports.Map = void 0;
const react_1 = __importStar(require("react"));
const react_map_gl_1 = __importStar(require("react-map-gl"));
const actions_1 = require("../context/dynamic/actions");
const provider_1 = require("../context/dynamic/provider");
const IWorld_1 = require("../interface/IWorld");
const Map = (props) => {
    var _a;
    const { state } = (0, provider_1.useCtx)();
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
            }, reuseMaps: true, mapStyle: (_a = props.map.mapStyle) !== null && _a !== void 0 ? _a : IWorld_1.EMapStyle.WORLD, onMove: props.map.onMapMove, onRender: (event) => event.target.resize(), dragRotate: false, boxZoom: false, interactiveLayerIds: props.map.interactiveLayerIds, dragPan: props.map.dragPan, scrollZoom: props.map.scrollZoom, doubleClickZoom: props.map.doubleClickZoom, mapboxAccessToken: props.map.accessToken }),
            props.children,
            react_1.default.createElement(react_map_gl_1.Marker, { latitude: 55.15, longitude: 15.02, onClick: () => {
                    var _a;
                    if ((_a = state.callbacks) === null || _a === void 0 ? void 0 : _a.onMarkersSelected) {
                        state.callbacks.onMarkersSelected(['aaaa 1']);
                    }
                } },
                react_1.default.createElement("div", { style: {
                        width: 100,
                        height: 100,
                        backgroundColor: 'pink',
                        borderRadius: 100
                    } })))));
};
exports.Map = Map;
