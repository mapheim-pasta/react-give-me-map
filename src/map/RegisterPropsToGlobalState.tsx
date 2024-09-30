import React, { useEffect } from 'react';
import { CustomBuilders, Fonts, useActions } from '../context/dynamic/actions';

export interface ClickEventData {
    lat: number;
    lng: number;
}

export interface ICallbacks {
    onMarkersSelected?: (ids: string[], clickData?: ClickEventData) => void;
    onStyleChanged?: (style: string) => void;
}

interface IProps {
    callbacks?: ICallbacks;
    customBuilders?: CustomBuilders;
    fonts?: Fonts;
    isWide?: boolean;
}

export const RegisterPropsToGlobalState = (props: IProps) => {
    const actions = useActions();
    useEffect(() => {
        actions.setCallbacks({
            callbacks: {
                onMarkersSelected: props.callbacks?.onMarkersSelected,
                onStyleChanged: props.callbacks?.onStyleChanged
            }
        });
    }, [props.callbacks?.onMarkersSelected, props.callbacks?.onStyleChanged]);

    useEffect(() => {
        actions.setCustomBuilders(props.customBuilders ?? {});
    }, [props.customBuilders]);

    useEffect(() => {
        actions.setFonts(props.fonts ?? { regular: 'InterRegular', semiBold: 'InterSemiBold' });
    }, [props.fonts]);
    return <></>;
};
