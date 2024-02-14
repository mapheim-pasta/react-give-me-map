import { MapRef, MapProps as OriginalMapProps } from 'react-map-gl';

export type IMapProps = OriginalMapProps & {
    onLoad?: (mapRef: MapRef | null) => void;
};

export interface IViewportExtended {
    latitude?: number;
    longitude?: number;
    zoom?: number;
    nw?: ICoordinates;
    se?: ICoordinates;
    height?: number;
    width?: number;
}

export interface ICoordinates {
    lat: number;
    lng: number;
}

export interface IXY {
    x: number;
    y: number;
}

export enum EMapStyle {
    SATELLITE = 'mapbox://styles/koudelka/ckstetxyy07gr17o4rh01vb9b',
    OUTDOOR = 'mapbox://styles/koudelka/ckwfq7e5k45h814o8521fnwo1',
    DEFAULT = 'mapbox://styles/koudelka/cld4go9oi000k01p7wci751am'
}

export interface GroupMarkerProps {
    textColor?: string;
    backgroundColor?: string;
    clusterMaxZoom?: number;

    clusterRadius?: number;
    autoHideIcons?: boolean;
}

export interface CountriesFillProps {
    color: string;
    opacity: number;
    countryCodes: string[];
}

export interface MarkersCustomConfigProps {
    standScale?: number;
}

export interface IMapConfig {
    availableStyles?: string[];
    geolocate?: boolean;

    groupMarkerProps?: GroupMarkerProps;
    countriesFill?: CountriesFillProps;
    markersCustomConfig?: MarkersCustomConfigProps;
}

export interface MarkerStyle {
    shadowColor: string;
    pixelSize: number;
}
