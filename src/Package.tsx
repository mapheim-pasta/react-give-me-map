import React, { useReducer } from 'react';
import { ContextProvider } from './context/dynamic/provider';
import { reducer } from './context/dynamic/reducer';
import { initialState } from './context/dynamic/state';
import { Map } from './map/Map';
import { ICallbacks, RegisterCallbacks } from './map/RegisterCallbacks';
import { EMapStyle, IMapProps } from './utils/map/mapTypes';
import { IWorldMarker } from './utils/world/worldTypes';

interface IProps {
    map: IMapProps;
    markers?: IWorldMarker[];
    children?: React.ReactNode;
    callbacks?: ICallbacks;
    selectedIds?: string[];
    selectedMapStyle?: EMapStyle;
}

export const Package = (props: IProps): JSX.Element => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const markers = props.markers ?? [];
    for (const marker of markers) {
        if (marker.elementType === 'direction') {
            // first is "start"
            // 1...n-1 are coordinates
            // last is "end"
            marker.refs = new Array(marker.elementData.coordinates.length + 2)
                .fill(0)
                .map(() => React.createRef<HTMLDivElement>());
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
                    selectedMapStyle={props.selectedMapStyle ?? EMapStyle.WORLD}
                >
                    {props.children}
                </Map>
            </ContextProvider>
        </>
    );
};
