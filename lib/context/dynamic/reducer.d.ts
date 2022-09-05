import { Actions } from './actions';
import { IState } from './state';
export declare const reducer: (state: IState, action: {
    type: Actions;
    value: unknown;
}) => IState;
