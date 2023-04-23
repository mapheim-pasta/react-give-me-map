import { isNil, omitBy } from 'lodash';
import { SymbolLayout, SymbolPaint } from 'mapbox-gl';
import React, { RefObject, useEffect, useState } from 'react';
import { MapRef, Source } from 'react-map-gl';
import { useLoadMapImages } from '../../hooks/map/useLoadMapImages';
import { IIconV2WorldMarker } from '../../utils/world/worldTypes';
import { EmptyLayer } from './EmptyLayer';
import { ClusterLayers, GroupMarkerProps } from './IconV2Markers/ClusterLayers';
import { IconLayers } from './IconV2Markers/IconLayers';

export function getSourceFeaturesForIcons(markers: IIconV2WorldMarker[]) {
    return (
        markers
            .filter((e) => e.visible)
            .map((marker, i) => {
                const data = marker.elementData;

                const paintAttributes: SymbolPaint = {
                    'text-color': data.textColor,
                    ...data.rawPaintAttributes
                };

                const layoutAttributes: SymbolLayout = {
                    'text-field': data.text,
                    'text-size': data.textSize,
                    'icon-image': data.imageUrl,
                    'icon-size': data.imageSize,
                    'icon-anchor': 'bottom',
                    'text-anchor': 'top',
                    ...data.rawLayoutAttributes
                };

                return {
                    type: 'Feature' as const,
                    properties: {
                        markerId: marker.id,
                        clickable: marker.selectable ? '1' : '0',
                        layout: omitBy(layoutAttributes, isNil),
                        paint: omitBy(paintAttributes, isNil)
                    },
                    geometry: {
                        type: 'Point' as const,
                        coordinates: [data.position.lng, data.position.lat, i]
                    }
                };
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((e): e is GeoJSON.Feature<GeoJSON.Point, any> => Boolean(e))
    );
}

export const IconV2Markers = (props: {
    mapRef: RefObject<MapRef>;
    markers: IIconV2WorldMarker[];
    groupMarkerProps: GroupMarkerProps;
    beforeId?: string;
}) => {
    const [areImagesLoaded, setAreImagesLoaded] = useState(false);

    const imageUrls = props.markers.map((marker) => marker.elementData.imageUrl);

    const layerIds = {
        icons: 'icons|layer',
        iconsClickable: 'icons|clickable',
        clusterCount: 'icons|cluster-count',
        cluster: 'icons|cluster',
        last: 'icons|last'
    };

    const beforeIds = {
        icons: props.beforeId,
        iconsClickable: layerIds.icons,
        clusterCount: layerIds.iconsClickable,
        cluster: layerIds.clusterCount,
        last: layerIds.cluster
    };

    useEffect(() => {
        if (props.mapRef.current && areImagesLoaded) {
            props.mapRef.current.moveLayer(layerIds.icons, beforeIds.icons);
            props.mapRef.current.moveLayer(layerIds.iconsClickable, beforeIds.iconsClickable);
            props.mapRef.current.moveLayer(layerIds.clusterCount, beforeIds.clusterCount);
            props.mapRef.current.moveLayer(layerIds.cluster, beforeIds.cluster);
            props.mapRef.current.moveLayer(layerIds.last, beforeIds.last);
        }
    }, [props.beforeId, props.mapRef?.current, areImagesLoaded]);

    useLoadMapImages({
        mapRef: props.mapRef,
        imageUrls,
        onLoad: () => {
            setAreImagesLoaded(true);
        }
    });

    const globalLayoutProps = {
        'text-font': ['Open Sans Bold'],
        'text-allow-overlap': true,
        'icon-allow-overlap': true
    };

    const sourceFeatures = getSourceFeaturesForIcons(props.markers);

    return (
        <>
            <Source
                id="icons"
                type="geojson"
                data={{
                    type: 'FeatureCollection' as const,
                    features: sourceFeatures
                }}
                cluster={true}
                clusterMaxZoom={10}
                clusterRadius={50}
            >
                <IconLayers
                    layerIds={{ icons: layerIds.icons, iconsClickable: layerIds.iconsClickable }}
                    beforeIds={{ icons: beforeIds.icons, iconsClickable: beforeIds.iconsClickable }}
                    globalLayoutProps={globalLayoutProps}
                />
                <ClusterLayers
                    layerIds={{ cluster: layerIds.cluster, clusterCount: layerIds.clusterCount }}
                    beforeIds={{ cluster: beforeIds.cluster, clusterCount: beforeIds.clusterCount }}
                    groupMarkerStyle={props.groupMarkerProps}
                />
                <EmptyLayer id={layerIds.last} beforeId={beforeIds.last} />
            </Source>
        </>
    );
};
