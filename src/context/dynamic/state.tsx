import { ICallbacks } from '../../map/RegisterPropsToGlobalState';
import { CustomBuilders } from './actions';

export interface IState {
    selectedIds: string[];
    callbacks: ICallbacks;

    customBuilders: CustomBuilders;
}

export const initialState: IState = {
    selectedIds: [],
    callbacks: {},
    customBuilders: {
        reactMarkers: {}
    }
};
