import React, { RefObject, useEffect } from 'react';
import { MapRef } from 'react-map-gl';
import { IWallV2WorldMarker } from '../../../utils/world/worldTypes';
import { EmptyLayer } from '../EmptyLayer';
import { WallSegment } from '../WallV2Marker/WallSegment';

interface Props {
    mapRef: RefObject<MapRef>;
    marker: IWallV2WorldMarker;

    beforeId?: string;

    isHighlighted?: boolean;
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
        if (props.mapRef.current) {
            props.mapRef.current.moveLayer(layerIds.layer, beforeIds.layer);
            props.mapRef.current.moveLayer(layerIds.last, beforeIds.last);
        }
    }, [props.beforeId, props.mapRef?.current]);

    return (
        <>
            <WallSegment
                sourceId={props.marker.id}
                layerId={layerIds.layer}
                beforeId={beforeIds.layer}
                markerId={props.marker.id}
                coordinates={props.marker.elementData.coordinates}
                wallProps={markerData.wall}
                visible={props.marker.visible ?? false}
            />
            <EmptyLayer id={layerIds.last} beforeId={beforeIds.last} />
        </>
    );
};
