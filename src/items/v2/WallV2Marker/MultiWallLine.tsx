import React, { RefObject, useEffect } from 'react';
import { MapRef } from 'react-map-gl';
import { ICoordinates } from '../../../utils/map/mapTypes';
import { IWallV2WorldMarker } from '../../../utils/world/worldTypes';
import { EmptyLayer } from '../EmptyLayer';
import { SingleLineWall } from './SingleWallLine';
interface Props {
    marker: IWallV2WorldMarker;
    mapRef: RefObject<MapRef>;
    beforeId?: string;
}

const coordinatesToWalls = (coords: ICoordinates[]): [ICoordinates, ICoordinates][] => {
    const res: [ICoordinates, ICoordinates][] = [];
    for (let i = 0; i < coords.length - 1; i++) {
        res.push([coords[i], coords[i + 1]]);
    }
    return res;
};

export const MultiLineWall = (props: Props) => {
    const marker = props.marker;
    const markerData = marker.elementData;
    const walls = coordinatesToWalls(marker.elementData.coordinates);

    const sourceIds = walls.map((_, i) => (i === 0 ? props.marker.id : `${props.marker.id}|${i}`));
    const layerIds = walls.map((_, i) =>
        i === 0 ? `${props.marker.id}|layer` : `${props.marker.id}|layer|${i}`
    );

    useEffect(() => {
        if (!props.mapRef.current) {
            return;
        }

        if (props.mapRef.current) {
            for (let i = 0; i < layerIds.length; i++) {
                if (i === 0) {
                    props.mapRef.current.moveLayer(layerIds[i], props.beforeId);
                } else {
                    props.mapRef.current.moveLayer(layerIds[i], layerIds[i - 1]);
                }
            }
            props.mapRef.current.moveLayer(marker.id + '|last', layerIds[layerIds.length - 1]);
        }
    }, [props.beforeId, props.mapRef?.current]);

    return (
        <>
            {walls.map((wall, i) => {
                return (
                    <SingleLineWall
                        key={layerIds[i]}
                        markerId={marker.id}
                        sourceId={sourceIds[i]}
                        layerId={layerIds[i]}
                        beforeId={i === 0 ? props.beforeId : layerIds[i - 1]}
                        coordinates={wall}
                        wallProps={{
                            color: markerData.wall.color,
                            opacity: markerData.wall.opacity,
                            height: markerData.wall.height
                        }}
                        width={markerData.line.width}
                        visible={marker.visible ?? false}
                    />
                );
            })}
            <EmptyLayer id={marker.id + '|last'} beforeId={layerIds[layerIds.length - 1]} />
        </>
    );
};
