import { SymbolLayout, SymbolPaint } from 'mapbox-gl';
import React, { RefObject, useEffect } from 'react';
import { Layer, LayerProps, MapRef, Source } from 'react-map-gl';
import { useLoadMapImages } from '../../hooks/map/useLoadMapImages';
import { IIndoorStandWorldMarker } from '../../utils/world/worldTypes';
import { EmptyLayer } from './EmptyLayer';
import { automoveMarkers } from './automoveMarkers';

const zoomStepMiddle = 18;
const zoomStepMax = 19;

export function getSourceFeaturesForIndoorStands(
    markers: IIndoorStandWorldMarker[],
    highlightedMarkerIds?: string[],
    orderedMarkerIds?: string[]
) {
    function getMarkerSortKey(markerId: string) {
        const isHighlighted = highlightedMarkerIds?.includes(markerId);
        if (isHighlighted) {
            return 1;
        } else {
            const orderedIndex = orderedMarkerIds?.indexOf(markerId);
            if (orderedIndex !== -1) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return (orderedIndex as any) + 2;
            } else {
                return 10000;
            }
        }
    }

    return (
        markers
            .filter((e) => e.visible)
            .map((marker, i) => {
                const data = marker.elementData;
                const isHighlighted = highlightedMarkerIds?.includes(marker.id);

                const getImageSrc = () => {
                    if (data.logoGeneratedImageUrl) {
                        return data.imageSrc;
                    }
                    if (data.imageSrc?.startsWith('temp-icon')) {
                        return data.pinSrc;
                    }
                    return data.imageSrc ?? data.pinSrc;
                };

                const imageSrc = getImageSrc();

                const pinZoom = 1.5;
                const logoZoom = 0.2;

                return {
                    type: 'Feature' as const,
                    properties: {
                        markerId: marker.id,
                        clickable: marker.selectable ? '1' : '0',
                        text: data.text,
                        textColor: data.textColor,
                        pinSrc: data.pinSrc,
                        imageSrc,
                        symbolSortKey: getMarkerSortKey(marker.id),
                        textHaloBlur: isHighlighted ? 2 : 1,
                        textHaloColor: isHighlighted ? '#F8E71C' : data.textHaloColor,
                        textHaloWidth: isHighlighted ? 1 : data.textHaloWidth,
                        fullScaleZoom:
                            data.imageSrc && data.imageSrc === imageSrc ? pinZoom : logoZoom
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

export const IndoorStandMarkers = (props: {
    mapRef: RefObject<MapRef>;
    markers: IIndoorStandWorldMarker[];
    beforeId?: string;
    highlightedMarkerIds?: string[];
    standScale: number;
    orderedMarkerIds?: string[];
}) => {
    const mapRef = props.mapRef.current;
    const pinUrls = props.markers
        .map((marker) => marker.elementData.pinSrc)
        .filter((e) => e && !e.startsWith('temp-icon'))
        .filter(Boolean);
    const imageUrls = props.markers
        .map((marker) => marker.elementData.imageSrc)
        .filter((e) => e && !e.startsWith('temp-icon'))
        .filter(Boolean);

    const layerIds = {
        layer: 'indoor_stands|layer',
        layerClickable: 'indoor_stands|clickable',
        last: 'indoor_stands|last'
    };

    const beforeIds = {
        layer: props.beforeId,
        layerClickable: layerIds.layer,
        last: layerIds.layerClickable
    };

    useEffect(() => {
        if (mapRef && areImagesLoaded) {
            const mapRef = props.mapRef.current;
            automoveMarkers({ layerIds, beforeIds, mapRef });
        }
    }, [props.beforeId, props.mapRef?.current]);

    const { isLoaded: areImagesLoaded } = useLoadMapImages({
        mapRef: props.mapRef,
        imageUrls: [...pinUrls, ...imageUrls]
    });

    const sourceFeatures = getSourceFeaturesForIndoorStands(
        props.markers,
        props.highlightedMarkerIds,
        props.orderedMarkerIds
    );

    const layout: SymbolLayout = {
        'symbol-z-order': 'source',
        'symbol-sort-key': ['get', 'symbolSortKey'],
        'text-allow-overlap': false,
        'text-optional': true,
        'icon-optional': false,
        'icon-allow-overlap': true,
        'text-padding': 2,
        'text-offset': [0, 0.3],
        'icon-anchor': 'bottom',
        'text-font': ['Open Sans Semibold'],
        'text-anchor': 'top',
        'icon-image': [
            'step',
            ['zoom'],
            ['get', 'pinSrc'],
            zoomStepMiddle,
            ['get', 'pinSrc'],
            zoomStepMax,
            ['get', 'imageSrc']
        ],
        'text-field': ['step', ['zoom'], '', 16, ['get', 'text']],
        'text-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0,
            8,
            zoomStepMiddle - 1,
            8,
            zoomStepMiddle,
            11,
            zoomStepMax,
            11,
            24,
            22 * props.standScale
        ],
        'icon-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0,
            0.1,
            zoomStepMiddle - 1,
            0.1,
            zoomStepMiddle,
            0.1,
            zoomStepMax,
            0.12,
            24,
            ['*', ['get', 'fullScaleZoom'], props.standScale]
        ]
    };

    const paint: SymbolPaint = {
        'text-color': ['get', 'textColor'],
        'text-halo-color': ['get', 'textHaloColor'],
        'text-halo-width': ['get', 'textHaloWidth'],
        'text-halo-blur': ['get', 'textHaloBlur']
    };

    const layer: LayerProps = {
        id: layerIds.layer,
        type: 'symbol' as const,
        source: 'icons',
        filter: ['==', ['get', 'clickable'], '0'],
        layout,
        paint
    };

    const clickableLayer: LayerProps = {
        id: layerIds.layerClickable,
        type: 'symbol' as const,
        source: 'icons',
        filter: ['==', ['get', 'clickable'], '1'],
        layout,
        paint
    };

    if (!areImagesLoaded) {
        return (
            <>
                <EmptyLayer id={layerIds.layer} beforeId={beforeIds.layer} />
                <EmptyLayer id={layerIds.layerClickable} beforeId={beforeIds.layerClickable} />
                <EmptyLayer id={layerIds.last} beforeId={beforeIds.last} />
            </>
        );
    }

    return (
        <>
            <Source
                id="indoor_stands"
                type="geojson"
                data={{
                    type: 'FeatureCollection' as const,
                    features: sourceFeatures
                }}
            >
                <Layer {...layer} />
                <Layer {...clickableLayer} />
                <EmptyLayer id={layerIds.last} beforeId={beforeIds.last} />
            </Source>
        </>
    );
};
