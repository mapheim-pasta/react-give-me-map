import { orderBy } from 'lodash';
import React, { RefObject } from 'react';
import { MapRef } from 'react-map-gl';
import { IconV2Marker } from '../items/v2/IconV2Marker';
import { LineV2Marker } from '../items/v2/LineV2Marker';
import { PolygonV2Marker } from '../items/v2/PolygonV2Marker';
import { IWorldV2Marker } from '../utils/world/worldTypes';

export interface IProps {
    mapRef: RefObject<MapRef>;
    markers: IWorldV2Marker[];
}

export const WorldMarkersV2 = (props: IProps): JSX.Element => {
    const orderedMarkers = orderBy(props.markers, 'order', 'desc');

    const layerOrder = orderedMarkers.reduce<string[]>((acc, curr) => {
        if (!curr.visible) {
            return acc;
        }
        return [...acc, `${curr.id}|layer`];
    }, []);

    console.log('layerOrder', layerOrder);

    return (
        <>
            {orderedMarkers.map((marker, index) => {
                const beforeId = layerOrder[index - 1];

                if (!marker.visible) {
                    return null;
                }

                switch (marker.elementType) {
                    case 'v2/line':
                        return <LineV2Marker key={marker.id} marker={marker} beforeId={beforeId} />;
                    case 'v2/polygon':
                        return (
                            <PolygonV2Marker
                                key={marker.id}
                                marker={marker}
                                beforeId={beforeId}
                                mapRef={props.mapRef}
                            />
                        );
                    case 'v2/icon':
                        return (
                            <IconV2Marker
                                key={marker.id}
                                marker={marker}
                                beforeId={beforeId}
                                mapRef={props.mapRef}
                            />
                        );
                    default:
                        return null;
                }
            })}
        </>
    );
};
