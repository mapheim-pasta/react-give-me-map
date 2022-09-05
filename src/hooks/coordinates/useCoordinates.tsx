import { useContext, useMemo } from 'react';
import { MapContext } from 'react-map-gl/dist/esm/components/map';
import { getCoordinatesBoundaries, ICoordinatesBoundaries } from '../../utils/gpx/gpxUtils';
import { ICoordinates, IXY } from '../../utils/map/mapTypes';

export const useCoordinate = (coordinates: ICoordinates[]): IReturnUseCoordinate => {
    const { map } = useContext(MapContext);

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
