import { Actions, ISetCallbacks, ISetMapRef } from './actions';
import { IState } from './state';

export const reducer = (state: IState, action: Actions): IState => {
    const value = action.value;
    switch (action.type) {
        case 'SET_MAP_REF':
            return {
                ...state,
                mapRef: (value as ISetMapRef).mapRef
            };
        case 'SET_CALLBACKS':
            return {
                ...state,
                callbacks: (value as ISetCallbacks).callbacks
            };
        default:
            return state;
    }
};
