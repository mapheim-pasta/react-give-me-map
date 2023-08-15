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
import { automoveMarkers } from './automoveMarkers';

export function getSourceFeaturesForIcons(
    markers: IIconV2WorldMarker[],
    highlightedMarkerIds?: string[]
) {
    return (
        markers
            .filter((e) => e.visible)
            .map((marker, i) => {
                const data = marker.elementData;
                const isHighlighted = highlightedMarkerIds?.includes(marker.id);

                const paintAttributes: SymbolPaint = {
                    'text-color': data.textColor,
                    'text-halo-blur': isHighlighted ? 2 : 1,
                    'text-halo-color': isHighlighted ? '#F8E71C' : data.textHaloColor,
                    'text-halo-width': isHighlighted ? 1 : data.textHaloWidth,
                    ...data.rawPaintAttributes
                };

                const layoutAttributes: SymbolLayout = {
                    'text-field': data.text,
                    'text-size': data.textSize,
                    'icon-image': data.imageUrl,
                    'icon-size': data.imageSize,
                    'text-offset': [0, 0.3],
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
    highlightedMarkerIds?: string[];
}) => {
    const [areImagesLoaded, setAreImagesLoaded] = useState(false);
    const [temporaryEmptyRender, setTemporaryEmptyRender] = useState(false);

    const mapRef = props.mapRef.current;
    const imageUrls = props.markers
        .map((marker) => marker.elementData.imageUrl)
        .filter((e) => e && !e.startsWith('temp-icon'));

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
        if (mapRef && areImagesLoaded) {
            const mapRef = props.mapRef.current;
            automoveMarkers({ layerIds, beforeIds, mapRef });
        }
    }, [props.beforeId, props.mapRef?.current]);

    useLoadMapImages({
        mapRef: props.mapRef,
        imageUrls,
        hash: props.markers.length,
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

    // Hack for placing the first marker
    useUpdateEffect(() => {
        if (props.markers.length === 1) {
            setTimeout(() => {
                setTemporaryEmptyRender(true);
            }, 500);
        }
    }, [props.markers.length]);

    useEffect(() => {
        if (temporaryEmptyRender) {
            setTemporaryEmptyRender(false);
        }
    }, [temporaryEmptyRender]);

    const autoHideIconsProps = {
        'text-allow-overlap': false,
        'text-optional': true,
        'text-padding': 2
    };

    const globalLayoutProps = {
        'text-font': ['Open Sans Bold'],
        'text-allow-overlap': true,
        'icon-allow-overlap': true,
        ...(props.groupMarkerProps?.autoHideIcons ? autoHideIconsProps : {})
    };

    const sourceFeatures = getSourceFeaturesForIcons(props.markers, props.highlightedMarkerIds);

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
