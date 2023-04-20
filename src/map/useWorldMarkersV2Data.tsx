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
            if (marker.elementType === 'v2/icon') {
                return [id + '|layer'];
            }
            if (marker.elementType === 'v2/wall') {
                if (marker.elementData.line.isLine) {
                    const firstLayerId = id + '|layer';
                    const otherLayerIds = marker.elementData.coordinates
                        .slice(0, marker.elementData.coordinates.length - 2)
                        .map((_, i) => `${id}|layer|${i + 1}`);

                    console.log('mmm1', [firstLayerId, ...otherLayerIds]);
                    return [firstLayerId, ...otherLayerIds];
                } else {
                    return [id + '|layer'];
                }
            }
        })
        .flat()
        .filter((val): val is string => {
            return val !== undefined;
        });

    return {
        layerIds,
        clickableSourceIds: layerIds
    };
}
