/// <reference types="react" />
import mapboxgl from 'mapbox-gl';
import { MapboxEvent, ViewStateChangeEvent } from 'react-map-gl';
import { EMapStyle, IViewportExtended } from './IWorld';
interface IProps {
    viewport?: IViewportExtended;
    onMapClick?: (e: mapboxgl.MapLayerMouseEvent) => void;
    onMapLoad?: (e: MapboxEvent<undefined>) => void;
    mapStyle?: EMapStyle;
    onMapMove?: (e: ViewStateChangeEvent) => void;
    interactiveLayerIds?: string[];
    dragPan?: boolean;
    scrollZoom?: boolean;
    doubleClickZoom?: boolean;
}
export declare const GiveMeMap: (props: IProps) => JSX.Element;
export {};
