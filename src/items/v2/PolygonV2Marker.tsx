import { isNil, omitBy } from 'lodash';
import { FillLayout, FillPaint, LineLayout, LinePaint } from 'mapbox-gl';
import React, { RefObject, useEffect } from 'react';
import { Layer, MapRef, Source } from 'react-map-gl';
import { IPolygonV2WorldMarker } from '../../utils/world/worldTypes';

interface Props {
    mapRef: RefObject<MapRef>;
    marker: IPolygonV2WorldMarker;
    beforeId?: string;
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

    console.log('ordr', markerId, props.beforeId);

    const ids = {
        layer: markerId + '|layer',
        layerClick: markerId + '|clickable',
        border: markerId + '|layer-border',
        borderClick: markerId + '|clickable-border'
    };

    const getBeforeIds = () => {
        if (data.border.hasBorder) {
            if (props.marker.selectable) {
                return {
                    borderClick: props.beforeId,
                    border: ids.borderClick,
                    layerClick: ids.border,
                    layer: ids.layerClick
                };
            } else {
                return {
                    borderClick: undefined,
                    border: props.beforeId,
                    layerClick: undefined,
                    layer: ids.border
                };
            }
        } else {
            if (props.marker.selectable) {
                return {
                    borderClick: undefined,
                    border: undefined,
                    layerClick: props.beforeId,
                    layer: ids.layerClick
                };
            } else {
                return {
                    borderClick: undefined,
                    border: undefined,
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

        if (data.border.hasBorder) {
            map.moveLayer(ids.border, beforeIds.border);
            if (props.marker.selectable) {
                map.moveLayer(ids.borderClick, beforeIds.borderClick);
            }
        }

        if (props.marker.selectable) {
            map.moveLayer(ids.layerClick, beforeIds.layerClick);
        }

        map.moveLayer(ids.layer, beforeIds.layer);
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
            <>
                {data.border.hasBorder && (
                    <>
                        {props.marker.selectable && (
                            <Layer
                                id={ids.borderClick}
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
                            id={ids.border}
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
                        id={ids.layerClick}
                        beforeId={beforeIds.layerClick}
                        type="fill"
                        source={`${markerId}`}
                        paint={{
                            'fill-opacity': 0
                        }}
                    />
                )}
                <Layer
                    id={ids.layer}
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
