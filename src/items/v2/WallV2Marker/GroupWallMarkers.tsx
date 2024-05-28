import React from 'react';
import { IWallV2WorldMarker } from '../../../utils/world/worldTypes';
import { EmptyLayer } from '../EmptyLayer';
import { transformLineCoordinatesIntoPolygonCoordinates } from './MultiLineWall';
import { GroupWallMarkerDataProps, WallSegment } from './WallSegment';

interface Props {
    id: string;
    markers: IWallV2WorldMarker[];
    beforeId: string;
}

export const GroupWallMarkers = (props: Props): JSX.Element => {
    const markers = props.markers.filter((e) => e.visible);

    const sourceIds = {
        nonSelectable: 'wall_group|' + props.id,
        selectable: 'wall_group|' + props.id + '|clickable'
    };

    const layerIds = {
        layer: 'wall_group|' + props.id + '|layer',
        selectable: 'wall_group|' + props.id + '|clickable',
        last: 'wall_group|' + props.id + '|last'
    };

    const beforeIds = {
        layer: props.beforeId,
        selectable: layerIds.layer,
        last: layerIds.selectable
    };

    function toMarkerData(marker: IWallV2WorldMarker) {
        return {
            wallProps: {
                color: marker.elementData.wall.color,
                height: marker.elementData.wall.height,
                baseHeight: marker.elementData.wall.baseHeight
            },
            markerId: marker.id,
            selectable: marker.selectable ?? false,
            orderIndex: marker.order ?? 0,
            visible: marker.visible ?? false
        };
    }

    function reduceMarkers(markersToReduce: IWallV2WorldMarker[]) {
        return markersToReduce.reduce((acc, marker) => {
            const markerData = toMarkerData(marker);
            if (marker.elementData.line?.isLine || marker.elementData.coordinates.length < 3) {
                const rectangleCoords = transformLineCoordinatesIntoPolygonCoordinates(
                    marker.elementData.coordinates,
                    marker.elementData.line.width
                );
                return [
                    ...acc,
                    ...rectangleCoords.map((coordinates) => ({
                        ...markerData,
                        coordinates
                    }))
                ];
            }

            const closedCoordinates = [
                ...marker.elementData.coordinates,
                marker.elementData.coordinates[0]
            ].filter(Boolean);
            return [...acc, { ...markerData, coordinates: closedCoordinates }];
        }, [] as GroupWallMarkerDataProps[]);
    }

    return (
        <>
            <WallSegment
                sourceId={sourceIds.nonSelectable}
                layerId={layerIds.layer}
                beforeId={beforeIds.layer}
                markerData={reduceMarkers(markers.filter((e) => !e.selectable))}
                opacity={1}
            />
            <WallSegment
                sourceId={sourceIds.selectable}
                layerId={layerIds.selectable}
                beforeId={beforeIds.selectable}
                markerData={reduceMarkers(markers.filter((e) => e.selectable))}
                opacity={1}
            />
            <EmptyLayer id={layerIds.last} beforeId={beforeIds.last} />
        </>
    );
};
