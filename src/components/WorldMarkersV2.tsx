import { orderBy } from 'lodash';
import React, { RefObject, useEffect } from 'react';
import { MapRef, Source } from 'react-map-gl';
import { IconV2Markers } from '../items/v2/IconV2Markers';
import { GroupMarkerProps } from '../items/v2/IconV2Markers/ClusterLayers';
import { LineV2Marker } from '../items/v2/LineV2Marker';
import { PolygonV2Marker } from '../items/v2/PolygonV2Marker';
import { WallV2Marker } from '../items/v2/WallV2Marker';
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
            ></Source>
            {nonIconMarkers.map((marker, index) => {
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
            {/* 
                Icons need to be rendered last because they take time to render
                due to pre-loading the images before they are shown
            */}
            <IconV2Markers
                markers={iconMarkers}
                mapRef={props.mapRef}
                beforeId={layerOrder[layerOrder.length - 1]}
                groupMarkerProps={props.groupMarkerProps}
            />
        </>
    );
};
