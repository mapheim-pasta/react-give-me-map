import { MapRef } from 'react-map-gl';
export declare type Actions = {
    type: 'SET_MAP_REF';
    value: ISetMapRef;
} | {
    type: 'SET_CALLBACKS';
    value: ISetCallbacks;
};
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
