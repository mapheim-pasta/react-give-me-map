import { get } from 'lodash';
import { MapRef } from 'react-map-gl';

interface Props {
    mapRef: MapRef | null;
    layerIds: Record<string, string>;
    beforeIds: Record<string, string | undefined>;
}
export const automoveMarkers = ({ mapRef, layerIds, beforeIds }: Props) => {
    if (!mapRef) {
        return;
    }
    Object.keys(layerIds).forEach((key) => {
        const layerId = get(layerIds, key);
        const beforeId = get(beforeIds, key);
        if (mapRef.getLayer(layerId) && beforeId && mapRef.getLayer(beforeId)) {
            mapRef.moveLayer(layerId, beforeId);
        }
    });
};
