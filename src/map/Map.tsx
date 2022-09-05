import React, { Ref, useRef } from 'react';
import ReactMapGL, { MapRef } from 'react-map-gl';
import { WorldMarkers } from '../components/WorldMarkers';
import { EMapStyle, IMapProps } from '../utils/map/mapTypes';

import { IWorldMarker } from '../utils/world/worldTypes';

interface IProps {
    map: IMapProps;
    markers: IWorldMarker[];
    children?: React.ReactNode;
}

export const Map = (props: IProps): JSX.Element => {
    const mapRef = useRef<MapRef>();

    return (
        <>
            <ReactMapGL
                {...props.map.viewport}
                ref={mapRef as Ref<MapRef>}
                style={{
                    width: '100%',
                    height: '100%'
                }}
                onClick={props.map.onMapClick}
                onLoad={(e) => {
                    props.map.onMapLoad?.(e, mapRef);
                }}
                reuseMaps={true}
                mapStyle={props.map.mapStyle ?? EMapStyle.WORLD}
                onMove={props.map.onMapMove}
                onRender={(event) => event.target.resize()}
                dragRotate={false}
                boxZoom={false}
                interactiveLayerIds={props.map.interactiveLayerIds}
                dragPan={props.map.dragPan ?? true}
                scrollZoom={props.map.scrollZoom ?? true}
                doubleClickZoom={props.map.doubleClickZoom ?? true}
                mapboxAccessToken={props.map.accessToken}
            >
                <WorldMarkers markers={props.markers} viewport={props.map.viewport} />
                {props.children}
            </ReactMapGL>
        </>
    );
};
