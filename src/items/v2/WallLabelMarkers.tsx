import { isNil, omitBy } from 'lodash';
import { SymbolLayout, SymbolPaint } from 'mapbox-gl';
import React from 'react';
import { Source } from 'react-map-gl';
import { EmptyLayer } from './EmptyLayer';
import { IconLayers } from './IconV2Markers/IconLayers';

export interface WallLabelDataPoint {
    id: string;
    wallMarkerId: string;
    lat: number;
    lng: number;
    label: string;
    visible: boolean;
}

function getSourceFeaturesForWallLabels(
    dataPoints: WallLabelDataPoint[],
    highlightedMarkerIds: string[]
) {
    return (
        dataPoints
            .filter((e) => e.visible)
            .map((data, i) => {
                const isHighlighted = highlightedMarkerIds.includes(data.wallMarkerId);
                const paintAttributes: SymbolPaint = {
                    'text-color': '#000',
                    'text-halo-blur': isHighlighted ? 2 : 1,
                    'text-halo-color': isHighlighted ? '#F8E71C' : '#fff',
                    'text-halo-width': isHighlighted ? 1 : 1
                };

                const layoutAttributes: SymbolLayout = {
                    'text-field': data.label,
                    'text-size': 12,
                    'symbol-z-order': 'source'
                };

                return {
                    type: 'Feature' as const,
                    properties: {
                        markerId: data.wallMarkerId,
                        clickable: '1',
                        layout: omitBy(layoutAttributes, isNil),
                        paint: omitBy(paintAttributes, isNil)
                    },
                    geometry: {
                        type: 'Point' as const,
                        coordinates: [data.lng, data.lat, i]
                    }
                };
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((e): e is GeoJSON.Feature<GeoJSON.Point, any> => Boolean(e))
    );
}

export const WallLabelMarkers = (props: {
    dataPoints: WallLabelDataPoint[];
    highlightedMarkerIds: string[];
    beforeId: string;
}) => {
    const layerIds = {
        icons: 'wall_labels|layer',
        iconsClickable: 'wall_labels|clickable',
        last: 'wall_labels|last'
    };

    const beforeIds = {
        icons: props.beforeId,
        iconsClickable: layerIds.icons,
        last: layerIds.iconsClickable
    };

    const globalLayoutProps = {
        'text-font': ['Open Sans Semibold'],
        'text-allow-overlap': false,
        'text-optional': true,
        'text-padding': 0
    };

    const sourceFeatures = getSourceFeaturesForWallLabels(
        props.dataPoints,
        props.highlightedMarkerIds
    );

    return (
        <>
            <Source
                id="wall_labels"
                type="geojson"
                data={{
                    type: 'FeatureCollection' as const,
                    features: sourceFeatures
                }}
                cluster={false}
            >
                <IconLayers
                    source={'wall_labels'}
                    layerIds={{
                        icons: layerIds.icons,
                        iconsClickable: layerIds.iconsClickable
                    }}
                    beforeIds={{
                        icons: beforeIds.icons,
                        iconsClickable: beforeIds.iconsClickable
                    }}
                    globalLayoutProps={globalLayoutProps}
                />
                <EmptyLayer id={layerIds.last} beforeId={beforeIds.last} />
            </Source>
        </>
    );
};
