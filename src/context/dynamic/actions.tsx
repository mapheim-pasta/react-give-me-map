import { ISetCallbacks, ISetMapRef } from './interfaces';
import { useCtx } from './provider';

export enum Actions {
    SET_MAP_REF,
    SET_CALLBACKS
}

export const useActions = (): IReturnUseActions => {
    const { dispatch } = useCtx();

    function setMapRef(value: ISetMapRef) {
        dispatch({ type: Actions.SET_MAP_REF, value });
    }

    function setCallbacks(value: ISetCallbacks) {
        dispatch({ type: Actions.SET_CALLBACKS, value });
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
