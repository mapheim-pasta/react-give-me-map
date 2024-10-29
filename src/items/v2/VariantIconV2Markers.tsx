import { reverse } from 'lodash';
import React, { useEffect, useMemo } from 'react';
import { MapRef } from 'react-map-gl';
import Supercluster from 'supercluster';
import { useCtx } from '../../context/dynamic/provider';
import { ICallbacks } from '../../map/RegisterPropsToGlobalState';
import { MarkerGlobalSettings } from '../../utils/map/mapTypes';
import { isDefined } from '../../utils/typecheck/isDefined';
import { IVariantIconV2WorldMarker } from '../../utils/world/worldTypes';
import { ClusterMarker } from './VariantIconV2Markers/ClusterMarker';
import { VariantIconV2Marker } from './VariantIconV2Markers/VariantIconV2Marker';
import { useComputeMarkerSizes } from './VariantIconV2Markers/useComputeMarkerSizes';

interface Props {
    markers: IVariantIconV2WorldMarker[];
    highlightedMarkerIds?: string[];
    markerGlobalSettings: MarkerGlobalSettings['v2/variant_icon'];
    forceHighlightSelectableMarkers?: boolean;
    mapRef: React.RefObject<MapRef>;
    isEditMode: boolean;
    callbacks: ICallbacks;
    language: string;
}

const useDivideMarkersAndClusters = (markers: IVariantIconV2WorldMarker[], isEditMode: boolean) => {
    const superclusterObj = new Supercluster({
        log: true,
        radius: 60,
        extent: 256,
        minZoom: 24,
        maxZoom: 24
    }).load(
        markers.map((e) => ({
            type: 'Feature',
            properties: {
                markerId: e.id
            },
            geometry: {
                type: 'Point',
                coordinates: [e.lng, e.lat]
            }
        }))
    );

    if (isEditMode) {
        return {
            markers,
            clusters: [],
            getMarkersInCluster: (clusterId: number) => {
                return [clusterId.toString()];
            }
        };
    }

    const superclusterResult = superclusterObj.getClusters([-180, -90, 180, 90], 24);
    const markerIdsWithotClusters = new Set<string>(
        superclusterResult.map((e) => e.properties.markerId).filter(isDefined)
    );

    const pointsWithoutClusters = markers.filter((m) => markerIdsWithotClusters.has(m.id));
    const clusters = superclusterResult
        .filter((e) => e.properties.cluster)
        .map((e) => ({
            clusterId: e.properties.cluster_id,
            pointCount: e.properties.point_count,
            pointCountLabel: e.properties.point_count_abbreviated,
            coordinates: {
                lng: e.geometry.coordinates[0],
                lat: e.geometry.coordinates[1]
            }
        }));
    return {
        markers: pointsWithoutClusters,
        clusters,
        getMarkersInCluster: (clusterId: number) => {
            return superclusterObj
                .getLeaves(clusterId)
                .map((e) => e.properties.markerId)
                .filter(isDefined);
        }
    };
};

export const VariantIconV2Markers = (props: Props) => {
    const { state } = useCtx();

    const markersBeforeCluster = useMemo(
        () => props.markers.filter((e) => e.visible),
        [props.markers]
    );

    const { markers, clusters, getMarkersInCluster } = useDivideMarkersAndClusters(
        markersBeforeCluster,
        props.isEditMode
    );

    const markerSizes = useComputeMarkerSizes({
        markers: markers,
        highlightedMarkerIds: props.highlightedMarkerIds,
        mapRef: props.mapRef,
        collisionPaddingLarge: props.markerGlobalSettings.collisionPaddingLarge,
        collisionPaddingMiddle: props.markerGlobalSettings.collisionPaddingMiddle
    });

    useEffect(() => {
        markerSizes.triggerUpdateImmediately();
    }, []);

    useEffect(() => {
        function triggerUpdate() {
            markerSizes.triggerUpdate();
        }

        props.mapRef?.current?.on('zoom', triggerUpdate);
        props.mapRef?.current?.on('moveend', triggerUpdate);
        return () => {
            props.mapRef?.current?.off('zoom', triggerUpdate);
            props.mapRef?.current?.off('moveend', triggerUpdate);
        };
    }, [props.mapRef?.current, markers]);

    useEffect(() => {
        markerSizes.triggerUpdateImmediately();
    }, [props.highlightedMarkerIds?.join(';'), markers.length]);

    return (
        <>
            {clusters.map((cluster) => {
                getMarkersInCluster(cluster.clusterId);
                return (
                    <ClusterMarker
                        key={cluster.clusterId}
                        pointCount={cluster.pointCount}
                        isActive={false}
                        isWide={state.isWide}
                        fonts={state.fonts}
                        mapRef={props.mapRef}
                        clusterId={cluster.clusterId}
                        lng={cluster.coordinates.lng}
                        lat={cluster.coordinates.lat}
                        forceHighlightSelectableMarkers={
                            props.forceHighlightSelectableMarkers ?? false
                        }
                        onClick={() => {
                            const markerIds = getMarkersInCluster(cluster.clusterId);
                            props.callbacks.onMarkersSelected?.(markerIds);
                        }}
                        selectable
                    />
                );
            })}
            {reverse(markers).map((marker) => {
                function getImage() {
                    if (marker.elementData.useStoryImage) {
                        return {
                            type: 'story' as const,
                            url: marker.elementData.storyImageUrl
                        };
                    }

                    return {
                        type: 'category' as const,
                        url: marker.elementData.imageUrl
                    };
                }

                const isActive = props.highlightedMarkerIds?.includes(marker.id) ?? false;

                return (
                    <VariantIconV2Marker
                        isActive={isActive}
                        forceHighlightSelectableMarkers={
                            props.forceHighlightSelectableMarkers ?? false
                        }
                        image={getImage()}
                        isWide={state.isWide}
                        mapRef={props.mapRef}
                        eventDate={marker.elementData.eventDate}
                        language={props.language}
                        isEditMode={props.isEditMode}
                        key={marker.id}
                        lat={marker.lat}
                        lng={marker.lng}
                        withStar={marker.elementData.withStar}
                        orderNumber={marker.elementData.circleText?.trim()}
                        selectable={marker.selectable ?? false}
                        size={markerSizes.sizes.get(marker.id)}
                        markerId={marker.id}
                        markerGlobalSettings={props.markerGlobalSettings}
                        fonts={state.fonts}
                        text={marker.elementData.text}
                        color={marker.elementData.color}
                        onClick={(id) => props.callbacks.onMarkersSelected?.([id])}
                    />
                );
            })}
        </>
    );
};
