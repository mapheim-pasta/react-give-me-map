import { orderBy } from 'lodash';
import React, { RefObject, useEffect } from 'react';
import { MapRef, Source } from 'react-map-gl';
import { IconV2Marker } from '../items/v2/IconV2Marker';
import { LineV2Marker } from '../items/v2/LineV2Marker';
import { PolygonV2Marker } from '../items/v2/PolygonV2Marker';
import { WallV2Marker } from '../items/v2/WallV2Marker';
import { IWorldV2Marker } from '../utils/world/worldTypes';

export interface IProps {
    mapRef: RefObject<MapRef>;
    markers: IWorldV2Marker[];
    highlightedMarkerIds?: string[];
}

export const WorldMarkersV2 = (props: IProps): JSX.Element => {
    const orderedMarkers = orderBy(props.markers, 'order', 'desc');
    const highlightedMarkerIds = props.highlightedMarkerIds ?? [];

    const layerOrder = orderedMarkers.map((e) => e.id);

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
            ></Source>
            {orderedMarkers.map((marker, index) => {
                const beforeMarkerId = layerOrder[index - 1];
                const beforeId = beforeMarkerId ? beforeMarkerId + '|last' : undefined;

                switch (marker.elementType) {
                    case 'v2/line':
                        return (
                            <LineV2Marker
                                key={marker.id}
                                marker={marker}
                                beforeId={beforeId}
                                mapRef={props.mapRef}
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
                                isHighlighted={highlightedMarkerIds.includes(marker.id)}
                            />
                        );
                    case 'v2/icon':
                        return (
                            <IconV2Marker
                                key={marker.id}
                                marker={marker}
                                beforeId={beforeId}
                                mapRef={props.mapRef}
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
                                isHighlighted={highlightedMarkerIds.includes(marker.id)}
                            />
                        );
                    default:
                        return null;
                }
            })}
        </>
    );
};
