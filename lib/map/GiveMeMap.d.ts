/// <reference types="mapbox-gl" />
import React from 'react';
import { MapboxEvent, ViewStateChangeEvent } from 'react-map-gl';
import { EMapStyle, IViewportExtended } from '../interface/IWorld';
interface IProps {
    map: {
        accessToken: string;
        viewport?: IViewportExtended;
        onMapClick?: (e: mapboxgl.MapLayerMouseEvent) => void;
        onMapLoad?: (e: MapboxEvent<undefined>) => void;
        mapStyle?: EMapStyle;
        onMapMove?: (e: ViewStateChangeEvent) => void;
        interactiveLayerIds?: string[];
        dragPan?: boolean;
        scrollZoom?: boolean;
        doubleClickZoom?: boolean;
    };
    children?: React.ReactNode;
}
export declare const GiveMeMap: (props: IProps) => JSX.Element;
export {};
