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
import { WallLabelMarkers } from '../items/v2/WallLabelMarkers';
import { WallV2Marker } from '../items/v2/WallV2Marker';
import { GroundFloor } from '../items/v2/WallV2Marker/GroundFloor';
import { GroupWallMarkers } from '../items/v2/WallV2Marker/GroupWallMarkers';
import { DividedMarkersV2 } from '../map/divideMarkersV2';
import {
    CountriesFillProps,
    GroupMarkerProps,
    MarkersCustomConfigProps
} from '../utils/map/mapTypes';
import { CountriesFillLayer } from './CountriesFillLayer';

export interface IProps {
    mapRef: RefObject<MapRef>;
    dividedMarkersV2: DividedMarkersV2;
    isEditMode: boolean;
    highlightedMarkerIds?: string[];
    orderedMarkerIds?: string[];
    groupMarkerProps: GroupMarkerProps;
    countriesFillConfig?: CountriesFillProps;
    markersCustomConfig: MarkersCustomConfigProps;
}

export const WorldMarkersV2 = (props: IProps): JSX.Element => {
    const {
        iconMarkers,
        indoorStandMarkers,
        floorMarkers,
        markers: markerGroups,
        wallMarkerLabels
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
                highlightedMarkerIds={props.highlightedMarkerIds}
            />
            <WallLabelMarkers
                dataPoints={wallMarkerLabels}
                beforeId="icons_last"
                highlightedMarkerIds={props.highlightedMarkerIds ?? []}
            />
            <IndoorStandMarkers
                markers={indoorStandMarkers}
                mapRef={props.mapRef}
                beforeId={'wall_labels|last'}
                highlightedMarkerIds={props.highlightedMarkerIds}
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
                switch (marker.elementType) {
                    case 'v2/line':
                        return (
                            <LineV2Marker
                                key={marker.id}
                                marker={marker}
                                beforeId={beforeId}
                                mapRef={props.mapRef}
                                orderIndex={orderIndex}
                                isHighlighted={highlightedMarkerIds.includes(marker.id)}
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
                                isHighlighted={highlightedMarkerIds.includes(marker.id)}
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
                                isHighlighted={highlightedMarkerIds.includes(marker.id)}
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
