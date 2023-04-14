import React, { RefObject } from 'react';
import { MapRef } from 'react-map-gl';
import { IconV2Marker } from '../items/v2/IconV2Marker';
import { LineV2Marker } from '../items/v2/LineV2Marker';
import { PolygonV2Marker } from '../items/v2/PolygonV2Marker';
import { IWorldV2Marker } from '../utils/world/worldTypes';

export interface IProps {
    mapRef: RefObject<MapRef>;
    markers: IWorldV2Marker[];
}

export const WorldMarkersV2 = (props: IProps): JSX.Element => {
    return (
        <>
            {props.markers.map((marker) => {
                switch (marker.elementType) {
                    case 'v2/line':
                        return <LineV2Marker key={marker.id} marker={marker} />;
                    case 'v2/polygon':
                        return <PolygonV2Marker key={marker.id} marker={marker} />;
                    case 'v2/icon':
                        return (
                            <IconV2Marker key={marker.id} marker={marker} mapRef={props.mapRef} />
                        );
                    default:
                        return null;
                }
            })}
        </>
    );
};
