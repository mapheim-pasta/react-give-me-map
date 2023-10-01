import React from 'react';
import { Layer, Source } from 'react-map-gl';
import { ICoordinates } from '../../../utils/map/mapTypes';
import { EmptyLayer } from '../EmptyLayer';
interface Props {
    beforeId?: string;
    coordinates: ICoordinates[];
    color: string;
    hasFloor: boolean;
    markerId: string;
    visible: boolean;
    orderIndex: number;
}

export const GroundFloor = (props: Props) => {
    const sourceId = props.markerId + '|floor';

    const layerIds = {
        layer: props.markerId + '|floor|layer',
        last: props.markerId + '|floor|last'
    };

    const beforeIds = {
        layer: props.beforeId,
        last: layerIds.layer
    };

    return (
        <Source
            id={sourceId}
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
                id={layerIds.layer}
                beforeId={beforeIds.layer}
                source={sourceId}
                type="fill"
                paint={{
                    'fill-color': props.color ?? '#fff',
                    'fill-opacity': props.color && props.hasFloor ? 1 : 0
                }}
            />
            <EmptyLayer id={layerIds.last} beforeId={beforeIds.last} />
        </Source>
    );
};
