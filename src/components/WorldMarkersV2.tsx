import { orderBy } from 'lodash';
import React, { RefObject, useEffect } from 'react';
import { MapRef, Source } from 'react-map-gl';
import { DirectionWorld } from '../items/v2/DirectionV2Marker';
import { IconV2Markers } from '../items/v2/IconV2Markers';
import { ImageTextV2Marker } from '../items/v2/ImageTextV2Marker';
import { LineV2Marker } from '../items/v2/LineV2Marker';
import { PolygonV2Marker } from '../items/v2/PolygonV2Marker';
import { WallV2Marker } from '../items/v2/WallV2Marker';
import { GroupMarkerProps } from '../utils/map/mapTypes';
import { IIconV2WorldMarker, IWorldV2Marker } from '../utils/world/worldTypes';

export interface IProps {
    mapRef: RefObject<MapRef>;
    markers: IWorldV2Marker[];
    highlightedMarkerIds?: string[];
    groupMarkerProps: GroupMarkerProps;
}

export const WorldMarkersV2 = (props: IProps): JSX.Element => {
    const nonIconMarkers = orderBy(
        props.markers.filter((e) => e.elementType !== 'v2/icon'),
        'order',
        'desc'
    );
    const iconMarkers = orderBy(
        props.markers.filter((e): e is IIconV2WorldMarker => e.elementType === 'v2/icon'),
        'order',
        'desc'
    );

    const highlightedMarkerIds = props.highlightedMarkerIds ?? [];

    const layerOrder = nonIconMarkers.map((e) => e.id);

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
            {nonIconMarkers.map((marker, index) => {
                const beforeMarkerId = layerOrder[index - 1];
                const beforeId = beforeMarkerId ? beforeMarkerId + '|last' : 'icons|last';
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
                            <DirectionWorld
                                key={marker.id + '|' + marker.elementData.coordinates.length}
                                marker={marker}
                                beforeId={beforeId}
                                mapRef={props.mapRef}
                                orderIndex={orderIndex}
                            />
                        );
                    // case 'v2/text':
                    //     return (
                    //         <TextV2Marker
                    //             key={marker.id}
                    //             marker={marker}
                    //             beforeId={beforeId}
                    //             mapRef={props.mapRef}
                    //             orderIndex={orderIndex}
                    //         />
                    //     );
                    default:
                        return null;
                }
            })}
        </>
    );
};
