import { isEqual, uniqWith } from 'lodash';
import React, { RefObject, useEffect } from 'react';
import { Layer, MapRef, Source } from 'react-map-gl';
import { coordsToArrays } from '../../utils/geojson/coordsToArrays';
import { ICoordinates } from '../../utils/map/mapTypes';
import { IImageV2WorldMarker } from '../../utils/world/worldTypes';
import { EmptyLayer } from './EmptyLayer';

interface Props {
    mapRef: RefObject<MapRef>;
    marker: IImageV2WorldMarker;

    beforeId?: string;

    isHighlighted?: boolean;
    orderIndex: number;
}

export const getFlippedCoordinates = (data: {
    flipHorizontal: boolean;
    flipVertical: boolean;
    coordinates: ICoordinates[];
}) => {
    if (data.flipHorizontal && data.flipVertical) {
        return [data.coordinates[2], data.coordinates[3], data.coordinates[0], data.coordinates[1]];
    }
    if (data.flipHorizontal) {
        return [data.coordinates[1], data.coordinates[0], data.coordinates[3], data.coordinates[2]];
    }
    if (data.flipVertical) {
        return [data.coordinates[3], data.coordinates[2], data.coordinates[1], data.coordinates[0]];
    }
    return data.coordinates;
};

export const ImageV2Marker = (props: Props): JSX.Element => {
    const markerId = props.marker.id;
    const data = props.marker.elementData;

    const sourceIdClick = markerId + '_click';

    const layerIds = {
        layer: markerId + '|layer',
        layerClick: sourceIdClick + '|clickable',
        last: markerId + '|last'
    };

    const beforeIds = {
        layer: props.beforeId,
        layerClick: layerIds.layer,
        last: layerIds.layer
    };

    useEffect(() => {
        if (props.mapRef.current) {
            props.mapRef.current.moveLayer(layerIds.layer, beforeIds.layer);
            props.mapRef.current.moveLayer(layerIds.layerClick, beforeIds.layerClick);
            props.mapRef.current.moveLayer(layerIds.last, beforeIds.last);
        }
    }, [props.beforeId, props.mapRef?.current]);

    const coordinates = getFlippedCoordinates({ ...data });
    const closedCoordinates = [...coordinates, coordinates[0]].filter(Boolean);

    if (coordinates.length !== 4 || uniqWith(coordinates, isEqual).length !== 4) {
        // console.log('Cannot render Image card - invalid coordinates', coordinates);
        return <></>;
    }

    return (
        <>
            <Source
                id={markerId}
                type="image"
                url={data.imageUrl}
                coordinates={coordsToArrays(coordinates)}
            >
                <Layer
                    id={layerIds.layer}
                    beforeId={beforeIds.layer}
                    type="raster"
                    source={markerId}
                    layout={{
                        visibility: props.marker.visible ? 'visible' : 'none'
                    }}
                    paint={{
                        'raster-opacity': data.opacity ?? 1
                    }}
                />
                <EmptyLayer id={layerIds.last} beforeId={beforeIds.last} />
            </Source>
            <Source
                id={sourceIdClick}
                type="geojson"
                data={{
                    type: 'Feature',
                    properties: {
                        markerId,
                        orderIndex: props.orderIndex
                    },
                    geometry: {
                        type: 'Polygon',
                        coordinates: [closedCoordinates.map(({ lng, lat }) => [lng, lat])]
                    }
                }}
            >
                {props.marker.selectable ? (
                    <Layer
                        id={layerIds.layerClick}
                        beforeId={beforeIds.layerClick}
                        type="fill"
                        source={sourceIdClick}
                        paint={{
                            'fill-opacity': 0
                        }}
                    />
                ) : (
                    <EmptyLayer id={layerIds.layerClick} beforeId={beforeIds.layerClick} />
                )}
            </Source>
        </>
    );
};
