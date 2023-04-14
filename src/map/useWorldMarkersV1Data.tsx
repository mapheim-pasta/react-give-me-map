import { IWorldV1Marker } from '../utils/world/worldTypes';

export function useWorldMarkersV1Data(markers: IWorldV1Marker[]) {
    const layerIds = markers
        .filter((e) => e.visible)
        .map((marker) => {
            if (marker.elementType === 'route' || marker.elementType === 'direction') {
                return marker.id + '|line-click';
            }
            if (marker.elementType === 'polygon' && marker.elementData.renderAs3d) {
                return marker.id + '|layer';
            }
        })
        .filter((val): val is string => {
            return val !== undefined;
        })
        .concat(['unclustered-point-images-clickable']);

    return {
        layerIds
    };
}
