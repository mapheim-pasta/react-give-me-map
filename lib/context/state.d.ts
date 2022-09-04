import { MapRef } from 'react-map-gl';
export interface IState {
    mapRef: MapRef | undefined;
    callbacks: {
        onMarkersSelected?: (ids: string[]) => void;
    };
}
export declare const initialState: IState;
