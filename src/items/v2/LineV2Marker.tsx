import { isNil, omitBy } from 'lodash';
import { LineLayout, LinePaint } from 'mapbox-gl';
import React, { RefObject, useEffect } from 'react';
import { Layer, MapRef, Source } from 'react-map-gl';
import { ILineV2WorldMarker } from '../../utils/world/worldTypes';

interface Props {
    mapRef: RefObject<MapRef>;
    marker: ILineV2WorldMarker;

    beforeId?: string;

    isHighlighted?: boolean;
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

    const layerIds = {
        layer: markerId + '|layer',
        layerClick: markerId + '|clickable',
        highlight1: markerId + '|highlight1',
        highlight2: markerId + '|highlight2'
    };

    const getBeforeIds = () => {
        if (props.isHighlighted) {
            if (props.marker.selectable) {
                return {
                    highlight1: props.beforeId,
                    highlight2: layerIds.highlight1,
                    layerClick: layerIds.highlight2,
                    layer: layerIds.layerClick
                };
            } else {
                return {
                    highlight1: props.beforeId,
                    highlight2: layerIds.highlight1,
                    layerClick: undefined,
                    layer: layerIds.highlight2
                };
            }
        } else {
            if (props.marker.selectable) {
                return {
                    highlight1: undefined,
                    highlight2: undefined,
                    layerClick: props.beforeId,
                    layer: layerIds.layerClick
                };
            } else {
                return {
                    highlight1: undefined,
                    highlight2: undefined,
                    layerClick: undefined,
                    layer: props.beforeId
                };
            }
        }
    };

    const beforeIds = getBeforeIds();

    useEffect(() => {
        const map = props.mapRef?.current;
        if (!map) {
            return;
        }

        if (props.marker.selectable) {
            map.moveLayer(layerIds.layerClick, beforeIds.layerClick);
        }
        if (props.isHighlighted) {
            map.moveLayer(layerIds.highlight1, beforeIds.highlight1);
            map.moveLayer(layerIds.highlight2, beforeIds.highlight2);
        }

        map.moveLayer(layerIds.layer, beforeIds.layer);
    }, [props.beforeId, props.mapRef]);

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
            {props.isHighlighted && (
                <>
                    <Layer
                        id={layerIds.highlight1}
                        beforeId={beforeIds.highlight1}
                        type="line"
                        source={markerId}
                        paint={{
                            ...omitBy(paintAttributes, isNil),
                            'line-width': Math.max(Number(paintAttributes['line-width']) / 6, 3),
                            'line-color': '#F8E71C',
                            'line-opacity': 1,
                            'line-offset': -Number(paintAttributes['line-width']) / 2,
                            'line-blur': 4
                        }}
                        layout={{ ...omitBy(layoutAttributes, isNil) }}
                    />
                    <Layer
                        id={layerIds.highlight2}
                        beforeId={beforeIds.highlight2}
                        type="line"
                        source={markerId}
                        paint={{
                            ...omitBy(paintAttributes, isNil),
                            'line-width': Math.max(Number(paintAttributes['line-width']) / 6, 3),
                            'line-color': '#F8E71C',
                            'line-opacity': 1,
                            'line-offset': Number(paintAttributes['line-width']) / 2,
                            'line-blur': 4
                        }}
                        layout={{ ...omitBy(layoutAttributes, isNil) }}
                    />
                </>
            )}
            {props.marker.selectable && (
                <Layer
                    id={layerIds.layerClick}
                    beforeId={beforeIds.layerClick}
                    type="line"
                    source={markerId}
                    paint={{ ...omitBy(paintAttributes, isNil), 'line-opacity': 0 }}
                    layout={{ ...omitBy(layoutAttributes, isNil) }}
                />
            )}
            <Layer
                id={layerIds.layer}
                beforeId={beforeIds.layer}
                type="line"
                source={markerId}
                paint={{ ...omitBy(paintAttributes, isNil) }}
                layout={{ ...omitBy(layoutAttributes, isNil) }}
            />
        </Source>
    );
};
