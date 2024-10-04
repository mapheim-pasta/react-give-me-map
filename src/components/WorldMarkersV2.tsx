import React, { RefObject, useEffect } from 'react';
import { MapRef, Source } from 'react-map-gl';
import { DirectionV2Marker } from '../items/v2/DirectionV2Marker';
import { EmptyLayer } from '../items/v2/EmptyLayer';
import { IconV2Markers } from '../items/v2/IconV2Markers';
import { ImageTextV2Marker } from '../items/v2/ImageTextV2Marker';
import { IndoorStandMarkers } from '../items/v2/IndoorStandMarkers';
import { LineV2Marker } from '../items/v2/LineV2Marker';
import { PolygonV2Marker } from '../items/v2/PolygonV2Marker';
import { RouteV2Marker } from '../items/v2/RouteMarker';
import { VariantIconV2Markers } from '../items/v2/VariantIconV2Markers';
import { WallLabelMarkers } from '../items/v2/WallLabelMarkers';
import { WallV2Marker } from '../items/v2/WallV2Marker';
import { GroundFloor } from '../items/v2/WallV2Marker/GroundFloor';
import { GroupWallMarkers } from '../items/v2/WallV2Marker/GroupWallMarkers';
import { DividedMarkersV2 } from '../map/divideMarkersV2';
import { ICallbacks } from '../map/RegisterPropsToGlobalState';
import {
    CountriesFillProps,
    GroupMarkerProps,
    MarkerGlobalSettings,
    MarkersCustomConfigProps
} from '../utils/map/mapTypes';
import { IWorldMarker } from '../utils/world/worldTypes';
import { CountriesFillLayer } from './CountriesFillLayer';

export interface IProps {
    mapRef: RefObject<MapRef>;
    dividedMarkersV2: DividedMarkersV2;
    isEditMode: boolean;
    highlightedMarkerIds?: string[];
    forceHighlightSelectableMarkers: boolean;
    orderedMarkerIds?: string[];
    groupMarkerProps: GroupMarkerProps;
    countriesFillConfig?: CountriesFillProps;
    markersCustomConfig: MarkersCustomConfigProps;
    markerGlobalSettings: MarkerGlobalSettings;
    callbacks: ICallbacks;
}

export const WorldMarkersV2 = (props: IProps): JSX.Element => {
    const {
        iconMarkers,
        indoorStandMarkers,
        floorMarkers,
        markers: markerGroups,
        wallMarkerLabels,
        variantIconMarkers
    } = props.dividedMarkersV2;

    const highlightedMarkerIds = props.highlightedMarkerIds ?? [];

    const layerOrderMarkerGroups = markerGroups.map((e) =>
        e.type === 'wallGroup' ? 'wall_group|' + e.id : e.id
    );

    const layerOrder = layerOrderMarkerGroups.concat(floorMarkers.map((e) => e.id + '|floor'));

    useEffect(() => {
        const mapRef = props.mapRef.current;
        if (!mapRef) {
            return;
        }

        for (let i = 1; i < layerOrder.length; i++) {
            const firstId = layerOrder[i] + '|layer';
            const secondId = layerOrder[i - 1] + '|last';

            if (mapRef.getLayer(firstId) && mapRef.getLayer(secondId)) {
                mapRef.moveLayer(firstId, secondId);
            }
        }
    }, [layerOrder.join(';')]);

    function getHighlightedMarkersForArray<T extends IWorldMarker>(markers: T[]) {
        return props.forceHighlightSelectableMarkers
            ? markers.filter((e) => e.selectable).map((e) => e.id)
            : props.highlightedMarkerIds ?? [];
    }

    return (
        <>
            <Source
                id={'empty-source'}
                type="geojson"
                data={{ type: 'FeatureCollection', features: [] }}
            />
            <IconV2Markers
                markers={iconMarkers}
                mapRef={props.mapRef}
                beforeId={undefined}
                groupMarkerProps={props.groupMarkerProps}
                highlightedMarkerIds={getHighlightedMarkersForArray(iconMarkers)}
            />
            <VariantIconV2Markers
                markers={variantIconMarkers}
                mapRef={props.mapRef}
                highlightedMarkerIds={props.highlightedMarkerIds}
                forceHighlightSelectableMarkers={props.forceHighlightSelectableMarkers}
                isEditMode={props.isEditMode}
                markerGlobalSettings={props.markerGlobalSettings['v2/variant_icon']}
                callbacks={props.callbacks}
            />
            <WallLabelMarkers
                dataPoints={wallMarkerLabels}
                beforeId="icons|last"
                highlightedMarkerIds={getHighlightedMarkersForArray(
                    markerGroups.flatMap((e) => (e.type === 'wallGroup' ? e.markers : [e.marker]))
                )}
            />
            <IndoorStandMarkers
                markers={indoorStandMarkers}
                mapRef={props.mapRef}
                beforeId={'wall_labels|last'}
                highlightedMarkerIds={getHighlightedMarkersForArray(indoorStandMarkers)}
                orderedMarkerIds={props.orderedMarkerIds}
                standScale={props.markersCustomConfig?.standScale ?? 1}
            />

            {markerGroups.map((markerGroup, index) => {
                const beforeMarkerId = layerOrder[index - 1];
                const beforeId = beforeMarkerId ? beforeMarkerId + '|last' : 'indoor_stands|last';
                const orderIndex = markerGroups.length - index;

                if (markerGroup.type === 'wallGroup') {
                    const groupWallMarkers = markerGroup.markers;
                    return (
                        <GroupWallMarkers
                            key={markerGroup.id}
                            id={markerGroup.id}
                            markers={groupWallMarkers}
                            beforeId={beforeId}
                        />
                    );
                }

                const marker = markerGroup.marker;
                const isHighlighted =
                    (props.forceHighlightSelectableMarkers && marker.selectable) ||
                    highlightedMarkerIds.includes(marker.id);

                switch (marker.elementType) {
                    case 'v2/line':
                        return (
                            <LineV2Marker
                                key={marker.id}
                                marker={marker}
                                beforeId={beforeId}
                                mapRef={props.mapRef}
                                orderIndex={orderIndex}
                                isHighlighted={isHighlighted}
                            />
                        );
                    case 'v2/polygon':
                        return (
                            <PolygonV2Marker
                                key={marker.id}
                                marker={marker}
                                beforeId={beforeId}
                                mapRef={props.mapRef}
                                orderIndex={orderIndex}
                                isHighlighted={isHighlighted}
                            />
                        );
                    case 'v2/wall':
                        return (
                            <WallV2Marker
                                key={marker.id}
                                marker={marker}
                                beforeId={beforeId}
                                mapRef={props.mapRef}
                                orderIndex={orderIndex}
                            />
                        );
                    case 'v2/image':
                    case 'v2/text':
                        return (
                            <ImageTextV2Marker
                                key={marker.id}
                                marker={marker}
                                beforeId={beforeId}
                                mapRef={props.mapRef}
                                orderIndex={orderIndex}
                                isHighlighted={isHighlighted}
                            />
                        );
                    case 'direction':
                        return (
                            <DirectionV2Marker
                                key={marker.id + '|' + marker.elementData.coordinates.length}
                                marker={marker}
                                beforeId={beforeId}
                                mapRef={props.mapRef}
                                orderIndex={orderIndex}
                            />
                        );
                    case 'v2/route':
                        return (
                            <RouteV2Marker
                                key={marker.id + '|' + marker.elementData.coordinates.length}
                                marker={marker}
                                beforeId={beforeId}
                                mapRef={props.mapRef}
                                orderIndex={orderIndex}
                            />
                        );
                    default:
                        return null;
                }
            })}
            <EmptyLayer
                id={'nonIcons|last'}
                beforeId={
                    layerOrderMarkerGroups.length
                        ? layerOrderMarkerGroups[layerOrderMarkerGroups.length - 1] + '|last'
                        : 'icons|last'
                }
            />
            {floorMarkers.map((marker, index) => {
                const beforeMarkerId = floorMarkers[index - 1]?.id;
                const beforeId = beforeMarkerId ? beforeMarkerId + '|floor|last' : 'nonIcons|last';
                const orderIndex = markerGroups.length + index;

                return (
                    <GroundFloor
                        key={marker.id + '|floor'}
                        markerId={marker.id}
                        beforeId={beforeId}
                        coordinates={marker.elementData.coordinates}
                        color={marker.elementData.line.fillColor}
                        hasFloor={marker.elementData.line.hasFloor}
                        orderIndex={orderIndex}
                        visible={marker.visible ?? false}
                    />
                );
            })}
            <EmptyLayer
                id={'afterFloorMarkers|last'}
                beforeId={
                    floorMarkers.length
                        ? floorMarkers[floorMarkers.length - 1].id + '|floor|last'
                        : 'nonIcons|last'
                }
            />
            {props.countriesFillConfig ? (
                <CountriesFillLayer
                    sourceId="countries-fill"
                    layerId="countries-fill|last"
                    beforeId="afterFloorMarkers|last"
                    countriesFillConfig={props.countriesFillConfig}
                />
            ) : (
                <EmptyLayer id="countries-fill" />
            )}
        </>
    );
};
