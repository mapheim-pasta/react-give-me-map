import { reverse } from 'lodash';
import React, { useEffect, useMemo } from 'react';
import { MapRef } from 'react-map-gl';
import { useCtx } from '../../context/dynamic/provider';
import { MarkerGlobalSettings } from '../../utils/map/mapTypes';
import { IVariantIconV2WorldMarker } from '../../utils/world/worldTypes';
import { VariantIconV2Marker } from './VariantIconV2Markers/VariantIconV2Marker';
import { useComputeMarkerSizes } from './VariantIconV2Markers/useComputeMarkerSizes';

interface Props {
    markers: IVariantIconV2WorldMarker[];
    highlightedMarkerIds?: string[];
    markerGlobalSettings: MarkerGlobalSettings['v2/variant_icon'];
    forceHighlightSelectableMarkers?: boolean;
    mapRef: React.RefObject<MapRef>;
    isEditMode: boolean;
}

export const VariantIconV2Markers = (props: Props) => {
    const { state } = useCtx();

    const markers = useMemo(() => props.markers.filter((e) => e.visible), [props.markers]);

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
                        onClick={(id) => state.callbacks.onMarkersSelected?.([id])}
                    />
                );
            })}
        </>
    );
};
