import { MapRef } from 'react-map-gl';
import {
    IDrawWorldMarker,
    IImageWorldMarker,
    ILinkWorldMarker,
    IPinWorldMarker,
    IPolygonWorldMarker,
    ITextWorldMarker,
    IWorldMarker,
    IYoutubeWorldMarker,
    WorldElements
} from '../../utils/world/worldTypes';
import { getInScale } from '../../utils/world/worldUtils';

export type SinglePointMultiSelectableMarker =
    | ITextWorldMarker
    | IImageWorldMarker
    | IDrawWorldMarker
    | IPinWorldMarker
    | IPolygonWorldMarker
    | IYoutubeWorldMarker
    | ILinkWorldMarker;

const ORIGIN_ZOOM = 1;

export function isSinglePointMultiSelectable(
    marker: IWorldMarker
): marker is SinglePointMultiSelectableMarker {
    return !['route', 'direction'].includes(marker.elementType);
}

export function getMarkerScale(
    m: Pick<IWorldMarker, 'scalable' | 'scale'>,
    zoom: number | undefined
) {
    return m.scalable ? getInScale(m.scale ?? 1, ORIGIN_ZOOM, zoom ?? 1) : 1;
}

export const useContainComputation = (markers: IWorldMarker[], mapRef: React.RefObject<MapRef>) => {
    const svgElements: WorldElements[] = ['draw', 'polygon'];

    function computations(event: MouseEvent) {
        const path = (event as any).path || (event.composedPath && event.composedPath());
        const marker = markers.find((m) => {
            let includes = false;
            if ('ref' in m) {
                if (path.includes(m.ref?.current)) {
                    includes = true;
                }
            }
            if ('refs' in m) {
                if (m.refs?.some((ref) => path.includes(ref?.current))) {
                    includes = true;
                }
            }

            // for polygon, we need to click on something more specific than just "svg"
            // to actually consider this a click on the marker, e.g. for path
            if (includes && svgElements.includes(m.elementType)) {
                // Polygon with at most 2 points should be always selected
                if (m.elementType === 'polygon' && m.elementData.coordinates.length <= 2) {
                    return true;
                }
                return path[0].nodeName !== 'svg';
            }

            return includes;
        });

        const zoom = mapRef.current?.getZoom();

        const marker2 = markers
            .filter((e) => !svgElements.includes(e.elementType))
            // This does not work correctly for images, find out why in the future
            .filter((e) => e.elementType !== 'image')
            .filter((e): e is SinglePointMultiSelectableMarker => isSinglePointMultiSelectable(e))
            .find((marker) => {
                const point = mapRef.current?.getMap().project([marker.lng, marker.lat]);

                if (!point) {
                    return false;
                }

                const minX =
                    point.x -
                    (getMarkerScale(marker, zoom) * (marker.ref?.current?.offsetWidth ?? 0)) / 2;
                const maxX =
                    point.x +
                    (getMarkerScale(marker, zoom) * (marker.ref?.current?.offsetWidth ?? 0)) / 2;

                const minY =
                    point.y -
                    (getMarkerScale(marker, zoom) * (marker.ref?.current?.offsetHeight ?? 0)) / 2;
                const maxY =
                    point.y +
                    (getMarkerScale(marker, zoom) * (marker.ref?.current?.offsetHeight ?? 0)) / 2;

                return event.x >= minX && event.x <= maxX && event.y >= minY && event.y <= maxY;
            });

        const finalMarker = marker ?? marker2;
        return {
            finalMarker,
            marker,
            marker2
        };
    }

    return {
        computations
    };
};
