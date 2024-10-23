import { ICallbacks } from '../../map/RegisterPropsToGlobalState';
import { CustomBuilders, Fonts } from './actions';

export interface IState {
    selectedIds: string[];
    callbacks: ICallbacks;

    customBuilders: CustomBuilders;

    fonts: Fonts;

    isWide: boolean;
}

export const initialState: IState = {
    selectedIds: [],
    callbacks: {},
    customBuilders: {
        reactMarkers: {}
    },
    isWide: true,
    fonts: {
        regular: 'InterRegular',
        semiBold: 'InterSemiBold',
        bold: 'InterBold'
    }
};
