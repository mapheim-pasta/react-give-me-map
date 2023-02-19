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
import { isPointInRectangle } from './useContainComputation/isPointInRectangle';

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

        const map = mapRef.current;
        const mapRefContainer = map?.getContainer();
        const isMapSourceOfClick = path.includes(mapRefContainer);

        if (!isMapSourceOfClick) {
            return {
                marker: null,
                marker2: null,
                finalMarker: null
            };
        }

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

        const zoom = map?.getZoom();

        const eventX = event.x - (map?.getContainer()?.getBoundingClientRect()?.left ?? 0);
        const eventY = event.y - (map?.getContainer()?.getBoundingClientRect()?.top ?? 0);

        const marker2 = markers
            .filter((e) => !svgElements.includes(e.elementType))
            // This does not work correctly for images, find out why in the future
            .filter((e) => e.elementType !== 'image')
            .filter((e): e is SinglePointMultiSelectableMarker => isSinglePointMultiSelectable(e))
            .find((marker) => {
                if (marker.elementType === 'image') {
                    const layerData = marker.elementData.layerData;

                    if (
                        !layerData ||
                        !layerData.bottomLeft ||
                        !layerData.bottomRight ||
                        !layerData.topLeft ||
                        !layerData.topRight
                    ) {
                        return;
                    }

                    if (!map) {
                        return;
                    }

                    return isPointInRectangle(
                        { x: eventX, y: eventY },
                        {
                            A: map?.project([layerData.topLeft.lng, layerData.topLeft.lat]),
                            B: map?.project([layerData.topRight.lng, layerData.topRight.lat]),
                            C: map?.project([layerData.bottomRight.lng, layerData.bottomRight.lat]),
                            D: map?.project([layerData.bottomLeft.lng, layerData.bottomLeft.lat])
                        }
                    );
                }

                const point = map?.project([marker.lng, marker.lat]);

                //hack?
                if (!point) return;

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

                return eventX >= minX && eventX <= maxX && eventY >= minY && eventY <= maxY;
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
