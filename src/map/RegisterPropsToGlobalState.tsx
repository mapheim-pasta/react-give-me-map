import React, { useEffect } from 'react';
import { CustomMarkerBuilders, useActions } from '../context/dynamic/actions';

export interface ICallbacks {
    onMarkersSelected?: (ids: string[]) => void;
    onStyleChanged?: (style: string) => void;
}

interface IProps {
    callbacks?: ICallbacks;
    customMarkerBuilders?: CustomMarkerBuilders;
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
        actions.setCustomMarkerBuilders(props.customMarkerBuilders ?? {});
    }, [props.customMarkerBuilders]);

    return <></>;
};
