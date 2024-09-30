import { Actions, CustomBuilders } from './actions';
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
        case Actions.SET_BUILDERS:
            return {
                ...state,
                customBuilders: value as CustomBuilders
            };
        case Actions.SET_FONTS:
            return {
                ...state,
                fonts: value as IState['fonts']
            };
        case Actions.SET_IS_WIDE:
            return {
                ...state,
                isWide: value as boolean
            };
        default:
            return state;
    }
};
