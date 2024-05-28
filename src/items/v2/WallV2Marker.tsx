import React, { RefObject } from 'react';
import { MapRef } from 'react-map-gl';
import { IWallV2WorldMarker } from '../../utils/world/worldTypes';
import { MultiLineWall } from './WallV2Marker/MultiLineWall';
import { PolygonWall } from './WallV2Marker/PolygonWall';

interface Props {
    mapRef: RefObject<MapRef>;
    marker: IWallV2WorldMarker;

    beforeId?: string;

    orderIndex: number;
}

export const WallV2Marker = (props: Props): JSX.Element => {
    const markerData = props.marker.elementData;

    if (markerData.line?.isLine || markerData.coordinates.length < 3) {
        return (
            <MultiLineWall
                mapRef={props.mapRef}
                marker={props.marker}
                beforeId={props.beforeId}
                orderIndex={props.orderIndex}
            />
        );
    }

    return (
        <PolygonWall
            mapRef={props.mapRef}
            marker={props.marker}
            beforeId={props.beforeId}
            orderIndex={props.orderIndex}
        />
    );
};
