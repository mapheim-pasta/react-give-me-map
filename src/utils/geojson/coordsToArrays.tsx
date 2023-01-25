import { ICoordinates } from '../map/mapTypes';

export function coordsToArrays(coords: ICoordinates[]): number[][] {
    return coords.map((coord) => [coord.lng, coord.lat]);
}
