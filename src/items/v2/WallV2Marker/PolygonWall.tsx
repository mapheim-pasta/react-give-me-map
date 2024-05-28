import React, { RefObject, useEffect } from 'react';
import { MapRef } from 'react-map-gl';
import { IWallV2WorldMarker } from '../../../utils/world/worldTypes';
import { EmptyLayer } from '../EmptyLayer';
import { WallSegment } from '../WallV2Marker/WallSegment';
import { automoveMarkers } from '../automoveMarkers';

interface Props {
    mapRef: RefObject<MapRef>;
    marker: IWallV2WorldMarker;

    beforeId?: string;

    orderIndex: number;
}

export const PolygonWall = (props: Props): JSX.Element => {
    const markerData = props.marker.elementData;

    const layerIds = {
        layer: props.marker.id + '|layer',
        last: props.marker.id + '|last'
    };

    const beforeIds = {
        layer: props.beforeId,
        last: layerIds.layer
    };

    useEffect(() => {
        const mapRef = props.mapRef.current;
        automoveMarkers({ layerIds, beforeIds, mapRef });
    }, [props.beforeId, props.mapRef?.current]);

    const closedCoordinates = [
        ...props.marker.elementData.coordinates,
        props.marker.elementData.coordinates[0]
    ].filter(Boolean);

    return (
        <>
            <WallSegment
                sourceId={props.marker.id}
                layerId={layerIds.layer}
                beforeId={beforeIds.layer}
                markerData={[
                    {
                        coordinates: closedCoordinates,
                        wallProps: {
                            color: markerData.wall.color,
                            height: markerData.wall.height,
                            baseHeight: markerData.wall.baseHeight
                        },
                        markerId: props.marker.id,
                        selectable: props.marker.selectable ?? false,

                        orderIndex: props.orderIndex,
                        visible: props.marker.visible ?? false
                    }
                ]}
                opacity={markerData.wall.opacity}
            />
            <EmptyLayer id={layerIds.last} beforeId={beforeIds.last} />
        </>
    );
};
