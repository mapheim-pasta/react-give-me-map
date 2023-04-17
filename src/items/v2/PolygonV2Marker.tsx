import { isNil, omitBy } from 'lodash';
import { FillLayout, FillPaint, LineLayout, LinePaint } from 'mapbox-gl';
import React, { RefObject, useEffect } from 'react';
import { Layer, MapRef, Source } from 'react-map-gl';
import { IPolygonV2WorldMarker } from '../../utils/world/worldTypes';

interface Props {
    mapRef: RefObject<MapRef>;
    marker: IPolygonV2WorldMarker;
    beforeId?: string;

    isHighlighted?: boolean;
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

    const layerIds = {
        layer: markerId + '|layer',
        layerClick: markerId + '|clickable',
        border: markerId + '|layer-border',
        borderClick: markerId + '|clickable-border',
        highlight: markerId + '|highlight'
    };

    const getBeforeIds = () => {
        if (props.isHighlighted) {
            if (data.border.hasBorder) {
                if (props.marker.selectable) {
                    return {
                        highlight: props.beforeId,
                        borderClick: layerIds.highlight,
                        border: layerIds.borderClick,
                        layerClick: layerIds.border,
                        layer: layerIds.layerClick
                    };
                } else {
                    return {
                        highlight: props.beforeId,
                        borderClick: undefined,
                        border: layerIds.highlight,
                        layerClick: undefined,
                        layer: layerIds.border
                    };
                }
            } else {
                if (props.marker.selectable) {
                    return {
                        highlight: props.beforeId,
                        borderClick: undefined,
                        border: undefined,
                        layerClick: layerIds.highlight,
                        layer: layerIds.layerClick
                    };
                } else {
                    return {
                        highlight: props.beforeId,
                        borderClick: undefined,
                        border: undefined,
                        layerClick: undefined,
                        layer: layerIds.highlight
                    };
                }
            }
        } else {
            if (data.border.hasBorder) {
                if (props.marker.selectable) {
                    return {
                        highlight: undefined,
                        borderClick: props.beforeId,
                        border: layerIds.borderClick,
                        layerClick: layerIds.border,
                        layer: layerIds.layerClick
                    };
                } else {
                    return {
                        highlight: undefined,
                        borderClick: undefined,
                        border: props.beforeId,
                        layerClick: undefined,
                        layer: layerIds.border
                    };
                }
            } else {
                if (props.marker.selectable) {
                    return {
                        highlight: undefined,
                        borderClick: undefined,
                        border: undefined,
                        layerClick: props.beforeId,
                        layer: layerIds.layerClick
                    };
                } else {
                    return {
                        highlight: undefined,
                        borderClick: undefined,
                        border: undefined,
                        layerClick: undefined,
                        layer: props.beforeId
                    };
                }
            }
        }
    };

    const beforeIds = getBeforeIds();

    useEffect(() => {
        const map = props.mapRef?.current;
        if (!map) {
            return;
        }

        if (props.isHighlighted) {
            map.moveLayer(layerIds.highlight, beforeIds.highlight);
        }

        if (data.border.hasBorder) {
            map.moveLayer(layerIds.border, beforeIds.border);
            if (props.marker.selectable) {
                map.moveLayer(layerIds.borderClick, beforeIds.borderClick);
            }
        }

        if (props.marker.selectable) {
            map.moveLayer(layerIds.layerClick, beforeIds.layerClick);
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
                    type: 'Polygon',
                    coordinates: [closedCoordinates.map(({ lng, lat }) => [lng, lat])]
                }
            }}
        >
            {props.isHighlighted && (
                <Layer
                    id={layerIds.highlight}
                    beforeId={beforeIds.highlight}
                    type="line"
                    source={markerId}
                    paint={{
                        ...omitBy(borderPaintAttributes, isNil),
                        'line-width': Math.max(Number(borderPaintAttributes['line-width']) / 3, 6),
                        'line-color': '#F8E71C',
                        'line-offset': -Number(borderPaintAttributes['line-width']) / 2,
                        'line-opacity': 1,
                        'line-blur': 4
                    }}
                    layout={{ ...omitBy(borderLayoutAttributes, isNil) }}
                />
            )}
            <>
                {data.border.hasBorder && (
                    <>
                        {props.marker.selectable && (
                            <Layer
                                id={layerIds.borderClick}
                                type="line"
                                beforeId={beforeIds.borderClick}
                                source={`${markerId}`}
                                paint={{
                                    ...omitBy(borderPaintAttributes, isNil),
                                    'line-opacity': 0
                                }}
                                layout={{ ...omitBy(borderLayoutAttributes, isNil) }}
                            />
                        )}
                        <Layer
                            id={layerIds.border}
                            type="line"
                            beforeId={beforeIds.border}
                            source={`${markerId}`}
                            paint={{ ...omitBy(borderPaintAttributes, isNil) }}
                            layout={{ ...omitBy(borderLayoutAttributes, isNil) }}
                        />
                    </>
                )}
                {props.marker.selectable && (
                    <Layer
                        id={layerIds.layerClick}
                        beforeId={beforeIds.layerClick}
                        type="fill"
                        source={`${markerId}`}
                        paint={{
                            'fill-opacity': 0
                        }}
                    />
                )}
                <Layer
                    id={layerIds.layer}
                    beforeId={beforeIds.layer}
                    type="fill"
                    source={`${markerId}`}
                    paint={{ 'fill-opacity': 0, ...omitBy(fillPaintAttributes, isNil) }}
                    layout={{ ...omitBy(fillLayoutAttributes, isNil) }}
                />
            </>
        </Source>
    );
};
