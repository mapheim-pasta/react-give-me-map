import { isNil, omitBy } from 'lodash';
import { LineLayout, LinePaint } from 'mapbox-gl';
import React from 'react';
import { Layer, Source } from 'react-map-gl';
import { ILineV2WorldMarker } from '../../utils/world/worldTypes';

interface Props {
    marker: ILineV2WorldMarker;
}

export const LineV2Marker = (props: Props): JSX.Element => {
    const markerId = props.marker.id;
    const data = props.marker.elementData;

    const paintAttributes: LinePaint = {
        'line-color': data.color,
        'line-width': data.width,
        'line-opacity': data.opacity,
        'line-dasharray':
            data.dashed?.isDashed && data.dashed?.lineLength && data.dashed?.gapLength
                ? [data.dashed.lineLength, data.dashed.gapLength]
                : undefined,
        ...data.rawPaintAttributes
    };

    const layoutAttributes: LineLayout = {
        ...data.rawLayoutAttributes
    };

    return (
        <Source
            id={`${markerId}`}
            type="geojson"
            data={{
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: data.coordinates.map(({ lng, lat }) => [lng, lat])
                }
            }}
        >
            <Layer
                id={`${markerId}|layer`}
                type="line"
                source="line"
                paint={{ ...omitBy(paintAttributes, isNil) }}
                layout={{ ...omitBy(layoutAttributes, isNil) }}
            />

            {props.marker.selectable && (
                <Layer
                    id={`${markerId}|clickable`}
                    type="line"
                    source="line"
                    paint={{ ...omitBy(paintAttributes, isNil), 'line-opacity': 0 }}
                    layout={{ ...omitBy(layoutAttributes, isNil) }}
                />
            )}
        </Source>
    );
};
