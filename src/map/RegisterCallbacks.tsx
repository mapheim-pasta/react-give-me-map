import React, { useEffect } from 'react';
import { useActions } from '../context/dynamic/actions';

export interface ICallbacks {
    onMarkersSelected?: (ids: string[]) => void;
    onStyleChanged?: (style: string) => void;
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
    }, [props.onMarkersSelected, props.onStyleChanged]);

    return <></>;
};
