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
                return [id + '|layer'];
            }
        })
        .flat()
        .concat('icons|clickable')
        .filter((val): val is string => {
            return val !== undefined;
        });

    return {
        layerIds,
        clickableSourceIds: layerIds
    };
}
