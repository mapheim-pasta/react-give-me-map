import { ISetCallbacks } from './interfaces';
import { useCtx } from './provider';

export enum Actions {
    SET_CALLBACKS
}

export const useActions = (): IReturnUseActions => {
    const { dispatch } = useCtx();

    function setCallbacks(value: ISetCallbacks) {
        dispatch({ type: Actions.SET_CALLBACKS, value });
    }

    return {
        setCallbacks
    };
};

export interface IReturnUseActions {
    setCallbacks: (value: ISetCallbacks) => void;
}
