import { isNil, omitBy } from 'lodash';
import { LineLayout, LinePaint } from 'mapbox-gl';
import React, { RefObject, useEffect } from 'react';
import { Layer, MapRef, Source } from 'react-map-gl';
import { ILineV2WorldMarker } from '../../utils/world/worldTypes';
import { EmptyLayer } from './EmptyLayer';

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
        highlight2: markerId + '|highlight2',
        last: markerId + '|last'
    };

    const beforeIds = {
        layer: props.beforeId,
        layerClick: layerIds.layer,
        highlight1: layerIds.layerClick,
        highlight2: layerIds.highlight1,
        last: layerIds.highlight2
    };

    useEffect(() => {
        if (props.mapRef.current) {
            props.mapRef.current.moveLayer(layerIds.layer, beforeIds.layer);
            props.mapRef.current.moveLayer(layerIds.layerClick, beforeIds.layerClick);
            props.mapRef.current.moveLayer(layerIds.highlight1, beforeIds.highlight1);
            props.mapRef.current.moveLayer(layerIds.highlight2, beforeIds.highlight2);
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
                    type: 'LineString',
                    coordinates: data.coordinates.map(({ lng, lat }) => [lng, lat])
                }
            }}
        >
            <Layer
                id={layerIds.layer}
                beforeId={beforeIds.layer}
                type="line"
                source={markerId}
                paint={{ ...omitBy(paintAttributes, isNil) }}
                layout={{ ...omitBy(layoutAttributes, isNil) }}
            />
            {props.marker.selectable ? (
                <Layer
                    id={layerIds.layerClick}
                    beforeId={beforeIds.layerClick}
                    type="line"
                    source={markerId}
                    paint={{ ...omitBy(paintAttributes, isNil), 'line-opacity': 0 }}
                    layout={{ ...omitBy(layoutAttributes, isNil) }}
                />
            ) : (
                <EmptyLayer id={layerIds.layerClick} beforeId={beforeIds.layerClick} />
            )}
            {props.isHighlighted ? (
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
            ) : (
                <>
                    <EmptyLayer id={layerIds.highlight1} beforeId={beforeIds.highlight1} />
                    <EmptyLayer id={layerIds.highlight2} beforeId={beforeIds.highlight2} />
                </>
            )}

            <EmptyLayer id={layerIds.last} beforeId={beforeIds.last} />
        </Source>
    );
};
