import { Actions } from './actions';
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
        default:
            return state;
    }
};
