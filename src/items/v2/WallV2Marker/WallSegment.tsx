import React from 'react';
import { Layer, Source } from 'react-map-gl';
import { coordsToArrays } from '../../../utils/geojson/coordsToArrays';
import { ICoordinates } from '../../../utils/map/mapTypes';
interface Props {
    sourceId: string;
    layerId: string;
    beforeId?: string;
    coordinates: ICoordinates[][];
    markerId: string;
    wallProps: WallProps;
    visible: boolean;
    orderIndex: number;
}

export interface WallProps {
    height: number;
    opacity: number;
    color: string;
}

export const WallSegment = (props: Props) => {
    const wallData = props.wallProps;

    const closedCoordinates = props.coordinates
        .map((coordinates) => [...coordinates, coordinates[0]].filter(Boolean))
        .map(coordsToArrays);

    return (
        <Source
            id={props.sourceId}
            type="geojson"
            data={{
                type: 'FeatureCollection',
                features: closedCoordinates.map((c) => ({
                    type: 'Feature',
                    properties: {
                        orderIndex: props.orderIndex
                    },
                    geometry: {
                        coordinates: [c],
                        type: 'Polygon'
                    }
                }))
            }}
        >
            <Layer
                id={props.layerId}
                source={props.sourceId}
                beforeId={props.beforeId}
                type="fill-extrusion"
                paint={{
                    'fill-extrusion-color': wallData.color,
                    'fill-extrusion-height': wallData.height,
                    'fill-extrusion-base': 0,
                    'fill-extrusion-opacity': wallData.opacity
                }}
                layout={{
                    visibility: props.visible ? 'visible' : 'none'
                }}
            />
        </Source>
    );
};
