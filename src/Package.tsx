import React, { useReducer } from 'react';
import { MapRef } from 'react-map-gl';
import { CustomBuilders } from './context/dynamic/actions';
import { ContextProvider } from './context/dynamic/provider';
import { reducer } from './context/dynamic/reducer';
import { initialState } from './context/dynamic/state';
import { Map } from './map/Map';
import { ICallbacks, RegisterPropsToGlobalState } from './map/RegisterPropsToGlobalState';
import { IMapConfig, IMapProps, MarkerStyle } from './utils/map/mapTypes';
import { IWorldMarker, IWorldV1Marker, IWorldV2Marker } from './utils/world/worldTypes';

interface IProps {
    map: IMapProps;
    mapRef: React.RefObject<MapRef>;
    markers?: IWorldMarker[];
    children?: React.ReactNode;
    callbacks?: ICallbacks;
    selectedIds?: string[];

    config?: IMapConfig;

    selectableMarkersStyle?: MarkerStyle;
    highlightedMarkers?: string[];
    highlightedMarkersStyle?: MarkerStyle;
    orderedMarkerIds?: string[];
    categories?: string[];
    selectedCategories?: string[];
    customBuilders?: CustomBuilders;
    isEditMode?: boolean;
}

export const isV2Marker = (marker: IWorldMarker): marker is IWorldV2Marker =>
    marker.elementType === 'v2/line' ||
    marker.elementType === 'v2/icon' ||
    marker.elementType === 'v2/polygon' ||
    marker.elementType === 'v2/wall' ||
    marker.elementType === 'v2/image' ||
    marker.elementType === 'direction' ||
    marker.elementType === 'v2/text' ||
    marker.elementType === 'v2/route' ||
    marker.elementType === 'indoor_stand';

export const isV1Marker = (marker: IWorldMarker): marker is IWorldV1Marker => !isV2Marker(marker);

export const Package = (props: IProps): JSX.Element => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Fill in default values
    const markers = (props.markers ?? []).map<IWorldMarker>((m, i) => ({
        ...m,
        order: m.order ?? i,
        scalable: m.scalable ?? true,
        scale: m.scale ?? 1
    }));

    const v1Markers = markers.filter<IWorldV1Marker>(isV1Marker);
    const v2Markers = markers.filter<IWorldV2Marker>(isV2Marker);

    for (const marker of v1Markers) {
        if (!marker.ref) {
            marker.ref = React.createRef<HTMLDivElement>();
        }
    }

    return (
        <>
            <ContextProvider reducer={{ state, dispatch }}>
                <RegisterPropsToGlobalState
                    callbacks={props.callbacks}
                    customBuilders={props.customBuilders}
                />
                <Map
                    mapRef={props.mapRef}
                    map={props.map}
                    isEditMode={props.isEditMode ?? false}
                    v1Markers={v1Markers}
                    v2Markers={v2Markers}
                    selectedIds={props.selectedIds ?? []}
                    config={props.config}
                    selectableMarkersStyle={props.selectableMarkersStyle}
                    highlightedMarkersStyle={props.highlightedMarkersStyle}
                    highlightedMarkers={props.highlightedMarkers ?? []}
                    categories={props.categories ?? []}
                    selectedCategories={props.selectedCategories ?? []}
                    orderedMarkerIds={props.orderedMarkerIds ?? []}
                >
                    {props.children}
                </Map>
            </ContextProvider>
        </>
    );
};
