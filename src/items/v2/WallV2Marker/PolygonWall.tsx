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

    isHighlighted?: boolean;
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

    return (
        <>
            <WallSegment
                sourceId={props.marker.id}
                layerId={layerIds.layer}
                beforeId={beforeIds.layer}
                markerId={props.marker.id}
                coordinates={[props.marker.elementData.coordinates]}
                wallProps={markerData.wall}
                visible={props.marker.visible ?? false}
                orderIndex={props.orderIndex}
            />
            <EmptyLayer id={layerIds.last} beforeId={beforeIds.last} />
        </>
    );
};
