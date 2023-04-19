import React from 'react';
import { ICoordinates } from '../../../utils/map/mapTypes';
import { IWallV2WorldMarker } from '../../../utils/world/worldTypes';
import { SingleLineWall } from './SingleWallLine';
interface Props {
    marker: IWallV2WorldMarker;
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

    return (
        <>
            {walls.map((wall, i) => (
                <SingleLineWall
                    markerId={marker.id}
                    coordinates={wall}
                    wallProps={{
                        color: markerData.wall.color,
                        opacity: markerData.wall.opacity,
                        height: markerData.wall.height
                    }}
                    width={markerData.line.width}
                    isFirst={i === 0}
                />
            ))}
        </>
    );
};
