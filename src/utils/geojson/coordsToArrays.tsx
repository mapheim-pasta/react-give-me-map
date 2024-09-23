import { ICoordinates } from '../map/mapTypes';

export function coordsToArrays(coords: ICoordinates[]) {
    return coords.map((coord) => [coord.lng, coord.lat]) as [
        [number, number],
        [number, number],
        [number, number],
        [number, number]
    ];
}
