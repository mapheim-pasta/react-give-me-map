import { IWorldV1Marker } from '../utils/world/worldTypes';

export function useWorldMarkersV1Data(markers: IWorldV1Marker[]) {
    const layerIds = markers
        .filter((e) => e.visible)
        .map((marker) => {
            if (marker.elementType === 'route') {
                return marker.id + '|line-click';
            }
            if (marker.elementType === 'polygon' && marker.elementData.renderAs3d) {
                return marker.id + '|layer';
            }
        })
        .filter((val): val is string => {
            return val !== undefined;
        });

    const hasClusters = markers.some((e) => e.elementType === 'image' && e.isGroupable);

    return {
        layerIds: [...layerIds, ...(hasClusters ? ['unclustered-point-images-clickable'] : [])]
    };
}
