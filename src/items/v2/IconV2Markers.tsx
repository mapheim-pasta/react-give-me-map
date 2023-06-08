import { isNil, omitBy } from 'lodash';
import { SymbolLayout, SymbolPaint } from 'mapbox-gl';
import React, { RefObject, useEffect, useState } from 'react';
import { MapRef, Source } from 'react-map-gl';
import { useUpdateEffect } from '../../hooks/general/useUpdateEffect';
import { useLoadMapImages } from '../../hooks/map/useLoadMapImages';
import { GroupMarkerProps } from '../../utils/map/mapTypes';
import { IIconV2WorldMarker } from '../../utils/world/worldTypes';
import { EmptyLayer } from './EmptyLayer';
import { ClusterLayers } from './IconV2Markers/ClusterLayers';
import { IconLayers } from './IconV2Markers/IconLayers';

export function getSourceFeaturesForIcons(markers: IIconV2WorldMarker[]) {
    return (
        markers
            .filter((e) => e.visible)
            .map((marker, i) => {
                const data = marker.elementData;

                const paintAttributes: SymbolPaint = {
                    'text-color': data.textColor,
                    'text-halo-blur': 1,
                    'text-halo-color': data.textHaloColor,
                    'text-halo-width': data.textHaloWidth,
                    ...data.rawPaintAttributes
                };

                const layoutAttributes: SymbolLayout = {
                    'text-field': data.text,
                    'text-size': data.textSize,
                    'icon-image': data.imageUrl,
                    'icon-size': data.imageSize,
                    'text-offset': [0, 0.2],
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
                        coordinates: [marker.lng, marker.lat, i]
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
    const [temporaryEmptyRender, setTemporaryEmptyRender] = useState(false);

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
    }, [props.beforeId, props.mapRef?.current]);

    useLoadMapImages({
        mapRef: props.mapRef,
        imageUrls,
        onLoad: () => {
            if (props.markers?.length) {
                setAreImagesLoaded(true);
            }
        }
    });

    useUpdateEffect(() => {
        setTimeout(() => {
            setTemporaryEmptyRender(true);
        }, 500);
    }, [props.groupMarkerProps?.clusterMaxZoom, props.groupMarkerProps.clusterRadius]);

    useEffect(() => {
        if (temporaryEmptyRender) {
            setTemporaryEmptyRender(false);
        }
    }, [temporaryEmptyRender]);

    const globalLayoutProps = {
        'text-font': ['Open Sans Bold'],
        'text-allow-overlap': true,
        'icon-allow-overlap': true
    };

    const sourceFeatures = getSourceFeaturesForIcons(props.markers);

    if (!areImagesLoaded || temporaryEmptyRender) {
        return (
            <>
                <EmptyLayer id={layerIds.icons} beforeId={beforeIds.icons} />
                <EmptyLayer id={layerIds.iconsClickable} beforeId={beforeIds.iconsClickable} />
                <EmptyLayer id={layerIds.clusterCount} beforeId={beforeIds.clusterCount} />
                <EmptyLayer id={layerIds.cluster} beforeId={beforeIds.cluster} />
                <EmptyLayer id={layerIds.last} beforeId={beforeIds.last} />
            </>
        );
    }

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
                clusterMaxZoom={props.groupMarkerProps?.clusterMaxZoom ?? 20}
                clusterRadius={props.groupMarkerProps.clusterRadius ?? 50}
            >
                {areImagesLoaded && (
                    <>
                        <IconLayers
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
                        <ClusterLayers
                            layerIds={{
                                cluster: layerIds.cluster,
                                clusterCount: layerIds.clusterCount
                            }}
                            beforeIds={{
                                cluster: beforeIds.cluster,
                                clusterCount: beforeIds.clusterCount
                            }}
                            groupMarkerStyle={props.groupMarkerProps}
                        />
                        <EmptyLayer id={layerIds.last} beforeId={beforeIds.last} />
                    </>
                )}
            </Source>
        </>
    );
};
