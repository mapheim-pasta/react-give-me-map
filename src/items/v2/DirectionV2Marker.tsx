import React, { RefObject, useEffect } from 'react';
import { Layer, MapRef, Source } from 'react-map-gl';
import { coordsToArrays } from '../../utils/geojson/coordsToArrays';
import { ICoordinates } from '../../utils/map/mapTypes';
import { IDirectionWorldMarker } from '../../utils/world/worldTypes';
import { EmptyLayer } from './EmptyLayer';
import { automoveMarkers } from './automoveMarkers';
interface Props {
    mapRef: RefObject<MapRef>;
    marker: IDirectionWorldMarker;
    beforeId?: string;
    onClick?: (e: MouseEvent) => void;
    orderIndex: number;
}

export const getSegmentsForDirectionMarker = (
    coordinates: ICoordinates[],
    path: ICoordinates[]
) => {
    const segments: ICoordinates[][] = [];
    let currentSegment = [path[0]];
    for (const point of path) {
        const waypoint = coordinates[segments.length + 1];
        currentSegment.push(point);

        if (!waypoint || (point.lat === waypoint.lat && point.lng && waypoint.lng)) {
            segments.push(currentSegment);
            currentSegment = [point];
        }
    }

    return segments;
};

export const DirectionWorld = (props: Props): JSX.Element => {
    const mapRef = props.mapRef;
    const elementData = props.marker.elementData;
    const markerId = props.marker.id;

    const segments = getSegmentsForDirectionMarker(elementData.coordinates, elementData.path);

    const sourceIds = segments.map((_, i) => `${markerId}|${i}`);

    const layerIds = segments.map((_, i) => ({
        layer: `${markerId}|${i}|layer`,
        layerClick: `${markerId}|${i}|clickable`,
        last: i === segments.length - 1 ? `${markerId}|last` : `${markerId}|${i}|last`
    }));

    const beforeIds = segments.map((_, i) => ({
        layer: i === 0 ? props.beforeId : layerIds[i - 1].last,
        layerClick: layerIds[i].layer,
        last: layerIds[i].layerClick
    }));

    const width = elementData.width ?? 5;

    useEffect(() => {
        if (!props.mapRef.current) {
            return;
        }

        segments.forEach((_, i) => {
            automoveMarkers({
                mapRef: mapRef.current,
                layerIds: layerIds[i],
                beforeIds: beforeIds[i]
            });
        });
    }, [props.beforeId, props.mapRef?.current]);

    if (elementData.coordinates.length < 2) {
        return <></>;
    }

    return (
        <>
            {segments.map((segment, i) => {
                return (
                    <Source
                        key={sourceIds[i]}
                        id={sourceIds[i]}
                        type="geojson"
                        data={{
                            type: 'Feature',
                            properties: {
                                orderIndex: props.orderIndex,
                                segmentIndex: i
                            },
                            geometry: {
                                type: 'LineString',
                                coordinates: coordsToArrays(segment)
                            }
                        }}
                    >
                        <Layer
                            id={layerIds[i].layer}
                            beforeId={beforeIds[i].layer}
                            source={sourceIds[i]}
                            type="line"
                            paint={{
                                'line-color': elementData.color,
                                'line-width': width,
                                'line-opacity': elementData.opacity ?? 1
                            }}
                            layout={{
                                'line-cap': 'round',
                                'line-join': 'round',
                                visibility: props.marker.visible ? 'visible' : 'none'
                            }}
                        />
                        <Layer
                            id={layerIds[i].layerClick}
                            beforeId={beforeIds[i].layerClick}
                            source={sourceIds[i]}
                            type="line"
                            metadata={{
                                try: 'this'
                            }}
                            paint={{
                                'line-color': 'black',
                                'line-width': Math.max(width, 30),
                                'line-opacity': 0
                            }}
                            layout={{
                                visibility: props.marker.visible ? 'visible' : 'none'
                            }}
                        />
                        <EmptyLayer id={layerIds[i].last} beforeId={beforeIds[i].last} />
                    </Source>
                );
            })}
        </>
    );
};
