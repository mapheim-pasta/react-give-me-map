import React, { useEffect } from 'react';
import { useActions } from '../context/dynamic/actions';
import { EMapStyle } from '../utils/map/mapTypes';

export interface ICallbacks {
    onMarkersSelected?: (ids: string[]) => void;
    onStyleChanged?: (style: EMapStyle) => void;
}

export const RegisterCallbacks = (props: ICallbacks) => {
    const actions = useActions();
    useEffect(() => {
        actions.setCallbacks({
            callbacks: {
                onMarkersSelected: props.onMarkersSelected,
                onStyleChanged: props.onStyleChanged
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <></>;
};
