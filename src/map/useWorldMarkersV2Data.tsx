import { IWallV2WorldMarker } from '../utils/world/worldTypes';
import { DividedMarkersV2 } from './divideMarkersV2';

export function isWallGroupable(marker: IWallV2WorldMarker) {
    if (marker.elementData.line.hasFloor) {
        return false;
    }
    if (marker.elementData.wall.opacity && marker.elementData.wall.opacity < 1) {
        return false;
    }
    return true;
}

export function useWorldMarkersV2Data(markers: DividedMarkersV2) {
    const { markers: markerGroups } = markers;

    const layerIds = markerGroups
        .map((markerGroup) => {
            if (markerGroup.type === 'wallGroup') {
                return ['wall_group|' + markerGroup.id + '|clickable'];
            }

            if (markerGroup.type === 'marker' && markerGroup.marker.selectable) {
                const marker = markerGroup.marker;
                const id = marker.id;
                if (marker.elementType === 'v2/polygon') {
                    return [id + '|clickable', id + '|clickable-border'];
                }
                if (marker.elementType === 'v2/line') {
                    return [id + '|clickable'];
                }
                if (marker.elementType === 'v2/wall') {
                    return [id + '|layer'];
                }
                if (marker.elementType === 'v2/image' || marker.elementType === 'v2/text') {
                    return [id + '_click' + '|clickable'];
                }
                if (marker.elementType === 'direction') {
                    return new Array(marker.elementData.coordinates.length - 1)
                        .fill(0)
                        .map((_, i) => `${id}|${i}|clickable`);
                }
                if (marker.elementType === 'v2/route') {
                    return [id + '|clickable'];
                }
            }
        })
        .flat()
        .concat('icons|clickable')
        .concat('indoor_stands|clickable')
        .filter((val): val is string => {
            return val !== undefined;
        });

    return {
        layerIds,
        clickableSourceIds: layerIds
    };
}
