import React, { useEffect } from 'react';
import { useActions } from '../context/dynamic/actions';

export interface ICallbacks {
    onMarkersSelected?: (ids: string[]) => void;
}

export const RegisterCallbacks = (props: ICallbacks) => {
    const actions = useActions();
    useEffect(() => {
        actions.setCallbacks({
            callbacks: {
                onMarkersSelected: props.onMarkersSelected
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <></>;
};
