import { ICallbacks } from '../../map/RegisterCallbacks';

export interface IState {
    selectedIds: string[];
    callbacks: ICallbacks;
}

export const initialState: IState = {
    selectedIds: [],
    callbacks: {}
};
