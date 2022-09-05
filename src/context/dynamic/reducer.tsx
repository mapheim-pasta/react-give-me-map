import { Actions } from './actions';
import { ISetCallbacks, ISetMapRef } from './interfaces';
import { IState } from './state';

export const reducer = (state: IState, action: { type: Actions; value: unknown }): IState => {
    const value = action.value;
    switch (action.type) {
        case Actions.SET_MAP_REF:
            return {
                ...state,
                mapRef: (value as ISetMapRef).mapRef
            };
        case Actions.SET_CALLBACKS:
            return {
                ...state,
                callbacks: (value as ISetCallbacks).callbacks
            };
        default:
            return state;
    }
};
