import { throttle } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MapRef } from 'react-map-gl';
import { IVariantIconV2WorldMarker } from '../../../utils/world/worldTypes';

interface Params {
    markers: IVariantIconV2WorldMarker[];
    highlightedMarkerIds?: string[];
    mapRef: React.RefObject<MapRef>;
}

interface TakenCoordinate {
    x: number;
    y: number;
    markerId: string;
}

const DISTANCE_MIDDLE = 60;
const DISTANCE_LARGE = 100;

// TOOD: Use rbush for better performance
// https://github.com/mourner/rbush/

export const useComputeMarkerSizes = (params: Params) => {
    const { markers, highlightedMarkerIds } = params;

    const sortedIconMarkers = useMemo(() => {
        return markers.sort((a, b) => a.lat - b.lat);
    }, [markers]);

    const [updateCount, setUpdateCount] = useState(0);
    const [sizes, setSizes] = useState<Map<string, number>>(new Map());

    const setUpdateCountThrottled = useCallback(
        throttle(setUpdateCount, 600, { leading: false, trailing: true }),
        []
    );

    function update() {
        const _coordinates = sortedIconMarkers
            .map<TakenCoordinate>((marker) => {
                const xy = params.mapRef?.current?.project([marker.lng, marker.lat]);
                if (xy) {
                    return {
                        markerId: marker.id,
                        x: xy.x,
                        y: xy.y
                    };
                }
                return {
                    markerId: marker.id,
                    x: 0,
                    y: 0
                };
            })
            // Only those that are visible in the map
            .filter(
                (marker) => marker.x > -100 && marker.y > -100 && marker.x < 2000 && marker.y < 2000
            );

        const { size1, size2, size3 } = _coordinates.reduce<{
            size1: TakenCoordinate[];
            size2: TakenCoordinate[];
            size3: TakenCoordinate[];
        }>(
            (acc, curr) => {
                const size = sizes.get(curr.markerId);
                if (size === 3) {
                    return { ...acc, size3: [...acc.size3, curr] };
                }
                if (size === 2) {
                    return { ...acc, size2: [...acc.size2, curr] };
                }
                return { ...acc, size1: [...acc.size1, curr] };
            },
            { size1: [], size2: [], size3: [] }
        );
        const coordinates = [...size3, ...size2, ...size1];

        highlightedMarkerIds?.forEach((activeMarkerId) => {
            const index = coordinates.findIndex((e) => e.markerId === activeMarkerId);
            if (index !== -1) {
                const active = coordinates[index];
                coordinates.splice(index, 1);
                coordinates.unshift(active);
            }
        });

        const takenCoordinates: { markerId: string; x: number; y: number }[] = [...coordinates];

        const distanceMiddleSquared = DISTANCE_MIDDLE * DISTANCE_MIDDLE;
        const distanceLargeSquared = DISTANCE_LARGE * DISTANCE_LARGE;

        const handledMarkerIds = new Set<string>();

        const newSizes = new Map(
            coordinates.map((m) => {
                if (highlightedMarkerIds?.includes(m.markerId)) {
                    return [m.markerId, 3];
                }

                let smallestDistance = Number.MAX_VALUE;
                let smallestDistanceMarkerId = '';
                for (let i = 0; i < takenCoordinates.length; i++) {
                    const coordinate = takenCoordinates[i];
                    if (coordinate.markerId === m.markerId) {
                        continue;
                    }

                    const distanceX = coordinate.x - m.x;
                    const distanceY = coordinate.y - m.y;
                    const distance = distanceX * distanceX + distanceY * distanceY;

                    if (distance < smallestDistance) {
                        smallestDistance = distance;
                        smallestDistanceMarkerId = coordinate.markerId;
                        if (smallestDistance < distanceMiddleSquared) {
                            break;
                        }
                    }
                }

                handledMarkerIds.add(smallestDistanceMarkerId);

                if (smallestDistance < distanceMiddleSquared) {
                    return [m.markerId, 1];
                }

                if (smallestDistance < distanceLargeSquared) {
                    return [m.markerId, 2];
                }

                return [m.markerId, 3];
            })
        );
        setSizes(newSizes);
    }

    useEffect(() => {
        update();
    }, [updateCount]);

    return {
        sizes: {
            get: (markerId: string) => sizes.get(markerId) ?? 1
        },
        triggerUpdate: () => {
            setUpdateCountThrottled((current) => current + 1);
        },
        triggerUpdateImmediately: () => {
            setUpdateCount((current) => current + 1);
        }
    };
};
