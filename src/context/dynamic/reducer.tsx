import { Actions, CustomMarkerBuilders } from './actions';
import { ISetCallbacks } from './interfaces';
import { IState } from './state';

export const reducer = (state: IState, action: { type: Actions; value: unknown }): IState => {
    const value = action.value;
    switch (action.type) {
        case Actions.SET_CALLBACKS:
            return {
                ...state,
                callbacks: (value as ISetCallbacks).callbacks
            };
        case Actions.SET_SELECTED_IDS:
            return {
                ...state,
                selectedIds: value as string[]
            };
        case Actions.SET_CUSTOM_MARKER_BUILDERS:
            return {
                ...state,
                customMarkerBuilders: value as CustomMarkerBuilders
            };
        default:
            return state;
    }
};
