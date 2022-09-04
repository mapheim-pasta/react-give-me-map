import React, { useContext } from 'react';
import { MapRef } from 'react-map-gl';

export const MapRefContext = React.createContext<React.RefObject<MapRef> | null>(null);

export const MapRefContextProvider = (props: {
    children: JSX.Element;
    mapRef: React.RefObject<MapRef>;
}) => {
    return <MapRefContext.Provider value={props.mapRef}>{props.children}</MapRefContext.Provider>;
};

export const useMapRef = () => {
    const ctx = useContext(MapRefContext);

    return ctx;
};
