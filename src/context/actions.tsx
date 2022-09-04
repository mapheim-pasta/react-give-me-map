import { MapRef } from 'react-map-gl';
import { useCtx } from './provider';

export type Actions = 'SET_MAP_REF' | 'SET_CALLBACKS';

export const useActions = (): IReturnUseActions => {
    const { dispatch } = useCtx();

    function setMapRef(value: ISetMapRef) {
        dispatch({ type: 'SET_MAP_REF', value });
    }

    function setCallbacks(value: ISetCallbacks) {
        dispatch({ type: 'SET_CALLBACKS', value });
    }

    return {
        setMapRef,
        setCallbacks
    };
};

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
