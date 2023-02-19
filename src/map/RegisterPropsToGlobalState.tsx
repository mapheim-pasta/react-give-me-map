import React, { useEffect } from 'react';
import { CustomBuilders, useActions } from '../context/dynamic/actions';

export interface ICallbacks {
    onMarkersSelected?: (ids: string[]) => void;
    onStyleChanged?: (style: string) => void;
}

interface IProps {
    callbacks?: ICallbacks;
    customBuilders?: CustomBuilders;
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

    return <></>;
};
