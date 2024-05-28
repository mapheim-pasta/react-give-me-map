import React from 'react';
import { Layer, Source } from 'react-map-gl';
import { coordsToArrays } from '../../../utils/geojson/coordsToArrays';
import { ICoordinates } from '../../../utils/map/mapTypes';

export interface WallProps {
    height: number;
    color: string;
    baseHeight: number;
}

export interface GroupWallMarkerDataProps {
    markerId: string;
    coordinates: ICoordinates[];
    isLine?: boolean;
    wallProps: WallProps;
    visible: boolean;
    orderIndex: number;
    selectable: boolean;
}

interface Props {
    sourceId: string;
    layerId: string;
    beforeId?: string;
    markerData: GroupWallMarkerDataProps[];
    opacity: number;
}

export const WallSegment = (props: Props) => {
    const visibleMarkerData = props.markerData.filter((e) => e.visible);

    function markerToFeature(m: GroupWallMarkerDataProps) {
        const wallData = m.wallProps;

        return {
            type: 'Feature' as const,
            properties: {
                markerId: m.markerId,
                color: wallData.color,
                height: (wallData.height ?? 0) + (wallData.baseHeight ?? 0),
                base: wallData.baseHeight ?? 0,
                orderIndex: m.orderIndex,
                clickable: m.selectable ? '1' : '0'
            },
            geometry: {
                coordinates: [coordsToArrays(m.coordinates)],
                type: 'Polygon' as const
            }
        };
    }

    return (
        <Source
            id={props.sourceId}
            type="geojson"
            data={{
                type: 'FeatureCollection',
                features: visibleMarkerData.map(markerToFeature)
            }}
        >
            <Layer
                id={props.layerId}
                source={props.sourceId}
                beforeId={props.beforeId}
                type="fill-extrusion"
                paint={{
                    'fill-extrusion-color': ['get', 'color'],
                    'fill-extrusion-height': ['get', 'height'],
                    'fill-extrusion-base': ['get', 'base'],
                    'fill-extrusion-opacity': props.opacity
                }}
                layout={{
                    visibility: 'visible'
                }}
            />
        </Source>
    );
};
