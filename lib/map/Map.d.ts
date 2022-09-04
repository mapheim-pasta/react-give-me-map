/// <reference types="mapbox-gl" />
import React from 'react';
import { MapboxEvent, MapRef, ViewStateChangeEvent } from 'react-map-gl';
import { EMapStyle, IViewportExtended } from '../interface/IWorld';
export interface IMapProps {
    accessToken: string;
    viewport?: IViewportExtended;
    onMapClick?: (e: mapboxgl.MapLayerMouseEvent) => void;
    onMapLoad?: (e: MapboxEvent<undefined>, mapRef: React.MutableRefObject<MapRef | undefined>) => void;
    mapStyle?: EMapStyle;
    onMapMove?: (e: ViewStateChangeEvent) => void;
    interactiveLayerIds?: string[];
    dragPan?: boolean;
    scrollZoom?: boolean;
    doubleClickZoom?: boolean;
}
interface IProps {
    map: IMapProps;
    children?: React.ReactNode;
}
export declare const Map: (props: IProps) => JSX.Element;
export {};
