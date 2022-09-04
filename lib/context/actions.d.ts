import { MapRef } from 'react-map-gl';
export declare type Actions = 'SET_MAP_REF' | 'SET_CALLBACKS';
export declare const useActions: () => IReturnUseActions;
export interface IReturnUseActions {
    setMapRef: (value: ISetMapRef) => void;
    setCallbacks: (value: ISetCallbacks) => void;
}
export interface ISetMapRef {
    mapRef: MapRef | undefined;
}
export interface ISetCallbacks {
    callbacks: {
        onMarkersSelected?: (ids: string[]) => void;
    };
}
