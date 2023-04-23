import { isNil, omitBy } from 'lodash';
import { FillLayout, FillPaint, LineLayout, LinePaint } from 'mapbox-gl';
import React, { RefObject, useEffect } from 'react';
import { Layer, MapRef, Source } from 'react-map-gl';
import { IPolygonV2WorldMarker } from '../../utils/world/worldTypes';
import { EmptyLayer } from './EmptyLayer';

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
        ...data.fill.rawLayoutAttributes,
        visibility:
            props.marker.visible && props.marker.elementData.fill.isFilled ? 'visible' : 'none'
    };

    const borderPaintAttributes: LinePaint = {
        'line-color': data.border.color,
        'line-opacity': data.border.opacity,
        'line-width': data.border.width,
        ...data.border.rawPaintAttributes
    };
    const borderLayoutAttributes: LineLayout = {
        ...data.border.rawLayoutAttributes,
        visibility: props.marker.visible ? 'visible' : 'none'
    };

    const layerIds = {
        layer: markerId + '|layer',
        layerClick: markerId + '|clickable',
        border: markerId + '|layer-border',
        borderClick: markerId + '|clickable-border',
        highlight: markerId + '|highlight',
        last: markerId + '|last'
    };

    const beforeIds = {
        layer: props.beforeId,
        layerClick: layerIds.layer,
        border: layerIds.layerClick,
        borderClick: layerIds.border,
        highlight: layerIds.borderClick,
        last: layerIds.highlight
    };

    useEffect(() => {
        if (props.mapRef.current) {
            props.mapRef.current.moveLayer(layerIds.layer, beforeIds.layer);
            props.mapRef.current.moveLayer(layerIds.layerClick, beforeIds.layerClick);
            props.mapRef.current.moveLayer(layerIds.border, beforeIds.border);
            props.mapRef.current.moveLayer(layerIds.borderClick, beforeIds.borderClick);
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
                properties: {},
                geometry: {
                    type: 'Polygon',
                    coordinates: [closedCoordinates.map(({ lng, lat }) => [lng, lat])]
                }
            }}
        >
            <>
                <Layer
                    id={layerIds.layer}
                    beforeId={beforeIds.layer}
                    type="fill"
                    source={`${markerId}`}
                    paint={{ ...omitBy(fillPaintAttributes, isNil) }}
                    layout={{ ...omitBy(fillLayoutAttributes, isNil) }}
                />
                {props.marker.selectable ? (
                    <Layer
                        id={layerIds.layerClick}
                        beforeId={beforeIds.layerClick}
                        type="fill"
                        source={`${markerId}`}
                        paint={{
                            'fill-opacity': 0
                        }}
                    />
                ) : (
                    <EmptyLayer id={layerIds.layerClick} beforeId={beforeIds.layerClick} />
                )}
                {data.border.hasBorder ? (
                    <Layer
                        id={layerIds.border}
                        type="line"
                        beforeId={beforeIds.border}
                        source={`${markerId}`}
                        paint={{ ...omitBy(borderPaintAttributes, isNil) }}
                        layout={{ ...omitBy(borderLayoutAttributes, isNil) }}
                    />
                ) : (
                    <EmptyLayer id={layerIds.border} beforeId={beforeIds.border} />
                )}
                {data.border.hasBorder && props.marker.selectable ? (
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
                ) : (
                    <EmptyLayer id={layerIds.borderClick} beforeId={beforeIds.borderClick} />
                )}
                {props.isHighlighted ? (
                    <Layer
                        id={layerIds.highlight}
                        beforeId={beforeIds.highlight}
                        type="line"
                        source={markerId}
                        paint={{
                            ...omitBy(borderPaintAttributes, isNil),
                            'line-width': Math.max(
                                Number(borderPaintAttributes['line-width']) / 3,
                                6
                            ),
                            'line-color': '#F8E71C',
                            'line-offset': -Number(borderPaintAttributes['line-width']) / 2,
                            'line-opacity': 1,
                            'line-blur': 4
                        }}
                        layout={{ ...omitBy(borderLayoutAttributes, isNil) }}
                    />
                ) : (
                    <EmptyLayer id={layerIds.highlight} beforeId={beforeIds.highlight} />
                )}
                <EmptyLayer id={layerIds.last} beforeId={beforeIds.last} />
            </>
        </Source>
    );
};
