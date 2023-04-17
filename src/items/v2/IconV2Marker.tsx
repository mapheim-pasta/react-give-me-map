import { isNil, omitBy } from 'lodash';
import { SymbolLayout, SymbolPaint } from 'mapbox-gl';
import React, { RefObject, useEffect } from 'react';
import { Layer, MapRef, Source } from 'react-map-gl';
import { useLoadMapImages } from '../../hooks/map/useLoadMapImages';
import { IIconV2WorldMarker } from '../../utils/world/worldTypes';

interface Props {
    mapRef: RefObject<MapRef>;
    marker: IIconV2WorldMarker;
    beforeId?: string;
    isHighlighted?: boolean;
}

export const IconV2Marker = (props: Props): JSX.Element => {
    const markerId = props.marker.id;
    const data = props.marker.elementData;

    useLoadMapImages({
        mapRef: props.mapRef,
        images: [
            {
                name: data.imageUrl,
                url: data.imageUrl
                // sdf: true
            }
        ]
    });

    const paintAttributes: SymbolPaint = {
        'text-color': data.textColor,
        ...data.rawPaintAttributes
    };
    const layoutAttributes: SymbolLayout = {
        'icon-image': data.imageUrl,
        'icon-size': data.imageSize,
        'text-font': ['Open Sans Bold'],
        'text-field': '{text}',
        'text-size': data.textSize,
        'icon-allow-overlap': true,
        'text-allow-overlap': true,
        ...data.rawLayoutAttributes
    };

    const layerIds = {
        layer: markerId + '|layer',
        highlight: markerId + '|highlight'
    };

    const getBeforeIds = () => {
        if (props.isHighlighted) {
            return {
                highlight: props.beforeId,
                layer: layerIds.highlight
            };
        } else {
            return {
                highlight: undefined,
                layer: props.beforeId
            };
        }
    };

    const beforeIds = getBeforeIds();

    useEffect(() => {
        const map = props.mapRef?.current;
        if (!map) {
            return;
        }

        map.moveLayer(layerIds.layer, props.beforeId);

        if (props.isHighlighted) {
            map.moveLayer(layerIds.highlight, beforeIds.highlight);
        }
    }, [props.beforeId, props.mapRef]);

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
            {props.isHighlighted && (
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
            )}
            <Layer
                id={layerIds.layer}
                beforeId={beforeIds.layer}
                source={markerId}
                type="symbol"
                paint={{ ...omitBy(paintAttributes, isNil) }}
                layout={{ ...omitBy(layoutAttributes, isNil) }}
            />
        </Source>
    );
};
