import React, { RefObject, useEffect } from 'react';
import { MapRef } from 'react-map-gl';
import { ICoordinates } from '../../../utils/map/mapTypes';
import { IWallV2WorldMarker } from '../../../utils/world/worldTypes';
import { EmptyLayer } from '../EmptyLayer';
import { WallSegment } from './WallSegment';
interface Props {
    marker: IWallV2WorldMarker;
    mapRef: RefObject<MapRef>;
    beforeId?: string;
    orderIndex: number;
}

const coordinatesToWalls = (coords: ICoordinates[]): [ICoordinates, ICoordinates][] => {
    const res: [ICoordinates, ICoordinates][] = [];
    for (let i = 0; i < coords.length - 1; i++) {
        res.push([coords[i], coords[i + 1]]);
    }
    return res;
};

export function transformLineCoordinatesIntoPolygonCoordinates(
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

export const MultiLineWall = (props: Props) => {
    const marker = props.marker;
    const markerData = marker.elementData;

    const sourceId = props.marker.id;
    const layerId = `${props.marker.id}|layer`;

    const walls = coordinatesToWalls(marker.elementData.coordinates);
    const rectangleCoords = walls.map(([start, end]) =>
        transformLineCoordinatesIntoPolygonCoordinates(start, end, marker.elementData.line.width)
    );

    useEffect(() => {
        if (!props.mapRef.current) {
            return;
        }

        if (props.mapRef.current) {
            props.mapRef.current.moveLayer(layerId, props.beforeId);
            props.mapRef.current.moveLayer(marker.id + '|last', layerId);
        }
    }, [props.beforeId, props.mapRef?.current]);

    return (
        <>
            <WallSegment
                sourceId={sourceId}
                layerId={layerId}
                beforeId={props.beforeId}
                markerId={marker.id}
                coordinates={rectangleCoords}
                wallProps={{
                    color: markerData.wall.color,
                    opacity: markerData.wall.opacity,
                    height: markerData.wall.height
                }}
                orderIndex={props.orderIndex}
                visible={marker.visible ?? false}
            />
            <EmptyLayer id={marker.id + '|last'} beforeId={layerId} />
        </>
    );
};
