import { isNil, omitBy } from 'lodash';
import { FillLayout, FillPaint, LineLayout, LinePaint } from 'mapbox-gl';
import React from 'react';
import { Layer, Source } from 'react-map-gl';
import { IPolygonV2WorldMarker } from '../../utils/world/worldTypes';

interface Props {
    marker: IPolygonV2WorldMarker;
}

export const PolygonV2Marker = (props: Props): JSX.Element => {
    const markerId = props.marker.id;
    const data = props.marker.elementData;

    const closedCoordinates = [...data.coordinates, data.coordinates[0]].filter(Boolean);

    const fillPaintAttributes: FillPaint = {
        'fill-color': data.fill.color,
        'fill-opacity': data.fill.opacity,
        ...data.fill.rawPaintAttributes
    };
    const fillLayoutAttributes: FillLayout = {
        ...data.fill.rawLayoutAttributes
    };

    const borderPaintAttributes: LinePaint = {
        'line-color': data.border.color,
        'line-opacity': data.border.opacity,
        'line-width': data.border.width,
        ...data.border.rawPaintAttributes
    };
    const borderLayoutAttributes: LineLayout = {
        ...data.border.rawLayoutAttributes
    };

    return (
        <Source
            id={`${markerId}|source`}
            type="geojson"
            data={{
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'Polygon',
                    coordinates: [closedCoordinates.map(({ lng, lat }) => [lng, lat])]
                }
            }}
        >
            {data.fill.isFilled && (
                <Layer
                    id={`${markerId}|layer-fill`}
                    type="fill"
                    source={`${markerId}|source`}
                    paint={{ ...omitBy(fillPaintAttributes, isNil) }}
                    layout={{ ...omitBy(fillLayoutAttributes, isNil) }}
                    minzoom={0}
                    maxzoom={24}
                />
            )}
            {data.border.hasBorder && (
                <Layer
                    id={`${markerId}|layer-border`}
                    type="line"
                    source={`${markerId}|source`}
                    paint={{ ...omitBy(borderPaintAttributes, isNil) }}
                    layout={{ ...omitBy(borderLayoutAttributes, isNil) }}
                />
            )}
        </Source>
    );
};
