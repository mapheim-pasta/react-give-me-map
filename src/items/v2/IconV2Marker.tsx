import { isNil, omitBy } from 'lodash';
import { SymbolLayout, SymbolPaint } from 'mapbox-gl';
import React, { RefObject } from 'react';
import { Layer, MapRef, Source } from 'react-map-gl';
import { useLoadMapImages } from '../../hooks/map/useLoadMapImages';
import { IIconV2WorldMarker } from '../../utils/world/worldTypes';

interface Props {
    mapRef: RefObject<MapRef>;
    marker: IIconV2WorldMarker;
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
        ...data.rawLayoutAttributes
    };

    return (
        <Source
            id={`${markerId}|source`}
            type="geojson"
            data={{
                type: 'Feature',
                properties: {
                    text: data.text
                },
                geometry: {
                    type: 'Point',
                    coordinates: [data.position.lng, data.position.lat] // Greece
                }
            }}
        >
            <Layer
                id={`${markerId}|layer`}
                type="symbol"
                paint={{ ...omitBy(paintAttributes, isNil) }}
                layout={{ ...omitBy(layoutAttributes, isNil) }}
            />
        </Source>
    );
};
