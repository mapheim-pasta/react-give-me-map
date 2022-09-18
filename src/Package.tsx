import React, { useReducer } from 'react';
import { ContextProvider } from './context/dynamic/provider';
import { reducer } from './context/dynamic/reducer';
import { initialState } from './context/dynamic/state';
import { Map } from './map/Map';
import { ICallbacks, RegisterCallbacks } from './map/RegisterCallbacks';
import { IMapConfig, IMapProps } from './utils/map/mapTypes';
import { IWorldMarker } from './utils/world/worldTypes';

interface IProps {
    map: IMapProps;
    markers?: IWorldMarker[];
    children?: React.ReactNode;
    callbacks?: ICallbacks;
    selectedIds?: string[];

    config?: IMapConfig;
}

export const Package = (props: IProps): JSX.Element => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const markers = props.markers ?? [];
    for (const marker of markers) {
        if (marker.elementType === 'direction') {
            // first is "start"
            // TODO: 1...n-1 will be stops on the way
            // last is "end"
            marker.refs = new Array(2).fill(0).map(() => React.createRef<HTMLDivElement>());
        } else {
            marker.ref = React.createRef<HTMLDivElement>();
        }
    }

    return (
        <>
            <ContextProvider reducer={{ state, dispatch }}>
                <RegisterCallbacks {...props.callbacks} />
                <Map
                    map={props.map}
                    markers={markers}
                    selectedIds={props.selectedIds ?? []}
                    config={props.config}
                >
                    {props.children}
                </Map>
            </ContextProvider>
        </>
    );
};
