import { useMemo } from 'react';
import { useMap } from 'react-map-gl';
import { getCoordinatesBoundaries, ICoordinatesBoundaries } from '../../utils/gpx/gpxUtils';
import { ICoordinates, IXY } from '../../utils/map/mapTypes';

export const useCoordinate = (coordinates: ICoordinates[]): IReturnUseCoordinate => {
    const { current: map } = useMap();

    if (!map) {
        throw Error('Map not found in context');
    }

    const points = useMemo(() => {
        return coordinates.map((point) => {
            return [point.lng, point.lat];
        });
    }, [coordinates]);
    const boundaries = useMemo(() => {
        return getCoordinatesBoundaries(coordinates);
    }, [coordinates]);

    const topLeft: IXY = map.project([boundaries.topLeft.lng, boundaries.topLeft.lat]);
    const bottomRight: IXY = map.project([boundaries.bottomRight.lng, boundaries.bottomRight.lat]);

    return {
        points,
        boundaries,
        topLeft,
        bottomRight
    };
};

export interface IReturnUseCoordinate {
    points: number[][];
    boundaries: ICoordinatesBoundaries;
    topLeft: IXY;
    bottomRight: IXY;
}
