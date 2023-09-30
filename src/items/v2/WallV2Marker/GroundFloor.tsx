import React from 'react';
import { Layer, Source } from 'react-map-gl';
import { ICoordinates } from '../../../utils/map/mapTypes';
interface Props {
    sourceId: string;
    layerId: string;
    beforeId?: string;
    coordinates: ICoordinates[];
    color: string;
    hasFloor: boolean;
    markerId: string;
    visible: boolean;
    orderIndex: number;
}

export const GroundFloor = (props: Props) => {
    const { layerId, beforeId } = props;

    return (
        <Source
            id={props.sourceId}
            type="geojson"
            data={{
                type: 'Feature',
                properties: {
                    orderIndex: props.orderIndex
                },
                geometry: {
                    type: 'Polygon',
                    coordinates: [props.coordinates.map(({ lng, lat }) => [lng, lat])]
                }
            }}
        >
            <Layer
                id={layerId}
                beforeId={beforeId}
                type="fill"
                source={props.sourceId}
                paint={{
                    'fill-color': props.color ?? '#fff',
                    'fill-opacity': props.color && props.hasFloor ? 1 : 0
                }}
            />
        </Source>
    );
};
