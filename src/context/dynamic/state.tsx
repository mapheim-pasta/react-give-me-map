import { ICallbacks } from '../../map/RegisterPropsToGlobalState';
import { CustomMarkerBuilders } from './actions';

export interface IState {
    selectedIds: string[];
    callbacks: ICallbacks;

    customMarkerBuilders: CustomMarkerBuilders;
}

export const initialState: IState = {
    selectedIds: [],
    callbacks: {},
    customMarkerBuilders: {}
};
