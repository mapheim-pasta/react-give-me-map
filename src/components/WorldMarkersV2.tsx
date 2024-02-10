import { orderBy } from 'lodash';
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
import { WallV2Marker } from '../items/v2/WallV2Marker';
import { GroundFloor } from '../items/v2/WallV2Marker/GroundFloor';
import { CountriesFillProps, GroupMarkerProps } from '../utils/map/mapTypes';
import {
    IIconV2WorldMarker,
    IIndoorStandWorldMarker,
    IWallV2WorldMarker,
    IWorldV2Marker
} from '../utils/world/worldTypes';
import { CountriesFillLayer } from './CountriesFillLayer';

export interface IProps {
    mapRef: RefObject<MapRef>;
    markers: IWorldV2Marker[];
    highlightedMarkerIds?: string[];
    orderedMarkerIds?: string[];
    groupMarkerProps: GroupMarkerProps;
    countriesFillConfig?: CountriesFillProps;
}

export const WorldMarkersV2 = (props: IProps): JSX.Element => {
    const nonIconMarkers = orderBy(
        props.markers.filter(
            (e) => e.elementType !== 'v2/icon' && e.elementType !== 'indoor_stand'
        ),
        'order',
        'desc'
    );
    const iconMarkers = orderBy(
        props.markers.filter((e): e is IIconV2WorldMarker => e.elementType === 'v2/icon'),
        'order',
        'desc'
    );
    const indoorStandMarkers = orderBy(
        props.markers.filter((e): e is IIndoorStandWorldMarker => e.elementType === 'indoor_stand'),
        'order',
        'desc'
    );

    const floorMarkers = nonIconMarkers.filter<IWallV2WorldMarker>(
        (e): e is IWallV2WorldMarker =>
            e.elementType === 'v2/wall' && e.elementData.line.isLine && e.elementData.line.hasFloor
    );

    const highlightedMarkerIds = props.highlightedMarkerIds ?? [];

    const layerOrder = nonIconMarkers
        .map((e) => e.id)
        .concat(floorMarkers.map((e) => e.id + '|floor'));

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
            <IndoorStandMarkers
                markers={indoorStandMarkers}
                mapRef={props.mapRef}
                beforeId={'icons|last'}
                highlightedMarkerIds={props.highlightedMarkerIds}
                orderedMarkerIds={props.orderedMarkerIds}
            />
            {nonIconMarkers.map((marker, index) => {
                const beforeMarkerId = layerOrder[index - 1];
                const beforeId = beforeMarkerId ? beforeMarkerId + '|last' : 'indoor_stands|last';
                const orderIndex = nonIconMarkers.length - index;

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
                                isHighlighted={highlightedMarkerIds.includes(marker.id)}
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
                    nonIconMarkers.length
                        ? nonIconMarkers[nonIconMarkers.length - 1].id + '|last'
                        : 'icons|last'
                }
            />
            {floorMarkers.map((marker, index) => {
                const beforeMarkerId = floorMarkers[index - 1]?.id;
                const beforeId = beforeMarkerId ? beforeMarkerId + '|floor|last' : 'nonIcons|last';
                const orderIndex = nonIconMarkers.length + index;

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
