import { ISetCallbacks } from './interfaces';
import { useCtx } from './provider';

export enum Actions {
    SET_CALLBACKS,
    SET_SELECTED_IDS,
    SET_BUILDERS
}

export type CustomMarkerBuilders = Record<string, (props: Record<string, unknown>) => JSX.Element>;

export type PinIconBuilder = (props: { iconText: string }) => JSX.Element;

export type CustomBuilders = {
    reactMarkers?: CustomMarkerBuilders;
    pinIcon?: PinIconBuilder;
};

export const useActions = (): IReturnUseActions => {
    const { dispatch } = useCtx();

    function setCallbacks(value: ISetCallbacks) {
        dispatch({ type: Actions.SET_CALLBACKS, value });
    }

    function setSelectedIds(value: string[]) {
        dispatch({ type: Actions.SET_SELECTED_IDS, value });
    }

    function setCustomBuilders(value: CustomBuilders) {
        dispatch({ type: Actions.SET_BUILDERS, value });
    }

    return {
        setCallbacks,
        setSelectedIds,
        setCustomBuilders
    };
};

export interface IReturnUseActions {
    setCallbacks: (value: ISetCallbacks) => void;
    setSelectedIds: (value: string[]) => void;

    setCustomBuilders: (value: CustomBuilders) => void;
}
