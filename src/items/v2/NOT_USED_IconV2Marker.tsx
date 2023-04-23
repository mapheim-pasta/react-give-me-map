import { isNil, omitBy } from 'lodash';
import { SymbolLayout, SymbolPaint } from 'mapbox-gl';
import React, { RefObject, useEffect, useState } from 'react';
import { Layer, MapRef, Source } from 'react-map-gl';
import { useLoadMapImages } from '../../hooks/map/useLoadMapImages';
import { IIconV2WorldMarker } from '../../utils/world/worldTypes';
import { EmptyLayer } from './EmptyLayer';

interface Props {
    mapRef: RefObject<MapRef>;
    marker: IIconV2WorldMarker;
    beforeId?: string;
    isHighlighted?: boolean;
}

export const NOT_USER_IconV2Marker = (props: Props): JSX.Element => {
    const markerId = props.marker.id;
    const data = props.marker.elementData;

    const [isImageLoaded, setIsImageLoaded] = useState(false);

    useLoadMapImages({
        mapRef: props.mapRef,
        imageUrls: [data.imageUrl],
        onLoad: () => setIsImageLoaded(true)
    });

    const paintAttributes: SymbolPaint = {
        'text-color': data.textColor,
        ...data.rawPaintAttributes
    };

    const layoutAttributes: SymbolLayout = {
        'text-font': ['Open Sans Bold'],
        'text-field': '{text}',
        'text-size': data.textSize,
        'text-allow-overlap': true,
        'icon-image': isImageLoaded ? data.imageUrl : undefined,
        'icon-size': data.imageSize,
        'icon-allow-overlap': true,
        'icon-anchor': 'bottom',
        'text-anchor': 'top',
        ...data.rawLayoutAttributes,
        // visibility: props.marker.visible ? 'visible' : 'none',
        visibility: 'none'
    };

    const layerIds = {
        layer: markerId + '|layer',
        highlight: markerId + '|highlight',
        last: markerId + '|last'
    };

    const beforeIds = {
        layer: props.beforeId,
        highlight: layerIds.layer,
        last: layerIds.highlight
    };

    useEffect(() => {
        if (props.mapRef.current) {
            props.mapRef.current.moveLayer(layerIds.layer, beforeIds.layer);
            props.mapRef.current.moveLayer(layerIds.highlight, beforeIds.highlight);
            props.mapRef.current.moveLayer(layerIds.last, beforeIds.last);
        }
    }, [props.beforeId, props.mapRef?.current]);

    return (
        <Source
            id={markerId}
            type="geojson"
            data={{
                type: 'Feature',
                properties: {
                    text: data.text
                },
                geometry: {
                    type: 'Point',
                    coordinates: [data.position.lng, data.position.lat]
                }
            }}
        >
            <Layer
                id={layerIds.layer}
                beforeId={beforeIds.layer}
                source={markerId}
                type="symbol"
                paint={{ ...omitBy(paintAttributes, isNil) }}
                layout={{ ...omitBy(layoutAttributes, isNil) }}
            />
            {props.isHighlighted ? (
                <Layer
                    id={layerIds.highlight}
                    beforeId={beforeIds.highlight}
                    source={markerId}
                    type="circle"
                    paint={{
                        'circle-color': '#F8E71C',
                        'circle-radius': 100,
                        'circle-opacity': 0.3,
                        'circle-blur': 0.5
                    }}
                />
            ) : (
                <EmptyLayer id={layerIds.highlight} beforeId={beforeIds.highlight} />
            )}
            <EmptyLayer id={layerIds.last} beforeId={beforeIds.last} />
        </Source>
    );
};
