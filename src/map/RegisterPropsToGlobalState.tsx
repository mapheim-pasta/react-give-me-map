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
    customBuilders?: CustomBuilders;
    fonts?: Fonts;
    isWide?: boolean;
}

export const RegisterPropsToGlobalState = (props: IProps) => {
    const actions = useActions();
    useEffect(() => {
        actions.setCustomBuilders(props.customBuilders ?? {});
    }, [props.customBuilders]);

    useEffect(() => {
        actions.setFonts(
            props.fonts ?? { regular: 'InterRegular', semiBold: 'InterSemiBold', bold: 'InterBold' }
        );
    }, [props.fonts]);
    return <></>;
};
