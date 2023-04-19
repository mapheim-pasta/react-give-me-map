import React, { useState } from 'react';
import { ICoordinates } from '../../../utils/map/mapTypes';
import { WallProps, WallSegment } from './WallSegment';

interface Props {
    markerId: string;
    coordinates: [ICoordinates, ICoordinates];
    width: number;
    wallProps: WallProps;
    isFirst: boolean;
}

function transformLineCoordinatesIntoPolygonCoordinates(
    start: ICoordinates,
    end: ICoordinates,
    width: number
) {
    const latMove = Math.abs(end.lat - start.lat);
    const lngMove = Math.abs(end.lng - start.lng);

    const latToLng = lngMove !== 0 ? latMove / (latMove + lngMove) : 1;
    const lngToLat = latMove !== 0 ? lngMove / (latMove + lngMove) : 1;

    const lngDelta = 0.000001 * width;
    const latDelta = lngDelta / 2;

    const new1 = { lat: start.lat - latDelta * lngToLat, lng: start.lng - lngDelta * latToLng };
    const new2 = { lat: start.lat + latDelta * lngToLat, lng: start.lng + lngDelta * latToLng };
    const new3 = { lat: end.lat + latDelta * lngToLat, lng: end.lng + lngDelta * latToLng };
    const new4 = { lat: end.lat - latDelta * lngToLat, lng: end.lng - lngDelta * latToLng };

    return [new1, new2, new3, new4];
}

export const SingleLineWall = (props: Props) => {
    const { coordinates, wallProps, width } = props;
    const [start, end] = coordinates;

    const [idRef] = useState(props.markerId + (props.isFirst ? '' : '|wall|' + Math.random()));

    const rectangleCoords = transformLineCoordinatesIntoPolygonCoordinates(start, end, width);

    return (
        <WallSegment
            sourceId={idRef.toString()}
            layerId={idRef.toString() + '|layer'}
            markerId={props.markerId}
            coordinates={rectangleCoords}
            wallProps={wallProps}
        />
    );
};
