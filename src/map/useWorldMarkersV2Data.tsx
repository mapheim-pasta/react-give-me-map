import { IWorldV2Marker } from '../utils/world/worldTypes';

export function useWorldMarkersV2Data(markers: IWorldV2Marker[]) {
    const layerIds = markers
        .filter((e) => e.selectable)
        .map((marker) => {
            const id = marker.id;
            if (marker.elementType === 'v2/polygon') {
                return [id + '|clickable', id + '|clickable-border'];
            }
            if (marker.elementType === 'v2/line') {
                return [id + '|clickable'];
            }
            if (marker.elementType === 'v2/wall') {
                if (marker.elementData.line.isLine && marker.elementData.line.hasFloor) {
                    return [id + '|layer', id + '|floor|layer'];
                }
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
