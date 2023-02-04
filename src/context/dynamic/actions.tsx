import { ISetCallbacks } from './interfaces';
import { useCtx } from './provider';

export enum Actions {
    SET_CALLBACKS,
    SET_SELECTED_IDS,
    SET_CUSTOM_MARKER_BUILDERS
}

export type CustomMarkerBuilders = Record<string, (props: Record<string, unknown>) => JSX.Element>;

export const useActions = (): IReturnUseActions => {
    const { dispatch } = useCtx();

    function setCallbacks(value: ISetCallbacks) {
        dispatch({ type: Actions.SET_CALLBACKS, value });
    }

    function setSelectedIds(value: string[]) {
        dispatch({ type: Actions.SET_SELECTED_IDS, value });
    }

    function setCustomMarkerBuilders(value: CustomMarkerBuilders) {
        dispatch({ type: Actions.SET_CUSTOM_MARKER_BUILDERS, value });
    }

    return {
        setCallbacks,
        setSelectedIds,
        setCustomMarkerBuilders
    };
};

export interface IReturnUseActions {
    setCallbacks: (value: ISetCallbacks) => void;
    setSelectedIds: (value: string[]) => void;

    setCustomMarkerBuilders: (value: CustomMarkerBuilders) => void;
}
