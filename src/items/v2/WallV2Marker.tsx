import React, { RefObject } from 'react';
import { MapRef } from 'react-map-gl';
import { IWallV2WorldMarker } from '../../utils/world/worldTypes';
import { MultiLineWall } from './WallV2Marker/MultiWallLine';
import { PolygonWall } from './WallV2Marker/PolygonWall';

interface Props {
    mapRef: RefObject<MapRef>;
    marker: IWallV2WorldMarker;

    beforeId?: string;

    isHighlighted?: boolean;
}

export const WallV2Marker = (props: Props): JSX.Element => {
    const markerData = props.marker.elementData;

    if (markerData.line?.isLine) {
        return <MultiLineWall marker={props.marker} />;
    }

    return (
        <PolygonWall
            mapRef={props.mapRef}
            marker={props.marker}
            beforeId={props.beforeId}
            isHighlighted={props.isHighlighted}
        />
    );
};
