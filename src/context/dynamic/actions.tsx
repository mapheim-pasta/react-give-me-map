import { ISetCallbacks } from './interfaces';
import { useCtx } from './provider';

export enum Actions {
    SET_CALLBACKS,
    SET_SELECTED_IDS
}

export const useActions = (): IReturnUseActions => {
    const { dispatch } = useCtx();

    function setCallbacks(value: ISetCallbacks) {
        dispatch({ type: Actions.SET_CALLBACKS, value });
    }

    function setSelectedIds(value: string[]) {
        dispatch({ type: Actions.SET_SELECTED_IDS, value });
    }

    return {
        setCallbacks,
        setSelectedIds
    };
};

export interface IReturnUseActions {
    setCallbacks: (value: ISetCallbacks) => void;
    setSelectedIds: (value: string[]) => void;
}
