import React, { RefObject, useEffect } from 'react';
import { Layer, MapRef, Source } from 'react-map-gl';
import { coordsToArrays } from '../../utils/geojson/coordsToArrays';
import { MAX_ZOOM, ROUTE_LINE_WIDTH } from '../../utils/world/worldConfig';
import { IDirectionWorldMarker } from '../../utils/world/worldTypes';
import { getInScaleReverse } from '../../utils/world/worldUtils';
import { EmptyLayer } from './EmptyLayer';
interface Props {
    mapRef: RefObject<MapRef>;
    marker: IDirectionWorldMarker;
    beforeId?: string;
    onClick?: (e: MouseEvent) => void;
    orderIndex: number;
}

export const DirectionWorld = (props: Props): JSX.Element => {
    const elementData = props.marker.elementData;
    const markerId = props.marker.id;

    let width = getInScaleReverse(
        ROUTE_LINE_WIDTH,
        props.mapRef?.current?.getZoom() ?? 1,
        MAX_ZOOM
    );
    const extraWidth = width < 40 ? 40 : width;
    width = width < 5 ? 5 : width;

    const layerIds = {
        layer: markerId + '|layer',
        layerClick: markerId + '|clickable',
        last: markerId + '|last'
    };

    const beforeIds = {
        layer: props.beforeId,
        layerClick: layerIds.layer,
        last: layerIds.layerClick
    };

    useEffect(() => {
        if (props.mapRef.current) {
            props.mapRef.current.moveLayer(layerIds.layer, beforeIds.layer);
            props.mapRef.current.moveLayer(layerIds.layerClick, beforeIds.layerClick);
            props.mapRef.current.moveLayer(layerIds.last, beforeIds.last);
        }
    }, [props.beforeId, props.mapRef?.current]);

    if (elementData.coordinates.length < 2) {
        return <></>;
    }

    return (
        <Source
            id={markerId}
            type="geojson"
            data={{
                type: 'Feature',
                properties: {
                    orderIndex: props.orderIndex
                },
                geometry: {
                    type: 'LineString',
                    coordinates: coordsToArrays(elementData.path)
                }
            }}
        >
            <Layer
                id={layerIds.layer}
                beforeId={beforeIds.layer}
                source={markerId}
                type="line"
                paint={{
                    'line-color': elementData.lineColor,
                    'line-width': width,
                    'line-opacity': elementData.lineOpacity ?? 1
                }}
                layout={{
                    'line-cap': 'round',
                    'line-join': 'round'
                }}
            />
            <Layer
                id={layerIds.layerClick}
                beforeId={beforeIds.layerClick}
                source={markerId}
                type="line"
                paint={{
                    'line-color': 'black',
                    'line-width': extraWidth,
                    'line-opacity': 0
                }}
            />
            <EmptyLayer id={layerIds.last} beforeId={beforeIds.last} />
        </Source>
    );
};
