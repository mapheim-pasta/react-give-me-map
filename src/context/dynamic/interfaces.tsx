import { MapRef } from 'react-map-gl';

export interface ISetMapRef {
    mapRef: MapRef | undefined;
}

export interface ISetCallbacks {
    callbacks: {
        onMarkersSelected?: (ids: string[]) => void;
    };
}
