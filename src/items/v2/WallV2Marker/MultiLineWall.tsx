import turfBuffer from '@turf/buffer';
import * as turf from '@turf/helpers';
import React, { RefObject, useEffect } from 'react';
import { MapRef } from 'react-map-gl';
import { ICoordinates } from '../../../utils/map/mapTypes';
import { IWallV2WorldMarker } from '../../../utils/world/worldTypes';
import { EmptyLayer } from '../EmptyLayer';
import { automoveMarkers } from '../automoveMarkers';
import { WallSegment } from './WallSegment';
interface Props {
    marker: IWallV2WorldMarker;
    mapRef: RefObject<MapRef>;
    beforeId?: string;
    orderIndex: number;
}

export function transformLineCoordinatesIntoPolygonCoordinates(
    coordinates: ICoordinates[],
    width: number
) {
    function createConnectedLinePolygons(points: number[][]) {
        if (points.length < 2 || width <= 0) {
            return null;
        }

        const polygons = [];

        for (let i = 0; i < points.length - 1; i++) {
            const point1 = points[i];
            const point2 = points[i + 1];

            // Convert latitude and longitude to Turf.js Points
            const lat1 = point1[1];
            const lon1 = point1[0];
            const lat2 = point2[1];
            const lon2 = point2[0];

            const linePolygon = createLinePolygon(lat1, lon1, lat2, lon2, width);
            polygons.push(linePolygon);
        }

        return polygons;
    }

    function createLinePolygon(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number,
        width: number
    ) {
        // Convert latitude and longitude to Turf.js Points
        // const point1 = turf.point([lon1, lat1]);
        // const point2 = turf.point([lon2, lat2]);

        // // Calculate the bearing (angle) between the two points
        // const bearing = turf.bearing(point1, point2);

        // Calculate the half-width in meters
        const halfWidth = width / 2;

        // Create a Turf.js LineString
        const line = turf.lineString([
            [lon1, lat1],
            [lon2, lat2]
        ]);

        // Create a Turf.js buffer around the line to represent the width
        const bufferedLine = turfBuffer(line, halfWidth, { units: 'meters' });

        // Convert the buffered line to a Polygon
        const polygon = turf.polygon(bufferedLine.geometry.coordinates);

        return polygon;
    }

    // Example usage with a list of points:
    const points = coordinates.map((e) => [e.lng, e.lat]);

    const resultPolygons = createConnectedLinePolygons(points);
    return (
        resultPolygons?.map((e) =>
            e.geometry.coordinates[0].map((e) => ({ lat: e[1], lng: e[0] }))
        ) ?? []
    );
}

export const MultiLineWall = (props: Props) => {
    const marker = props.marker;
    const markerData = marker.elementData;

    const sourceId = props.marker.id;
    const layerId = `${props.marker.id}|layer`;

    const layerIds = {
        layer: `${props.marker.id}|layer`,
        last: `${props.marker.id}|last`
    };

    const beforeIds = {
        layer: props.beforeId,
        last: layerIds.layer
    };

    const rectangleCoords = transformLineCoordinatesIntoPolygonCoordinates(
        marker.elementData.coordinates,
        marker.elementData.line.width
    );

    useEffect(() => {
        const mapRef = props.mapRef.current;
        automoveMarkers({ layerIds, beforeIds, mapRef });
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
