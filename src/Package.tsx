import React, { useRef } from 'react';
import { MapRef } from 'react-map-gl';
import { GlobalCallbackContextProvider, ICallbacks } from './context/GlobalCallbacksContext';
import { MapRefContextProvider } from './context/MapRefContext';
import { IMapProps, Map } from './map/Map';

interface IProps {
    map: IMapProps;
    children?: React.ReactNode;
    callbacks?: ICallbacks;
}

export const Package = (props: IProps): JSX.Element => {

    const mapRef = useRef<MapRef>(null);

    return (
        <>
            <GlobalCallbackContextProvider callbacks={props.callbacks ?? {}}>
            <MapRefContextProvider mapRef={mapRef}>
                <Map mapRef={mapRef} map={props.map}>{props.children}</Map>
            </GlobalCallbackContextProvider>
        </>
    );
};
