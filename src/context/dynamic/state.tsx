import { MapRef } from 'react-map-gl';

export interface IState {
    mapRef: MapRef | undefined;
    callbacks: {
        onMarkersSelected?: (ids: string[]) => void;
    };
}

export const initialState: IState = {
    mapRef: undefined,
    callbacks: {}
};
